# Skill 创建详细规范

> 按需加载。仅在创建或审查 skill 时读取此文件。

---

## Frontmatter 字段说明

```yaml
---
name: skill-name                  # 必需，kebab-case
description: 一句话描述触发场景    # 必需，用于判断何时触发
allowed-tools: Read, Edit, Bash   # 可选，预批准工具列表
---
```

**allowed-tools 常用组合：**
- 只读分析：`Read, Glob, Grep`
- 文件修改：`Read, Write, Edit, Glob`
- 含 git：`Read, Write, Edit, Bash`
- 全权限：不填（每次操作都需用户确认）

---

## 动态特性用法

### `!命令` — 运行时注入

```markdown
当前 git 状态：
!git status --short

当前 skill 列表：
!for f in .claude/skills/*/SKILL.md; do echo $(basename $(dirname $f)); done
```

注意：`!` 命令在 skill **加载时**执行，结果直接嵌入上下文。适合注入"当前状态"类信息。

### `$ARGUMENTS` — 接收参数

```markdown
目标功能：$ARGUMENTS
```

用户调用 `/skill-creator create bigwin` 时，`$ARGUMENTS` = `create bigwin`。

### `${CLAUDE_SKILL_DIR}` — 引用同目录文件

```markdown
详细规范见 ${CLAUDE_SKILL_DIR}/reference.md
```

---

## 文件结构决策

### 什么时候需要 reference.md？

- SKILL.md 超过 200 行
- 有大量示例代码
- 有详细的规范表格或参数说明
- 内容不是每次都需要，可以按需加载

### 什么时候需要 examples.md？

- skill 有多种调用方式
- 有复杂的输出格式示例
- 用户经常问"这种情况怎么用"

---

## 质量检查清单

创建完 skill 后，自检以下项目：

- [ ] `name` 和 `description` 填写完整且准确
- [ ] `description` 能让人清楚判断"什么时候该用这个 skill"
- [ ] SKILL.md 控制在 500 行以内
- [ ] 没有硬编码项目特定路径（除非 skill 本身是项目特定的）
- [ ] 动态注入的命令在当前环境可以运行
- [ ] 参数用法有说明（如果接收 `$ARGUMENTS`）
- [ ] 有明确的"等用户确认"节点（涉及文件修改的 skill）

---

## 通用 vs 项目特定

| 类型 | 存放位置 | 示例 |
|------|----------|------|
| 通用 skill | `.claude/skills/` (项目内) 或 `~/.claude/skills/` (全局) | vc, skill-creator |
| 项目特定 skill | `.claude/skills/` (项目内) | feature (含项目文档路径) |

通用 skill 未来可以发布到 GitHub skill 库供复用。

---

## 常见反模式

**不要这样做：**
- SKILL.md 里写大量示例代码 → 放 examples.md
- 一个 skill 做多件不相关的事 → 拆分成多个 skill
- 把项目路径硬编码进通用 skill → 用 `$ARGUMENTS` 或动态查找
- 每次加载都注入大量静态文本 → 静态规范放 reference.md 按需读取
- description 写得太宽泛（如"帮助开发"）→ 应该具体到场景

---

## 迭代时机

以下情况应主动提出更新 skill：

1. 用户纠正了 skill 的某个行为 → 立即更新规范
2. 发现 skill 缺少某个常用场景的覆盖 → 补充
3. SKILL.md 超过 500 行 → 拆分到 reference.md
4. 某个 `!命令` 在当前环境报错 → 修复命令
5. 用户添加了新的全局约束（如新的代码风格规范）→ 检查是否需要更新相关 skill