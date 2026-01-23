import { loadSettings } from "./settings.js";
import { isLowPerformance } from "./deviceDetection.js";

const GRID_TYPES = { DEFAULT: "default", STATIC: "static", NONE: "none" };

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_gridSize;
    uniform float u_lineWidth;
    uniform vec3 u_color;
    uniform float u_baseOpacity;
    uniform float u_highlightIntensity;

    uniform vec3 u_blobs[16];
    uniform int u_blobCount;
    uniform float u_blobRadius;

    out vec4 outColor;

    void main() {
        vec2 st = gl_FragCoord.xy;

        // 1. Calculate precise distance to the nearest grid line (in pixels)
        // fract() wraps 0..1; subtracting 0.5 centers it; abs() gives distance from center
        vec2 gridDist = abs(fract(st / u_gridSize - 0.5) - 0.5) * u_gridSize;

        // 2. Use smoothstep for Anti-Aliasing (prevents disappearing lines)
        // This creates a 1px soft edge. If a line falls between pixels, it draws 50% on both.
        float radius = u_lineWidth * 0.5;
        float xLine = 1.0 - smoothstep(radius - 0.5, radius + 0.5, gridDist.x);
        float yLine = 1.0 - smoothstep(radius - 0.5, radius + 0.5, gridDist.y);

        // Combine axes
        float lineIntensity = max(xLine, yLine);

        // 3. Lower discard threshold to keep soft edges
        if (lineIntensity < 0.1) discard;

        float totalLight = 0.0;

        for(int i = 0; i < 16; i++) {
            if (i >= u_blobCount) break;
            vec3 blob = u_blobs[i];
            float dist = distance(st, blob.xy);
            float glow = 1.0 - smoothstep(0.0, u_blobRadius, dist);
            totalLight += glow * blob.z;
        }

        float alpha = u_baseOpacity + (totalLight * u_highlightIntensity);
        alpha = clamp(alpha, 0.0, 1.0);

        // 4. Multiply alpha by lineIntensity to render the smooth edge
        outColor = vec4(u_color * alpha, alpha * lineIntensity);
    }
  `;

class BackgroundGrid {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "high-performance", desynchronized: true });
        
        if (this.gl) {
            this.config = loadSettings().backgroundGrid;
            if (isLowPerformance()) {
                this.config.type = GRID_TYPES.STATIC;
            }
            this.blobs = [];
            this.mouseX = -5000;
            this.mouseY = -5000;
            this.isRunning = false;
            this.isDark = document.documentElement.classList.contains("dark");
            this.init();
        }
    }

    init() {
        this.createProgram();
        this.createQuad();
        this.resize();
        this.bindEvents();
        if (this.config.type !== GRID_TYPES.NONE) {
            this.start();
        }
    }

    createProgram() {
        const gl = this.gl;
        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
        };

        const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        this.uLoc = {
            res: gl.getUniformLocation(this.program, "u_resolution"),
            gridSize: gl.getUniformLocation(this.program, "u_gridSize"),
            lineWidth: gl.getUniformLocation(this.program, "u_lineWidth"),
            color: gl.getUniformLocation(this.program, "u_color"),
            baseOpacity: gl.getUniformLocation(this.program, "u_baseOpacity"),
            highlightIntensity: gl.getUniformLocation(this.program, "u_highlightIntensity"),
            blobs: gl.getUniformLocation(this.program, "u_blobs"),
            blobCount: gl.getUniformLocation(this.program, "u_blobCount"),
            blobRadius: gl.getUniformLocation(this.program, "u_blobRadius")
        };
    }

    createQuad() {
        const gl = this.gl;
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    bindEvents() {
        window.addEventListener("resize", () => this.resize());
        window.addEventListener("mousemove", e => {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.mouseX = x * dpr;
            this.mouseY = (rect.height - y) * dpr;
        });
        document.addEventListener("basecoat:theme", () => {
            this.isDark = document.documentElement.classList.contains("dark");
        });
        document.addEventListener("app:settings-changed", e => {
            this.config = e.detail.backgroundGrid;
            if (isLowPerformance()) {
                this.config.type = GRID_TYPES.STATIC;
            }
            this.config.type === GRID_TYPES.NONE ? this.stop() : (this.isRunning || this.start());
        });
    }

    updateBlobs(deltaTime) {
        if (Math.random() < .02 && this.blobs.length < 6) {
            this.blobs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                age: 0,
                life: 3 + Math.random() * 2,
                maxInt: this.config.highlightIntensity
            });
        }

        for (let i = this.blobs.length - 1; i >= 0; i--) {
            const blob = this.blobs[i];
            blob.age += deltaTime;
            if (blob.age >= blob.life) {
                this.blobs.splice(i, 1);
                continue;
            }
            const progress = blob.age / blob.life;
            if (progress < .3) {
                blob.currInt = (progress / .3) * blob.maxInt;
            } else if (progress > .7) {
                blob.currInt = ((1 - progress) / .3) * blob.maxInt;
            } else {
                blob.currInt = blob.maxInt;
            }
        }
    }

    render(time) {
        if (!this.isRunning) return;
        const deltaTime = (time - this.lastTime) / 1000 || .016;
        this.lastTime = time;
        const gl = this.gl;
        const dpr = window.devicePixelRatio || 1;

        if (this.config.type === GRID_TYPES.DEFAULT) {
            this.updateBlobs(deltaTime);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        const blobRadius = Math.min(this.canvas.width, this.canvas.height) * .15 * this.config.highlightSize;
        gl.uniform2f(this.uLoc.res, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uLoc.gridSize, this.config.gridSize * dpr);
        gl.uniform1f(this.uLoc.lineWidth, this.config.lineWidth * dpr);
        
        const color = this.isDark ? [1, 1, 1] : [.15, .15, .15];
        gl.uniform3fv(this.uLoc.color, color);
        
        gl.uniform1f(this.uLoc.baseOpacity, this.config.baseOpacity);
        gl.uniform1f(this.uLoc.highlightIntensity, this.config.highlightIntensity);
        gl.uniform1f(this.uLoc.blobRadius, blobRadius);

        const blobsData = [];
        const isDesktop = window.innerWidth >= 640;
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (this.config.type === GRID_TYPES.DEFAULT && !isTouch && isDesktop) {
            blobsData.push(this.mouseX, this.mouseY, this.config.highlightIntensity);
        }

        if (this.config.type === GRID_TYPES.DEFAULT) {
            this.blobs.forEach(blob => {
                blobsData.push(blob.x, blob.y, blob.currInt);
            });
        }

        gl.uniform1i(this.uLoc.blobCount, blobsData.length / 3);
        if (blobsData.length > 0) {
            gl.uniform3fv(this.uLoc.blobs, new Float32Array(blobsData));
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(t => this.render(t));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(time => this.render(time));
        }
    }

    stop() {
        this.isRunning = false;
        if (this.gl) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }
}

function initBackgroundGrid() {
    const canvas = document.getElementById("grid-canvas");
    if (canvas) {
        new BackgroundGrid(canvas);
    }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackgroundGrid);
} else {
    initBackgroundGrid();
}
