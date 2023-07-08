export const evolveImageData = (
  oldImageData: ImageData,
  processor: (x: number, y: number, oldBuffer: ArrayBuffer) => number
) => {
  let { width, height } = oldImageData;
  let newImageData = new ImageData(width, height);

  let oldBuffer: ArrayBuffer = oldImageData.data.buffer;
  let buf32 = new Uint32Array(newImageData.data.buffer);

  let y = height;
  while (y-- > 0) {
    let x = width;
    while (x-- > 0) {
      buf32[y * width + x] = processor(x, y, oldBuffer);
    }
  }
  return newImageData;
};
