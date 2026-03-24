import { useRef, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';

export function LiquidWebGLBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useThemeContext();
    const isLight = theme === 'light';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { alpha: true });
        if (!gl) return;

        // Define colors based on theme
        // Dark mode: Deep blacks with cyan/violet liquid mesh
        // Light mode: Ivory/White with cobalt/sapphire liquid mesh
        const color1 = isLight ? [0.96, 0.94, 0.92, 1.0] : [0.03, 0.03, 0.03, 1.0];
        const color2 = isLight ? [0.85, 0.90, 0.98, 0.8] : [0.05, 0.15, 0.25, 0.8];
        const color3 = isLight ? [0.70, 0.80, 0.95, 0.6] : [0.15, 0.05, 0.25, 0.6];

        const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      
      uniform vec4 u_color1;
      uniform vec4 u_color2;
      uniform vec4 u_color3;

      // Classic 2D noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Mouse influence
        vec2 mouse = u_mouse / u_resolution;
        mouse.x *= u_resolution.x / u_resolution.y;
        float dist = distance(st, mouse);
        float influence = smoothstep(0.5, 0.0, dist) * 0.5;

        // Base noise movement
        vec2 pos = st * 1.5;
        float n = snoise(pos + u_time * 0.15);
        n += snoise(pos * 2.0 - u_time * 0.1) * 0.5;
        n += influence;

        // Color mixing
        vec4 mix1 = mix(u_color1, u_color2, n * 0.8 + 0.5);
        vec4 mix2 = mix(mix1, u_color3, (snoise(pos * 3.0 + u_time * 0.2) * 0.5 + 0.5));
        
        gl_FragColor = mix2;
      }
    `;

        const compileShader = (type: number, source: string) => {
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
        };

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

        const color1Loc = gl.getUniformLocation(program, 'u_color1');
        const color2Loc = gl.getUniformLocation(program, 'u_color2');
        const color3Loc = gl.getUniformLocation(program, 'u_color3');

        let animationFrameId: number;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let tmouseX = mouseX;
        let tmouseY = mouseY;

        const resize = () => {
            // Aggressively downscale WebGL resolution for massive performance boost
            // A smooth gradient doesn't need to be rendered at native 4K
            const scale = 0.12;
            canvas.width = Math.floor(window.innerWidth * scale);
            canvas.height = Math.floor(window.innerHeight * scale);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resize, { passive: true });
        resize();

        const handleMouseMove = (e: MouseEvent) => {
            tmouseX = e.clientX;
            // In WebGL, Y is inverted
            tmouseY = window.innerHeight - e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const render = (time: number) => {
            // smooth mouse follow
            mouseX += (tmouseX - mouseX) * 0.05;
            mouseY += (tmouseY - mouseY) * 0.05;

            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, time * 0.001);
            gl.uniform2f(mouseLocation, mouseX, mouseY);

            gl.uniform4fv(color1Loc, color1);
            gl.uniform4fv(color2Loc, color2);
            gl.uniform4fv(color3Loc, color3);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        };

        render(0);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isLight]);

    return (
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden mix-blend-normal opacity-40">
            <canvas ref={canvasRef} className="h-full w-full object-cover" />
        </div>
    );
}
