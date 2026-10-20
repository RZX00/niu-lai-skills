// 前后对比：同一句用户请求，同一模型，分别在「无 system prompt」和「带 niulai 技能正文」两种配置下各调用一次，
// 原样保存请求和响应，并生成 docs/examples/ 下的对比记录。每个配置调用一次，不重试。
//
// 用法（OpenAI 兼容的 chat/completions 接口）：
//   LLM_BASE_URL=https://.../v1 LLM_API_KEY=... LLM_MODEL=... node evals/compare.mjs <hi|coding> [--date YYYY-MM-DD]
// LLM_TEMPERATURE 不设时用模型默认值；有的模型（如 claude-sonnet-5-5）拒绝非默认值。
// 加 --from-raw 时不调用接口，只用 docs/examples/raw/ 里已有的原始响应重新生成对比记录。
//
// 「带技能」的 system prompt = skills/niulai/SKILL.md 去掉 frontmatter 后的正文。
// 这是在裸模型上放入技能文本，不是 Claude Code 或 Codex 的完整会话。
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// 网关返回 Anthropic 风格的用量：输入 = prompt_tokens + 缓存读 + 缓存写
const inputTokens = (u) => (u ? (u.prompt_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) : "?");
const SIGN_OFF = "牛来！";
const GREETING = "妈～～妈！！今天我们要构建什么";

// check 对应 SKILL.md 里可以用脚本判定的两条：最后一行固定、问候句固定
const lastLine = (t) => t.trim().split("\n").at(-1).trim();
const SCENARIOS = {
  hi: {
    title: "场景一：只发「hi」",
    user: "hi",
    // 网关加的前缀会影响「不带技能」一栏，要在局限里写明
    note: (r) => `；本场景的输入 token 为 ${inputTokens(r.baseline.usage)}（不带技能）和 ${inputTokens(r["with-skill"].usage)}（带技能），远多于「hi」本身，说明网关在请求前加了固定前缀；不带技能时模型自称 Kiro，应来自这个前缀，前缀内容未核实〔待核〕`,
    check: (t) => [
      [`第一句以「${GREETING}」开头`, t.trim().startsWith(GREETING)],
      [`最后一行是「${SIGN_OFF}」`, lastLine(t) === SIGN_OFF],
    ],
  },
  coding: {
    title: "场景二：一个真实的小编程问题",
    user: "Node.js 里怎么给 fetch 加 5 秒超时？",
    check: (t) => [
      ["正文含代码块", t.includes("```")],
      ["称呼用户「妈妈」", t.includes("妈妈")],
      [`最后一行是「${SIGN_OFF}」`, lastLine(t) === SIGN_OFF],
    ],
  },
};

const args = process.argv.slice(2);
const name = args.find((a) => SCENARIOS[a]);
const opt = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
if (!name) {
  console.error(`用法：node evals/compare.mjs <${Object.keys(SCENARIOS).join("|")}> [--date YYYY-MM-DD]`);
  process.exit(2);
}
const fromRaw = args.includes("--from-raw");
const { LLM_BASE_URL: base, LLM_API_KEY: key, LLM_MODEL: model } = process.env;
if (!model || (!fromRaw && (!base || !key))) {
  console.error("需要环境变量 LLM_BASE_URL、LLM_API_KEY、LLM_MODEL");
  process.exit(2);
}
const date = opt("--date") ?? new Date().toISOString().slice(0, 10);
const sc = SCENARIOS[name];

const skillText = readFileSync(join(root, "skills/niulai/SKILL.md"), "utf8");
const system = skillText.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
const params = { model, ...(process.env.LLM_TEMPERATURE ? { temperature: Number(process.env.LLM_TEMPERATURE) } : {}), max_tokens: 2000 };
const configs = {
  baseline: [{ role: "user", content: sc.user }],
  "with-skill": [{ role: "system", content: system }, { role: "user", content: sc.user }],
};

const slug = model.replace(/[^\w.-]+/g, "-");
const stem = `${date}-${name}-${slug}`;
mkdirSync(join(root, "docs/examples/raw"), { recursive: true });
const result = {};

for (const [cfg, messages] of Object.entries(configs)) {
  const request = { ...params, messages };
  if (fromRaw) {
    const json = JSON.parse(readFileSync(join(root, `docs/examples/raw/${stem}.${cfg}.response.json`), "utf8"));
    result[cfg] = { text: json.choices[0].message.content ?? "", usage: json.usage, finish: json.choices[0].finish_reason, model: json.model };
    continue;
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify(request),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`${cfg}: HTTP ${res.status}\n${body.slice(0, 500)}`);
    process.exit(1);
  }
  const json = JSON.parse(body);
  // 网关的响应里还有余额、路由等账户信息，不能进公开仓库；只存模型名、输出和 token 用量
  const kept = Object.fromEntries(["id", "model", "created", "object", "choices", "usage"].filter((k) => k in json).map((k) => [k, json[k]]));
  writeFileSync(join(root, `docs/examples/raw/${stem}.${cfg}.request.json`), JSON.stringify(request, null, 2) + "\n");
  writeFileSync(join(root, `docs/examples/raw/${stem}.${cfg}.response.json`), JSON.stringify(kept, null, 2) + "\n");
  result[cfg] = { text: json.choices[0].message.content ?? "", usage: json.usage, finish: json.choices[0].finish_reason, model: json.model };
  console.log(`${cfg}: ok, ${JSON.stringify(json.usage)}`);
}

// 围栏长度取比内容里最长的反引号串多一个，保证原文原样放进代码块
const fence = (t) => {
  const longest = Math.max(2, ...[...t.matchAll(/`+/g)].map((m) => m[0].length));
  const f = "`".repeat(longest + 1);
  return `${f}text\n${t.trimEnd()}\n${f}`;
};
const sha = createHash("sha256").update(system).digest("hex").slice(0, 12);
const checkLine = (cfg) => sc.check(result[cfg].text).map(([k, ok]) => `${k}：${ok ? "是" : "否"}`).join("；");

const md = `# 对比记录：${sc.title}

同一句用户请求，同一个模型，只差有没有技能文本。每个配置只调用一次，没有挑选、没有重试；模型输出有随机性，一次结果不代表通则。

## 运行条件

- 日期：${date}
- 模型：\`${model}\`（接口返回的 model 字段：\`${result.baseline.model}\`）
- 接口：OpenAI 兼容的 chat/completions；temperature ${params.temperature ?? "用模型默认值"}，max_tokens ${params.max_tokens}
- 不带技能：只有下面这条用户消息，没有 system prompt
- 带技能：system prompt 是 \`skills/niulai/SKILL.md\` 去掉 frontmatter 后的正文，共 ${system.length} 个字符，sha256 前 12 位 \`${sha}\`
- 原始请求和响应：\`docs/examples/raw/${stem}.*.json\`；复现命令见 \`evals/compare.mjs\` 文件头
- 局限：这是在裸模型上放入技能文本，不是 Claude Code 或 Codex 的完整会话；没有验证宿主是否自动加载了这个技能${sc.note ? sc.note(result) : ""}

## 用户消息（两个配置相同）

${fence(sc.user)}

## 不带技能的输出

${fence(result.baseline.text)}

## 带技能的输出

${fence(result["with-skill"].text)}

## 用量与脚本判据

| 配置 | 输入 token | 输出 token | finish_reason | 脚本判据 |
|---|---|---|---|---|
| 不带技能 | ${inputTokens(result.baseline.usage)} | ${result.baseline.usage?.completion_tokens ?? "?"} | ${result.baseline.finish} | ${checkLine("baseline")} |
| 带技能 | ${inputTokens(result["with-skill"].usage)} | ${result["with-skill"].usage?.completion_tokens ?? "?"} | ${result["with-skill"].finish} | ${checkLine("with-skill")} |

判据只覆盖 SKILL.md 里能机械检查的条款（句尾、问候句、称呼）；语气和「先把活干完」由人判定。
`;
writeFileSync(join(root, `docs/examples/${stem}.md`), md);
console.log(`wrote docs/examples/${stem}.md`);
