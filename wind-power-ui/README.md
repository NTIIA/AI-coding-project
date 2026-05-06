# 风电功率预测可视化大屏

本项目是一个基于 React 与 Vite 构建的风电功率预测可视化前端，用于展示风电场实时运行态势、功率预测结果、气象资源分析、数据链路质量与机组健康状态等信息。界面采用高信息密度的大屏布局，适合竞赛展示、调度监控原型、风电预测系统演示等场景。

当前版本为前端静态演示项目，页面数据主要来自组件内置 Mock 数据，尚未接入真实后端接口。

## 功能概览

- 实时监控：展示风场总览、机组运行状态、设备列表、节点健康等运行态势。
- 功率预测：展示历史功率对比、未来功率预测区间、预测准确率与误差指标。
- 气象分析：展示风速、风向、温度、气压、湿度、风玫瑰等气象要素。
- 数据管理：展示数据源质量、数据接入速率、底层链路节点状态。
- 自适应大屏：基于固定设计稿尺寸进行等比缩放，适配不同分辨率屏幕。
- 图表可视化：使用 Recharts 绘制折线图、面积图、柱状图、饼图等。

## 技术栈

- React 19：前端组件开发。
- Vite 8：开发服务器与项目构建。
- Tailwind CSS 4：基础样式能力。
- Recharts：图表可视化。
- ESLint：代码质量检查。

## 项目结构

```text
wind-power-ui/
├── public/
│   ├── favicon.svg              # 浏览器图标
│   └── icons.svg                # 公共 SVG 图标资源
├── src/
│   ├── assets/
│   │   ├── hero.png             # 页面视觉资源
│   │   ├── react.svg            # Vite 模板资源
│   │   └── vite.svg             # Vite 模板资源
│   ├── App.jsx                  # 应用根组件，加载大屏页面
│   ├── App.css                  # 应用样式文件
│   ├── index.css                # 全局样式与 Tailwind 引入
│   ├── main.jsx                 # React 应用入口
│   ├── WindPowerForecastingDashboard.jsx      # 当前主大屏组件
│   └── WindPowerForecastingDashboard.bak.jsx  # 大屏组件备份文件
├── eslint.config.js             # ESLint 配置
├── index.html                   # Vite HTML 入口
├── package.json                 # 项目依赖与脚本
├── package-lock.json            # npm 依赖锁定文件
├── vite.config.js               # Vite 配置
└── README.md                    # 项目说明文档
```

## 快速开始

### 环境要求

建议使用较新的 Node.js LTS 版本，并使用 npm 安装依赖。

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

启动后根据终端输出访问本地开发地址，通常为：

```text
http://localhost:5173/
```

### 生产构建

```bash
npm run build
```

构建产物默认输出到 `dist/` 目录。

### 本地预览构建产物

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 核心文件说明

### `src/WindPowerForecastingDashboard.jsx`

项目的主页面文件，包含大屏的核心布局、Mock 数据、图表组件与交互逻辑。主要模块包括：

- `Header`：顶部标题栏与系统状态信息。
- `LeftSidebarContent`：左侧面板区域，根据底部导航切换不同业务内容。
- `RightSidebarContent`：右侧面板区域，根据底部导航切换不同业务内容。
- `TurbineScene`：中心风场态势展示区域。
- `BottomNav`：底部导航，用于切换实时监控、功率预测、气象分析、数据管理等视图。
- `useDashboardScale`：根据浏览器窗口尺寸计算大屏缩放比例。
- `DashboardStyles`：大屏页面的主要内联样式定义。

### `src/App.jsx`

应用根组件，当前直接渲染 `WindPowerForecastingDashboard`。

### `src/main.jsx`

React 应用入口，负责将根组件挂载到 `#root`。

### `src/index.css`

全局 CSS 文件，包含 Tailwind CSS 引入以及页面基础样式。

## 数据说明

当前页面使用静态 Mock 数据进行展示，主要数据定义集中在 `src/WindPowerForecastingDashboard.jsx` 文件顶部，例如：

- `weatherCards`：气象指标卡片数据。
- `historyData`：历史实际功率与理论功率对比数据。
- `forecastData`：未来功率预测及上下限区间数据。
- `unitStatusData`：机组状态分布数据。
- `accuracyItems`：预测准确率与误差指标。
- `mockDataQuality`：数据源质量数据。
- `mockTurbines`：机组列表与状态数据。
- `mockNodes`：数据链路节点状态数据。

后续如需接入真实业务数据，可将这些 Mock 数据替换为接口请求结果，并按图表字段结构进行映射。

## 页面模块

底部导航当前包含四个主要业务视图：

| 模块 | 说明 |
| --- | --- |
| 实时监控 | 展示全场资产运行态势、机组状态、设备状态与关键运行指标 |
| 功率预测 | 展示历史功率、预测曲线、预测区间、模型准确率与误差指标 |
| 气象分析 | 展示风速、风向、温度、风资源分布等气象分析信息 |
| 数据管理 | 展示数据质量、接入速率、链路节点、底层数据服务状态 |

## 开发建议

- 接口接入：建议新增 `src/services/` 目录统一管理接口请求。
- 数据类型：若项目继续扩展，可迁移至 TypeScript，提高图表数据和业务字段的可维护性。
- 组件拆分：当前主组件体量较大，后续可按面板拆分到 `src/components/` 目录。
- 配置管理：风场名称、装机容量、站点坐标、刷新频率等参数可抽离为配置文件。
- 真实刷新：可通过轮询、WebSocket 或 SSE 接入实时 SCADA、气象与预测结果数据。

## 构建与部署

执行生产构建：

```bash
npm run build
```

将生成的 `dist/` 目录部署到静态资源服务器即可，例如 Nginx、对象存储静态站点、竞赛展示服务器等。

如部署在非根路径，需要根据实际部署路径调整 Vite 的 `base` 配置。

## 备注

- 当前项目为前端展示型工程，不包含后端服务、数据库或真实预测模型。
- `WindPowerForecastingDashboard.bak.jsx` 为备份文件，正式开发时建议明确是否保留，避免后续维护混淆。
- 页面采用大屏固定设计尺寸并进行缩放，适合横屏展示环境。
