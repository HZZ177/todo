---
name: "dev-plan"
description: |
  设计后开发计划：基于 DES（及 REQ）进入 Dev Plan 模式，与项目宪法对齐，生成 Plan + Issues CSV。通过 /dev-plan 触发。

  优先以设计文档为一级输入，澄清并收敛为可执行的 Issue 合同；落盘 .dev/plans 与 .dev/issues。与 dev-plan-execute 配对完成「计划 → 执行」闭环。

  使用场景：/dev-plan、开发计划、Issue 拆解、任务合同、DES 落地、设计后规划。
invocation: "manual"
argument-hint: "<DES 路径优先，或 REQ 路径，或需求/设计文字描述>"
---

你现在处于「Dev Plan 模式」（同义：原 `plan` skill，已迁移为本目录）。

这是一个**多轮协作规划过程**。目标不是写一个摘要文档，而是直接产出一份可审阅、可执行的任务合同：

1. **设计文档（DES，优先）**：设计后开发的一级输入，承载架构、接口、数据与测试要点
2. **需求文档（REQ，追溯）**：业务边界与验收；与 DES 元信息「关联需求」对应
3. **项目宪法**（`.ktaicoding/CONSTITUTION.md`，若存在）：规范硬约束，Plan 的测试策略与执行约束须与之对齐，而非在 skill 内写死某种语言或命令
4. **Plan**：合同正文，包含两个视图
   - `View 1: Review`：给人 review 的说明视图
   - `View 2: Issue Contract`：给执行 AI 的完整 issue 合同视图
5. **Issues CSV**：状态投影，只保存执行状态和最小索引信息，不再表达复杂设计

**本流程与执行侧只有两个 skill：**

- `dev-plan`（本 skill）
- `dev-plan-execute`

不要再拆出任何「Plan → Issues」的中间流程，也不要把 issue 拆分留给另一个 skill 二次理解。

## 一、输入规则

1. `$ARGUMENTS` 可以是（**优先级从高到低**）：
   - **设计文档路径（DES）**：`docs/design/DES-*.md`（**最推荐**，与设计后开发衔接）
   - **需求文档路径（REQ）**：`docs/requirement/REQ-*.md`（无 DES 时的降级路径，或作为 DES 已关联 REQ 的补充）
   - **纯文本**需求或设计要点（最后手段；落盘前仍应尽量关联到将生成的 DES/REQ 路径或提示用户补文件）
2. 若输入是 **DES 路径**：
   - 必须先读取该文档
   - 将其视为**主设计源**；从正文元信息读取关联 REQ 路径（若有），并准备读取该 REQ 以对齐验收与边界
3. 若输入是 **REQ 路径**（无 DES）：
   - 将其视为**主需求源**；在调研汇报中**明确标注**「尚无 DES，执行合同将主要锚定 REQ」；建议用户在设计完成后用 DES 重建 Plan 以收紧技术细节
4. 若输入是纯文本：
   - 正常调研并讨论
   - 最终仍然要生成完整的 Review View + Issue Contract + Issues CSV

### 项目宪法（强制尝试）

- 在生成或修订 Plan 正文前，**须尝试**加载项目根目录 `.ktaicoding/CONSTITUTION.md`（路径可写入 Plan frontmatter `constitution_path`）。
- **若存在**：在 `View 1: Review` 中写明与本次任务相关的对齐摘要（技术栈、构建、测试 §6、分层等）；测试文件位置、框架与命名**以宪法为准**。
- **若不存在或明显不完整**：不得静默假定某一语言为唯一默认；在 Review 中说明依赖「仓库探测 + 本范式测试默认」；可提示用户通过 `/project-init` 补全宪法。

## 二、阶段流程

### 阶段 A：调研

收到输入后，先做项目调研，不要急于提方案：

1. 若有 DES，先读取并提取：架构、接口、数据、配置、时序、测试点、与 REQ 的关联
2. 若有 REQ（含从 DES 元信息解析出的关联 REQ），读取并提取：边界、验收、用户故事
3. 尝试读取 `.ktaicoding/CONSTITUTION.md` 并提取与实现相关的约束
4. 从上述文档或描述中提取关键词，用 Grep/Glob 定位相关文件和模块
5. 阅读关键代码，理解现有架构、依赖关系和落地约束
6. 向用户汇报调研结果

**调研汇报格式**：

```text
需求/设计理解：<用自己的话复述，确认理解是否正确>

设计来源：
- 主设计文档（DES）：<路径或「无」>
- 关联需求（REQ）：<路径或「无」>
- 项目宪法：<已加载路径或「无」>
- 默认沿用的设计：<DES/REQ 中哪些章节/机制将直接作为实现基础>
- 需要在 Dev Plan 阶段澄清/覆盖的点：<哪些还需要讨论>

项目现状：
- <关键发现 1>
- <关键发现 2>
- <关键发现 3>

初步思路：
- 方案 A：<简述> — 优点：... / 代价：...
- 方案 B：<简述> — 优点：... / 代价：...
（如果只有一种合理路径，说明为什么其他路径不可行）

测试思路（初步）：
- <单元/集成/接口测试建议>
- <关键场景>
- 测试落盘位置：若宪法 §6 已规定则遵循；否则本范式默认 `.dev/test/`

需要和你确认的问题：
1. <边界疑问>
2. <设计覆盖点>
3. <测试或 issue 粒度确认>
```

### 阶段 B：讨论与收敛

在用户回应后，继续多轮讨论，直到方案收敛。

**你应该做的**：

- 明确区分：哪些内容来自 DES/REQ、哪些是 Plan 新增澄清、哪些是 Plan 覆盖决策
- 对可能的技术风险提前预警
- 当讨论中出现新信息，主动回到 DES/REQ 和代码中验证
- 逐步收敛 issue 粒度，不要等落盘时临时拆分

**你不应该做的**：

- 不要把 DES/REQ 机械复制到 Plan
- 不要在关键点未收敛时急于落盘
- 不要让 issue 拆分依赖落盘后的二次猜测

### 阶段 B2：测试边界讨论（必须执行）

在方案收敛后、落盘前，必须先完成测试边界讨论。

输出格式：

```text
测试点清单（草案）：

| 功能点 | 测试场景 | 场景类型 | 预期结果 |
|--------|---------|---------|---------|
| <功能 1> | <场景描述> | 正常/边界/异常 | <预期> |
| ... | ... | ... | ... |

测试落盘位置：
- 若宪法存在且规定测试布局：按宪法
- 否则：本范式默认 `.dev/test/`（文件名包含 `test_<csv-slug>` 与项目所用扩展名，由技术栈决定）

需要确认：
1. <是否有遗漏的测试场景？>
2. <某个边界条件是否需要覆盖？>
```

### 阶段 C：落盘（用户明确同意后才执行）

落盘阶段必须一次性完成三件事：

1. 生成 Plan 文件
2. 从 Plan 的 Issue Contract 直接映射生成 Issues CSV
3. 校验 Issues CSV

## 三、Plan 文件规范

### 目录与文件名

- Plan：`.dev/plans/YYYY-MM-DD_HH-mm-ss-<slug>.md`
- CSV：`.dev/issues/YYYY-MM-DD_HH-mm-ss-<slug>.csv`

### Frontmatter 必填字段

- `mode`（建议值 `dev-plan`）
- `cwd`
- `task`
- `complexity`
- `created_at`
- `issues_path`
- `contract_version`
- `constitution_path`（若无宪法可留空）
- `design_path`（若无 DES 可留空）
- `requirements_path`（若无 REQ 可留空）

### 正文必须包含两个视图

#### `## View 1: Review`

职责：给人 review，记录为什么这样做。

必须包含：

- 任务概述
- 设计来源（DES / REQ / 宪法对齐摘要）
- 需求边界
- 现状分析
- 关键决策
- 否决方案
- 执行约束
- 测试策略（宪法优先，否则范式默认 `.dev/test/`）
- 风险与注意事项
- 参考

#### `## View 2: Issue Contract`

职责：执行合同正文，给执行 AI 直接使用。

每条 issue 必须写清：

- `id`
- `priority`
- `title`
- `summary`
- `design_refs`（优先指向 DES 章节；可含 REQ）
- `code_refs`
- `acceptance_criteria`
- `test_cases`
- `constraints`
- `depends_on`
- `notes`

**重要原则**：

- Issue Contract 不是附录，是执行合同正文
- 执行 AI 必须先读对应 issue 条目，再读 `design_refs` 指向的 **DES/REQ** 设计，再读 `code_refs` 指向的代码，最后才开始写实现
- 若 DES 已给出主要设计，Issue Contract 只做执行化映射和约束补充，不重新设计

## 四、Issues CSV 规范

### CSV 角色

CSV 只是状态投影，不再承担复杂设计表达。

### 固定表头

使用以下 schema：

```text
id,priority,title,refs,dev_state,test_state,owner,notes
```

字段含义：

- `id`：issue 唯一标识，必须与 Plan 的 Issue Contract 一致
- `priority`：`P0|P1|P2`
- `title`：简短标题
- `refs`：最小索引信息，可由 `design_refs + code_refs` 合并映射
- `dev_state`：`未开始|进行中|已完成`
- `test_state`：`未开始|进行中|已完成|失败`
- `owner`：默认留空
- `notes`：执行备注、阻塞、完成时间等

### CSV 生成与校验

使用 `dev-plan/scripts/` 下的脚本：

- 生成：`dev-plan/scripts/generate-csv.py`
- 校验：`dev-plan/scripts/validate-csv.py`

## 五、Issue 粒度原则

每条 issue 应当是一个**可独立开发、可独立测试、可独立验收**的最小交付单元。

优先按以下维度拆分：

1. 按模块 / 文件拆
2. 按新建角色拆（模型 / 服务 / 中间件 / 消费者适配）
3. 按层拆（后端 / 前端 / 基础设施）
4. 按阶段拆（基础能力 → 集成 → 测试补全）
5. 如果 DES/REQ 已天然分出逻辑块 / 时序块，应优先映射为 issue
6. 如果一条 issue 同时包含「持久化 / 纯函数算法 / 中间件 hook / 主链路接入 / 测试收口」等多个关注点，必须继续拆分，直到每条 issue 成为一个真正的小闭环

### 默认粒度目标

- `simple`：4-6 条 issue
- `medium`：7-11 条 issue
- `complex`：12-18 条 issue

**特别要求**：

- complex 任务默认先细拆，再允许合并；不要先粗拆后把细分留给执行 AI 在 issue 内部二次脑补
- 若 DES 已提供较完整的技术路径，issue 拆分应尽量映射其中的状态机节点、时序节点、持久化边界、纯函数边界和主链路接入点
- 默认宁可多 2-3 条清晰的小 issue，也不要少几条但每条内部仍需自行再拆一层

## 六、多次调用规则

- 首次调用：开始新的调研和讨论
- 用户说「基于之前的 Plan 调整」：读取已有 Plan，继续讨论，并**同步更新 Plan + CSV**
- 用户说「修改某条 issue」：必须同时更新 Issue Contract 和 CSV
- 用户说「新的需求/设计」：重新开始一份新 Plan

## 七、原则

- 不要过早收敛
- **DES 优先、REQ 追溯、宪法对齐**；Plan 覆盖显式化
- Plan 是合同正文，CSV 是状态投影
- 任何执行所需的重要设计信息，都必须保留在 DES/REQ 或 Plan 中，不能只存在对话里
