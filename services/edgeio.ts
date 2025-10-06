export type EdgeGesture =
  | "left" | "right" | "up" | "down"
  | "pinch" | "spread" | "fist" | "open"
  | "shake" | "tap";

export type EdgeHandlers = Partial<Record<EdgeGesture, () => void>>;

export interface EdgeIO {
  start: (handlers: EdgeHandlers) => void;
  stop: () => void;
  isActive: () => boolean;
}

/**
 * Implementation plan:
 * 1) Try to dynamically import a browser bundle from the EdgeGesture repo (if reachable).
 * 2) If not reachable, provide a local fallback:
 *    - Keyboard: ArrowLeft/Right/Up/Down = left/right/up/down; +/- = spread/pinch.
 *    - Mobile motion: significant shake -> "shake".
 *    - Click/tap on a small on-screen button -> "tap".
 */
export function createEdgeIO(): EdgeIO {
  let isActive = false;
  let handlers: EdgeHandlers = {};
  let keyboardListeners: (() => void)[] = [];
  let motionListeners: (() => void)[] = [];
  let tapButton: HTMLButtonElement | null = null;

  const createTapButton = () => {
    if (tapButton) return tapButton;
    
    tapButton = document.createElement('button');
    tapButton.innerHTML = '👆';
    tapButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid #00ffff;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      display: none;
    `;
    
    tapButton.addEventListener('click', () => {
      handlers.tap?.();
    });
    
    document.body.appendChild(tapButton);
    return tapButton;
  };

  const setupKeyboardListeners = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlers.left?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.right?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlers.up?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.down?.();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handlers.spread?.();
          break;
        case '-':
          e.preventDefault();
          handlers.pinch?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    keyboardListeners.push(() => document.removeEventListener('keydown', handleKeyDown));
  };

  const setupMotionListeners = () => {
    let lastShakeTime = 0;
    const shakeThreshold = 15;
    let lastX = 0, lastY = 0, lastZ = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isActive || !e.acceleration) return;
      
      const { x, y, z } = e.acceleration;
      if (x === null || y === null || z === null) return;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      const acceleration = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
      
      if (acceleration > shakeThreshold && Date.now() - lastShakeTime > 1000) {
        lastShakeTime = Date.now();
        handlers.shake?.();
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
      motionListeners.push(() => window.removeEventListener('devicemotion', handleMotion));
    }
  };

  const tryLoadEdgeGestureRepo = async (): Promise<boolean> => {
    try {
      // Try to load from the EdgeGesture repo
      const module = await import('https://raw.githubusercontent.com/gunnchOS3k/EdgeGesture-Fall-2025-Edge-AI-Qualcomm-Hackathon/main/dist/edge-gesture.js');
      if (module && module.createEdgeIO) {
        // Use the real EdgeGesture implementation
        const realEdgeIO = module.createEdgeIO();
        return true;
      }
    } catch (error) {
      console.log('EdgeGesture repo not available, using fallback implementation');
    }
    return false;
  };

  return {
    start: (newHandlers: EdgeHandlers) => {
      handlers = newHandlers;
      isActive = true;
      
      // Try to load the real EdgeGesture implementation first
      tryLoadEdgeGestureRepo().then((loaded) => {
        if (!loaded) {
          // Fallback to local implementation
          setupKeyboardListeners();
          setupMotionListeners();
          
          // Show tap button for mobile
          if (window.innerWidth <= 768) {
            createTapButton().style.display = 'block';
          }
        }
      });
    },
    
    stop: () => {
      isActive = false;
      handlers = {};
      
      // Clean up listeners
      keyboardListeners.forEach(cleanup => cleanup());
      motionListeners.forEach(cleanup => cleanup());
      keyboardListeners = [];
      motionListeners = [];
      
      // Hide tap button
      if (tapButton) {
        tapButton.style.display = 'none';
      }
    },
    
    isActive: () => isActive
  };
}
