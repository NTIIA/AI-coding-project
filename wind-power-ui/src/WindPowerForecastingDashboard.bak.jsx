import React from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

/**
 * Wind Power Forecasting Dashboard - refined visual version
 *
 * 设计目标：在不重建项目的前提下，保留原有 React + Recharts 组件结构，
 * 将视觉细节改为更接近参考图的大屏科幻风：顶部驾驶舱标题栏、左右信息面板、
 * 中央数字孪生风机、底部斜切导航、蓝青色 HUD 光效。
 *
 * 使用方式：直接替换原 WindPowerForecastingDashboard.jsx。
 * 依赖：react、recharts。无需 lucide-react、无需外部图片素材、无需 Tailwind。
 */

const weatherCards = [
  { label: "风速", value: "8.6", unit: "m/s" },
  { label: "风向", value: "236°", unit: "西南" },
  { label: "气温", value: "18.2", unit: "°C" },
  { label: "气压", value: "1012.3", unit: "hPa" },
];

const historyData = [
  { time: "00:00", actual: 52, theory: 60 },
  { time: "02:00", actual: 66, theory: 74 },
  { time: "04:00", actual: 94, theory: 108 },
  { time: "06:00", actual: 78, theory: 86 },
  { time: "08:00", actual: 122, theory: 160 },
  { time: "10:00", actual: 157, theory: 215 },
  { time: "12:00", actual: 137, theory: 176 },
  { time: "14:00", actual: 122, theory: 137 },
  { time: "16:00", actual: 171, theory: 190 },
  { time: "18:00", actual: 206, theory: 222 },
  { time: "20:00", actual: 236, theory: 258 },
  { time: "22:00", actual: 218, theory: 244 },
  { time: "24:00", actual: 205, theory: 246 },
];

const forecastData = [
  { time: "14:00", p: 42, a: 37, low: 26, high: 56 },
  { time: "16:00", p: 68, a: 64, low: 50, high: 84 },
  { time: "18:00", p: 174, a: 168, low: 145, high: 199 },
  { time: "20:00", p: 205, a: 198, low: 178, high: 225 },
  { time: "22:00", p: 202, a: 194, low: 176, high: 226 },
  { time: "00:00", p: 190, a: 185, low: 164, high: 214 },
  { time: "02:00", p: 184, a: 176, low: 154, high: 210 },
  { time: "04:00", p: 177, a: 169, low: 144, high: 207 },
  { time: "06:00", p: 166, a: null, low: 130, high: 198 },
  { time: "08:00", p: 145, a: null, low: 104, high: 183 },
  { time: "10:00", p: 121, a: null, low: 78, high: 164 },
  { time: "12:00", p: 94, a: null, low: 54, high: 137 },
  { time: "14:00+", p: 73, a: null, low: 38, high: 118 },
].map((item) => ({ ...item, range: Math.max(item.high - item.low, 0) }));

const unitStatusData = [
  { name: "正常运行", value: 42, color: "#42e4a9" },
  { name: "限功率运行", value: 3, color: "#3488ff" },
  { name: "停机", value: 2, color: "#f2c84b" },
  { name: "故障", value: 1, color: "#ff4f61" },
];

const navItems = [
  { icon: "monitor", title: "实时监控", sub: "数据与运行" },
  { icon: "trend", title: "功率预测", sub: "预测与优化", active: true },
  { icon: "weather", title: "气象分析", sub: "气象数据分析" },
  { icon: "alarm", title: "告警诊断", sub: "事件与告警" },
  { icon: "database", title: "数据管理", sub: "数据接入与治理" },
  { icon: "report", title: "报表中心", sub: "报表与导出" },
];

const accuracyItems = [
  { label: "准确率", value: "92.5%", icon: "gauge" },
  { label: "MAE", value: "8.7%", icon: "settings" },
  { label: "RMSE", value: "12.4MW", icon: "search" },
  { label: "R²", value: "0.96", icon: "shield" },
];

function DashboardStyles() {
  return (
    <style>{`
      :root {
        --bg0: #020812;
        --bg1: #06162b;
        --panel: rgba(5, 24, 50, 0.76);
        --panel2: rgba(2, 19, 43, 0.88);
        --line: rgba(32, 170, 255, 0.33);
        --line-soft: rgba(87, 207, 255, 0.16);
        --cyan: #23d6ff;
        --cyan2: #55f6ff;
        --blue: #1f7dff;
        --text: #d8f4ff;
        --muted: #7c9abc;
        --green: #39efb4;
        --orange: #ff8d3a;
        --red: #ff5369;
      }

      * { box-sizing: border-box; }
      .wf-root {
        min-height: 100vh;
        width: 100%;
        overflow: auto;
        background:
          radial-gradient(circle at 50% 30%, rgba(13, 101, 180, 0.24), transparent 30%),
          radial-gradient(circle at 50% 92%, rgba(0, 221, 255, 0.19), transparent 32%),
          linear-gradient(180deg, #000712 0%, #020a17 55%, #020612 100%);
        color: var(--text);
        font-family: Inter, "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
        padding: 18px;
      }

      .wf-screen {
        position: relative;
        width: min(1920px, calc(100vw - 36px));
        min-width: 1320px;
        min-height: 980px;
        margin: 0 auto;
        border: 1px solid rgba(46, 183, 255, 0.32);
        background:
          radial-gradient(circle at 50% 54%, rgba(14, 165, 233, 0.20), transparent 28%),
          radial-gradient(circle at 50% 95%, rgba(28, 223, 255, 0.22), transparent 18%),
          linear-gradient(180deg, rgba(6, 22, 43, 0.98), rgba(1, 8, 20, 0.99));
        box-shadow: 0 0 72px rgba(0, 153, 255, 0.20), inset 0 0 70px rgba(0, 148, 255, 0.09);
        overflow: hidden;
      }

      .wf-screen::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(69, 204, 255, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(69, 204, 255, 0.045) 1px, transparent 1px),
          radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.14) 58%, rgba(0, 0, 0, 0.52) 100%);
        background-size: 44px 44px, 44px 44px, 100% 100%;
      }

      .wf-screen::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 89px;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 213, 255, 0.95), transparent);
        box-shadow: 0 0 26px rgba(0, 213, 255, 0.65);
        pointer-events: none;
      }

      .wf-header {
        position: relative;
        z-index: 5;
        height: 64px;
        display: grid;
        grid-template-columns: 1fr 620px 1fr;
        align-items: center;
        padding: 0 20px;
        border-bottom: 1px solid rgba(55, 180, 255, 0.24);
        background: linear-gradient(180deg, rgba(5, 19, 43, 0.95), rgba(3, 14, 30, 0.64));
      }

      .wf-header-title {
        position: relative;
        height: 64px;
        display: grid;
        place-items: center;
        color: #e6f8ff;
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-shadow: 0 0 18px rgba(84, 214, 255, 0.98), 0 0 44px rgba(18, 115, 255, 0.45);
        background:
          linear-gradient(135deg, transparent 0 8%, rgba(0, 136, 255, 0.17) 8% 92%, transparent 92% 100%),
          linear-gradient(180deg, rgba(21, 68, 125, 0.25), rgba(4, 20, 42, 0.42));
        clip-path: polygon(0 0, 12% 0, 18% 100%, 82% 100%, 88% 0, 100% 0, 92% 100%, 8% 100%);
      }

      .wf-header-title::before,
      .wf-header-title::after {
        content: "";
        position: absolute;
        bottom: 0;
        height: 1px;
        width: 46%;
        background: linear-gradient(90deg, transparent, rgba(69, 207, 255, 0.9));
        box-shadow: 0 0 12px rgba(69, 207, 255, 0.85);
      }
      .wf-header-title::before { left: 0; }
      .wf-header-title::after { right: 0; transform: scaleX(-1); }

      .wf-header-left,
      .wf-header-right {
        display: flex;
        align-items: center;
        gap: 18px;
        min-width: 0;
        color: #adc8e4;
        font-size: 14px;
        white-space: nowrap;
      }
      .wf-header-right { justify-content: flex-end; }
      .wf-header-left span, .wf-header-right span { display: inline-flex; align-items: center; gap: 6px; }
      .wf-status-dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        background: var(--green);
        box-shadow: 0 0 14px rgba(57, 239, 180, 0.95);
      }

      .wf-layout {
        position: relative;
        z-index: 3;
        display: grid;
        grid-template-columns: 440px 1fr 520px;
        gap: 16px;
        padding: 14px 18px 118px;
      }
      .wf-left,
      .wf-right { display: flex; flex-direction: column; gap: 14px; }
      .wf-center { min-width: 0; }

      .wf-panel {
        position: relative;
        border: 1px solid var(--line);
        background:
          linear-gradient(145deg, rgba(5, 37, 76, 0.80), rgba(2, 14, 33, 0.88)),
          radial-gradient(circle at 100% 0%, rgba(43, 213, 255, 0.14), transparent 36%);
        box-shadow: inset 0 0 28px rgba(40, 183, 255, 0.06), 0 0 24px rgba(0, 132, 255, 0.13);
        overflow: hidden;
        clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
      }
      .wf-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(69, 207, 255, 0.12), transparent 33%),
          linear-gradient(180deg, rgba(69, 207, 255, 0.07), transparent 46%);
      }
      .wf-panel::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 2px;
        width: 42%;
        background: linear-gradient(90deg, rgba(0, 222, 255, 0.95), transparent);
        box-shadow: 0 0 12px rgba(0, 222, 255, 0.8);
      }
      .wf-panel-head {
        position: relative;
        z-index: 1;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px 0 14px;
        border-bottom: 1px solid rgba(65, 192, 255, 0.17);
      }
      .wf-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #d7f5ff;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: .04em;
      }
      .wf-panel-right { color: #7893b0; font-size: 12px; }
      .wf-panel-body { position: relative; z-index: 1; padding: 13px 14px 14px; }

      .wf-icon-badge {
        display: inline-grid;
        place-items: center;
        width: 18px;
        height: 18px;
        border-radius: 5px;
        background: rgba(28, 123, 255, 0.22);
        color: var(--cyan2);
        box-shadow: inset 0 0 12px rgba(69, 207, 255, 0.18);
      }
      .wf-icon { width: 16px; height: 16px; display: block; color: currentColor; }

      .weather-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
      .weather-card {
        min-height: 76px;
        padding: 11px 8px;
        border: 1px solid rgba(42, 161, 255, 0.22);
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(12, 54, 98, 0.60), rgba(3, 22, 48, 0.68));
        box-shadow: inset 0 0 18px rgba(0, 204, 255, 0.04);
      }
      .weather-card .label { color: #8aa5c2; font-size: 12px; }
      .weather-card .value { margin-top: 7px; color: #20e4d1; font-size: 24px; line-height: 1; font-weight: 800; }
      .weather-card .unit { margin-top: 5px; color: #c0d6ec; font-size: 12px; }

      .warning-box {
        margin-top: 10px;
        min-height: 84px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 121, 52, 0.45);
        background: linear-gradient(90deg, rgba(118, 40, 17, 0.78), rgba(47, 19, 17, 0.64));
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(255, 112, 44, 0.12), inset 0 0 24px rgba(255, 102, 31, 0.06);
      }
      .warning-title { display: flex; align-items: center; gap: 7px; color: #ffb987; font-size: 14px; font-weight: 700; }
      .warning-main { display: flex; align-items: center; gap: 13px; margin-top: 8px; }
      .warning-main .windmark {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        color: #ff9c43;
        border-radius: 10px;
        background: rgba(255, 132, 42, 0.12);
      }
      .warning-main strong { display: block; color: #ffb36d; font-size: 17px; margin-bottom: 2px; }
      .warning-main span { color: #ffcfb1; font-size: 12px; }

      .overview-row { display: grid; grid-template-columns: 1fr 128px; gap: 12px; align-items: center; }
      .overview-kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px 18px; }
      .kpi-title { color: #8aa5c2; font-size: 13px; margin-bottom: 5px; }
      .kpi-value { color: #49a9ff; font-size: 24px; line-height: 1; font-weight: 800; }
      .kpi-value small { font-size: 13px; color: #5bc4ff; }
      .ring-gauge {
        --value: 48.4;
        position: relative;
        width: 118px;
        height: 118px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background:
          radial-gradient(circle, #061426 0 56%, transparent 57% 100%),
          conic-gradient(#1b86ff var(--angle), rgba(26, 78, 160, 0.36) 0deg);
        box-shadow: inset 0 0 24px rgba(25, 136, 255, 0.24), 0 0 18px rgba(41, 150, 255, 0.22);
      }
      .ring-gauge::before {
        content: "";
        position: absolute;
        inset: 10px;
        border: 1px solid rgba(82, 201, 255, 0.16);
        border-radius: 999px;
      }
      .ring-center { position: relative; text-align: center; }
      .ring-center b { display: block; color: #94d7ff; font-size: 27px; line-height: 1; }
      .ring-center span { color: #6b87a7; font-size: 10px; }

      .chart-box { height: 170px; }
      .forecast-chart-box { height: 255px; }
      .recharts-default-tooltip {
        background: rgba(3, 18, 40, 0.94) !important;
        border: 1px solid rgba(68, 202, 255, 0.35) !important;
        border-radius: 8px !important;
        box-shadow: 0 0 18px rgba(0, 189, 255, 0.18) !important;
      }

      .model-list { display: grid; gap: 9px; color: #9eb9d7; font-size: 13px; }
      .model-list .row { display: grid; grid-template-columns: 94px 1fr; gap: 10px; align-items: center; }
      .model-list .value { color: #a9d9ff; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .health-bar { height: 7px; border-radius: 999px; overflow: hidden; background: rgba(85, 124, 164, 0.32); }
      .health-bar i { display: block; width: 96%; height: 100%; background: linear-gradient(90deg, #177cff, #3ff0ff); box-shadow: 0 0 10px rgba(63, 240, 255, 0.9); }

      .hero {
        position: relative;
        height: 784px;
        min-width: 0;
        border: 1px solid rgba(44, 178, 255, 0.13);
        border-radius: 0 0 18px 18px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 44%, rgba(42, 170, 255, 0.22), transparent 26%),
          radial-gradient(circle at 52% 78%, rgba(0, 226, 255, 0.20), transparent 28%),
          radial-gradient(circle at 50% 50%, rgba(9, 33, 70, 0.40), rgba(1, 8, 20, 0.02) 60%);
      }
      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(54, 196, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(54, 196, 255, 0.05) 1px, transparent 1px);
        background-size: 38px 38px;
        mask-image: radial-gradient(circle, black 0 58%, transparent 80%);
      }
      .hero::after {
        content: "";
        position: absolute;
        left: 10%;
        right: 8%;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.98), transparent);
        box-shadow: 0 0 32px rgba(0, 217, 255, 0.9), 0 -28px 80px rgba(0, 196, 255, 0.20);
      }
      .hero-title {
        position: absolute;
        z-index: 4;
        left: 50%;
        top: 34px;
        transform: translateX(-50%);
        min-width: 390px;
        text-align: center;
      }
      .hero-title-main {
        display: inline-flex;
        align-items: center;
        gap: 16px;
        padding: 14px 28px;
        border: 1px solid rgba(48, 202, 255, 0.32);
        background: linear-gradient(90deg, rgba(3, 20, 44, 0.34), rgba(10, 49, 98, 0.55), rgba(3, 20, 44, 0.34));
        color: #d5f8ff;
        font-size: 23px;
        font-weight: 800;
        letter-spacing: .04em;
        text-shadow: 0 0 13px rgba(44, 209, 255, 0.8);
        clip-path: polygon(9% 0, 91% 0, 100% 50%, 91% 100%, 9% 100%, 0 50%);
      }
      .hero-title-main span { color: #15baff; }
      .hero-title-sub {
        margin-top: 8px;
        color: rgba(117, 220, 255, 0.78);
        font-size: 13px;
        letter-spacing: .24em;
      }

      .hero-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .hero-label {
        position: absolute;
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 12px 17px;
        color: #d6f7ff;
        font-size: 14px;
        border: 1px solid rgba(65, 212, 255, 0.28);
        border-radius: 999px;
        background: rgba(3, 22, 46, 0.60);
        box-shadow: 0 0 24px rgba(0, 173, 255, 0.12);
        backdrop-filter: blur(4px);
      }
      .hero-label small { display: block; color: #789cbd; margin-top: 3px; font-size: 11px; }
      .hero-label.left { left: 8%; top: 24%; }
      .hero-label.right { right: 9%; top: 63%; }
      .module-card {
        position: absolute;
        z-index: 5;
        left: 41%;
        top: 70%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 14px;
        width: 236px;
        padding: 15px 19px;
        border: 1px solid rgba(69, 224, 255, 0.62);
        color: #d9fbff;
        background: linear-gradient(135deg, rgba(0, 196, 255, 0.22), rgba(5, 36, 75, 0.78));
        box-shadow: 0 0 28px rgba(0, 223, 255, 0.28), inset 0 0 24px rgba(56, 232, 255, 0.15);
        clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);
      }
      .module-card .iconwrap {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        color: #55f6ff;
        background: rgba(19, 130, 255, 0.19);
        border-radius: 8px;
      }
      .module-card b { font-size: 24px; display: block; }
      .module-card span { color: #a4bfda; font-size: 13px; }
      .hero-glow-line {
        position: absolute;
        left: 18%;
        right: 18%;
        bottom: 4px;
        height: 120px;
        background: radial-gradient(ellipse at center, rgba(0, 217, 255, 0.32), transparent 58%);
        pointer-events: none;
      }

      .orbit-line { stroke-dasharray: 8 12; animation: orbitDash 10s linear infinite; }
      .rotor { transform-box: view-box; transform-origin: 391px 389px; animation: slowSpin 34s linear infinite; }
      .pulse { animation: pulse 2.6s ease-in-out infinite; }
      @keyframes orbitDash { to { stroke-dashoffset: -180; } }
      @keyframes slowSpin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: .35; } 50% { opacity: .85; } }

      .future-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .forecast-circle { display: grid; justify-items: center; gap: 8px; padding: 4px 0 0; }
      .forecast-circle .title { color: #8ba5c2; font-size: 14px; }
      .power-ring {
        --angle: 260deg;
        position: relative;
        width: 106px;
        height: 106px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background:
          radial-gradient(circle, #061426 0 58%, transparent 59% 100%),
          conic-gradient(var(--color, #159cff) var(--angle), rgba(44, 81, 152, 0.42) 0deg);
        box-shadow: inset 0 0 23px rgba(55, 218, 255, 0.16), 0 0 20px rgba(0, 166, 255, 0.17);
      }
      .power-ring b { color: #4ff2ff; font-size: 27px; line-height: 1; }
      .power-ring span { display: block; margin-top: 5px; color: #b5c9e0; font-size: 13px; }
      .change { color: var(--green); font-size: 15px; font-weight: 700; }
      .change.down { color: var(--red); }

      .accuracy-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
      .accuracy-item { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .accuracy-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 auto;
        display: grid;
        place-items: center;
        color: #9cecff;
        border: 1px solid rgba(74, 201, 255, 0.22);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(22, 141, 255, 0.30), rgba(18, 69, 129, 0.24));
        box-shadow: inset 0 0 16px rgba(83, 225, 255, 0.11);
      }
      .accuracy-value { color: #7edfff; font-size: 19px; font-weight: 800; line-height: 1; white-space: nowrap; }
      .accuracy-label { color: #8aa5c2; font-size: 12px; margin-top: 4px; }

      .unit-row { display: grid; grid-template-columns: 142px 1fr; gap: 20px; align-items: center; }
      .pie-wrap { position: relative; width: 132px; height: 132px; }
      .pie-center { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; pointer-events: none; }
      .pie-center b { display: block; color: #e1fbff; font-size: 30px; line-height: 1; }
      .pie-center span { color: #8ea9c7; font-size: 12px; }
      .unit-legend { display: grid; gap: 9px; color: #9cb4d2; font-size: 14px; }
      .legend-row { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; }
      .legend-dot { display: inline-block; width: 7px; height: 7px; margin-right: 10px; border-radius: 1px; background: var(--dot); box-shadow: 0 0 8px var(--dot); }

      .bottom-nav {
        position: absolute;
        z-index: 6;
        left: 18px;
        right: 18px;
        bottom: 16px;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 12px;
      }
      .nav-item {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        color: #7f9abc;
        border: 1px solid rgba(43, 157, 255, 0.20);
        background: linear-gradient(180deg, rgba(8, 34, 71, 0.70), rgba(2, 13, 32, 0.88));
        box-shadow: inset 0 0 22px rgba(42, 176, 255, 0.04);
        clip-path: polygon(7% 0, 93% 0, 100% 100%, 0 100%);
      }
      .nav-item.active {
        color: #e2fbff;
        border-color: rgba(43, 219, 255, 0.70);
        background: linear-gradient(180deg, rgba(0, 199, 255, 0.20), rgba(4, 35, 75, 0.85));
        box-shadow: 0 0 28px rgba(0, 213, 255, 0.26), inset 0 0 28px rgba(46, 216, 255, 0.13);
      }
      .nav-icon {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        color: currentColor;
        background: rgba(35, 91, 160, 0.32);
        box-shadow: inset 0 0 20px rgba(68, 210, 255, 0.08);
      }
      .nav-title { font-size: 18px; line-height: 1; font-weight: 800; letter-spacing: .04em; }
      .nav-sub { margin-top: 6px; color: #7188a7; font-size: 12px; }
      .nav-item.active .nav-sub { color: #9bcce5; }

      @media (max-width: 1500px) {
        .wf-screen { width: 1500px; min-width: 1500px; }
        .wf-root { min-height: 1050px; }
        .wf-layout { grid-template-columns: 382px 1fr 440px; }
        .wf-header { grid-template-columns: 1fr 520px 1fr; }
        .wf-header-title { font-size: 27px; }
      }
    `}</style>
  );
}

function Icon({ name, className = "wf-icon" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    weather: (
      <>
        <circle cx="8" cy="8" r="3" {...common} />
        <path d="M8 1.8v1.2M8 13v1.2M1.8 8h1.2M13 8h1.2M3.5 3.5l.9.9M11.6 11.6l.9.9M12.5 3.5l-.9.9M4.4 11.6l-.9.9" {...common} />
      </>
    ),
    wind: (
      <>
        <path d="M2 6h8.8a2 2 0 1 0-1.9-2.7" {...common} />
        <path d="M2 10h11a2.25 2.25 0 1 1-2.1 3" {...common} />
        <path d="M2 13h5.2" {...common} />
      </>
    ),
    monitor: (
      <>
        <rect x="2.4" y="3" width="11.2" height="7.4" rx="1.2" {...common} />
        <path d="M6.2 13h3.6M8 10.4V13" {...common} />
      </>
    ),
    trend: (
      <>
        <path d="M2.5 11.5 6 8l2.3 2.1 5-5" {...common} />
        <path d="M10.5 5.1h2.8v2.8" {...common} />
        <path d="M3 14h10" {...common} opacity=".55" />
      </>
    ),
    chart: (
      <>
        <path d="M2.5 13.5h11" {...common} />
        <path d="M4.2 11V7M8 11V3.2M11.8 11V5" {...common} />
      </>
    ),
    gauge: (
      <>
        <path d="M3 12a5 5 0 1 1 10 0" {...common} />
        <path d="M8 12l3-4" {...common} />
        <path d="M4.6 12h6.8" {...common} />
      </>
    ),
    alarm: (
      <>
        <path d="M8 14a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2Z" {...common} />
        <path d="M12 10.4V7a4 4 0 1 0-8 0v3.4L3 12h10z" {...common} />
      </>
    ),
    database: (
      <>
        <ellipse cx="8" cy="4" rx="4.4" ry="2" {...common} />
        <path d="M3.6 4v4c0 1.1 2 2 4.4 2s4.4-.9 4.4-2V4" {...common} />
        <path d="M3.6 8v4c0 1.1 2 2 4.4 2s4.4-.9 4.4-2V8" {...common} />
      </>
    ),
    report: (
      <>
        <path d="M4 2.5h5l3 3v8H4z" {...common} />
        <path d="M9 2.5v3h3M6 8h4M6 10.5h4M6 13h2" {...common} />
      </>
    ),
    location: (
      <>
        <path d="M8 14s4.2-3.8 4.2-7.1a4.2 4.2 0 1 0-8.4 0C3.8 10.2 8 14 8 14Z" {...common} />
        <circle cx="8" cy="6.9" r="1.4" {...common} />
      </>
    ),
    brain: (
      <>
        <path d="M5 12.4a2.6 2.6 0 0 1-.9-5A2.5 2.5 0 0 1 7.5 3a2.5 2.5 0 0 1 4 3.1 2.8 2.8 0 0 1-.5 6.3" {...common} />
        <path d="M8 4v9M5.5 8H8M8 10.4h3" {...common} />
      </>
    ),
    settings: (
      <>
        <circle cx="8" cy="8" r="2.1" {...common} />
        <path d="M8 1.7v2M8 12.3v2M1.7 8h2M12.3 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4" {...common} />
      </>
    ),
    user: (
      <>
        <circle cx="8" cy="5.2" r="2.4" {...common} />
        <path d="M3.6 14a4.4 4.4 0 0 1 8.8 0" {...common} />
      </>
    ),
    warning: (
      <>
        <path d="M8 2.4 14 13H2z" {...common} />
        <path d="M8 5.8v3.4M8 11.4h.01" {...common} />
      </>
    ),
    shield: (
      <>
        <path d="M8 1.8 13 4v3.6c0 3.2-2 5.3-5 6.6-3-1.3-5-3.4-5-6.6V4z" {...common} />
        <path d="m5.8 8 1.4 1.4 3-3" {...common} />
      </>
    ),
    search: (
      <>
        <circle cx="7" cy="7" r="4" {...common} />
        <path d="m10.2 10.2 3.1 3.1" {...common} />
      </>
    ),
    zap: <path d="M9.4 1.8 3.7 8.6h4.2l-1.4 5.6 5.8-7H8z" {...common} />,
  };

  return <svg viewBox="0 0 16 16" className={className} aria-hidden="true">{paths[name] || paths.chart}</svg>;
}

function Panel({ title, icon, right, children, className = "" }) {
  return (
    <section className={`wf-panel ${className}`}>
      <div className="wf-panel-head">
        <div className="wf-panel-title">
          <span className="wf-icon-badge"><Icon name={icon} /></span>
          {title}
        </div>
        {right && <div className="wf-panel-right">{right}</div>}
      </div>
      <div className="wf-panel-body">{children}</div>
    </section>
  );
}

function Header() {
  return (
    <header className="wf-header">
      <div className="wf-header-left">
        <span><Icon name="location" /> 风场：东海风场A区</span>
        <span><Icon name="brain" /> 模型：XGBoost v2.4</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><i className="wf-status-dot" />状态：<b style={{ color: "var(--green)" }}>运行中</b></span>
      </div>
      <div className="wf-header-title">风电功率预测平台</div>
      <div className="wf-header-right">
        <span>2024-05-18&nbsp;&nbsp;14:35:27</span>
        <span>星期六</span>
        <span>⛅ 18°C</span>
        <span><Icon name="user" /> admin⌄</span>
      </div>
    </header>
  );
}

function WeatherPanel() {
  return (
    <Panel title="实时气象" icon="weather" right="测风塔 80m">
      <div className="weather-grid">
        {weatherCards.map((item) => (
          <div className="weather-card" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
            <div className="unit">{item.unit}</div>
          </div>
        ))}
      </div>
      <div className="warning-box">
        <div className="warning-title"><Icon name="warning" /> 极端天气预警 <span style={{ marginLeft: "auto" }}>›</span></div>
        <div className="warning-main">
          <div className="windmark"><Icon name="wind" className="wf-icon" /></div>
          <div>
            <strong>强风预警</strong>
            <span>未来6小时阵风强度较高，风险等级：<b style={{ color: "#ff8e45" }}>较高</b></span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function WindFarmPanel() {
  return (
    <Panel title="风场概况" icon="gauge" right="今日⌄">
      <div className="overview-row">
        <div className="overview-kpis">
          <div><div className="kpi-title">装机容量</div><div className="kpi-value">300 <small>MW</small></div></div>
          <div><div className="kpi-title">运行机组</div><div className="kpi-value">48 <small>台</small></div></div>
          <div><div className="kpi-title">平均风速</div><div className="kpi-value">7.8 <small>m/s</small></div></div>
          <div><div className="kpi-title">当前功率</div><div className="kpi-value">145.2 <small>MW</small></div></div>
        </div>
        <div className="ring-gauge" style={{ "--angle": "174.24deg" }}>
          <div className="ring-center"><b>48.4%</b><span>当前负荷率</span></div>
        </div>
      </div>
    </Panel>
  );
}

function HistoryPanel() {
  return (
    <Panel title="历史功率" icon="chart" right="24小时　　7天　　30天">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="rgba(117, 203, 255, 0.14)" strokeDasharray="3 4" />
            <XAxis dataKey="time" tick={{ fill: "#7e98b6", fontSize: 12 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fill: "#7e98b6", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 300]} ticks={[0, 75, 150, 225, 300]} />
            <Tooltip />
            <ReferenceLine x="14:00" stroke="#1a78ff" strokeDasharray="4 4" label={{ value: "当前", fill: "#7ecfff", fontSize: 11, position: "top" }} />
            <Line type="monotone" dataKey="actual" name="实际功率" stroke="#2388ff" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="theory" name="理论功率" stroke="#27d5c2" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function ModelPanel() {
  return (
    <Panel title="模型状态" icon="shield">
      <div className="model-list">
        <div className="row"><span>模型名称</span><span className="value">XGBoost 风电功率预测模型</span></div>
        <div className="row"><span>更新时间</span><span className="value">2024-05-18 14:30</span></div>
        <div className="row"><span>数据输入</span><span className="value">气象(5) + 历史功率 + 机组状态</span></div>
        <div className="row"><span>训练周期</span><span className="value">每日 02:00 自动训练</span></div>
        <div className="row"><span>模型健康度</span><div style={{ display: "grid", gridTemplateColumns: "1fr 42px", gap: 8, alignItems: "center" }}><div className="health-bar"><i /></div><span style={{ color: "#4cf2ff", textAlign: "right" }}>96%</span></div></div>
        <div className="row"><span>数据质量</span><span className="value" style={{ color: "var(--green)" }}>优秀</span></div>
      </div>
    </Panel>
  );
}

function TurbineScene() {
  return (
    <section className="hero">
      <div className="hero-title">
        <div className="hero-title-main"><span>当前模块</span> 功率预测 ›</div>
        <div className="hero-title-sub">»»» 旋转鼠标切换模块 «««</div>
      </div>

      <div className="hero-label left"><Icon name="monitor" /><div>实时监控<small>数据刷新中</small></div></div>
      <div className="hero-label right"><Icon name="alarm" /><div>告警诊断<small>异常追踪中</small></div></div>

      <svg className="hero-svg" viewBox="0 0 900 780" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#c8fbff" stopOpacity="0.98" />
            <stop offset="0.42" stopColor="#35dcff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#0a7fff" stopOpacity="0.04" />
          </radialGradient>
          <linearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9fcff" stopOpacity="0.60" />
            <stop offset="0.34" stopColor="#43d8ff" stopOpacity="0.30" />
            <stop offset="1" stopColor="#106dff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="nacelleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8f6ff" stopOpacity="0.26" />
            <stop offset="0.55" stopColor="#2caeff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#06142a" stopOpacity="0.04" />
          </linearGradient>
          <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.82 0 0 0 0 1 0 0 0 .9 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="wire" width="22" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9H22M11 0V18" stroke="rgba(116,225,255,.22)" strokeWidth="0.75" />
          </pattern>
        </defs>

        <g opacity="0.84">
          <ellipse cx="438" cy="442" rx="330" ry="158" fill="none" stroke="rgba(79,211,255,.16)" />
          <ellipse cx="438" cy="442" rx="400" ry="190" fill="none" stroke="rgba(79,211,255,.10)" />
          <ellipse className="orbit-line" cx="438" cy="442" rx="280" ry="132" fill="none" stroke="rgba(62,220,255,.36)" strokeWidth="1.4" />
          <path d="M143 426c70-92 199-144 330-145" fill="none" stroke="#2ee5ff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <path d="M177 401l-22 4 12 18" fill="none" stroke="#2ee5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
          <path d="M738 505c-62 84-167 137-292 148" fill="none" stroke="#2ee5ff" strokeWidth="3" strokeLinecap="round" opacity=".74" />
          <path d="M720 487l22 1-7 20" fill="none" stroke="#2ee5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".74" />
        </g>

        <g filter="url(#cyanGlow)">
          <path d="M458 484 C482 570, 505 655, 535 778 L394 778 C411 651, 424 566, 438 484 Z" fill="rgba(24,142,255,.14)" stroke="rgba(108,231,255,.38)" strokeWidth="1.3" />
          <path d="M444 495 C456 587, 465 676, 478 776" stroke="rgba(152,242,255,.24)" strokeWidth="1.1" />
          <path d="M466 499 C489 595, 515 688, 548 776" stroke="rgba(152,242,255,.16)" strokeWidth="1.1" />
          <path d="M411 614H515M402 683H534" stroke="rgba(152,242,255,.16)" strokeWidth="1" />
        </g>

        <g transform="translate(373 365) rotate(-2)" filter="url(#cyanGlow)">
          <path d="M70 56 C120 6 300 11 430 28 C464 32 489 57 486 88 C483 116 455 133 416 133 L76 133 C40 133 17 111 17 94 C16 78 36 66 70 56Z" fill="url(#nacelleGrad)" stroke="rgba(158,236,255,.54)" strokeWidth="1.4" />
          <path d="M40 81 C134 41 324 40 470 78" fill="none" stroke="rgba(125,234,255,.30)" strokeWidth="1.1" />
          <path d="M51 119 C140 94 325 94 467 119" fill="none" stroke="rgba(125,234,255,.22)" strokeWidth="1.1" />
          <path d="M61 67 h394 v54 H61z" fill="url(#wire)" opacity=".72" />
          <ellipse cx="93" cy="91" rx="62" ry="48" fill="rgba(16,94,179,.11)" stroke="rgba(176,243,255,.42)" />
          <circle cx="102" cy="90" r="33" fill="none" stroke="rgba(158,236,255,.30)" />
          <path d="M170 61v63M210 53v72M250 49v75M291 48v76M333 52v72M376 59v61M418 68v46" stroke="rgba(159,238,255,.22)" />
          <path d="M158 89h275" stroke="rgba(159,238,255,.26)" />
          <rect x="217" y="68" width="75" height="42" rx="8" fill="rgba(62,202,255,.10)" stroke="rgba(150,238,255,.26)" />
          <rect x="319" y="65" width="95" height="50" rx="7" fill="rgba(62,202,255,.08)" stroke="rgba(150,238,255,.22)" />
        </g>

        <g className="rotor" filter="url(#cyanGlow)">
          <path d="M378 367 C330 320 261 268 132 208 C104 195 93 201 119 227 C222 323 306 375 363 397 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.50)" strokeWidth="1.2" />
          <path d="M374 398 C326 491 302 574 292 750 C290 789 306 798 323 762 C378 644 399 517 398 408 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.48)" strokeWidth="1.2" />
          <path d="M407 371 C501 324 611 304 745 315 C787 318 792 335 751 347 C619 385 509 403 415 402 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.42)" strokeWidth="1.2" />
        </g>

        <g filter="url(#cyanGlow)">
          <circle cx="391" cy="389" r="67" fill="rgba(20,137,255,.12)" stroke="rgba(205,251,255,.62)" strokeWidth="1.4" />
          <circle cx="391" cy="389" r="43" fill="rgba(9,61,119,.28)" stroke="rgba(121,233,255,.44)" />
          <circle cx="391" cy="389" r="18" fill="url(#hubGlow)" />
          <path d="M326 389h130M391 325v130" stroke="rgba(188,246,255,.16)" strokeWidth="1" />
          <circle className="pulse" cx="391" cy="389" r="86" fill="none" stroke="rgba(50,224,255,.35)" strokeWidth="1" />
        </g>

        <g opacity=".72">
          <path d="M654 196v148M630 230v120M684 229v119" stroke="rgba(129,224,255,.34)" strokeWidth="2" />
          <path d="M642 220h26M622 250h78M622 281h78" stroke="rgba(129,224,255,.20)" />
          <circle cx="654" cy="191" r="4" fill="#49e6ff" />
          <path d="M750 205v141M729 234v111M772 234v111" stroke="rgba(129,224,255,.30)" strokeWidth="2" />
          <path d="M733 260h56M733 289h56" stroke="rgba(129,224,255,.16)" />
        </g>
      </svg>

      <div className="module-card">
        <div className="iconwrap"><Icon name="trend" /></div>
        <div><b>功率预测</b><span>当前模块</span></div>
      </div>
      <div className="hero-glow-line" />
    </section>
  );
}

function ForecastCurvePanel() {
  return (
    <Panel title="短期预测曲线" icon="chart" right="15分钟分辨率⌄">
      <div className="forecast-chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 10, right: 14, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#39dfff" stopOpacity="0.32" />
                <stop offset="1" stopColor="#167dff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(117, 203, 255, 0.14)" strokeDasharray="3 4" />
            <XAxis dataKey="time" tick={{ fill: "#7e98b6", fontSize: 12 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fill: "#7e98b6", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 300]} ticks={[0, 75, 150, 225, 300]} />
            <Tooltip />
            <Area type="monotone" dataKey="low" stackId="conf" stroke="none" fill="transparent" dot={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="range" name="置信区间(80%)" stackId="conf" stroke="none" fill="url(#band)" dot={false} isAnimationActive={false} />
            <ReferenceLine x="06:00" stroke="#128cff" strokeDasharray="4 4" label={{ value: "预测时段", fill: "#8bdcff", fontSize: 12, position: "top" }} />
            <ReferenceLine x="08:00" stroke="rgba(31, 198, 255, .5)" strokeDasharray="3 6" label={{ value: "15min", fill: "#9dc8df", fontSize: 11, position: "top" }} />
            <ReferenceLine x="10:00" stroke="rgba(31, 198, 255, .5)" strokeDasharray="3 6" label={{ value: "30min", fill: "#9dc8df", fontSize: 11, position: "top" }} />
            <ReferenceLine x="14:00+" stroke="rgba(31, 198, 255, .5)" strokeDasharray="3 6" label={{ value: "45min", fill: "#9dc8df", fontSize: 11, position: "top" }} />
            <Line type="monotone" dataKey="p" name="预测功率" stroke="#2388ff" strokeWidth={3} dot={{ r: 3, fill: "#2388ff", stroke: "#9bdcff" }} />
            <Line type="monotone" dataKey="a" name="实际功率" stroke="#21d6c5" strokeWidth={2.4} strokeDasharray="5 4" dot={false} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function FuturePowerPanel() {
  const items = [
    { title: "15分钟预测", value: "152.3", change: "3.2%", angle: "280deg", color: "#1f91ff" },
    { title: "30分钟预测", value: "149.8", change: "1.6%", angle: "242deg", color: "#2bd9c7" },
    { title: "45分钟预测", value: "147.1", change: "-0.5%", angle: "222deg", color: "#2bd9c7", down: true },
  ];

  return (
    <Panel title="未来发电量（多时段）" icon="zap">
      <div className="future-grid">
        {items.map((item) => (
          <div className="forecast-circle" key={item.title}>
            <div className="title">{item.title}</div>
            <div className="power-ring" style={{ "--angle": item.angle, "--color": item.color }}>
              <div style={{ textAlign: "center" }}><b>{item.value}</b><span>MW</span></div>
            </div>
            <div className={`change ${item.down ? "down" : ""}`}>{item.down ? "↓" : "↑"} {item.change}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AccuracyPanel() {
  return (
    <Panel title="预测精度（近7天）" icon="shield">
      <div className="accuracy-grid">
        {accuracyItems.map((item) => (
          <div className="accuracy-item" key={item.label}>
            <div className="accuracy-icon"><Icon name={item.icon} /></div>
            <div>
              <div className="accuracy-value">{item.value}</div>
              <div className="accuracy-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function UnitStatusPanel() {
  const total = unitStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Panel title="机组状态" icon="monitor">
      <div className="unit-row">
        <div className="pie-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={unitStatusData} innerRadius={45} outerRadius={62} paddingAngle={2} dataKey="value" stroke="rgba(2, 8, 20, .78)" strokeWidth={2}>
                {unitStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-center"><div><b>{total}</b><span>总机组</span></div></div>
        </div>
        <div className="unit-legend">
          {unitStatusData.map((item) => (
            <div className="legend-row" key={item.name}>
              <span><i className="legend-dot" style={{ "--dot": item.color }} />{item.name}</span>
              <span>{item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <div className={`nav-item ${item.active ? "active" : ""}`} key={item.title}>
          <div className="nav-icon"><Icon name={item.icon} /></div>
          <div>
            <div className="nav-title">{item.title}</div>
            <div className="nav-sub">{item.sub}</div>
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function WindPowerForecastingDashboard() {
  return (
    <div className="wf-root">
      <DashboardStyles />
      <div className="wf-screen">
        <Header />
        <main className="wf-layout">
          <aside className="wf-left">
            <WeatherPanel />
            <WindFarmPanel />
            <HistoryPanel />
            <ModelPanel />
          </aside>
          <div className="wf-center">
            <TurbineScene />
          </div>
          <aside className="wf-right">
            <ForecastCurvePanel />
            <FuturePowerPanel />
            <AccuracyPanel />
            <UnitStatusPanel />
          </aside>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
