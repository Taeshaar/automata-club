export type Color = number;

export function colorFromRgb(r: number, g: number, b: number) {
  return (
    (255 << 24) | // alpha
    (b << 16) | // blue
    (g << 8) | // green
    r // red
  );
}

export function colorFromHex(h: string) {
  let matches = h.match(/.{2}/g);
  if (!matches || matches.length !== 3) {
    throw new Error(`${h} is not a valid rrggbb color.`);
  }

  let [r, g, b] = matches.map((s) => parseInt(s, 16));
  return colorFromRgb(r, g, b);
}
