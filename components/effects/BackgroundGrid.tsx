"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";

interface Blob {
  x: number;
  y: number;
  age: number;
  life: number;
  maxInt: number;
  currInt: number;
}

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

    // Calculate precise distance to the nearest grid line (in pixels)
    vec2 gridDist = abs(fract(st / u_gridSize - 0.5) - 0.5) * u_gridSize;

    // Use smoothstep for Anti-Aliasing
    float radius = u_lineWidth * 0.5;
    float xLine = 1.0 - smoothstep(radius - 0.5, radius + 0.5, gridDist.x);
    float yLine = 1.0 - smoothstep(radius - 0.5, radius + 0.5, gridDist.y);

    // Combine axes
    float lineIntensity = max(xLine, yLine);

    // Discard transparent pixels
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

    outColor = vec4(u_color * alpha, alpha * lineIntensity);
  }
`;

export function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef({ x: -5000, y: -5000 });
  const isRunningRef = useRef(false);
  const lastTimeRef = useRef(0);
  const isDarkRef = useRef(true);
  const animationFrameRef = useRef<number>(0);

  const { settings } = useSettings();
  const gridConfig = settings.backgroundGrid;

  const createShader = useCallback(
    (gl: WebGL2RenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    },
    []
  );

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      desynchronized: true,
    });

    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Get uniform locations
    uniformsRef.current = {
      res: gl.getUniformLocation(program, "u_resolution"),
      gridSize: gl.getUniformLocation(program, "u_gridSize"),
      lineWidth: gl.getUniformLocation(program, "u_lineWidth"),
      color: gl.getUniformLocation(program, "u_color"),
      baseOpacity: gl.getUniformLocation(program, "u_baseOpacity"),
      highlightIntensity: gl.getUniformLocation(program, "u_highlightIntensity"),
      blobs: gl.getUniformLocation(program, "u_blobs"),
      blobCount: gl.getUniformLocation(program, "u_blobCount"),
      blobRadius: gl.getUniformLocation(program, "u_blobRadius"),
    };

    // Create quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    vaoRef.current = vao;
  }, [createShader]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = document.documentElement.clientWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${document.documentElement.clientWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  const updateBlobs = useCallback((deltaTime: number) => {
    // Randomly spawn new blobs
    if (Math.random() < 0.02 && blobsRef.current.length < 6) {
      const canvas = canvasRef.current;
      if (canvas) {
        blobsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          age: 0,
          life: 3 + Math.random() * 2,
          maxInt: gridConfig.highlightIntensity,
          currInt: 0,
        });
      }
    }

    // Update existing blobs
    for (let i = blobsRef.current.length - 1; i >= 0; i--) {
      const blob = blobsRef.current[i];
      blob.age += deltaTime;

      if (blob.age >= blob.life) {
        blobsRef.current.splice(i, 1);
        continue;
      }

      const progress = blob.age / blob.life;
      if (progress < 0.3) {
        blob.currInt = (progress / 0.3) * blob.maxInt;
      } else if (progress > 0.7) {
        blob.currInt = ((1 - progress) / 0.3) * blob.maxInt;
      } else {
        blob.currInt = blob.maxInt;
      }
    }
  }, [gridConfig.highlightIntensity]);

  const render = useCallback(
    (time: number) => {
      if (!isRunningRef.current) return;

      const deltaTime = (time - lastTimeRef.current) / 1000 || 0.016;
      lastTimeRef.current = time;

      const gl = glRef.current;
      const program = programRef.current;
      const vao = vaoRef.current;
      const uniforms = uniformsRef.current;
      const canvas = canvasRef.current;

      if (!gl || !program || !vao || !canvas) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (gridConfig.type === "default") {
        updateBlobs(deltaTime);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);

      const dpr = window.devicePixelRatio || 1;
      const blobRadius = Math.min(canvas.width, canvas.height) * 0.15 * gridConfig.highlightSize;

      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.gridSize, gridConfig.gridSize * dpr);
      gl.uniform1f(uniforms.lineWidth, gridConfig.lineWidth * dpr);

      const color = isDarkRef.current ? [1, 1, 1] : [0.15, 0.15, 0.15];
      gl.uniform3fv(uniforms.color, color);
      gl.uniform1f(uniforms.baseOpacity, gridConfig.baseOpacity);
      gl.uniform1f(uniforms.highlightIntensity, gridConfig.highlightIntensity);
      gl.uniform1f(uniforms.blobRadius, blobRadius);

      // Build blob array
      const blobData: number[] = [];
      const isDesktop = window.innerWidth >= 640;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Add mouse blob on desktop
      if (gridConfig.type === "default" && !isTouch && isDesktop) {
        blobData.push(mouseRef.current.x, mouseRef.current.y, gridConfig.highlightIntensity);
      }

      // Add ambient blobs
      if (gridConfig.type === "default") {
        blobsRef.current.forEach((blob) => {
          blobData.push(blob.x, blob.y, blob.currInt);
        });
      }

      gl.uniform1i(uniforms.blobCount, blobData.length / 3);
      if (blobData.length > 0) {
        gl.uniform3fv(uniforms.blobs, new Float32Array(blobData));
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    },
    [gridConfig, updateBlobs]
  );

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(render);
  }, [render]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const gl = glRef.current;
    if (gl) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }, []);

  useEffect(() => {
    initWebGL();
    resize();

    const handleResize = () => resize();
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * dpr;
    };
    const handleThemeChange = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("theme-change", handleThemeChange);

    // Check initial theme
    isDarkRef.current = document.documentElement.classList.contains("dark");

    if (gridConfig.type !== "none") {
      start();
    }

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("theme-change", handleThemeChange);
    };
  }, [initWebGL, resize, start, stop, gridConfig.type]);

  // Handle settings changes
  useEffect(() => {
    if (gridConfig.type === "none") {
      stop();
    } else if (!isRunningRef.current) {
      start();
    }
  }, [gridConfig.type, start, stop]);

  if (gridConfig.type === "none") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      id="grid-canvas"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
