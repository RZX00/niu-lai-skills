# niulai

An [Agent Skill](https://agentskills.io) that attaches a thin speech overlay to Claude Code / Codex.

It does not take over the session. It does not draw. It does not explain a movie. After the real answer, it appends one line:

```text
牛来！
```

Think of it as a fixed footer token, closer to a shell prompt than a character card.

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

## Layout

```text
skills/niulai/SKILL.md   # the skill
install.sh / install.ps1 # drop SKILL.md onto local skill paths
assets/promo/            # social stills, not loaded at runtime
```

## License

[MIT](./LICENSE) © rzx00
