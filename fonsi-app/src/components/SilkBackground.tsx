/**
 * Animated silk texture background — RN port of the website's canvas-based silk effect.
 * Uses expo-gl with a GLSL fragment shader for GPU-accelerated rendering.
 */

import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';

interface SilkBackgroundProps {
  speed?: number;
  scale?: number;
  color?: [number, number, number];
  style?: ViewStyle;
}

const VERT_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG_SHADER = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform vec3 uColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float u = uv.x * uScale;
  float v = (1.0 - uv.y) * uScale;

  // Cross-couple axes to prevent directional dead zones on mobile
  u += 0.12 * sin(2.5 * v);
  v += 0.12 * sin(2.5 * u);

  float tOffset = uSpeed * uTime;
  float t02 = 0.02 * tOffset;
  float t01 = 0.1 * tOffset;

  float sinVal = 0.03 * sin(8.0 * u - tOffset);
  float cos3u = cos(3.0 * u);
  float tex_y = v + sinVal;
  float sum = u + tex_y;

  float pattern = 0.6 + 0.4 * sin(
    5.0 * (sum + cos(cos3u + 5.0 * tex_y) + t02) +
    sin(20.0 * (sum - t01))
  );

  vec3 col = uColor * pattern;

  // Radial vignette overlay (matches website)
  vec2 center = uv - 0.5;
  float dist = length(center) * 2.0;
  float vignette = mix(0.05, 0.3, dist);
  col *= (1.0 - vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const SilkBackground: React.FC<SilkBackgroundProps> = ({
  speed = 0.02,
  scale = 2,
  color = [123, 116, 129],
  style,
}) => {
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    // Compile vertex shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, VERT_SHADER);
    gl.compileShader(vertShader);

    // Compile fragment shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, FRAG_SHADER);
    gl.compileShader(fragShader);

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad (2 triangles)
    const vertices = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const speedLoc = gl.getUniformLocation(program, 'uSpeed');
    const scaleLoc = gl.getUniformLocation(program, 'uScale');
    const colorLoc = gl.getUniformLocation(program, 'uColor');

    // Normalize color to 0-1
    const r = color[0] / 255;
    const g = color[1] / 255;
    const b = color[2] / 255;

    let lastFrame = 0;
    const frameInterval = 1000 / 30; // 30 FPS

    const render = (timestamp: number) => {
      if (timestamp - lastFrame >= frameInterval) {
        lastFrame = timestamp;
        frameRef.current += 1;

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform2f(resolutionLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(timeLoc, frameRef.current);
        gl.uniform1f(speedLoc, speed);
        gl.uniform1f(scaleLoc, scale);
        gl.uniform3f(colorLoc, r, g, b);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.endFrameEXP();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
  }, [speed, scale, color]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,
});
