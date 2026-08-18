# niulai

<p align="center">
  <img src="assets/promo/01-cover.jpg" width="720" alt="niulai cover">
</p>

An [Agent Skill](https://agentskills.io) that attaches a thin speech overlay to Claude Code / Codex.

It does not take over the session. It does not draw. It does not explain a movie. After the real answer, it appends one line:

```text
牛来！
```

Think of it as a fixed footer token, closer to a shell prompt than a character card.

[中文说明](#中文)

## Contract

Loaded from `skills/niulai/SKILL.md`.

| | |
|---|---|
| Identity | agent = 牛来, user = 妈妈 |
| Always | finish the task first; last line is `牛来！` |
| Greeting | `hi` / `hello` / `嗨` / `你好` → first line `妈～～妈！！今天我们要构建什么` |
| Optional asides | at most one per turn (`建模炸了` / `这帧过了` / `货不对板，但能跑`) |
| Out of scope | images, ASCII, video, 票房, meme coins, fake official accounts |

If the overlay starts eating the answer, the skill is being applied wrong.

## Trigger

The frontmatter `description` is the hook. Typical hits: `hi`, `牛来`, `/niulai`, `妈～妈`.

This is not injected via `AGENTS.md`. If it does not fire, the skill is not on the agent's load path.

## Install

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

Manual copy of `skills/niulai/SKILL.md`:

- Claude Code → `~/.claude/skills/niulai/SKILL.md`
- Codex → `~/.agents/skills/niulai/SKILL.md` or `~/.codex/skills/niulai/SKILL.md`

Restart the agent after install.

## Stills

Runtime does not load these. They are repo cards only.

<p align="center">
  <img src="assets/promo/02-avatar.jpg" width="280" alt="avatar">
  <img src="assets/promo/06-tic.jpg" width="280" alt="footer token">
</p>

<p align="center">
  <img src="assets/promo/05-open.jpg" width="720" alt="greeting hook">
</p>

<p align="center">
  <img src="assets/promo/03-stand.jpg" width="320" alt="full body">
  <img src="assets/promo/04-coding.jpg" width="400" alt="coding still">
</p>

Raw frames: `assets/promo/raw-*.jpg`.

## Layout

```text
skills/niulai/SKILL.md   # the skill
install.sh / install.ps1 # drop SKILL.md onto local skill paths
assets/promo/            # social stills, not loaded at runtime
```

## License

[MIT](./LICENSE) © rzx00

---

<a name="中文"></a>

# 中文

<p align="center">
  <img src="assets/promo/01-cover.jpg" width="720" alt="niulai 封面">
</p>

给 Claude Code / Codex 挂一层很薄的 [Agent Skill](https://agentskills.io) 口癖。

它不接管会话，不画图，不讲电影。正文照常写完，最后一行固定追加：

```text
牛来！
```

更接近 shell prompt，不是人设卡。

## 契约

入口：`skills/niulai/SKILL.md`。

| | |
|---|---|
| 身份 | agent = 牛来，用户 = 妈妈 |
| 始终 | 先把活干完；最后一行是 `牛来！` |
| 开场 | `hi` / `hello` / `嗨` / `你好` → 第一句 `妈～～妈！！今天我们要构建什么` |
| 旁白 | 一轮最多一句（`建模炸了` / `这帧过了` / `货不对板，但能跑`） |
| 不做 | 出图、ASCII、视频、票房、meme 币、假官方号 |

口癖开始吞正文，就是用错了。

## 触发

靠 YAML `description` 匹配。常见钩子：`hi`、`牛来`、`/niulai`、`妈～妈`。

不写进 `AGENTS.md`。不触发 = skill 不在当前 agent 的加载路径上。

## 安装

Claude Code plugin：

```
/plugin marketplace add RZX00/niu-lai-skills
/plugin install niulai@niu-lai-skills
```

macOS / Linux / WSL：

```bash
curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
```

Windows：

```powershell
irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
```

手动拷 `skills/niulai/SKILL.md`：

- Claude Code → `~/.claude/skills/niulai/SKILL.md`
- Codex → `~/.agents/skills/niulai/SKILL.md` 或 `~/.codex/skills/niulai/SKILL.md`

装完重启 agent。

## 静帧

运行时不读这些图，只给仓库和社媒用。

<p align="center">
  <img src="assets/promo/02-avatar.jpg" width="280" alt="头像">
  <img src="assets/promo/06-tic.jpg" width="280" alt="句尾">
</p>

<p align="center">
  <img src="assets/promo/05-open.jpg" width="720" alt="开场钩子">
</p>

<p align="center">
  <img src="assets/promo/03-stand.jpg" width="320" alt="全身">
  <img src="assets/promo/04-coding.jpg" width="400" alt="写代码">
</p>

原图：`assets/promo/raw-*.jpg`。

## 目录

```text
skills/niulai/SKILL.md   # skill 本体
install.sh / install.ps1 # 写到本机 skill 路径
assets/promo/            # 静帧，运行时不加载
```

## 许可

[MIT](./LICENSE) © rzx00
