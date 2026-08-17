export interface RgbaImage {
  width: number;
  height: number;
  data: Uint8Array;
}

function readU32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>>
    0
  );
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new DecompressionStream('deflate');
  const writer = stream.writable.getWriter();
  await writer.write(data);
  await writer.close();
  const buffer = await new Response(stream.readable).arrayBuffer();
  return new Uint8Array(buffer);
}

export async function decodePng(bytes: Uint8Array): Promise<RgbaImage> {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i += 1) {
    if (bytes[i] !== sig[i]) throw new Error('Not a PNG');
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat: Uint8Array[] = [];

  while (offset + 8 <= bytes.length) {
    const length = readU32(bytes, offset);
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const start = offset + 8;
    const chunk = bytes.subarray(start, start + length);
    if (type === 'IHDR') {
      width = readU32(chunk, 0);
      height = readU32(chunk, 4);
      bitDepth = chunk[8];
      colorType = chunk[9];
    } else if (type === 'IDAT') {
      idat.push(chunk);
    } else if (type === 'IEND') {
      break;
    }
    offset = start + length + 4;
  }

  if (!width || !height) throw new Error('PNG missing IHDR');
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`Unsupported PNG format depth=${bitDepth} colorType=${colorType}`);
  }

  const compressedLength = idat.reduce((sum, part) => sum + part.length, 0);
  const compressed = new Uint8Array(compressedLength);
  let cursor = 0;
  for (const part of idat) {
    compressed.set(part, cursor);
    cursor += part.length;
  }
  const inflated = await inflate(compressed);
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const recon = new Uint8Array(height * stride);
  let src = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[src];
    src += 1;
    const row = inflated.subarray(src, src + stride);
    src += stride;
    const dest = y * stride;
    const prev = y === 0 ? null : recon.subarray((y - 1) * stride, y * stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= channels ? recon[dest + x - channels] : 0;
      const up = prev ? prev[x] : 0;
      const upLeft = prev && x >= channels ? prev[x - channels] : 0;
      let value = row[x];
      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) value = (value + paeth(left, up, upLeft)) & 255;
      else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}`);
      recon[dest + x] = value;
    }
  }

  if (colorType === 6) {
    return { width, height, data: recon };
  }
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0, j = 0; i < recon.length; i += 3, j += 4) {
    rgba[j] = recon[i];
    rgba[j + 1] = recon[i + 1];
    rgba[j + 2] = recon[i + 2];
    rgba[j + 3] = 255;
  }
  return { width, height, data: rgba };
}

export function sampleGrid(
  image: RgbaImage,
  bbox: [number, number, number, number],
): Array<{ lat: number; lon: number; r: number; g: number; b: number; a: number }> {
  const [west, south, east, north] = bbox;
  const cells = [];
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const i = (y * image.width + x) * 4;
      const lon = west + ((x + 0.5) / image.width) * (east - west);
      const lat = north - ((y + 0.5) / image.height) * (north - south);
      cells.push({
        lat,
        lon,
        r: image.data[i],
        g: image.data[i + 1],
        b: image.data[i + 2],
        a: image.data[i + 3],
      });
    }
  }
  return cells;
}
