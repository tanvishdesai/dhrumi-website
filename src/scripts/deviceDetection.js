import { loadSettings } from "./settings.js";

const isMobile = () => typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.maxTouchPoints && navigator.maxTouchPoints > 1;

const isLowPerformance = () => {
    if (typeof window > "u" || typeof navigator > "u") return !1;
    const e = loadSettings().performance?.lowPerformanceMode;
    if (e === "on") return !0;
    if (e === "off") return !1;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return !0;
    const r = navigator.hardwareConcurrency;
    if (r && r < 4) return !0;
    const o = navigator.deviceMemory;
    return !!(o && o < 4)
};

export { isMobile, isLowPerformance };
