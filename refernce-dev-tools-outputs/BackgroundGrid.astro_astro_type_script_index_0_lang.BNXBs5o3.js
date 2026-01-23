import{l as f}from"./settings.Bs8SxSJd.js";import{i as l}from"./deviceDetection.DNriNLq8.js";const n={DEFAULT:"default",STATIC:"static",NONE:"none"},m=`#version 300 es
    in vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,b=`#version 300 es
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
  `;class p{constructor(i){this.canvas=i,this.gl=i.getContext("webgl2",{alpha:!0,antialias:!1,powerPreference:"high-performance",desynchronized:!0}),this.gl&&(this.config=f().backgroundGrid,l()&&(this.config.type=n.STATIC),this.blobs=[],this.mouseX=-5e3,this.mouseY=-5e3,this.isRunning=!1,this.isDark=document.documentElement.classList.contains("dark"),this.init())}init(){this.createProgram(),this.createQuad(),this.resize(),this.bindEvents(),this.config.type!==n.NONE&&this.start()}createProgram(){const i=this.gl,e=(a,c)=>{const o=i.createShader(a);return i.shaderSource(o,c),i.compileShader(o),i.getShaderParameter(o,i.COMPILE_STATUS)?o:(console.error(i.getShaderInfoLog(o)),i.deleteShader(o),null)},t=e(i.VERTEX_SHADER,m),s=e(i.FRAGMENT_SHADER,b);this.program=i.createProgram(),i.attachShader(this.program,t),i.attachShader(this.program,s),i.linkProgram(this.program),this.uLoc={res:i.getUniformLocation(this.program,"u_resolution"),gridSize:i.getUniformLocation(this.program,"u_gridSize"),lineWidth:i.getUniformLocation(this.program,"u_lineWidth"),color:i.getUniformLocation(this.program,"u_color"),baseOpacity:i.getUniformLocation(this.program,"u_baseOpacity"),highlightIntensity:i.getUniformLocation(this.program,"u_highlightIntensity"),blobs:i.getUniformLocation(this.program,"u_blobs"),blobCount:i.getUniformLocation(this.program,"u_blobCount"),blobRadius:i.getUniformLocation(this.program,"u_blobRadius")}}createQuad(){const i=this.gl,e=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vao=i.createVertexArray(),i.bindVertexArray(this.vao);const t=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,t),i.bufferData(i.ARRAY_BUFFER,e,i.STATIC_DRAW);const s=i.getAttribLocation(this.program,"a_position");i.enableVertexAttribArray(s),i.vertexAttribPointer(s,2,i.FLOAT,!1,0,0)}resize(){const i=window.devicePixelRatio||1;this.canvas.width=window.innerWidth*i,this.canvas.height=window.innerHeight*i,this.canvas.style.width=`${window.innerWidth}px`,this.canvas.style.height=`${window.innerHeight}px`,this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}bindEvents(){window.addEventListener("resize",()=>this.resize()),window.addEventListener("mousemove",i=>{const e=this.canvas.getBoundingClientRect(),t=window.devicePixelRatio||1,s=i.clientX-e.left,a=i.clientY-e.top;this.mouseX=s*t,this.mouseY=(e.height-a)*t}),document.addEventListener("basecoat:theme",()=>{this.isDark=document.documentElement.classList.contains("dark")}),document.addEventListener("app:settings-changed",i=>{this.config=i.detail.backgroundGrid,l()&&(this.config.type=n.STATIC),this.config.type===n.NONE?this.stop():this.isRunning||this.start()})}updateBlobs(i){Math.random()<.02&&this.blobs.length<6&&this.blobs.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,age:0,life:3+Math.random()*2,maxInt:this.config.highlightIntensity});for(let e=this.blobs.length-1;e>=0;e--){const t=this.blobs[e];if(t.age+=i,t.age>=t.life){this.blobs.splice(e,1);continue}const s=t.age/t.life;s<.3?t.currInt=s/.3*t.maxInt:s>.7?t.currInt=(1-s)/.3*t.maxInt:t.currInt=t.maxInt}}render(i){if(!this.isRunning)return;const e=(i-this.lastTime)/1e3||.016;this.lastTime=i;const t=this.gl,s=window.devicePixelRatio||1;this.config.type===n.DEFAULT&&this.updateBlobs(e),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.program),t.bindVertexArray(this.vao);const a=Math.min(this.canvas.width,this.canvas.height)*.15*this.config.highlightSize;t.uniform2f(this.uLoc.res,this.canvas.width,this.canvas.height),t.uniform1f(this.uLoc.gridSize,this.config.gridSize*s),t.uniform1f(this.uLoc.lineWidth,this.config.lineWidth*s);const c=this.isDark?[1,1,1]:[.15,.15,.15];t.uniform3fv(this.uLoc.color,c),t.uniform1f(this.uLoc.baseOpacity,this.config.baseOpacity),t.uniform1f(this.uLoc.highlightIntensity,this.config.highlightIntensity),t.uniform1f(this.uLoc.blobRadius,a);const o=[],g=window.innerWidth>=640,u="ontouchstart"in window||navigator.maxTouchPoints>0;this.config.type===n.DEFAULT&&!u&&g&&o.push(this.mouseX,this.mouseY,this.config.highlightIntensity),this.config.type===n.DEFAULT&&this.blobs.forEach(r=>{o.push(r.x,r.y,r.currInt)}),t.uniform1i(this.uLoc.blobCount,o.length/3),o.length>0&&t.uniform3fv(this.uLoc.blobs,new Float32Array(o)),t.drawArrays(t.TRIANGLE_STRIP,0,4),requestAnimationFrame(r=>this.render(r))}start(){this.isRunning||(this.isRunning=!0,this.lastTime=performance.now(),requestAnimationFrame(i=>this.render(i)))}stop(){this.isRunning=!1,this.gl.clear(this.gl.COLOR_BUFFER_BIT)}}function d(){const h=document.getElementById("grid-canvas");h&&new p(h)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
