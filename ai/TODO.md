# TODO

## Milestone 1 — Skill 双向同步 CLI（最高优先级）

目标：在任何目标项目里，一条命令就能拉取/推送 skill，与 agent-toolkit 仓库双向同步。

> 设计文档：[`ai/features/SKILL-SYNC-CLI.md`](features/SKILL-SYNC-CLI.md)（本期聚焦 Pull）

- [ ] 设计 CLI 命名与分发方式（`agent-toolkit` / `atk` / `npx` / 独立脚本？）
- [ ] 确定 skill 在目标项目的落点（`.claude/skills/` vs `skills/`，按平台自动选）
- [ ] **Pull 命令**：`atk pull <skill-name>` 从本仓库拉取指定 skill 到当前项目
  - [ ] 支持 `atk pull --all` 批量拉
  - [ ] 支持 `atk list` 查看可用 skill 清单
  - [ ] 拉取时自动选 CLAUDE / AGENTS 协议模板（按目标项目类型）
  - [ ] 处理目标已存在同名 skill 的冲突（覆盖 / 跳过 / diff 三种模式）
- [ ] **Push 命令**：`atk push <skill-name>` 把目标项目里改过的 skill 推回本仓库
  - [ ] 推送前 diff 预览，需用户确认
  - [ ] 自动新建分支或在 `other-skills/` 暂存，避免污染主线
  - [ ] 校验 SKILL.md frontmatter 合法性
- [ ] **版本机制**：每个 skill 加版本号 / hash，pull 时能判断是否需要更新
- [ ] **配置文件**：目标项目放一个 `.agent-toolkit.json` 记录已引入的 skill 和版本
- [ ] 文档：在 README 写清安装、pull、push、update 完整流程

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

- [x] 重命名 skill creator，泛化 AI 协议（commit 3233c46）
- [x] 为 codex 适配所有 skill（commit b10e317）