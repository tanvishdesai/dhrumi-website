const CONFIG_DEF = {
    backgroundGrid: {
        type: {
            label: "Background Type",
            type: "select",
            options: [{ value: "default", label: "Default (Animated)" }, { value: "static", label: "Static Grid" }, { value: "none", label: "None" }],
            default: "default"
        },
        gridSize: {
            label: "Grid Size",
            type: "slider",
            min: 10,
            max: 150,
            step: 5,
            default: 60,
            valueFormatter: e => `${e}px`
        },
        lineWidth: {
            label: "Line Width",
            type: "slider",
            min: .5,
            max: 5,
            step: .1,
            default: .5,
            valueFormatter: e => `${e.toFixed(1)}px`
        },
        baseOpacity: {
            label: "Grid Highlight Opacity",
            type: "slider",
            min: 0,
            max: 1,
            step: .01,
            default: .12,
            valueFormatter: e => e.toFixed(2)
        },
        highlightIntensity: {
            label: "Highlight Intensity",
            type: "slider",
            min: 0,
            max: 1.5,
            step: .05,
            default: .35,
            valueFormatter: e => e.toFixed(2)
        },
        highlightSize: {
            label: "Highlight Size",
            type: "slider",
            min: 1,
            max: 5,
            step: .25,
            default: 1.75,
            valueFormatter: e => `x${e.toFixed(2)}`
        }
    },
    globe: {
        rotationSpeed: {
            label: "Rotation Speed",
            type: "slider",
            min: 0,
            max: .5,
            step: .01,
            default: .1
        },
        lineWidth: {
            label: "Line Width",
            type: "slider",
            min: .01,
            max: .05,
            step: .001,
            default: .035,
            valueFormatter: e => e.toFixed(3)
        },
        meridians: {
            label: "Meridians (Vertical)",
            type: "slider",
            min: 4,
            max: 24,
            step: 1,
            default: 12
        },
        parallels: {
            label: "Parallels (Horizontal)",
            type: "slider",
            min: 2,
            max: 12,
            step: 1,
            default: 8
        },
        rgbOffset: {
            label: "Acidity (RGB Shift)",
            type: "slider",
            min: 0,
            max: .025,
            step: 5e-4,
            default: .0125,
            valueFormatter: e => e.toFixed(4)
        }
    },
    interaction: {
        mouseSensitivity: {
            label: "Mouse Sensitivity",
            type: "slider",
            min: 0,
            max: 2,
            step: .1,
            default: .2,
            valueFormatter: e => e.toFixed(1)
        },
        gyroSensitivity: {
            label: "Gyroscope Sensitivity",
            type: "slider",
            min: .1,
            max: 3,
            step: .1,
            default: 1,
            valueFormatter: e => e.toFixed(1),
            mobileOnly: !0
        }
    },
    audio: {
        flashbangEnabled: {
            label: "Flashbang on Light mode",
            type: "checkbox",
            description: "Flashbang sound effect plays when switching to light mode.",
            default: !0
        }
    },
    performance: {
        lowPerformanceMode: {
            label: "Low Performance Mode",
            type: "select",
            options: [{ value: "auto", label: "Auto (Detect)" }, { value: "on", label: "On (Reduced Motion)" }, { value: "off", label: "Off (High Quality)" }],
            default: "auto",
            description: "Force reduced motion and static effects."
        },
        showFPS: {
            label: "Show FPS Counter",
            type: "checkbox",
            description: "Display frames per second counter in top left corner.",
            default: !1
        }
    },
    breadcrumb: {
        enabled: {
            label: "Show Breadcrumbs",
            type: "checkbox",
            description: "Display navigation breadcrumbs on pages.",
            default: !0
        }
    }
};

const getDefaults = e => {
    const t = {};
    for (const i in e) {
        t[i] = {};
        for (const a in e[i]) t[i][a] = e[i][a].default
    }
    return t
};

const DEFAULT_SETTINGS = {
    camera: { fov: 75, near: .1, far: 10, position: { x: 0, y: 0, z: 2.5 } },
    globe: { radius: 1.2, segments: 128 },
    gyroscope: { permissionGranted: !1 }
};

const mergeSettings = (e, t) => {
    const i = { ...e };
    return e && typeof e == "object" && t && typeof t == "object" && Object.keys(t).forEach(a => {
        t[a] && typeof t[a] == "object" && a in e && typeof e[a] == "object" ? i[a] = mergeSettings(e[a], t[a]) : i[a] = t[a]
    }), i
};

const INITIAL_SETTINGS = mergeSettings(getDefaults(CONFIG_DEF), DEFAULT_SETTINGS);
const STORAGE_KEY = "appSettings";

const loadSettings = () => {
    try {
        const e = localStorage.getItem(STORAGE_KEY),
            t = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
        if (e) {
            const i = JSON.parse(e);
            return mergeSettings(t, i)
        }
        return t
    } catch (e) {
        return console.error("Failed to load settings. Using defaults.", e), JSON.parse(JSON.stringify(INITIAL_SETTINGS))
    }
};

const saveSettings = e => {
    const t = loadSettings(),
        i = mergeSettings(t, e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(i));
    document.dispatchEvent(new CustomEvent("app:settings-changed", { detail: i }))
};

const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    const e = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    document.dispatchEvent(new CustomEvent("app:settings-changed", { detail: e }));
    document.dispatchEvent(new CustomEvent("app:settings-reset", { detail: e }))
};

export { CONFIG_DEF, loadSettings, resetSettings, saveSettings };
