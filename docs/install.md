# 安装说明（供 Agent 执行）

## 1 范围

本文件供 Agent 在用户要求安装 niu-lai-skills 时执行。安装内容是一个技能 `niulai`，即一份 `SKILL.md`，没有脚本和依赖。Codex 桌宠包是另一件东西，不在本文件范围内。

## 2 术语和定义

2.1 技能：`skills/niulai/SKILL.md`。Agent 加载后，称呼用户「妈妈」，并在每条回复的最后一行写「牛来！」。

2.2 安装脚本：仓库根目录的 `install.sh`（macOS / Linux / WSL）和 `install.ps1`（Windows）。脚本只下载 `SKILL.md` 一个文件。

## 3 前置条件

3.1 应先确认用户的系统：macOS / Linux / WSL 需要 `curl` 和 `bash`；Windows 需要 PowerShell 5 或更高版本。缺少时，应告知用户并停止，不应自行安装。

## 4 安装步骤

4.1 应先问清用户使用的宿主：Claude Code 或 Codex。

4.2 应在运行前向用户列出将写入的位置。安装脚本把同一份 `SKILL.md` 写入下列三处，目录不存在时创建，已有同名文件时覆盖：

| 位置 | 供谁读取 |
|---|---|
| `~/.claude/skills/niulai/SKILL.md` | Claude Code |
| `~/.agents/skills/niulai/SKILL.md` | Codex 等读取 `~/.agents/skills` 的 Agent |
| `~/.codex/skills/niulai/SKILL.md` | Codex |

4.3 应选择下列一种方式，不应同时使用。

方式 A（脚本，推荐；Claude Code 和 Codex 都适用）：

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
```

方式 B（仅 Claude Code，插件）：

```text
/plugin marketplace add RZX00/niu-lai-skills
/plugin install niulai@niu-lai-skills
```

注：插件由 Claude Code 自己管理，不写入 4.2 表中的位置。

方式 C（手动）：把 `skills/niulai/SKILL.md` 复制到 4.2 表中用户所用宿主对应的路径。

## 5 验证

5.1 应提示用户开一个新会话，技能在会话开始时加载。

5.2 新会话中，应请用户发 `hi`。技能生效时，回复的第一句是「妈～～妈！！今天我们要构建什么」，最后一行是「牛来！」。

5.3 没有出现时，应先确认 `SKILL.md` 在 4.2 表对应的路径上、宿主已重启，再请用户发「用 niulai 技能，hi」。仍然没有时，应如实告知用户，不应自行改写技能文本。

## 6 卸载

6.1 方式 A 或 C 安装的，应列出 4.2 表中三个 `niulai` 目录，经用户确认后删除。方式 B 安装的，应通过 `/plugin` 卸载。

## 7 示例

<examples>
<example>
用户：帮我安装 niulai 技能。
Agent：先问用户用 Claude Code 还是 Codex，再列出将写入的三个位置。用户同意后运行方式 A 的命令。最后说：「请开一个新会话，然后对我说：hi。你应该看到第一句是『妈～～妈！！今天我们要构建什么』，最后一行是『牛来！』。」
</example>
</examples>
