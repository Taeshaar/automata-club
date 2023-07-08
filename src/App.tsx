import { onMount, onCleanup, createSignal } from 'solid-js';
import type { Component } from 'solid-js';

import { parseRules, Rule, getAliveNeighbors } from './lib/cellular_automata';
import { colorFromHex, Color } from './lib/couleur';
import { evolveImageData, ProcessorFunction } from './lib/pixel_canvas';
import styles from './App.module.css';

// Configurations
const ZOOM = 2;
const HOLDER_ID = '#automata';
const RULES = '23/3';

// Il faudra découper ça un peu mieux quand je ferais les fichiers
const sparseRainbow = ((
  treshold: number,
  colors: Array<Color>
): ProcessorFunction => {
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
  colorFromHex('ffff00'),
  colorFromHex('ffffff'),
]);

const applyRule = ((rulesString: string): ProcessorFunction => {
  let rules = parseRules(rulesString);
  return (x, y, width, height, oldBuffer) => {
    let buf32 = new Uint32Array(oldBuffer);
    let index = y * width + x
    let aliveNeighbors = getAliveNeighbors(x, y, width, height, oldBuffer);
    let aliveNeighborsCount = aliveNeighbors.length;

    let currentCellValue = buf32[index];
    let currentCellIsAlive = (currentCellValue >> 24 & 0xFF) === 255;

    // Mes rules étant un bit, je pourrais faire ça BIEN plus vite avec un `a & b > 0`
    if (currentCellIsAlive && rules.surviveRule.indexOf(aliveNeighborsCount) !== -1) {
      return currentCellValue;
    } else if (!currentCellIsAlive && rules.birthRule.indexOf(aliveNeighborsCount) !== -1) {
      // Je pourrais mix les couleurs
      return aliveNeighbors[0];
    }
    return 0x0;
  };
})(RULES);

const App: Component = () => {
  let canvas: HTMLCanvasElement;
  const [ width, setWidth ] =  createSignal(window.innerWidth/ZOOM);
  const [ height, setHeight ] =  createSignal(window.innerHeight/ZOOM);
  let count = 0;

  const resizeCanvas = () => {
    setWidth(window.innerWidth/ZOOM);
    setHeight(window.innerHeight/ZOOM);
  };
  window.addEventListener('resize', resizeCanvas);

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unobtainable context');
    }

    ctx.imageSmoothingEnabled = false;
    let imageData = ctx.getImageData(
      0,
      0,
      Math.floor(width()),
      Math.floor(height())
    );
    imageData = evolveImageData(imageData, sparseRainbow);


    let animationFrameId: number;
    const loop = (t: number) => {
      animationFrameId = requestAnimationFrame(loop);

      /*count += 1;
      if (count >= 10) {

        count -= 10;
      } else {
        return;
      }*/
  
      imageData = evolveImageData(imageData, applyRule);
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
      <canvas ref={canvas!} width={width()} height={height()} />
    </>
  );
};

export default App;
