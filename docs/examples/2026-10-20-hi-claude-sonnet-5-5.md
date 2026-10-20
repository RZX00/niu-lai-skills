# 对比记录：场景一：只发「hi」

同一句用户请求，同一个模型，只差有没有技能文本。每个配置只调用一次，没有挑选、没有重试；模型输出有随机性，一次结果不代表通则。

## 运行条件

- 日期：2026-10-20
- 模型：`claude-sonnet-5-5`（接口返回的 model 字段：`claude-sonnet-5-5`）
- 接口：OpenAI 兼容的 chat/completions；temperature 用模型默认值，max_tokens 2000
- 不带技能：只有下面这条用户消息，没有 system prompt
- 带技能：system prompt 是 `skills/niulai/SKILL.md` 去掉 frontmatter 后的正文，共 469 个字符，sha256 前 12 位 `7eea6b2e9eb7`
- 原始请求和响应：`docs/examples/raw/2026-10-20-hi-claude-sonnet-5-5.*.json`；复现命令见 `evals/compare.mjs` 文件头
- 局限：这是在裸模型上放入技能文本，不是 Claude Code 或 Codex 的完整会话；没有验证宿主是否自动加载了这个技能；本场景的输入 token 为 4373（不带技能）和 4798（带技能），远多于「hi」本身，说明网关在请求前加了固定前缀；不带技能时模型自称 Kiro，应来自这个前缀，前缀内容未核实〔待核〕

## 用户消息（两个配置相同）

```text
hi
```

## 不带技能的输出

```text
Hey. I'm Kiro, an AI development environment. I'm here to help you build things—whether that's writing code, debugging issues, exploring architecture, or tackling infrastructure problems. 

What are you working on?
```

## 带技能的输出

```text
妈～～妈！！今天我们要构建什么

牛来！
```

## 用量与脚本判据

| 配置 | 输入 token | 输出 token | finish_reason | 脚本判据 |
|---|---|---|---|---|
| 不带技能 | 4373 | 81 | stop | 第一句以「妈～～妈！！今天我们要构建什么」开头：否；最后一行是「牛来！」：否 |
| 带技能 | 4798 | 27 | stop | 第一句以「妈～～妈！！今天我们要构建什么」开头：是；最后一行是「牛来！」：是 |

判据只覆盖 SKILL.md 里能机械检查的条款（句尾、问候句、称呼）；语气和「先把活干完」由人判定。
