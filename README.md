# niulai

<p align="center">
  <img src="skills/niulai/assets/cover.jpg" width="720" alt="niulai — 牛来 coding">
</p>

给 Claude Code / Codex 挂一层很薄的 [Agent Skill](https://agentskills.io) 口癖。
An [Agent Skill](https://agentskills.io) that attaches a thin speech overlay to Claude Code / Codex.

它不接管会话，不画图，不讲电影。正文写完后固定追加一行：
It does not take over the session. It does not draw. After the real answer, it appends one line:

```text
牛来！
```

更接近 shell prompt，不是人设卡。
Think of it as a fixed footer token, closer to a shell prompt than a character card.

## 契约 / Contract

入口 / loaded from `skills/niulai/SKILL.md`。

| | 中文 | English |
|---|---|---|
| 身份 / Identity | agent = 牛来，用户 = 妈妈 | agent = 牛来, user = 妈妈 |
| 始终 / Always | 先把活干完；最后一行是 `牛来！` | finish the task first; last line is `牛来！` |
| 开场 / Greeting | `hi` / `hello` / `嗨` / `你好` → 第一句 `妈～～妈！！今天我们要构建什么` | same greeting hook |
| 旁白 / Asides | 一轮最多一句（`建模炸了` / `这帧过了` / `货不对板，但能跑`） | at most one aside per turn |
| 不做 / Out of scope | 出图、ASCII、视频、票房、meme 币、假官方号 | images, ASCII, video, 票房, meme coins, fake official accounts |

口癖开始吞正文，就是用错了。
If the overlay starts eating the answer, the skill is being applied wrong.

## 触发 / Trigger

靠 YAML `description` 匹配。常见钩子：`hi`、`牛来`、`/niulai`、`妈～妈`。
The frontmatter `description` is the hook. Typical hits: `hi`, `牛来`, `/niulai`, `妈～妈`.

不写进 `AGENTS.md`。不触发 = skill 不在当前 agent 的加载路径上。
This is not injected via `AGENTS.md`. If it does not fire, the skill is not on the agent's load path.

## 安装 / Install

Claude Code plugin:

```
/plugin marketplace add RZX00/niu-lai-skills
/plugin install niulai@niu-lai-skills
```

macOS / Linux / WSL:

```bash
curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
```

Windows:

```powershell
irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
```

手动拷 / copy `skills/niulai/SKILL.md`：

- Claude Code → `~/.claude/skills/niulai/SKILL.md`
- Codex → `~/.agents/skills/niulai/SKILL.md` 或 / or `~/.codex/skills/niulai/SKILL.md`

装完重启 agent。Restart the agent after install.

## 目录 / Layout

```text
skills/niulai/SKILL.md          # skill 本体 / the skill
skills/niulai/assets/cover.jpg  # 主图 / hero (coding)
skills/niulai/assets/coding-*   # 其它 coding 静帧，README 不展示
install.sh / install.ps1        # 写到本机 skill 路径
```

## 许可 / License

[MIT](./LICENSE) © rzx00
