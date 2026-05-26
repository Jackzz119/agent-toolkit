# TODO

## Milestone 1 — Skill 双向同步 CLI（最高优先级）

目标：在任何目标项目里，一条命令就能拉取/推送 skill，与 agent-toolkit 仓库双向同步。

> 设计文档：[`ai/features/SKILL-SYNC-CLI.md`](features/SKILL-SYNC-CLI.md)（本期聚焦 Pull · common 包）

**需求对齐已完成 ✅**：6 个决策点全部锁定（CLI=Node 脚本 + npx github、落点默认 `.claude/skills/`、common 包 = 全部 `skills/`、pull 已存在报错、版本双轨）。

Subtask 进度（详见 Feature 文档）：

- [x] **ST-1**：搭骨架 `package.json` + `bin/atk.mjs`，实现 `atk list`
- [x] **ST-2**：实现 `atk pull`（common 包主路径，交互菜单 u/s/q）
- [x] **ST-3**：`.agent-toolkit.json` + per-skill 版本 + 4 情景智能菜单（contentHash 驱动）+ 文件夹分包（`skills/_common/`、`skills/<pack>/`）
- [ ] **ST-4**：非交互 flag——`--dest` / `--mode` / `--pack`
- [ ] **ST-5**：`atk update` + `atk diff` 独立命令，含孤儿 entry 清理
- [ ] **ST-6**：README + 跨平台冒烟 + 本仓库 dogfood

后续（非本期）：

- [ ] `atk pull <name>` 单个拉
- [ ] `atk pull --pack <xxx>` 其他包
- [ ] `atk pull --from other` 拉 `other-skills/`
- [ ] Push 命令（推回主仓库），含 diff 预览 / 暂存分支 / frontmatter 校验

## Phase 2 — 仓库整理

- [ ] 处理 `skills/blender-create/SKILL.md` 未提交修改，确认要保留的版本
- [ ] 整合 `other-skills/blender-create/` 与 `skills/blender-create/`，决定单一来源
- [ ] 提交当前 rename（`extra-skills/ → other-skills/`）

## Phase 3 — 协议与文档

- [ ] 抽出 CLAUDE.md / AGENTS.md 的共享内容，减少双份维护
- [ ] 写仓库根 `README.md`：toolkit 定位、引入方式、skill 一览
- [ ] 给 `intj` / `feature` / `vc` 各补一份 `examples.md`

## Phase 4 — Skill 完善

- [ ] `custom-skill` 补全触发策略字段
- [ ] `blender-create` 验证在最新 Blender MCP 下的工具列表是否仍准确
- [ ] 评估是否新增 `test`、`review` 等通用 skill

## Bug

- （暂无）

## Done

- [x] Milestone 1 需求对齐：6 个决策点拍板（2026-05-17）
- [x] 重命名 skill creator，泛化 AI 协议（commit 3233c46）
- [x] 为 codex 适配所有 skill（commit b10e317）