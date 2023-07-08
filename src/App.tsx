import { onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';

import { parseRules, Rule } from './lib/cellular_automata';
import { colorFromHex, Color } from './lib/couleur';
import { evolveImageData } from './lib/pixel_canvas';
import styles from './App.module.css';

// Configurations
const ZOOM = 4;
const HOLDER_ID = '#automata';
const RULES = '23/3';

let rules = parseRules(RULES);

// Il faudra découper ça un peu mieux quand je ferais les fichiers
const sparseRainbow = ((
  treshold: number,
  colors: Array<Color>
): ((x: number, y: number) => Color) => {
  return (x, y) => {
    if (Math.random() > treshold) {
      return 0x0;
    }

    return colors[Math.floor(Math.random() * colors.length)];
  };
})(0.1, [
  colorFromHex('ff0000'),
  colorFromHex('00ff00'),
  colorFromHex('0000ff'),
  colorFromHex('ff00ff'),
  colorFromHex('00ffff'),
  colorFromHex('ffffff'),
]);

const App: Component = () => {
  let canvas: HTMLCanvasElement;
  let width: number;
  let height: number;

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unobtainable context');
    }

    ctx.imageSmoothingEnabled = false;
    let imageData = ctx.getImageData(
      0,
      0,
      Math.floor(width),
      Math.floor(height)
    );

    let animationFrameId: number;
    const loop = (t: number) => {
      animationFrameId = requestAnimationFrame(loop);
      imageData = evolveImageData(imageData, sparseRainbow);
      ctx.putImageData(imageData, 0, 0);
    };
    requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    });
  });

  return (
    <>
      <canvas ref={canvas!} width={width!} height={height!} />
    </>
  );
};

export default App;
