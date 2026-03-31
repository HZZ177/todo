---
mode: dev-plan
cwd: D:\Pycharm Projects\todo
task: Windows 桌面待办应用一期规划
complexity: medium
created_at: 2026-03-31 11:41:49
issues_path: .dev/issues/2026-03-31_11-41-49-windows-desktop-todo-app.csv
contract_version: 1
constitution_path: ""
design_path: ""
requirements_path: ""
---

## View 1: Review

### 任务概述
规划一款 Windows 桌面轻量待办应用一期版本。应用默认以半透明、置顶的悬浮球存在于桌面；用户点击后，以动画展开同一窗口中的主面板。主面板采用上下联动布局：上半区为月视图，下半区为选中日期的时间线视图，并提供嵌入式快速录入能力。任务数据为本地离线存储，不做同步。

### 设计来源
- 主设计文档（DES）：无
- 关联需求（REQ）：无
- 项目宪法：未发现 `.ktaicoding/CONSTITUTION.md`
- 本 Plan 的设计基础：直接基于用户对话中确认的产品边界与实现偏好

#### 用户已确认的关键边界
1. 一期仅做本地离线，不做同步
2. 任务字段收敛为：标题 + 日期 + 可选时间 + 完成状态
3. 时间线视图支持任意选中日期，而非仅今天
4. 展开态布局为月视图 + 时间线上下联动双区布局
5. 目标是做可运行桌面应用一期
6. 悬浮球位置持久化为必做项
7. 允许加入最基础的系统托盘入口

### 需求边界
#### 本期范围
- Windows 桌面可运行应用
- 半透明置顶悬浮球
- 单窗口两态切换：收起态 / 展开态
- 展开态月视图
- 展开态选中日期时间线视图
- 快速录入待办
- 待办完成状态切换
- 本地持久化任务数据
- 本地持久化悬浮球位置
- 基础系统托盘：显示主界面 / 退出应用

#### 本期不做
- 云同步 / 账号体系
- 提醒通知
- 重复任务
- 标签、优先级、描述等扩展字段
- 多窗口协同架构
- 跨平台适配
- 复杂筛选、搜索、统计分析

### 现状分析
当前仓库为空仓库，仅包含 `.claude`、`.git`、`.idea` 与 `.gitignore` 等基础文件，不存在现成业务代码、设计文档、需求文档或项目宪法。需要从零初始化项目与工程结构。

### 关键决策
#### 决策 1：使用 Tauri + React + TypeScript
原因：
- 适合做轻量 Windows 桌面工具
- 窗口控制、透明度、托盘、打包能力够用
- 相比 Electron 更轻量
- 前端 UI 开发效率高，便于打磨交互

#### 决策 2：采用单窗口两态切换
收起态与展开态共享同一个窗口，通过窗口尺寸、内容区和动画控制切换，而不是拆成独立悬浮球窗口 + 面板窗口。

原因：
- 显著降低窗口焦点、定位、同步与生命周期复杂度
- 更适合一期尽快做出稳定可运行版本

#### 决策 3：录入区嵌入展开态时间线面板
不单独设置“录入视图”，而是在时间线区域顶部嵌入快速录入表单。

原因：
- 降低交互层级
- 用户录入后可立即看到当前日期的数据变化
- 缩小一期范围

#### 决策 4：数据模型极简
建议一期任务模型：
- `id`
- `title`
- `date` (`YYYY-MM-DD`)
- `time` (`HH:mm`，可选)
- `completed`
- `createdAt`
- `updatedAt`

原因：
- 足够支撑月视图、时间线和完成状态
- 避免过早引入复杂业务规则

### 否决方案
#### 否决 1：Electron + React
原因：对当前轻量桌面工具目标偏重，性能和体积上不占优。

#### 否决 2：双窗口架构
原因：会额外引入窗口锚点、焦点恢复、位置同步和外部点击关闭等复杂问题，不适合一期。

#### 否决 3：一期引入同步、提醒或重复任务
原因：这些能力会显著扩大范围，削弱“先交付桌面轻量工具”的目标。

### 执行约束
- 一期只面向 Windows
- 不依赖云服务
- 所有关键数据本地存储
- 窗口交互优先保证稳定，再考虑视觉细节增强
- 任务展示逻辑需保证月视图与时间线共享同一数据源
- 代码实现前，执行 AI 必须先读本 Plan 对应 Issue，再读对应 `code_refs` 指向代码

### 测试策略
当前无项目宪法，测试按仓库探测 + 前端桌面应用默认实践制定。

#### 测试重点
1. 悬浮球显示、点击展开/收起
2. 悬浮球拖拽与位置持久化
3. 月视图选中日期与时间线联动
4. 新增仅日期任务后进入未安排分组
5. 新增带时间任务后进入时间线排序区
6. 完成状态变更后两个视图同步更新
7. 任务与窗口位置重启恢复
8. 托盘操作可正常显示主界面和退出

#### 测试落盘策略
- 前端单元/组件测试：跟随源码测试目录
- 手工验证记录或额外测试说明：`.dev/test/`

### 风险与注意事项
- Windows 透明窗口、拖拽和置顶行为需要结合 Tauri 实际能力验证
- 单窗口两态虽然更简单，但需要谨慎处理尺寸切换与布局动画，避免闪烁
- 月视图与时间线共用数据时，日期格式与排序逻辑必须统一
- 若 Tauri 透明窗口在某些环境下表现受限，需要保留 UI 降级空间（例如保留轻微背景而非完全透明）

### 参考
- 用户对话确认的一期产品边界
- 当前仓库实际状态（空仓库）

## View 2: Issue Contract

### Issue DP-001
- id: DP-001
- priority: P0
- title: 初始化桌面应用工程骨架
- summary: 使用 Tauri + React + TypeScript 初始化 Windows 桌面应用一期工程，建立基础目录、开发脚本和运行入口，为后续窗口交互和业务模块提供承载。
- design_refs:
  - View 1: Review > 关键决策 > 决策 1
  - View 1: Review > 需求边界 > 本期范围
- code_refs:
  - package.json
  - src-tauri/**
  - src/**
  - vite.config.*
  - tsconfig*.json
- acceptance_criteria:
  - 可在本地启动开发环境并打开桌面应用窗口
  - 工程包含 React 前端与 Tauri 后端基础结构
  - 项目具备后续新增状态管理、组件与存储能力的目录组织
- test_cases:
  - 本地执行开发启动命令，应用可成功打开
  - 初始窗口可正常加载前端页面
- constraints:
  - 仅面向 Windows 一期
  - 不引入不必要的复杂基础设施
- depends_on: []
- notes: 优先选择轻量依赖，为后续功能实现留足空间

### Issue DP-002
- id: DP-002
- priority: P0
- title: 实现悬浮球收起态与位置持久化
- summary: 实现应用默认收起态的半透明置顶悬浮球，支持拖拽移动，并将窗口位置持久化到本地，在下次启动时恢复。
- design_refs:
  - View 1: Review > 任务概述
  - View 1: Review > 设计来源 > 用户已确认的关键边界
  - View 1: Review > 测试策略
- code_refs:
  - src/app/window-shell/**
  - src/store/ui-store.*
  - src-tauri/**
- acceptance_criteria:
  - 应用启动后默认展示悬浮球收起态
  - 悬浮球处于置顶状态且具备半透明视觉效果
  - 用户可拖拽悬浮球移动位置
  - 关闭并重新打开应用后悬浮球位置恢复
- test_cases:
  - 启动应用后可见悬浮球
  - 拖拽后重启应用，位置保持一致
- constraints:
  - 拖拽与置顶行为需兼容 Windows 桌面使用场景
  - 一期不要求复杂吸附或多显示器策略
- depends_on:
  - DP-001
- notes: 若透明能力受限，可接受轻微背景色作为视觉降级

### Issue DP-003
- id: DP-003
- priority: P0
- title: 实现单窗口展开态与切换动画
- summary: 基于单窗口两态方案，实现从悬浮球收起态到主面板展开态的尺寸切换、内容切换和基础过渡动画，保证交互稳定。
- design_refs:
  - View 1: Review > 关键决策 > 决策 2
  - View 1: Review > 风险与注意事项
- code_refs:
  - src/app/window-shell/**
  - src/components/layout/**
  - src/store/ui-store.*
  - src/styles/**
- acceptance_criteria:
  - 点击悬浮球可切换到展开态面板
  - 展开态展示完整主界面布局容器
  - 再次触发收起操作可回到悬浮球态
  - 切换过程无明显状态错乱或布局破碎
- test_cases:
  - 连续展开/收起多次后界面状态正确
  - 展开态尺寸和收起态尺寸切换正常
- constraints:
  - 优先稳定性，不追求复杂动画效果
- depends_on:
  - DP-002
- notes: 可以先做基础 CSS/状态过渡，再逐步细化视觉

### Issue DP-004
- id: DP-004
- priority: P0
- title: 建立 Todo 数据模型与本地存储
- summary: 定义一期 TodoItem 数据结构，建立统一数据源与本地持久化能力，使任务数据在重启后恢复，并支撑月视图与时间线共享。
- design_refs:
  - View 1: Review > 关键决策 > 决策 4
  - View 1: Review > 需求边界 > 本期范围
- code_refs:
  - src/types/**
  - src/store/todo-store.*
  - src/services/storage/**
- acceptance_criteria:
  - 存在统一 Todo 数据模型定义
  - 支持新增、更新完成状态、按日期查询等基础操作
  - 任务数据可本地持久化并在重启后恢复
- test_cases:
  - 新增任务后刷新/重启应用，数据仍存在
  - 按日期查询结果正确
- constraints:
  - 不引入同步相关结构
  - 数据结构保持极简
- depends_on:
  - DP-001
- notes: 存储实现可优先采用 Tauri Store 或等价轻量方案

### Issue DP-005
- id: DP-005
- priority: P1
- title: 实现月视图与日期选中逻辑
- summary: 实现展开态上半区月视图，支持月份展示、切换与日期选中，并在日期单元格中反映该日任务概况。
- design_refs:
  - View 1: Review > 任务概述
  - View 1: Review > 页面结构
- code_refs:
  - src/features/calendar/**
  - src/store/ui-store.*
  - src/store/todo-store.*
- acceptance_criteria:
  - 可展示当前月份日历网格
  - 支持切换上月/下月
  - 支持选中任意日期
  - 日期单元格可显示任务数量或标记
- test_cases:
  - 切换月份后日期网格正确更新
  - 点击某日后选中状态正确变化
- constraints:
  - 展示信息保持简洁，不做复杂卡片化设计
- depends_on:
  - DP-003
  - DP-004
- notes: 日期选中状态应作为月视图与时间线联动的单一来源

### Issue DP-006
- id: DP-006
- priority: P1
- title: 实现时间线视图与任务分组排序
- summary: 实现展开态下半区时间线，基于当前选中日期展示任务详情；有时间的任务按时间排序，无时间任务进入未安排分组。
- design_refs:
  - View 1: Review > 任务概述
  - View 1: Review > 关键决策 > 决策 3
- code_refs:
  - src/features/timeline/**
  - src/store/ui-store.*
  - src/store/todo-store.*
- acceptance_criteria:
  - 下半区可显示选中日期对应任务列表
  - 带时间任务按时间升序排列
  - 无时间任务显示在未安排分组
  - 切换月视图选中日期后时间线同步更新
- test_cases:
  - 同日多条带时间任务按顺序显示
  - 同日无时间任务正确归类
- constraints:
  - 一期只处理单日视图，不做跨天时间轴
- depends_on:
  - DP-005
- notes: 排序与分组逻辑应独立成可测试函数

### Issue DP-007
- id: DP-007
- priority: P1
- title: 实现快速录入与完成状态联动
- summary: 在时间线区域顶部嵌入快速录入表单，支持创建任务、设置日期和可选时间，并支持切换完成状态，确保月视图与时间线同步更新。
- design_refs:
  - View 1: Review > 关键决策 > 决策 3
  - View 1: Review > 需求边界 > 本期范围
- code_refs:
  - src/features/todo-form/**
  - src/features/timeline/**
  - src/features/calendar/**
  - src/store/todo-store.*
- acceptance_criteria:
  - 用户可输入标题并选择日期创建任务
  - 用户可选择是否填写具体时间
  - 新建任务后月视图和时间线立即同步更新
  - 用户可切换任务完成/未完成状态
- test_cases:
  - 新建仅日期任务后进入未安排分组
  - 新建带时间任务后显示在正确时间位置
  - 切换完成状态后两个视图同步变化
- constraints:
  - 表单保持轻量，不做复杂校验规则
- depends_on:
  - DP-004
  - DP-005
  - DP-006
- notes: 默认日期可使用当前选中日期，减少输入成本

### Issue DP-008
- id: DP-008
- priority: P1
- title: 实现系统托盘与一期测试收口
- summary: 增加基础系统托盘入口，支持显示主界面与退出应用；同时补充一期关键测试与手动验证记录，完成可运行版本的交付收口。
- design_refs:
  - View 1: Review > 设计来源 > 用户已确认的关键边界
  - View 1: Review > 测试策略
- code_refs:
  - src-tauri/**
  - src/**/__tests__/**
  - .dev/test/**
- acceptance_criteria:
  - 系统托盘可提供显示主界面与退出能力
  - 一期关键路径测试已补齐
  - 存在可执行的手工验证清单或记录
- test_cases:
  - 托盘点击可重新显示主界面
  - 托盘退出可正常关闭应用
  - 一期关键场景验证全部通过
- constraints:
  - 托盘能力保持最小实现，不做复杂菜单
- depends_on:
  - DP-007
- notes: 测试收口阶段需覆盖窗口状态、数据恢复和核心交互链路
