import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";

/**
 * Wind Power Forecasting Dashboard - High Information Density Version
 *
 * 【高信息密度排版优化】：
 * 1. 面板内容紧凑化：缩小间距，引入 Dense Table（密集数据表）样式。
 * 2. 复合数据展示：图表结合微型排行榜、状态条、趋势指标（图数结合）。
 * 3. 密集场站排版：将纵向堆叠的列表改为 2/3 列自适应布局，极大提升空间利用率。
 * 4. 氛围信息填充：中央 HUD 增加经纬度、系统环境参数等极客数据条，增强精密感。
 */

// ==================== 核心与 Mock 数据区 ====================
const weatherCards = [
  { label: "风速(10m)", value: "8.6", unit: "m/s", trend: "+0.2" },
  { label: "风速(80m)", value: "10.2", unit: "m/s", trend: "+0.5" },
  { label: "风向", value: "236°", unit: "西南", trend: "SW" },
  { label: "气温", value: "18.2", unit: "°C", trend: "-1.2" },
  { label: "气压", value: "1012.3", unit: "hPa", trend: "-0.5" },
  { label: "湿度", value: "68%", unit: "RH", trend: "+2.0" },
];

const historyData = [
  { time: "00:00", actual: 52, theory: 60 }, { time: "02:00", actual: 66, theory: 74 },
  { time: "04:00", actual: 94, theory: 108 }, { time: "06:00", actual: 78, theory: 86 },
  { time: "08:00", actual: 122, theory: 160 }, { time: "10:00", actual: 157, theory: 215 },
  { time: "12:00", actual: 137, theory: 176 }, { time: "14:00", actual: 122, theory: 137 },
  { time: "16:00", actual: 171, theory: 190 }, { time: "18:00", actual: 206, theory: 222 },
  { time: "20:00", actual: 236, theory: 258 }, { time: "22:00", actual: 218, theory: 244 },
  { time: "24:00", actual: 205, theory: 246 },
];

const forecastData = [
  { time: "14:00", p: 42, a: 37, low: 26, high: 56 }, { time: "15:00", p: 55, a: 52, low: 40, high: 70 },
  { time: "16:00", p: 68, a: 64, low: 50, high: 84 }, { time: "17:00", p: 120, a: 115, low: 95, high: 145 },
  { time: "18:00", p: 174, a: 168, low: 145, high: 199 }, { time: "19:00", p: 190, a: 185, low: 165, high: 215 },
  { time: "20:00", p: 205, a: 198, low: 178, high: 225 }, { time: "21:00", p: 210, a: 205, low: 185, high: 235 },
  { time: "22:00", p: 202, a: 194, low: 176, high: 226 }, { time: "23:00", p: 195, a: 190, low: 170, high: 220 },
  { time: "00:00", p: 190, a: 185, low: 164, high: 214 }, { time: "01:00", p: 187, a: 180, low: 160, high: 215 },
  { time: "02:00", p: 184, a: 176, low: 154, high: 210 }, { time: "03:00", p: 180, a: 172, low: 150, high: 208 },
  { time: "04:00", p: 177, a: 169, low: 144, high: 207 }, { time: "05:00", p: 172, a: 165, low: 138, high: 203 },
  { time: "06:00", p: 166, a: null, low: 130, high: 198 }, { time: "07:00", p: 155, a: null, low: 118, high: 190 },
  { time: "08:00", p: 145, a: null, low: 104, high: 183 }, { time: "09:00", p: 132, a: null, low: 90, high: 175 },
  { time: "10:00", p: 121, a: null, low: 78, high: 164 }, { time: "11:00", p: 108, a: null, low: 65, high: 150 },
  { time: "12:00", p: 94, a: null, low: 54, high: 137 }, { time: "13:00", p: 85, a: null, low: 45, high: 125 },
  { time: "14:00+", p: 73, a: null, low: 38, high: 118 },
].map((item) => ({ ...item, range: Math.max(item.high - item.low, 0) }));

const unitStatusData = [
  { name: "正常运行", value: 42, color: "#42e4a9" }, { name: "限功率", value: 3, color: "#3488ff" },
  { name: "维护停机", value: 2, color: "#f2c84b" }, { name: "故障异常", value: 1, color: "#ff4f61" },
];

const accuracyItems = [
  { label: "综合准确率", value: "92.5%", icon: "gauge", trend: "up" },
  { label: "平均绝对误差(MAE)", value: "15.2MW", icon: "settings", trend: "down" },
  { label: "均方根误差(RMSE)", value: "12.4", icon: "search", trend: "down" },
  { label: "决定系数(R²)", value: "0.96", icon: "shield", trend: "up" },
];

const mockDataQuality = [
  { name: "SCADA秒级", value: 99.8, color: "#39efb4" }, { name: "测风塔气象", value: 96.4, color: "#23d6ff" },
  { name: "NWP 气象源", value: 98.5, color: "#1f7dff" }, { name: "AGC 调度指令", value: 99.9, color: "#ff8d3a" }
];

const mockVoltData = [{ time: "14:00", v: 690 }, { time: "14:05", v: 692 }, { time: "14:10", v: 688 }, { time: "14:15", v: 695 }, { time: "14:20", v: 691 }, { time: "14:25", v: 689 }];
const mockTempData = [{ time: "00:00", temp: 16 }, { time: "04:00", temp: 15 }, { time: "08:00", temp: 18 }, { time: "12:00", temp: 22 }, { time: "16:00", temp: 24 }, { time: "20:00", temp: 19 }];
const mockIngest = [{ t: "14:30", mb: 45 }, { t: "14:31", mb: 48 }, { t: "14:32", mb: 42 }, { t: "14:33", mb: 85 }, { t: "14:34", mb: 44 }, { t: "14:35", mb: 46 }];
const mockWindRose = [{ name: "N", value: 10 }, { name: "NE", value: 15 }, { name: "E", value: 25 }, { name: "SE", value: 30 }, { name: "S", value: 50 }, { name: "SW", value: 80 }, { name: "W", value: 40 }, { name: "NW", value: 20 }];
const mockGenPie = [{ name: "一期风机", value: 450 }, { name: "二期风机", value: 320 }, { name: "三期风机", value: 210 }];

const mockTurbines = Array.from({length: 12}, (_, i) => {
  const pwr = (Math.random() * 2 + 0.5).toFixed(2);
  const rpm = (Math.random() * 10 + 8).toFixed(1);
  return {
    id: `F-${String(i+1).padStart(2, '0')}`,
    status: i === 3 ? "停机" : i === 7 ? "限功" : "运行",
    color: i === 3 ? "#f2c84b" : i === 7 ? "#3488ff" : "#42e4a9",
    power: i === 3 ? "0.00" : pwr,
    rpm: i === 3 ? "0.0" : rpm
  };
});

const mockHealth = [
  { name: "主轴轴承", val: 82, color: "#ff8d3a" }, { name: "齿轮箱", val: 95, color: "#39efb4" },
  { name: "发电机", val: 88, color: "#23d6ff" }, { name: "偏航系统", val: 76, color: "#ff5369" },
  { name: "变桨控制", val: 91, color: "#39efb4" }, { name: "变流器", val: 85, color: "#1f7dff" }
];

const mockNodes = [
  { name: "Kafka 消息总线", status: "运行中", delay: "12ms", load: "45%" }, 
  { name: "Flink 流计算", status: "运行中", delay: "45ms", load: "78%" },
  { name: "Influx 时序库", status: "运行中", delay: "8ms", load: "32%" }, 
  { name: "MySQL 元数据", status: "运行中", delay: "5ms", load: "15%" },
  { name: "Redis 缓存层", status: "运行中", delay: "2ms", load: "62%" }
];

const navItems = [
  { id: "monitor", icon: "monitor", title: "实时监控", sub: "全场资产运行态势" },
  { id: "trend", icon: "trend", title: "功率预测", sub: "AI 多周期出力研判" },
  { id: "weather", icon: "weather", title: "气象分析", sub: "微观选址与风资源" },
  { id: "database", icon: "database", title: "数据管理", sub: "底层链路与质量控" },
];

const DESIGN_WIDTH = 1662;
const DESIGN_HEIGHT = 918;

function useDashboardScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const updateScale = () => {
      const nextScale = Math.min((window.innerWidth - 16) / DESIGN_WIDTH, (window.innerHeight - 16) / DESIGN_HEIGHT, 1);
      setScale(Number(Math.max(nextScale, 0.2).toFixed(4)));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);
  return scale;
}

function DashboardStyles() {
  return (
    <style>{`
      :root {
        --bg0: #020812; --bg1: #06162b; --panel: rgba(5, 24, 50, 0.76);
        --line: rgba(32, 170, 255, 0.33); --cyan: #23d6ff; --cyan2: #55f6ff;
        --blue: #1f7dff; --text: #d8f4ff; --green: #39efb4; --orange: #ff8d3a; --red: #ff5369;
        --sci-blue: #3182bd; --sci-red: #ff4d4f; --sci-gray: #cccccc;
      }
      * { box-sizing: border-box; }
      html, body, #root { overflow: hidden; }
      .wf-root {
        height: 100vh; width: 100%; overflow: hidden;
        background: radial-gradient(circle at 50% 30%, rgba(13, 101, 180, 0.24), transparent 30%),
                    radial-gradient(circle at 50% 92%, rgba(0, 221, 255, 0.19), transparent 32%),
                    linear-gradient(180deg, #000712 0%, #020a17 55%, #020612 100%);
        color: var(--text); font-family: Inter, "Microsoft YaHei", "PingFang SC", monospace, sans-serif;
        padding: 8px; display: grid; place-items: center;
      }
      .wf-stage { position: relative; width: var(--dashboard-width); height: var(--dashboard-height); }
      .wf-screen {
        position: relative; width: 1662px; height: 918px; transform: scale(var(--dashboard-scale));
        transform-origin: left top; margin: 0 auto; border: 1px solid rgba(46, 183, 255, 0.32);
        background: radial-gradient(circle at 50% 54%, rgba(14, 165, 233, 0.20), transparent 28%),
                    linear-gradient(180deg, rgba(6, 22, 43, 0.98), rgba(1, 8, 20, 0.99));
        box-shadow: 0 0 72px rgba(0, 153, 255, 0.20), inset 0 0 70px rgba(0, 148, 255, 0.09); overflow: hidden;
      }
      .wf-screen::before {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background-image: linear-gradient(rgba(69, 204, 255, 0.045) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(69, 204, 255, 0.045) 1px, transparent 1px),
                          radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.14) 58%, rgba(0, 0, 0, 0.52) 100%);
        background-size: 44px 44px, 44px 44px, 100% 100%;
      }
      .wf-screen::after {
        content: ""; position: absolute; left: 0; right: 0; bottom: 78px; height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 213, 255, 0.95), transparent);
        box-shadow: 0 0 26px rgba(0, 213, 255, 0.65); pointer-events: none;
      }
      .wf-header {
        position: relative; z-index: 5; height: 62px; display: grid; grid-template-columns: 450px 1fr 450px;
        align-items: center; padding: 0 16px; border-bottom: 1px solid rgba(55, 180, 255, 0.24);
        background: linear-gradient(180deg, rgba(5, 19, 43, 0.95), rgba(3, 14, 30, 0.64));
      }
      .wf-header-title {
        position: relative; height: 62px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: linear-gradient(135deg, transparent 0 10%, rgba(0, 136, 255, 0.12) 15% 85%, transparent 90% 100%),
                    linear-gradient(180deg, rgba(21, 68, 125, 0.15), rgba(4, 20, 42, 0.25));
      }
      .wf-header-title-main {
        font-family: "Kaiti", "STKaiti", "SimKai", "cursive", serif;
        font-size: 36px; font-weight: 900; letter-spacing: 0.18em;
        color: #f6d365;
        background: linear-gradient(180deg, #fff3b0 0%, #e0ac1c 45%, #b8860b 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 8px rgba(224, 172, 28, 0.5));
        line-height: 1.1; margin-top: -2px;
      }
      .wf-header-title-sub {
        font-size: 12px; color: #94d7ff; font-weight: 500;
        letter-spacing: 0.4em; margin-top: 1px; text-transform: uppercase;
        opacity: 0.85;
      }
      .wf-header-title::before, .wf-header-title::after { content: ""; position: absolute; bottom: 0; height: 1px; width: 46%; background: linear-gradient(90deg, transparent, rgba(69, 207, 255, 0.9)); box-shadow: 0 0 12px rgba(69, 207, 255, 0.85); }
      .wf-header-title::before { left: 0; } .wf-header-title::after { right: 0; transform: scaleX(-1); }
      .wf-header-left, .wf-header-right { display: flex; align-items: center; gap: 16px; color: #adc8e4; font-size: 13px; white-space: nowrap; overflow: hidden; }
      .wf-header-right { justify-content: flex-end; }
      .wf-header-left span, .wf-header-right span { display: inline-flex; align-items: center; gap: 6px; }
      .wf-status-dot { width: 9px; height: 9px; border-radius: 999px; background: var(--green); box-shadow: 0 0 14px rgba(57, 239, 180, 0.95); }

      /* 【布局紧凑化】增加列宽以容纳更多表格数据，减小间距 */
      .wf-layout {
        position: relative; z-index: 3; display: grid; grid-template-columns: 410px minmax(0, 1fr) 440px; gap: 10px;
        height: calc(100% - 62px); padding: 6px 10px 80px;
        transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .wf-layout.switching { opacity: 0.6; transform: scale(0.995); }
      .wf-left, .wf-right { display: flex; flex-direction: column; gap: 8px; min-height: 0; }
      .wf-center { min-width: 0; position: relative; }

      .wf-panel { position: relative; display: flex; flex-direction: column; height: 100%; min-height: 0; }
      .wf-panel-bg {
        position: absolute; inset: 0; border: 1px solid var(--line);
        background: linear-gradient(145deg, rgba(5, 37, 76, 0.90), rgba(2, 14, 33, 0.95));
        box-shadow: inset 0 0 28px rgba(40, 183, 255, 0.06);
        clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%); z-index: 0; pointer-events: none;
      }
      .wf-panel-bg::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(69, 207, 255, 0.12), transparent 33%); }
      .wf-panel-bg::after { content: ""; position: absolute; left: 0; top: 0; height: 2px; width: 42%; background: linear-gradient(90deg, rgba(0, 222, 255, 0.95), transparent); box-shadow: 0 0 12px rgba(0, 222, 255, 0.8); }
      .wf-panel-head { position: relative; z-index: 1; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 10px 0 12px; border-bottom: 1px solid rgba(65, 192, 255, 0.17); background: linear-gradient(90deg, rgba(27, 119, 255, 0.18), transparent 70%); }
      .wf-panel-title { display: flex; align-items: center; gap: 6px; color: #d7f5ff; font-size: 16px; font-weight: 700; letter-spacing: .04em; }
      .wf-panel-right { color: #7893b0; font-size: 12px; display: flex; gap: 8px; align-items: center; }
      .wf-panel-body { position: relative; z-index: 1; padding: 8px 10px; flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 6px; }
      .wf-panel-body::-webkit-scrollbar { width: 3px; }
      .wf-panel-body::-webkit-scrollbar-thumb { background: rgba(35, 214, 255, 0.2); border-radius: 3px; }

      .wf-icon-badge { display: inline-grid; place-items: center; width: 16px; height: 16px; border-radius: 4px; background: rgba(28, 123, 255, 0.22); color: var(--cyan2); box-shadow: inset 0 0 12px rgba(69, 207, 255, 0.18); }
      .wf-icon { width: 14px; height: 14px; display: block; color: currentColor; }

      /* 【密集排版体系】 Dense Grid & Table */
      .dense-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
      .dense-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 8px; }
      
      .mini-card { padding: 5px 8px; border: 1px solid rgba(42, 161, 255, 0.15); border-radius: 4px; background: linear-gradient(180deg, rgba(12, 54, 98, 0.40), rgba(3, 22, 48, 0.60)); display: flex; flex-direction: column; justify-content: center; min-height: 48px; }
      .mini-card-head { display: flex; justify-content: space-between; color: #8aa5c2; font-size: 12px; margin-bottom: 2px; white-space: nowrap; }
      .mini-card-body { display: flex; align-items: baseline; gap: 4px; overflow: hidden; }
      .mini-card-body b { color: #20e4d1; font-size: 18px; line-height: 1; }
      .mini-card-body span { color: #c0d6ec; font-size: 12px; }
      .trend-up { color: var(--red); font-size: 12px; }
      .trend-down { color: var(--green); font-size: 12px; }

      .dense-table { display: flex; flex-direction: column; font-size: 13px; color: #a9d9ff; height: 100%; }
      .dense-table-header { display: grid; padding: 4px 8px; color: #7e98b6; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 4px; margin-bottom: 4px; }
      .dense-table-row { display: grid; padding: 6px 8px; border-bottom: 1px dashed rgba(255,255,255,0.06); align-items: center; transition: background 0.2s; }
      .dense-table-row:hover { background: rgba(35, 214, 255, 0.08); }

      /* Key-Value Pair Grid */
      .kv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 10px; font-size: 12px; color: #9eb9d7; }
      .kv-item { display: flex; justify-content: space-between; padding-bottom: 2px; border-bottom: 1px solid rgba(255,255,255,0.03); }
      .kv-val { color: #d8f4ff; font-family: monospace; font-size: 14px; text-align: right; }

      .chart-box { flex: 1; min-height: 0; width: 100%; }
      .recharts-default-tooltip { background: rgba(3, 18, 40, 0.94) !important; border: 1px solid rgba(68, 202, 255, 0.35) !important; border-radius: 8px !important; padding: 6px 10px !important; font-size: 12px; }

      /* Hero Section (Center 3D Turbine + Tech HUD) */
      .hero { position: relative; height: 100%; border: 1px solid rgba(44, 178, 255, 0.13); border-radius: 0 0 18px 18px; overflow: hidden; background: radial-gradient(circle at 50% 50%, rgba(9, 33, 70, 0.40), rgba(1, 8, 20, 0.02) 60%); }
      .hero-title { position: absolute; z-index: 15; left: 50%; top: 20px; transform: translateX(-50%); text-align: center; }
      .hero-title-main { display: inline-flex; align-items: center; gap: 14px; padding: 10px 24px; border: 1px solid rgba(48, 202, 255, 0.45); background: linear-gradient(90deg, rgba(3, 20, 44, 0.4), rgba(10, 49, 98, 0.7), rgba(3, 20, 44, 0.4)); color: #d5f8ff; font-size: 22px; font-weight: 800; letter-spacing: .06em; clip-path: polygon(9% 0, 91% 0, 100% 50%, 91% 100%, 9% 100%, 0 50%); box-shadow: 0 0 30px rgba(21, 186, 255, 0.2); }
      .hero-title-main span { color: #15baff; font-size: 15px; margin-right: 4px; }

      /* 【新增】HUD 边角料信息，增加极客精密感 */
      .tech-hud-corner { position: absolute; z-index: 10; font-family: monospace; font-size: 12px; color: rgba(65, 212, 255, 0.6); line-height: 1.5; display: flex; flex-direction: column; gap: 4px; }
      .tech-hud-corner.tl { top: 16px; left: 16px; border-left: 2px solid rgba(65, 212, 255, 0.5); padding-left: 8px; }
      .tech-hud-corner.tr { top: 16px; right: 16px; text-align: right; border-right: 2px solid rgba(65, 212, 255, 0.5); padding-right: 8px; }
      .tech-hud-corner.bl { bottom: 30px; left: 16px; }
      .tech-hud-corner.br { bottom: 30px; right: 16px; text-align: right; }
      .tech-hud-val { color: rgba(214, 247, 255, 0.9); font-weight: 600; }

      .orbit-label { display: flex; align-items: center; justify-content: center; gap: 8px; color: #789cbd; font-size: 14px; border: 1px solid rgba(65, 212, 255, 0.15); border-radius: 8px; background: rgba(3, 22, 46, 0.85); cursor: pointer; transition: all 0.4s ease; width: 100%; height: 100%; }
      .orbit-label.active { color: #d6f7ff; border-color: rgba(65, 212, 255, 0.8); background: linear-gradient(180deg, rgba(16, 68, 138, 0.95), rgba(6, 32, 66, 1)); transform: scale(1.15); box-shadow: 0 0 24px rgba(0, 173, 255, 0.3); font-weight: 600; }
      .orbit-label .iconwrap { width: 26px; height: 26px; display: grid; place-items: center; color: #55f6ff; background: rgba(19, 130, 255, 0.19); border-radius: 6px; transition: all 0.4s ease; }
      .orbit-label.active .iconwrap { background: rgba(19, 130, 255, 0.4); box-shadow: 0 0 12px rgba(85, 246, 255, 0.4); }

      .bottom-nav { position: absolute; z-index: 6; left: 12px; right: 12px; bottom: 8px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
      .nav-item { height: 62px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #7f9abc; border: 1px solid rgba(43, 157, 255, 0.20); background: linear-gradient(180deg, rgba(8, 34, 71, 0.70), rgba(2, 13, 32, 0.88)); clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%); cursor: pointer; transition: all 0.3s ease; }
      .nav-item.active { color: #e2fbff; border-color: rgba(43, 219, 255, 0.70); background: linear-gradient(90deg, transparent, rgba(62, 241, 255, 0.18), transparent), linear-gradient(180deg, rgba(0, 199, 255, 0.20), rgba(4, 35, 75, 0.85)); box-shadow: 0 0 20px rgba(0, 213, 255, 0.26); }
      .nav-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: rgba(35, 91, 160, 0.32); }
      .nav-title { font-size: 16px; font-weight: 800; line-height: 1; }
      .nav-sub { font-size: 12px; margin-top: 4px; color: #7188a7; }

      .rotor { transform-box: view-box; transform-origin: 391px 389px; animation: slowSpin 34s linear infinite; }
      @keyframes slowSpin { to { transform: rotate(360deg); } }
      .orbit-line { stroke-dasharray: 4 8; animation: orbitDash 20s linear infinite; }
      @keyframes orbitDash { to { stroke-dashoffset: -100; } }

      /* 环形进度条复合控件 */
      .ring-gauge-wrap { display: flex; gap: 12px; align-items: center; }
      .ring-gauge { position: relative; width: 80px; height: 80px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle, #061426 0 56%, transparent 57% 100%), conic-gradient(var(--color, #1b86ff) var(--angle), rgba(26, 78, 160, 0.36) 0deg); box-shadow: inset 0 0 20px rgba(25, 136, 255, 0.24); flex-shrink: 0; }
      .ring-gauge::before { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(82, 201, 255, 0.16); border-radius: 50%; }
      .ring-center { position: relative; text-align: center; line-height: 1; }
      .ring-center b { display: block; color: var(--color, #94d7ff); font-size: 18px; }
      .ring-center span { color: #6b87a7; font-size: 10px; }
      
      /* 小进度条组件 */
      .progress-list { flex: 1; display: flex; flex-direction: column; gap: 6px; }
      .progress-item { font-size: 12px; }
      .progress-label { display: flex; justify-content: space-between; color: #8aa5c2; margin-bottom: 2px; }
      .progress-val { color: #d8f4ff; font-family: monospace; }
      .progress-bar-bg { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
      .progress-bar-fill { height: 100%; border-radius: 2px; }
    `}</style>
  );
}

function Icon({ name, className = "wf-icon" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    weather: <><circle cx="8" cy="8" r="3" {...common} /><path d="M8 1.8v1.2M8 13v1.2M1.8 8h1.2M13 8h1.2M3.5 3.5l.9.9M11.6 11.6l.9.9M12.5 3.5l-.9.9M4.4 11.6l-.9.9" {...common} /></>,
    wind: <><path d="M2 6h8.8a2 2 0 1 0-1.9-2.7" {...common} /><path d="M2 10h11a2.25 2.25 0 1 1-2.1 3" {...common} /><path d="M2 13h5.2" {...common} /></>,
    monitor: <><rect x="2.4" y="3" width="11.2" height="7.4" rx="1.2" {...common} /><path d="M6.2 13h3.6M8 10.4V13" {...common} /></>,
    trend: <><path d="M2.5 11.5 6 8l2.3 2.1 5-5" {...common} /><path d="M10.5 5.1h2.8v2.8" {...common} /><path d="M3 14h10" {...common} opacity=".55" /></>,
    chart: <><path d="M2.5 13.5h11" {...common} /><path d="M4.2 11V7M8 11V3.2M11.8 11V5" {...common} /></>,
    gauge: <><path d="M3 12a5 5 0 1 1 10 0" {...common} /><path d="M8 12l3-4" {...common} /><path d="M4.6 12h6.8" {...common} /></>,
    alarm: <><path d="M8 14a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2Z" {...common} /><path d="M12 10.4V7a4 4 0 1 0-8 0v3.4L3 12h10z" {...common} /></>,
    database: <><ellipse cx="8" cy="4" rx="4.4" ry="2" {...common} /><path d="M3.6 4v4c0 1.1 2 2 4.4 2s4.4-.9 4.4-2V4" {...common} /><path d="M3.6 8v4c0 1.1 2 2 4.4 2s4.4-.9 4.4-2V8" {...common} /></>,
    report: <><path d="M4 2.5h5l3 3v8H4z" {...common} /><path d="M9 2.5v3h3M6 8h4M6 10.5h4M6 13h2" {...common} /></>,
    location: <><path d="M8 14s4.2-3.8 4.2-7.1a4.2 4.2 0 1 0-8.4 0C3.8 10.2 8 14 8 14Z" {...common} /><circle cx="8" cy="6.9" r="1.4" {...common} /></>,
    brain: <><path d="M5 12.4a2.6 2.6 0 0 1-.9-5A2.5 2.5 0 0 1 7.5 3a2.5 2.5 0 0 1 4 3.1 2.8 2.8 0 0 1-.5 6.3" {...common} /><path d="M8 4v9M5.5 8H8M8 10.4h3" {...common} /></>,
    settings: <><circle cx="8" cy="8" r="2.1" {...common} /><path d="M8 1.7v2M8 12.3v2M1.7 8h2M12.3 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4" {...common} /></>,
    user: <><circle cx="8" cy="5.2" r="2.4" {...common} /><path d="M3.6 14a4.4 4.4 0 0 1 8.8 0" {...common} /></>,
    warning: <><path d="M8 2.4 14 13H2z" {...common} /><path d="M8 5.8v3.4M8 11.4h.01" {...common} /></>,
    shield: <><path d="M8 1.8 13 4v3.6c0 3.2-2 5.3-5 6.6-3-1.3-5-3.4-5-6.6V4z" {...common} /><path d="m5.8 8 1.4 1.4 3-3" {...common} /></>,
    search: <><circle cx="7" cy="7" r="4" {...common} /><path d="m10.2 10.2 3.1 3.1" {...common} /></>,
    zap: <path d="M9.4 1.8 3.7 8.6h4.2l-1.4 5.6 5.8-7H8z" {...common} />,
    upload: <><path d="M14 10v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3M11 5l-3-3-3 3M8 2v8" {...common} /></>,
    download: <><path d="M14 10v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3M5 7l3 3 3-3M8 10V2" {...common} /></>,
  };
  return <svg viewBox="0 0 16 16" className={className} aria-hidden="true">{paths[name] || paths.chart}</svg>;
}

function Panel({ title, icon, right, children, className = "", style }) {
  return (
    <section className={`wf-panel ${className}`} style={style}>
      <div className="wf-panel-bg" />
      <div className="wf-panel-head">
        <div className="wf-panel-title"><span className="wf-icon-badge"><Icon name={icon} /></span>{title}</div>
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
        <span><Icon name="location" /> 东海风场A区 <span style={{color:"rgba(255,255,255,0.2)"}}>|</span> Imanformer v1.2</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "8px" }}><i className="wf-status-dot" />状态：<b style={{ color: "var(--green)" }}>运行中</b></span>
      </div>
      <div className="wf-header-title">
        <div className="wf-header-title-main">神威·风影之眼</div>
        <div className="wf-header-title-sub">多场景风力发电超短期预测系统</div>
      </div>
      <div className="wf-header-right">
        <span>2024-05-18 14:35:27 <span style={{color:"rgba(255,255,255,0.2)"}}>|</span> ⛅ 18°C</span>
        <span><Icon name="user" /> admin⌄</span>
      </div>
    </header>
  );
}

// ==================== 经过高密度重构的面板组件 ====================

function WeatherPanel({ style }) {
  return (
    <Panel title="实时气象 (测风塔80m)" icon="weather" right="刷新: 1min" style={style}>
      <div className="dense-grid-3">
        {weatherCards.map((item) => (
          <div className="mini-card" key={item.label}>
            <div className="mini-card-head"><span>{item.label}</span></div>
            <div className="mini-card-body">
              <b>{item.value}</b><span>{item.unit}</span>
              {item.trend && <span className={item.trend.includes('+') ? 'trend-up' : 'trend-down'} style={{marginLeft: "auto"}}>{item.trend}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "6px", padding: "5px 8px", border: "1px solid rgba(255, 121, 52, 0.45)", background: "linear-gradient(90deg, rgba(118, 40, 17, 0.4), rgba(47, 19, 17, 0.2))", borderRadius: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
        <div style={{ color: "#ff9c43" }}><Icon name="warning" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#ffb36d", fontSize: "11px", fontWeight: "bold", marginBottom: "1px" }}>强阵风预警</div>
          <div style={{ color: "#ffcfb1", fontSize: "10px", whiteSpace: "normal", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>未来6小时偏南风增强，请防范。</div>
        </div>
      </div>
    </Panel>
  );
}

function WindFarmPanel({ style }) {
  return (
    <Panel title="风场运行概况" icon="gauge" right="今日指标" style={style}>
      <div className="kv-grid" style={{ marginBottom: "8px" }}>
        <div className="kv-item"><span>装机容量</span><span className="kv-val">300 <small style={{fontSize: "10px"}}>MW</small></span></div>
        <div className="kv-item"><span>运行机组</span><span className="kv-val">48 <small style={{fontSize: "10px"}}>台</small></span></div>
        <div className="kv-item"><span>平均风速</span><span className="kv-val">7.8 <small style={{fontSize: "10px"}}>m/s</small></span></div>
        <div className="kv-item"><span>当前功率</span><span className="kv-val">145.2 <small style={{fontSize: "10px"}}>MW</small></span></div>
      </div>
      <div className="ring-gauge-wrap">
        <div className="ring-gauge" style={{ "--angle": "174deg" }}>
          <div className="ring-center"><b>48.4%</b><span>当前负荷</span></div>
        </div>
        <div className="progress-list">
          <div className="progress-item">
            <div className="progress-label"><span>日发电量进度</span><span className="progress-val">1.2GWh / 2.5GWh</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: "48%", background: "linear-gradient(90deg, #1f7dff, #23d6ff)" }} /></div>
          </div>
          <div className="progress-item">
            <div className="progress-label"><span>月发电量进度</span><span className="progress-val">42.5GWh / 65GWh</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: "65%", background: "linear-gradient(90deg, #ff8d3a, #ffb987)" }} /></div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ModelPanel({ style }) {
  return (
    <Panel title="算法架构态势" icon="brain" right={<div className="history-tabs"><span className="active">Imanformer</span><span>Baseline</span><span>Ensemble</span></div>} style={style}>
      <div className="kv-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
         <div className="kv-item"><span>算法核心引擎</span><span className="kv-val" style={{color: "#39efb4"}}>Imanformer v1.2</span></div>
         <div className="kv-item"><span>特征维数</span><span className="kv-val">256 维</span></div>
         <div className="kv-item"><span>滚动训练周期</span><span className="kv-val">02:00 (自动)</span></div>
         <div className="kv-item"><span>推理耗时(均值)</span><span className="kv-val">28 毫秒</span></div>
         <div className="kv-item"><span>输入源: NWP 数据</span><span className="kv-val">数值气象预报</span></div>
         <div className="kv-item"><span>输入源: 历史功率</span><span className="kv-val">滞后=48小时</span></div>
      </div>
    </Panel>
  );
}

function HistoryPanel({ style }) {
  return (
    <Panel title="历史功率对比 (实发 vs 理论)" icon="chart" style={style} right={<div className="history-tabs"><span className="active">今日</span><span>昨日</span></div>}>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="rgba(117, 203, 255, 0.14)" strokeDasharray="3 4" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 300]} ticks={[0, 150, 300]} />
            <Tooltip />
            <Line type="monotone" dataKey="actual" name="实际" stroke="#2388ff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="theory" name="理论" stroke="#27d5c2" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function ForecastCurvePanel({ style }) {
  return (
    <Panel title="短期预测置信区间" icon="chart" right="分辨率: 15分钟" style={style}>
      <div className="chart-box" style={{ minHeight: "150px", padding: "10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 30, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--sci-blue)" stopOpacity="0.15" />
                <stop offset="1" stopColor="var(--sci-blue)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="time" tick={{ fill: "#7e98b6", fontSize: 9 }} axisLine={{ stroke: '#666' }} tickLine={false} interval={3} />
            <YAxis tick={{ fill: "#7e98b6", fontSize: 9 }} axisLine={{ stroke: '#666' }} tickLine={false} domain={[0, 300]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(2, 8, 18, 0.95)', border: '1px solid #666', fontSize: '11px' }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend verticalAlign="top" align="right" height={24} iconType="plainline" wrapperStyle={{ fontSize: '10px', color: '#7e98b6', top: 0 }} />
            <Area type="monotone" dataKey="low" stackId="conf" stroke="none" fill="transparent" fillOpacity={0} legendType="none" dot={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="range" name="置信区间 (80%)" stackId="conf" stroke="none" fill="url(#band)" dot={false} isAnimationActive={false} />
            <ReferenceLine x="06:00" stroke="var(--sci-red)" strokeDasharray="5 5" label={{ value: "预测起点 T0", fill: "var(--sci-red)", fontSize: 9, position: "top" }} />
            <Line type="monotone" dataKey="p" name="预测功率" stroke="var(--sci-blue)" strokeWidth={2} dot={{ r: 1.5, fill: 'var(--sci-blue)' }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="a" name="实测功率" stroke="var(--sci-gray)" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 1.5, stroke: 'var(--sci-gray)', fill: 'transparent' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function FuturePowerPanel({ style }) {
  const items = [
    { title: "15分钟预测", value: "152.3", change: "3.2%", angle: "280deg", color: "#1f91ff" },
    { title: "30分钟预测", value: "149.8", change: "1.6%", angle: "242deg", color: "#2bd9c7" },
    { title: "45分钟预测", value: "147.1", change: "-0.5%", angle: "222deg", color: "#2bd9c7", down: true },
  ];

  return (
    <Panel title="未来发电量（多时段）" icon="zap" style={style}>
      <div className="future-grid">
        {items.map((item) => (
          <div className="forecast-circle" key={item.title}>
            <div style={{ color: "#8ba5c2", fontSize: "12px", whiteSpace: "nowrap" }}>{item.title}</div>
            <div className="power-ring" style={{ "--angle": item.angle, "--color": item.color }}>
              <div style={{ textAlign: "center" }}><b>{item.value}</b><span style={{ display: "block", marginTop: "2px", color: "#b5c9e0", fontSize: "10px" }}>MW</span></div>
            </div>
            <div style={{ color: item.down ? "var(--red)" : "var(--green)", fontSize: "12px", fontWeight: "bold" }}>
              {item.down ? "↓" : "↑"} {item.change}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AccuracyPanel({ style }) {
  return (
    <Panel title="预测考核指标评价" icon="shield" right="近7日" style={style}>
      <div className="dense-grid-2">
        {accuracyItems.map((item) => (
          <div className="mini-card" key={item.label} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
            <div style={{ color: "#23d6ff", background: "rgba(35, 214, 255, 0.1)", padding: "6px", borderRadius: "6px" }}><Icon name={item.icon} className="wf-icon" /></div>
            <div>
              <div style={{ color: "#8aa5c2", fontSize: "11px" }}>{item.label}</div>
              <div style={{ color: "#d8f4ff", fontSize: "16px", fontWeight: "bold", display: "flex", gap: "4px", alignItems: "baseline" }}>
                {item.value}
                <span className={item.trend === 'up' ? 'trend-up' : 'trend-down'} style={{fontSize: "12px"}}>{item.trend === 'up' ? '↑' : '↓'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function UnitStatusPanel({ style }) {
  const total = unitStatusData.reduce((sum, item) => sum + item.value, 0);
  return (
    <Panel title="机组群状态统计" icon="monitor" style={style}>
      <div className="ring-gauge-wrap" style={{ height: "100%", justifyContent: "space-between" }}>
        <div style={{ width: "80px", height: "80px", position: "relative", flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={unitStatusData} innerRadius="65%" outerRadius="100%" paddingAngle={2} dataKey="value" stroke="none">
                {unitStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center", lineHeight: 1 }}><b style={{ color: "#d8f4ff", fontSize: "18px" }}>{total}</b><br/><span style={{ color: "#7e98b6", fontSize: "9px" }}>总台数</span></div>
          </div>
        </div>
        <div className="progress-list" style={{ justifyContent: "center", minWidth: 0 }}>
          {unitStatusData.map((item) => (
            <div className="progress-item" key={item.name}>
              <div className="progress-label">
                <span style={{ display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><i style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, flexShrink: 0 }}/> {item.name}</span>
                <span className="progress-val" style={{ marginLeft: "8px" }}>{item.value}</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${(item.value / total) * 100}%`, background: item.color }} /></div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// === 高密度 Dense Tables & 复合图表面板 ===

function DeviceListPanel({ style }) {
  return (
    <Panel title="单机运行工况监测列表" icon="monitor" right="总数: 48台" style={style}>
      <div className="dense-table">
        <div className="dense-table-header" style={{ gridTemplateColumns: "80px 70px 1fr 1fr" }}>
          <span>机组编号</span><span>状态</span><span style={{textAlign:"right"}}>有功(MW)</span><span style={{textAlign:"right"}}>发电机(RPM)</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
          {mockTurbines.map(t => (
            <div className="dense-table-row" key={t.id} style={{ gridTemplateColumns: "80px 70px 1fr 1fr" }}>
              <span style={{ fontFamily: "monospace" }}>{t.id}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: t.color }}>
                <i style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.color, boxShadow: `0 0 6px ${t.color}` }} />{t.status}
              </span>
              <span style={{ fontFamily: "monospace", textAlign:"right" }}>{t.power}</span>
              <span style={{ fontFamily: "monospace", textAlign:"right", color: t.rpm === "0.0" ? "#7e98b6" : "#d8f4ff" }}>{t.rpm}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function NodeStatusPanel({ style }) {
  return (
    <Panel title="底层计算存储算力链路" icon="settings" style={style}>
      <div className="dense-table">
        <div className="dense-table-header" style={{ gridTemplateColumns: "1fr 60px 60px 80px" }}>
          <span>微服务节点</span><span>状态</span><span style={{textAlign:"right"}}>延迟</span><span style={{textAlign:"right"}}>节点负载</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
          {mockNodes.map((n, i) => (
            <div className="dense-table-row" key={i} style={{ gridTemplateColumns: "1fr 60px 60px 80px" }}>
              <span>{n.name}</span>
              <span style={{ color: "#39efb4" }}>{n.status}</span>
              <span style={{ color: "#7e98b6", fontFamily: "monospace", textAlign:"right" }}>{n.delay}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: "monospace", fontSize: "10px" }}>{n.load}</span>
                <div style={{ width: "30px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}><div style={{ width: n.load, height: "100%", background: parseInt(n.load) > 70 ? "#ff8d3a" : "#23d6ff", borderRadius: "2px" }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function DataQualityPanel({ style }) {
  return (
    <Panel title="多源数据接入质量" icon="brain" style={style}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <button className="wf-btn" style={{ flex: 1, padding: "4px 8px", fontSize: "11px", background: "rgba(35, 214, 255, 0.15)", border: "1px solid rgba(35, 214, 255, 0.3)", color: "#23d6ff", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <Icon name="upload" className="wf-icon" /> 数据载入
        </button>
        <button className="wf-btn" style={{ flex: 1, padding: "4px 8px", fontSize: "11px", background: "rgba(57, 239, 180, 0.15)", border: "1px solid rgba(57, 239, 180, 0.3)", color: "#39efb4", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <Icon name="download" className="wf-icon" /> 数据下载
        </button>
      </div>
      <div className="progress-list" style={{ marginTop: "4px" }}>
        {mockDataQuality.map((item, i) => (
          <div className="progress-item" key={i}>
            <div className="progress-label">
              <span style={{ color: "#9eb9d7" }}>{item.name}</span>
              <span style={{ color: item.color, fontWeight: "bold" }}>{item.value}%</span>
            </div>
            <div className="progress-bar-bg" style={{ height: "6px" }}>
              <div className="progress-bar-fill" style={{ width: `${item.value}%`, background: item.color, boxShadow: `0 0 8px ${item.color}80` }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IngestionRatePanel({ style }) {
  return (
    <Panel title="实时数据流吞吐(MB/s)" icon="chart" style={style}>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockIngest} margin={{ top: 5, right: 0, left: -24, bottom: 0 }} barSize={10}>
             <CartesianGrid stroke="rgba(85, 246, 255, 0.14)" strokeDasharray="3 4" vertical={false} />
             <XAxis dataKey="t" tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} />
             <YAxis tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} />
             <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
             <Bar dataKey="mb" name="吞吐量" fill="#23d6ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function TempForecastPanel({ style }) {
  return (
    <Panel title="数值气象预报气温" icon="weather" style={style}>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockTempData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
             <CartesianGrid stroke="rgba(117, 203, 255, 0.14)" strokeDasharray="3 4" vertical={false} />
             <XAxis dataKey="time" tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} />
             <YAxis domain={['auto', 'auto']} tick={{ fill: "#7e98b6", fontSize: 10 }} axisLine={false} tickLine={false} />
             <Tooltip />
             <Line type="monotone" dataKey="temp" name="气温" stroke="#ff8d3a" strokeWidth={2.5} dot={{r:3}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}


// ==================== 侧边栏动态路由渲染 ====================

function LeftSidebarContent({ activeTab }) {
  switch (activeTab) {
    case 'monitor':
      return (
        <>
          <WeatherPanel style={{ flex: "0 0 240px" }} />
          <WindFarmPanel style={{ flex: "0 0 230px" }} />
          <UnitStatusPanel style={{ flex: "1 1 0" }} />
        </>
      );
    case 'trend':
      return (
        <>
          <WindFarmPanel style={{ flex: "0 0 220px" }} />
          <HistoryPanel style={{ flex: "1 1 220px" }} />
          <ModelPanel style={{ flex: "0 0 160px" }} />
        </>
      );
    case 'weather':
      return (
        <>
          <WeatherPanel style={{ flex: "0 0 220px" }} />
          <TempForecastPanel style={{ flex: "1 1 0" }} />
        </>
      );
    case 'database':
      return (
        <>
          <WindFarmPanel style={{ flex: "0 0 220px" }} />
          <DataQualityPanel style={{ flex: "1 1 0" }} />
        </>
      );
    default:
      return null;
  }
}

function RightSidebarContent({ activeTab }) {
  switch (activeTab) {
    case 'monitor':
      return <DeviceListPanel style={{ flex: "1 1 0" }} />;
    case 'trend':
      return (
        <>
          <ForecastCurvePanel style={{ flex: "1 1 240px" }} />
          <FuturePowerPanel style={{ flex: "0 0 200px" }} />
          <AccuracyPanel style={{ flex: "0 0 160px" }} />
        </>
      );
    case 'weather':
      return (
        <>
          <ForecastCurvePanel style={{ flex: "1 1 0" }} />
          <AccuracyPanel style={{ flex: "0 0 160px" }} />
        </>
      );
    case 'database':
      return (
        <>
          <IngestionRatePanel style={{ flex: "0 0 200px" }} />
          <NodeStatusPanel style={{ flex: "1 1 0" }} />
        </>
      );
    default:
      return null;
  }
}

// ==================== 中央风机及 HUD 信息扩展 ====================
function TurbineScene({ activeTitle, ringIndex, spinOffset, onTabChange }) {
  let currentActive = ringIndex % navItems.length;
  if (currentActive < 0) currentActive += navItems.length;
  const ringRotation = 90 - ringIndex * (360 / navItems.length);

  const labels = navItems.map((item, i) => {
    const angleDeg = ringRotation + i * (360 / navItems.length);
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = 438 + 300 * Math.cos(angleRad); // 稍微放大轨道半径以适应更宽的布局
    const y = 442 + 140 * Math.sin(angleRad);
    const sinVal = Math.sin(angleRad);
    const scale = 0.75 + 0.25 * sinVal; 
    const opacity = Math.max(0.2, 0.45 + 0.55 * sinVal);
    const isActive = i === currentActive;
    return { ...item, x, y, scale, opacity, sinVal, isActive };
  });

  const backLabels = labels.filter(l => l.sinVal < 0).sort((a, b) => a.y - b.y);
  const frontLabels = labels.filter(l => l.sinVal >= 0).sort((a, b) => a.y - b.y);

  const renderLabel = (l) => (
    <g key={l.id} style={{ transform: `translate(${l.x}px, ${l.y}px) scale(${l.scale})`, opacity: l.opacity, transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease' }}>
      <foreignObject x="-75" y="-22" width="150" height="44" style={{ overflow: 'visible' }}>
        <div className={`orbit-label ${l.isActive ? 'active' : ''}`} onClick={() => onTabChange(l.id)}>
          <div className="iconwrap"><Icon name={l.icon} /></div><span style={{ fontWeight: l.isActive ? 700 : 400 }}>{l.title}</span>
        </div>
      </foreignObject>
    </g>
  );

  return (
    <section className="hero">
      {/* 极客风 HUD 边角料信息 */}
      <div className="tech-hud-corner tl">
        <div>系统状态: <span className="tech-hud-val">在线</span></div>
        <div>上行带宽: <span className="tech-hud-val">10Gbps</span></div>
        <div>加密协议: <span className="tech-hud-val">AES-256</span></div>
      </div>
      <div className="tech-hud-corner tr">
        <div>纬度: <span className="tech-hud-val">31.2304 N</span></div>
        <div>经度: <span className="tech-hud-val">121.4737 E</span></div>
        <div>海拔: <span className="tech-hud-val">12.4m</span></div>
      </div>
      <div className="tech-hud-corner bl">
        <div>CPU 负载: <span className="tech-hud-val">42%</span></div>
        <div>内存使用: <span className="tech-hud-val">18GB / 32GB</span></div>
      </div>
      <div className="tech-hud-corner br">
        <div>算法指纹: <span className="tech-hud-val">0x8F9A2B</span></div>
        <div>同步延迟: <span className="tech-hud-val">14ms</span></div>
      </div>

      <div className="hero-title">
        <div className="hero-title-main"><span>运行中</span> {activeTitle} </div>
      </div>

      <svg className="hero-svg" viewBox="0 0 900 780" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#c8fbff" stopOpacity="0.98" /><stop offset="0.42" stopColor="#35dcff" stopOpacity="0.55" /><stop offset="1" stopColor="#0a7fff" stopOpacity="0.04" /></radialGradient>
          <linearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9fcff" stopOpacity="0.60" /><stop offset="0.34" stopColor="#43d8ff" stopOpacity="0.30" /><stop offset="1" stopColor="#106dff" stopOpacity="0.02" /></linearGradient>
          <linearGradient id="nacelleGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b8f6ff" stopOpacity="0.26" /><stop offset="0.55" stopColor="#2caeff" stopOpacity="0.12" /><stop offset="1" stopColor="#06142a" stopOpacity="0.04" /></linearGradient>
          <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#061a35" /><stop offset="0.5" stopColor="#1a4d8a" /><stop offset="1" stopColor="#061a35" /></linearGradient>
          <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2" result="blur" /><feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.82 0 0 0 0 1 0 0 0 .9 0" result="glow" /><feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="blur" /><feColorMatrix in="blur" type="matrix" values="0 0 0 0 0 0 0 0 0 0.8 0 0 0 0 1 0 0 0 1 0" result="glow" /><feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        
        {/* 背景装饰轨道 */}
        <g opacity="0.6">
          <ellipse cx="438" cy="442" rx="380" ry="180" fill="none" stroke="rgba(79,211,255,.08)" strokeDasharray="2 10" />
          <ellipse className="orbit-line" cx="438" cy="442" rx="300" ry="140" fill="none" stroke="rgba(62,220,255,.30)" strokeWidth="1" />
        </g>
        
        {backLabels.map(renderLabel)}
        
        {/* 风机塔架 - 透视增强 */}
        <g filter="url(#cyanGlow)">
          <path d="M438 484 L390 780 L486 780 L438 484" fill="url(#towerGrad)" opacity="0.8" />
          <path d="M438 484 L405 780" stroke="rgba(108,231,255,.4)" strokeWidth="1" fill="none" />
          <path d="M438 484 L471 780" stroke="rgba(108,231,255,.4)" strokeWidth="1" fill="none" />
          {/* 塔架加强筋 */}
          {[550, 620, 690, 760].map(y => (
             <path key={y} d={`M${438 - (y-484)*0.16} ${y} L${438 + (y-484)*0.16} ${y}`} stroke="rgba(108,231,255,.2)" strokeWidth="1" fill="none" />
          ))}
        </g>

        {/* 机舱内部透视图 */}
        <g transform="translate(373 365) rotate(-2)" filter="url(#cyanGlow)">
          {/* 机舱外壳（半透明） */}
          <path d="M70 56 C120 6 300 11 430 28 C464 32 489 57 486 88 C483 116 455 133 416 133 L76 133 C40 133 17 111 17 94 C16 78 36 66 70 56Z" fill="rgba(15, 45, 85, 0.4)" stroke="rgba(158,236,255,.6)" strokeWidth="1.5" />
          
          {/* 内部机械结构：主轴 */}
          <rect x="90" y="80" width="180" height="20" rx="4" fill="rgba(85, 246, 255, 0.2)" stroke="rgba(85, 246, 255, 0.5)" strokeWidth="1" />
          {/* 内部机械结构：齿轮箱 */}
          <rect x="270" y="65" width="80" height="50" rx="6" fill="rgba(35, 136, 255, 0.3)" stroke="rgba(100, 200, 255, 0.6)" strokeWidth="1" />
          <circle cx="310" cy="90" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
          {/* 内部机械结构：发电机 */}
          <rect x="360" y="70" width="90" height="40" rx="4" fill="rgba(19, 130, 255, 0.2)" stroke="rgba(35, 214, 255, 0.5)" strokeWidth="1" />
          <path d="M370 75 L440 75 M370 85 L440 85 M370 95 L440 95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          {/* 前端连接部 */}
          <ellipse cx="93" cy="91" rx="62" ry="48" fill="rgba(16,94,179,.2)" stroke="rgba(176,243,255,.5)" />
        </g>

        {/* 叶片旋转部分 */}
        <g style={{ transform: `rotate(${spinOffset}deg)`, transformOrigin: '391px 389px', transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <g className="rotor" filter="url(#strongGlow)">
            {/* 叶片1 */}
            <g>
              <path d="M378 367 C330 320 261 268 132 208 C104 195 93 201 119 227 C222 323 306 375 363 397 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.6)" strokeWidth="1.2" />
              <path d="M350 350 L150 240" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="5 5" />
            </g>
            {/* 叶片2 */}
            <g>
              <path d="M374 398 C326 491 302 574 292 750 C290 789 306 798 323 762 C378 644 399 517 398 408 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.5)" strokeWidth="1.2" />
              <path d="M380 450 L310 700" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="5 5" />
            </g>
            {/* 叶片3 */}
            <g>
              <path d="M407 371 C501 324 611 304 745 315 C787 318 792 335 751 347 C619 385 509 403 415 402 Z" fill="url(#bladeGrad)" stroke="rgba(184,246,255,.45)" strokeWidth="1.2" />
              <path d="M450 380 L700 340" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="5 5" />
            </g>
          </g>
        </g>

        {/* 轮毂中心 */}
        <g filter="url(#strongGlow)">
          <circle cx="391" cy="389" r="45" fill="rgba(9,61,119,0.4)" stroke="rgba(121,233,255,.6)" strokeWidth="2" />
          <circle cx="391" cy="389" r="22" fill="url(#hubGlow)" />
          {/* 动态扫描环 */}
          <circle cx="391" cy="389" r="35" fill="none" stroke="rgba(85, 246, 255, 0.4)" strokeWidth="1" strokeDasharray="10 20">
            <animateTransform attributeName="transform" type="rotate" from="0 391 389" to="360 391 389" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {frontLabels.map(renderLabel)}
      </svg>
    </section>
  );
}

function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <div className={`nav-item ${item.id === activeTab ? "active" : ""}`} key={item.id} onClick={() => onTabChange(item.id)}>
          <div className="nav-icon"><Icon name={item.icon} /></div>
          <div><div className="nav-title">{item.title}</div><div className="nav-sub">{item.sub}</div></div>
        </div>
      ))}
    </nav>
  );
}

export default function WindPowerForecastingDashboard() {
  const dashboardScale = useDashboardScale();
  const dashboardStyle = {
    "--dashboard-scale": dashboardScale,
    "--dashboard-width": `${DESIGN_WIDTH * dashboardScale}px`,
    "--dashboard-height": `${DESIGN_HEIGHT * dashboardScale}px`,
  };

  const [ringIndex, setRingIndex] = useState(1); 
  const [spinOffset, setSpinOffset] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleTabChange = (targetId) => {
    const newIdx = navItems.findIndex(item => item.id === targetId);
    let currentMod = ringIndex % navItems.length;
    if (currentMod < 0) currentMod += navItems.length;

    if (newIdx === currentMod || isSwitching) return;

    let diff = newIdx - currentMod;
    if (diff > 3) diff -= navItems.length;
    if (diff < -3) diff += navItems.length;

    setIsSwitching(true);
    setRingIndex(prev => prev + diff);
    setSpinOffset(prev => prev + diff * 120);

    setTimeout(() => setIsSwitching(false), 350);
  };

  let activeMod = ringIndex % navItems.length;
  if (activeMod < 0) activeMod += navItems.length;
  const activeTabId = navItems[activeMod].id;
  const activeTitle = navItems[activeMod].title;

  return (
    <div className="wf-root" style={dashboardStyle}>
      <DashboardStyles />
      <div className="wf-stage">
        <div className="wf-screen">
          <Header />
          <main className={`wf-layout ${isSwitching ? 'switching' : ''}`}>
            <aside className="wf-left">
              <LeftSidebarContent activeTab={activeTabId} />
            </aside>
            <div className="wf-center">
              <TurbineScene activeTitle={activeTitle} ringIndex={ringIndex} spinOffset={spinOffset} onTabChange={handleTabChange} />
            </div>
            <aside className="wf-right">
              <RightSidebarContent activeTab={activeTabId} />
            </aside>
          </main>
          <BottomNav activeTab={activeTabId} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}