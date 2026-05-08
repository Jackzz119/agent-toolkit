# Agent Toolkit

跨 AI 平台的 agent 工具箱：一套可复用的 skill 库 + AI 工作协议模板，供其他项目按需引入。

## 项目结构

- `agents/` — AI 平台工作协议模板
  - `claude/CLAUDE.md` — Claude Code 平台版本（用 `.claude/skills/`、`${CLAUDE_SKILL_DIR}`）
  - `codex/AGENTS.md` — 平台中立版本（用 `skills/`、`${SKILL_DIR}`），适用于 Codex 等
- `skills/` — 主 skill 集，每个 skill 一个目录，含 `SKILL.md`（必需）和按需的 `reference.md` / `examples.md`
- `other-skills/` — 备用/迁移区（当前含 blender-create，与 `skills/` 下同名版本待整合）
- `ai/` — 本仓库自身的 PROJECT.md / TODO.md 工作区

## Skill 清单

| Skill | 触发策略 | 职责 |
|---|---|---|
| `intj` | 自动 | 任务主管，Epic/Task/Bug 分级，维护 PROJECT.md / TODO.md |
| `feature` | 询问 | 功能驱动开发，读写 Feature 文档，拆分 Subtask |
| `vc` | 询问 | git commit / 分支 / PR 规范 |
| `custom-skill` | — | Skill 主管，管理所有 skill 的生命周期 |
| `logman` | 自动 | log 语句格式与功能域标签规范 |
| `blender-create` | — | Blender MCP 建模 / 材质 / Retopo / Rigging / 导出流程 |

## AI 工作协议核心

- 每次对话先读 `ai/PROJECT.md` + `ai/TODO.md`，扫描 `skills/` 感知可用 skill
- skill 上下文回复以 `**SKILL名称**` 开头
- 文档维护：TODO.md 是任务唯一来源；任务完成后才把实现细节回填到 PROJECT.md
- 默认中文沟通；commit message 用英文
- 未授权不直接改文件，先说改哪、为什么、给 diff，等确认

## Skill 真源规则

- **`skills/` 是唯一真源**，所有 skill 修改只在这里进行
- **`.claude/skills/` 是本地缓存**，仅供本仓库自身的 Claude Code 会话使用，不手动改
- 真源更新后通过 Milestone 1 的 CLI（待开发）同步到 `.claude/skills/`；本仓库也算一个"目标项目"

## Brain Dump

- CLI 双向同步（Milestone 1）是 toolkit 能否真正跨项目复用的关键，决定整个项目存在的意义
- 是否把 `other-skills/` 与 `skills/` 合并成单一来源（目前 blender-create 两边都有）
- 是否给每个 skill 补 `examples.md`，沉淀真实调用案例
- 协议模板是否抽出 `agents/_shared.md` 共用片段，避免 CLAUDE.md / AGENTS.md 双份维护漂移
- 是否加一份 `README.md` 给外部用户讲怎么把 toolkit 引入到目标项目