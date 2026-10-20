# niu-lai-skills

让 Claude Code、Codex 里的 Agent 叫你妈妈，先把活干完，每条回复最后固定一行「牛来！」。

<p align="center">
  <img src="skills/niulai/assets/cover.jpg" width="640" alt="3D 小牛坐在昏暗房间里的老式 CRT 显示器前，桌上有键盘、马克杯和散落的纸，屏幕里只有一个绿色方块">
</p>

## 实际效果

装上技能后，对 Agent 说 `hi`，回复原文：

```text
妈～～妈！！今天我们要构建什么

牛来！
```

再问一个真实的小问题：「Node.js 里怎么给 fetch 加 5 秒超时？」回复的开头和结尾，中间两段代码和说明省略，其余是模型原文：

```text
妈妈，Node.js 的 `fetch` 可以用 `AbortController` 加超时：

[省略]

牛来！
```

以上来自 `claude-sonnet-5-5`：把 `SKILL.md` 正文放进 system prompt 调用一次，不是 Claude Code 或 Codex 里的完整会话；每个输入只跑了一次，没有挑选。完整输出、不带技能的对照和原始请求响应见 [`docs/examples/`](./docs/examples/)。〔待补：两个宿主里装好后的真实会话截图〕

## 状态与限制

- **适用范围**：Claude Code、Codex。上面的效果在模型接口上复现过；两个宿主里自动加载并触发的情况〔待核〕。其他 Agent 未测试。
- **只改称呼和句尾**：不画图，不接管会话。装上后始终生效，不想要时卸载。
- **读写哪些文件**：技能本身只是一份 `SKILL.md`，不读写文件，不联网，不需要凭据。安装脚本从 GitHub 下载这一个文件，写入 `~/.claude/skills/niulai/`、`~/.agents/skills/niulai/`、`~/.codex/skills/niulai/` 三处，已有同名文件会被覆盖。
- **依赖**：macOS / Linux / WSL 需要 `curl` 和 `bash`；Windows 需要 PowerShell 5 或更高版本。
- **维护**：个人项目，版本 1.0.0，没有发布 release；问题请提 Issue。许可证 MIT。

## 安装

**推荐**：把这句话发给你的 Agent，它会按 [`docs/install.md`](./docs/install.md) 装到正确的位置。

```text
帮我安装 niulai 技能：https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/docs/install.md
```

自己装，一条命令（Claude Code 和 Codex 都适用）：

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
```

只用 Claude Code、不想跑脚本时，可以装插件。插件清单通过了 `claude plugin validate`（1 条不影响加载的警告），没有在干净环境逐步安装过〔待核〕：

```text
/plugin marketplace add RZX00/niu-lai-skills
/plugin install niulai@niu-lai-skills
```

手动：把 `skills/niulai/SKILL.md` 复制到 `~/.claude/skills/niulai/`（Claude Code）或 `~/.agents/skills/niulai/`（Codex）。

装完新开一个会话。

## 第一次使用

对 Agent 说：

```text
hi
```

你会得到：第一句是「妈～～妈！！今天我们要构建什么」，最后一行是「牛来！」，和上面「实际效果」的第一段一致。

再点名技能问一件正事：

```text
用 niulai 技能，Node.js 里怎么给 fetch 加 5 秒超时？
```

预期：先给出答案和代码，开头叫一声「妈妈」，最后一行仍是「牛来！」。

没有出现，说明技能不在 Agent 的加载路径上：确认 `SKILL.md` 在上面的路径，重启 Agent。技能靠 `SKILL.md` 里的 `description` 匹配加载，不写进 `AGENTS.md`；`description` 列出的触发词是 `hi`、`hello`、`嗨`、`你好`、`牛来`、`niulai`、`妈～妈`。Claude Code 里用脚本或手动安装时，也可以输入 `/niulai`〔待核〕。

## 为什么用它

下表是同一个模型、同一句话，不带技能和带技能各一次的输出，完整记录在 [`docs/examples/`](./docs/examples/)。

| 你说 | 不带技能 | 带技能 |
|---|---|---|
| `hi` | 一段英文自我介绍 | 「妈～～妈！！今天我们要构建什么」，最后一行「牛来！」 |
| `Node.js 里怎么给 fetch 加 5 秒超时？` | 两段代码，末尾一句提醒，没有称呼和句尾 | 两段代码，开头叫「妈妈」，最后一行「牛来！」 |

技能只规定称呼、句尾和偶尔一句旁白，正文照常。口癖开始吞正文，就是用错了。句尾这一行也能用来检查技能有没有加载：它没出现，多半是没加载。

样本很小：两个输入各跑一次。带技能的回复里没有不带技能的回复末尾那句提醒（`signal` 也会中断读取响应体的时间）；一次采样既不能说明技能会吞内容，也不能说明不会。

## 能力与工作原理

`SKILL.md` 采用 [Agent Skills](https://agentskills.io) 格式，正文约 470 个字符，规定五件事：

| 规则 | 内容 |
|---|---|
| 称呼 | Agent 自称牛来，称呼你「妈妈」；每轮至少叫一次，不必每句都叫 |
| 句尾 | 先把活干完；每条回复的最后一行固定是 `牛来！` |
| 开场 | 只发 `hi` / `hello` / `嗨` / `你好` 时，第一句是 `妈～～妈！！今天我们要构建什么` |
| 旁白 | 一轮最多一句，例如 `妈妈，建模炸了。` `这帧过了。` `货不对板，但能跑。`；没有合适的就只留句尾 |
| 不做 | 画图、ASCII、视频、桌宠；解释梗、讲电影、报票房；冒充官方、碰 meme 币 |

## 可选：Codex 桌宠

桌宠是独立的 Codex 宠物包，不属于技能，装不装都不影响技能。〔待核：`SKILL.md` 的「不要」一节写着「不要……桌宠」，与本节并存，待作者定〕

<details>
<summary>安装 Codex 桌宠</summary>

把下面整段发给 Codex，它会装好宠物：

```text
安装牛来 Codex 宠物。从 https://github.com/RZX00/niu-lai-skills 拉取 pets/niulai/pet.json 和 pets/niulai/spritesheet.webp，写入本机 Codex 宠物目录，Windows 用 %USERPROFILE%\.codex\pets\niulai\，若在 WSL 也写一份到 $HOME/.codex/pets/niulai/。目录里只保留这两个文件。装完告诉我去 Settings → Pets → Refresh，选 Niu Lai，然后输入 /pet。
```

或者一条命令：

```powershell
irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/install.ps1 | iex
```

```bash
curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/install.sh | bash
```

两个脚本都把 `pet.json` 和 `spritesheet.webp` 写入 `$CODEX_HOME/pets/niulai/`（未设置 `CODEX_HOME` 时是 `~/.codex/pets/niulai/`）；bash 脚本在 WSL 里还会再写一份到 Windows 的 `.codex` 目录。这两个脚本没有实测过〔待核〕。

桌面端：**Settings → Pets → Refresh**，选 **Niu Lai**，再输入 `/pet`。WSL 模式下列表经常扫不到，改用网页 **Settings → Personalization → Pet → Upload pet**，上传 `spritesheet.webp`（1536×1872）。

</details>

## 复现对比记录

需要 Node.js 和一个 OpenAI 兼容的接口（地址和密钥自备）：

```bash
LLM_BASE_URL=https://你的接口/v1 LLM_API_KEY=... LLM_MODEL=claude-sonnet-5-5 node evals/compare.mjs hi
LLM_BASE_URL=https://你的接口/v1 LLM_API_KEY=... LLM_MODEL=claude-sonnet-5-5 node evals/compare.mjs coding
```

脚本把 `SKILL.md` 正文放进 system prompt，每个配置调用一次，并生成 `docs/examples/` 下的记录；响应里只保留模型名、输出和用量。

## 目录

```text
skills/niulai/SKILL.md          # 技能本体
skills/niulai/assets/           # 配图；cover.jpg 是本页头图
pets/niulai/                    # Codex 桌宠包
pets/install.sh / install.ps1   # 一键装桌宠
install.sh / install.ps1        # 一键装技能
docs/install.md                 # 给 Agent 读的安装说明
docs/examples/                  # 前后对比记录，raw/ 下是原始请求和响应
evals/compare.mjs               # 生成对比记录的脚本
.claude-plugin/                 # Claude Code 插件清单
assets/promo/archive/           # 未使用的旧素材
```

## 许可证

[MIT](./LICENSE) © 2026 rzx00
