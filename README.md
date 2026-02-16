# Stock Analyzer

股票分析软件 - 实时行情监控、趋势分析、投资建议

## 功能特性

- 实时股票行情监控
- 个股和大盘K线图
- 技术指标分析
- 个人自选股管理
- 股票相关新闻资讯
- 智能投资建议
- 多平台支持（Web/桌面/移动）

## 技术栈

- 前端: React 18 + TypeScript
- UI框架: Ant Design
- 图表库: ECharts/TradingView
- 状态管理: Redux Toolkit
- 后端: Node.js + Express
- 数据库: PostgreSQL + Redis

## 项目结构

```
stock-analyzer/
├── packages/
│   ├── common/           # 共享代码
│   │   ├── components/   # 通用组件
│   │   ├── hooks/        # 共享Hooks
│   │   ├── utils/        # 工具函数
│   │   └── types/        # 类型定义
│   ├── web/              # Web版
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── mobile/           # 移动端（预留）
│   └── desktop/          # 桌面端（预留）
├── services/             # 后端服务
├── shared/               # 共享配置
└── docs/                 # 文档
```

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```