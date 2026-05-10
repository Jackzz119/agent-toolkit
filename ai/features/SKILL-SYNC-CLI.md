# Skill 双向同步 CLI 系统设计文档

> 最后更新：2026-05-10
> 状态：需求对齐中（未开工）
> 当前阶段：聚焦 **Pull** 单向流程；Push 留到 Pull 稳定后再设计

---

## 一、功能目标

在任何目标项目里，通过一条命令从 `agent-toolkit` 仓库拉取 / 更新单个或多个 skill，无需手动复制粘贴。后续再扩展 push（把目标项目里改过的 skill 推回主仓库）。

**本期范围（Pull）**：
- `pull` 单个 skill 到目标项目
- `pull --all` 拉全部
- `list` 查看可用 skill
- `update` 更新已引入的 skill
- `diff` 对比本地 vs 远端
- 自动识别目标项目类型（Claude / Codex），决定落点
- 版本追踪 + 本地修改保护

**非本期范围**：
- Push（推回主仓库）
- npm registry 发布
- skill 之间依赖管理

---

## 二、调用链路

```
用户在目标项目目录
  └─ npx --yes github:<user>/agent-toolkit pull <skill-name>
       └─ 临时目录 git clone --depth=1 agent-toolkit
            └─ 读取 skills/<skill-name>/
                 └─ 检测目标项目类型（.claude/ or AGENTS.md）
                      └─ 复制到 .claude/skills/<name>/ 或 skills/<name>/
                           └─ 写入/更新 .agent-toolkit.json 记录版本
                                └─ 清理临时目录
```

---

## 三、模块设计

### 3.1 CLI 分发方式（待定 ⏸）

候选：

| 方案 | 优点 | 缺点 |
|---|---|---|
| **A. npm 包 + npx** `npx agent-toolkit pull xxx` | 用户体验好 | 需 publish 维护 |
| **B. 纯 shell 脚本** `curl \| sh` 装 `atk` | 无依赖 | Win 兼容麻烦 |
| **C. Python CLI** `pipx install` | 跨平台稳 | 需 Python 环境 |
| **D. 仓库内 Node 脚本 + `npx github:`** | 零发布、跨平台 | 用户得有 Node |

**初步建议**：先 **D**，稳定后转 **A**。
**待用户确认。**

### 3.2 实现语言（待定 ⏸）

候选：Node / Python / 纯 shell。
**初步建议**：Node（依赖普及、跨平台、与 npx 配套自然）。
**待用户确认。**

### 3.3 数据源策略

`git clone --depth=1` 到系统临时目录，读取需要的文件后清理。
- 优点：完整、能拿历史、离线友好
- 不用 GitHub API（避免 rate limit）

### 3.4 目标项目类型检测 & 落点

| 检测信号 | 落点 |
|---|---|
| 存在 `.claude/` 目录 | `.claude/skills/<name>/` |
| 存在 `AGENTS.md` 或 `.codex/` | `skills/<name>/` |
| 都没有 | 默认 `.claude/skills/`，提示用户可改 |
| 用户传 `--dest <path>` | 强制使用该路径 |

### 3.5 Skill 来源范围

仓库根有两个目录：`skills/`（主线）、`other-skills/`（草稿）。
- 默认只暴露 `skills/`
- `--from other` 才能拉 `other-skills/`

### 3.6 命令形态

```
atk list                          # 列出可拉的 skill
atk pull <name>                   # 拉单个
atk pull <name1> <name2>          # 拉多个
atk pull --all                    # 拉全部 skills/
atk pull --from other <name>      # 从 other-skills/ 拉
atk pull <name> --dest <path>     # 指定落点
atk pull <name> --mode <m>        # 冲突模式：skip/overwrite/diff
atk update [<name>]               # 更新已引入的（不带名 = 全部）
atk diff <name>                   # 对比本地 vs 远端
```

**已存在 skill 调 pull 时**：默认报错，提示用 `update`。避免误覆盖本地修改。

### 3.7 版本机制

每个 skill 记录两个值：
- **sourceCommit**：拉取时主仓库 HEAD 的 commit hash（追溯用）
- **contentHash**：skill 目录内容的 sha256（判断本地改动用）

不污染 SKILL.md frontmatter。

### 3.8 配置文件 `.agent-toolkit.json`

放在目标项目根目录：

```json
{
  "source": "github:<user>/agent-toolkit",
  "skillsDir": ".claude/skills",
  "skills": {
    "intj": {
      "sourceCommit": "9875f7f",
      "contentHash": "sha256:abc...",
      "pulledAt": "2026-05-09",
      "from": "skills"
    }
  }
}
```

### 3.9 冲突 / 更新策略

| 场景 | 行为 |
|---|---|
| 目标已存在同名 skill，调 `pull` | 报错，建议用 `update` |
| 调 `update`，本地 contentHash == 拉取时记录 | 直接覆盖到最新 |
| 调 `update`，本地 contentHash != 记录（用户改过） | 提示 keep / overwrite / diff |
| `--mode skip`（默认 pull 时） | 已存在则跳过 |
| `--mode overwrite` | 强制覆盖 |
| `--mode diff` | 仅打印 diff 不写入 |

---

## 四、待用户确认的决策点

记录于此，等用户回来后逐个拍板：

1. **CLI 分发**：先走 D（仓库内 Node 脚本 + `npx github:`），稳定后转 A？
2. **实现语言**：Node 是否 OK？
3. **落点策略**：自动检测 `.claude/` vs `AGENTS.md`，否则默认 `.claude/skills/` —— 同意？
4. **`other-skills/` 默认隐藏**，需 `--from other` —— 同意？
5. **pull 已存在 skill 时报错**（改让用户走 update）—— 同意？
6. **版本机制**：source commit + content hash 双轨 —— 同意？

---

## 五、待实现 / 已知问题

- Windows / macOS / Linux 下 `git clone` 临时目录的清理需可靠（异常退出不能留垃圾）
- npm 包名是否要抢注（`agent-toolkit` / `atk`）—— 走 A 之前再看
- skill 内若引用 `${CLAUDE_SKILL_DIR}` 等变量，复制后路径仍正确（验证）
- Codex 风格落点 `skills/` 与现有项目 `skills/` 命名是否冲突 —— 验证

---

## 实现计划

进度：0 / 0 subtasks 完成（0%）

> 待 Step 2 决策点全部拍板后再拆 Subtask。
> 预计骨架（仅参考）：
> - ST-1: 选定分发方式 & 语言后，搭 `bin/atk.mjs` 入口 + `list` 命令
> - ST-2: 实现 `pull <name>`（单个、默认落点检测）
> - ST-3: 实现 `.agent-toolkit.json` 读写 + 版本字段
> - ST-4: 实现 `pull --all` / `pull <a> <b>` / `--from other` / `--dest`
> - ST-5: 实现 `update`，含 contentHash 比对与冲突提示
> - ST-6: 实现 `diff`
> - ST-7: 文档（README）+ 跨平台测试（Win/macOS/Linux）

---

## 测试记录

（待开工后填）