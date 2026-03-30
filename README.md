<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AI 智能设备运营系统 (AI Agent Device System)

</div>

## 📌 项目简介

本项目是一个基于 **React 19 + Vite** 构建的一站式 AI 智能设备运营与管理平台。系统深度集成了 Google Gemini 强大的生成式 AI 能力，旨在为硬件设备管理、状态监控、数据可视化及自动化运营数据分析报告提供智能化的解决方案。

*初始工程基于 Google AI Studio 导出生成。*

## ⚙️ 核心功能模块

系统包含了多个主要功能页面（映射自 `src/pages`）：
- **首页概览 (Home)**：全局系统核心指标与状态总览。
- **运营看板 (Operation Dashboard)**：依托 Recharts 与 D3，通过多样化的图表全景展示各设备节点的运行状况和运维统计信息。
- **硬件智能体 (Hardware Agent)**：硬件与数字孪生及边缘 AI Agent 的管理平台，负责进行远程对话、健康追踪等。
- **运营报告 (Operation Report)**：对接核心的 Gemini 大模型能力，通过多维度数据汇总，一键生成结构化运营周报或故障预测报告。
- **AI 实验室 (AI Lab)**：提供在现有设备池上的各类 AI 大模型能力测试和特性预览。
- **帮助与支持 (FAQ)**：提供常见问题和使用手册的答疑中心。

## 🛠 技术栈 (Tech Stack)

### 核心框架体系
- **框架**：[React 19](https://react.dev/) + TypeScript
- **构建工具**：[Vite 6](https://vitejs.dev/)
- **路由控制**：React Router DOM 7
- **UI 层与动画**：Tailwind CSS v4 + Tailwind Merge + clsx + Motion + Lucide React

### 核心功能依赖
- **图表数据引擎**：Recharts v3 + D3
- **AI 与大模型 SDK**：`@google/genai` (与 Google Gemini API 通信的核心组件)
- **本地服务 / Proxy 支持**：Express + dotenv

## 🚀 快速启动 (Run Locally)

**环境要求：** 
- `Node.js` (建议版本 >= 18.x)

### 操作步骤

1. **安装所有依赖依赖**
   ```bash
   npm install
   ```

2. **配置相关的环境变量**
   
   请确保从 `.env.example` 复制一份配置名为 `.env.local` 或者 `.env`，并在此补全您的 AI API Key：
   ```env
   # .env.local 示例
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **运行开发环境**
   ```bash
   npm run dev
   ```
   *服务将在本地启动，默认绑定 3000 端口，并开放网络映射（`0.0.0.0`）。控制台会输出访问地址。*

4. **代码构建与打包**
   ```bash
   npm run build
   ```

## 📜 常用脚本命令说明

| NPM 脚本命令 | 功能描述 |
| --- | --- |
| `npm run dev` | 启动开发服务器（并基于 Vite 提供极速 HMR 热更新） |
| `npm run build` | 构建并压缩项目的生产版本及相关 Bundle |
| `npm run preview` | 本地测试并预览打完包的生产代码 |
| `npm run clean` | 清除旧的 `dist` 构建文件夹 |
| `npm run lint` | 仅执行 TypeScript 类型校验及问题捕获但不输出代码 (`tsc --noEmit`) |
