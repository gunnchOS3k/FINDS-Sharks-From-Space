import { DEFAULT_POINTS, MAX_BODY_BYTES, MAX_POINTS, MIN_POINTS } from './types';
import { findRegion, isValidBBox, type BBox } from './regions';
import type { GenerateRequest } from './types';

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function assertMethod(method: string, allowed: string[]): void {
  if (!allowed.includes(method)) {
    throw new HttpError(405, 'method_not_allowed', `Method ${method} is not allowed.`);
  }
}

export function parseJsonBody(raw: string, maxBytes = MAX_BODY_BYTES): unknown {
  const bytes = new TextEncoder().encode(raw).length;
  if (bytes > maxBytes) {
    throw new HttpError(413, 'payload_too_large', `Request body exceeds ${maxBytes} bytes.`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'invalid_json', 'Request body must be valid JSON.');
  }
}

export function validateGenerateRequest(input: unknown): GenerateRequest {
  if (!input || typeof input !== 'object') {
    throw new HttpError(400, 'invalid_body', 'Request body must be an object.');
  }
  const body = input as Record<string, unknown>;
  if (typeof body.region !== 'string' || body.region.trim().length < 2) {
    throw new HttpError(400, 'invalid_region', 'region must be a non-empty string.');
  }
  if (!findRegion(body.region)) {
    throw new HttpError(
      400,
      'unsupported_region',
      'region must be one of the documented FINDS preset ocean regions.',
    );
  }
  const n = body.n === undefined ? DEFAULT_POINTS : Number(body.n);
  if (!Number.isInteger(n) || n < MIN_POINTS || n > MAX_POINTS) {
    throw new HttpError(
      400,
      'invalid_n',
      `n must be an integer between ${MIN_POINTS} and ${MAX_POINTS}.`,
    );
  }
  let bbox: BBox | undefined;
  if (body.bbox !== undefined) {
    if (!isValidBBox(body.bbox)) {
      throw new HttpError(
        400,
        'invalid_bbox',
        'bbox must be [west, south, east, north] within supported geographic limits.',
      );
    }
    bbox = body.bbox;
  }
  return { region: body.region.trim(), n, bbox };
}
