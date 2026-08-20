'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Universal Transparent Preloader for Apple (iPad / iPhone / Safari) & All Browsers
 * 
 * Uses a Seamless Dual-Engine:
 * 1. Instant 442KB Animated WebP (starts immediately with zero delay and 100% transparency).
 * 2. Hardware-Accelerated WebGL Engine (smoothly transitions in with premultiplied alpha and 0 black flash).
 */

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Auto-dismiss after animation completes (~9 seconds)
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 9000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(dismissTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Set canvas internal resolution immediately
    canvas.width = 1280;
    canvas.height = 720;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
      });
    } catch {
      gl = null;
    }

    if (!gl) return;

    gl.viewport(0, 0, 1280, 720);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        vec2 colorCoord = vec2(v_texCoord.x, v_texCoord.y * 0.5);
        vec2 alphaCoord = vec2(v_texCoord.x, 0.5 + v_texCoord.y * 0.5);
        vec4 color = texture2D(u_image, colorCoord);
        float alpha = texture2D(u_image, alphaCoord).r;
        // Premultiplied alpha blending: eliminates black background halo/blink
        gl_FragColor = vec4(color.rgb * alpha, alpha);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 1,
         1, -1, 1, 1,
        -1,  1, 0, 0,
        -1,  1, 0, 0,
         1, -1, 1, 1,
         1,  1, 1, 0,
      ]),
      gl.STATIC_DRAW
    );

    const a_position = gl.getAttribLocation(program, 'a_position');
    const a_texCoord = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(a_texCoord);
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let frameCount = 0;

    function renderLoop() {
      if (video.readyState >= 2 && video.currentTime > 0.02) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frameCount++;
        if (frameCount >= 2) {
          setIsReady(true);
        }
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    }

    const startPlay = () => {
      video.play().catch(() => {});
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener('canplay', startPlay, { once: true });
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('canplay', startPlay);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative flex items-center justify-center w-[min(540px,min(92vw,82vh))] h-[min(540px,min(92vw,82vh))]">
            {/* Offscreen driving video for WebGL alpha extraction */}
            <video
              ref={videoRef}
              src="/loading-stacked.mp4"
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              x-webkit-airplay="deny"
              preload="auto"
              style={{
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0.01,
                pointerEvents: 'none',
              }}
            />

            {/* Hardware-Accelerated WebGL Canvas with smooth fade-in once frames are valid */}
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
                isReady ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'transparent',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
            />

            {/* Instant Transparent Animated WebP Layer (Guarantees zero-blink start) */}
            <img
              src="/loading.webp"
              alt="Letters Loading Animation"
              className={`w-full h-full object-contain pointer-events-none select-none bg-transparent absolute inset-0 transition-opacity duration-300 ${
                isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


