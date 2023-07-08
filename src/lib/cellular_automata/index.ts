export type Rule = Array<number>

export const parseRules = (rules: string): {surviveRule: Rule, birthRule: Rule} => {
  let [surviveRule, birthRule] = rules.split('/').map(rule => rule.split('').map(i => parseInt(i)))
  
  return { birthRule, surviveRule }
}

// Je me demande comment je pourrais accélérer ça
export const getAliveNeighbors = (
  x: number,
  y: number,
  width: number,
  height: number,
  buffer: ArrayBuffer,
): Array<number> => {
  // Permet de boucler, mais on devrait pouvoir faire mieux en dupliquant de la data
  let prevX = x - 1;
  let nextX = x + 1;
  if (x === 0) {
    prevX = width - 1;
  } else if (x === width - 1) {
    nextX = 0;
  }

  let prevY = y - 1;
  let nextY = y + 1;
  if (y === 0) {
    prevY = height - 1;
  } else if (y === height - 1) {
    nextY = 0;
  }

  let buf32 = new Uint32Array(buffer);
  // Ne pourrait-on pas faire plus rapide d'une manière ou une autre ? :()
  let neighbors = [
    buf32[prevX + prevY * width],
    buf32[x + prevY * width],
    buf32[nextX + prevY * width],
    buf32[prevX + y * width],
    buf32[nextX + y * width],
    buf32[prevX + nextY * width],
    buf32[x + nextY * width],
    buf32[nextX + nextY * width],
  ];

  // Et là on renvois les couleurs pour pouvoir mixer
  return neighbors.filter((pixelValue) => ((pixelValue >> 24) & 0xff) === 255);
}