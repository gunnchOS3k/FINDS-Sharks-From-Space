export type Gesture = 'left' | 'right' | 'up' | 'down' | 'pinch' | 'spread' | 'shake' | 'tap';

export type GestureHandlers = Partial<Record<Gesture, () => void>>;

export interface GestureController {
  start: (handlers: GestureHandlers) => void;
  stop: () => void;
}

export function classifyPinch(prevDist: number, nextDist: number, threshold = 48): 'pinch' | 'spread' | null {
  const delta = nextDist - prevDist;
  if (delta <= -threshold) return 'pinch';
  if (delta >= threshold) return 'spread';
  return null;
}

function isEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || el.isContentEditable;
}

export function createGestureController(): GestureController {
  const cleanups: Array<() => void> = [];
  let handlers: GestureHandlers = {};

  const onKey = (event: KeyboardEvent) => {
    if (isEditable(event.target)) return;
    const map: Record<string, Gesture> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
      '-': 'pinch',
      _: 'pinch',
      '+': 'spread',
      '=': 'spread',
    };
    const gesture = map[event.key];
    if (!gesture) return;
    event.preventDefault();
    handlers[gesture]?.();
  };

  const onPointer = () => {
    const pointers = new Map<number, { x: number; y: number }>();
    let lastDist = 0;
    const down = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.panel, .topbar, .modal, .btn, select, input')) {
        handlers.tap?.();
      }
      if (!target?.closest('.panel')) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };
    const move = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size !== 2) return;
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const kind = lastDist ? classifyPinch(lastDist, dist) : null;
      lastDist = dist;
      if (kind) handlers[kind]?.();
    };
    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) lastDist = 0;
    };
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    cleanups.push(() => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    });
  };

  const onShake = () => {
    let last = 0;
    const motion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.hypot(acc.x ?? 0, acc.y ?? 0, acc.z ?? 0);
      if (mag > 22 && Date.now() - last > 1200) {
        last = Date.now();
        handlers.shake?.();
      }
    };
    window.addEventListener('devicemotion', motion);
    cleanups.push(() => window.removeEventListener('devicemotion', motion));
  };

  return {
    start(next) {
      handlers = next;
      window.addEventListener('keydown', onKey);
      cleanups.push(() => window.removeEventListener('keydown', onKey));
      onPointer();
      onShake();
    },
    stop() {
      handlers = {};
      while (cleanups.length) cleanups.pop()?.();
    },
  };
}

export const GESTURE_MATRIX = [
  { gesture: 'Arrow keys', desktop: 'Supported', android: 'Supported with keyboard', pwa: 'Supported' },
  { gesture: '+ / -', desktop: 'Supported', android: 'Supported with keyboard', pwa: 'Supported' },
  { gesture: 'Tap', desktop: 'Supported', android: 'Supported', pwa: 'Supported' },
  {
    gesture: 'Pinch / spread on map',
    desktop: 'Deck.gl controller zooms the map',
    android: 'Deck.gl two-finger zoom',
    pwa: 'Deck.gl two-finger zoom',
  },
  {
    gesture: 'Pinch / spread on control panel',
    desktop: 'Trackpad/pointer pair changes candidate count',
    android: 'Two-finger pinch/spread changes candidate count',
    pwa: 'Two-finger pinch/spread changes candidate count',
  },
  {
    gesture: 'Shake',
    desktop: 'Not applicable',
    android: 'Supported via DeviceMotionEvent (opens gallery)',
    pwa: 'Supported where the browser exposes device motion',
  },
] as const;
