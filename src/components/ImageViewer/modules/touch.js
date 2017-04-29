import * as core from './core';

const cursor = { left: 0, top: 0 };
let pan;
const timeConstant = 325;
let offset = 0;
let velocity;
let frame;
let timestamp;
let ticker;
let amplitude;
let target;

let prevY = 0;

let swipe;
let targetLeft;
let animationId;

let pinch;
let distance;
let distanceMove;

function track() {
  const now = Date.now();
  const elapsed = now - timestamp;
  timestamp = now;
  const delta = offset - frame; // delta - сколько пролистнули в px
  frame = offset; // -frame - реальное положение top

  const v = (1000 * delta) / (1 + elapsed); // v - px / s. Может быть как положительным, так и отрицательным.
  velocity = (0.8 * v) + (0.2 * velocity);
}

function scroll(y, current, apply) {
  const rangeY = prevY - y;

  offset = y;

  const top = rangeY < 0
    ? core.moveTop(rangeY, current.top, current.height, window.innerHeight - 40, 40)
    : core.moveBottom(rangeY, current.top, current.height, window.innerHeight - 40, 40);

  apply({ top });
  // view.style[xform] = 'translateY(' + (-offset) + 'px)';
  prevY = y;
}

function autoScroll(current, apply) {
  let elapsed;
  let delta;

  if (amplitude) {
    elapsed = Date.now() - timestamp;
    delta = -amplitude * Math.exp(-elapsed / timeConstant);
    if (delta > 0.5 || delta < -0.5) {
      scroll(target + delta, current, apply);
      requestAnimationFrame(() => { autoScroll(current, apply); });
    } else {
      scroll(target, current, apply);
    }
  }
}

export function handleTouchStart(initial, current, apply) {

  return (e) => {
    if (animationId) {
      apply({ left: initial.box.left });
      cancelAnimationFrame(animationId);
    }

    if (e.touches.length === 1 && current.scale !== initial.scale) {
      pan = true;

      velocity = 0;
      amplitude = 0;
      frame = offset;
      timestamp = Date.now();

      clearInterval(ticker);
      ticker = setInterval(track, 100);
    } else if (e.touches.length === 1 && current.scale === initial.scale) {
      swipe = true;
      targetLeft = initial.box.left;
    } else if (e.touches.length === 2) {
      pan = false;
      swipe = false;
      pinch = true;
    }

    cursor.left = e.touches[0].clientX;
    cursor.top = e.touches[0].clientY;
  };
}

function handlePan(touch, current, apply) {
  const rangeX = touch.clientX - cursor.left;
  const rangeY = touch.clientY - cursor.top;

  const left = rangeX < 0
    ? core.moveLeft(rangeX, current.left, current.width, window.innerWidth)
    : core.moveRight(rangeX, current.left, current.width, window.innerWidth);

  const top = rangeY < 0
    ? core.moveTop(rangeY, current.top, current.height, window.innerHeight - 40, 40)
    : core.moveBottom(rangeY, current.top, current.height, window.innerHeight - 40, 40);

  apply({ left, top });

  cursor.left = touch.clientX;
  cursor.top = touch.clientY;
}

function handlePinch(touches, initial, current, apply) {
  const touch1 = touches[0];
  const touch2 = touches[1];

  const minX = Math.min(touch1.clientX, touch2.clientX);
  const minY = Math.min(touch1.clientY, touch2.clientY);

  const clientX = Math.round(minX + (Math.abs(touches[0].clientX - touches[1].clientX) / 2));
  const clientY = Math.round(minY + (Math.abs(touches[0].clientY - touches[1].clientY) / 2));

  const newDistance = Math.sqrt(
    (Math.round(touch1.clientX - touch2.clientX) ** 2) + (Math.round(touch1.clientY - touch2.clientY) ** 2),
  );

  if (!distance || Math.abs(newDistance - distance) < 2) {
    distance = newDistance;
    return;
  }

  const deltaY = newDistance > distance ? -1 : 1;

  distanceMove = newDistance - distance;
  distance = newDistance;

  if ((current.scale === 100.00 && deltaY < 0) || (current.scale === initial.scale && deltaY > 0)) {
    return;
  }

  const e = { clientX, clientY, deltaY };

  apply(core.zoom(e, { initial, current }, { zoom: current.scale + (distanceMove / 200) }));
}

export function handleTouchMove(initial, current, apply, navActions, imgPosition, totalImg) {
  return (e) => {
    if (pan) {
      const y = e.touches[0].clientY;
      const delta = cursor.top - y;

      // handlePan(e.touches[0], current, apply);

      if (delta > 2 || delta < -2) {
        cursor.top = y;
        scroll(offset + delta, current, apply);
      }

      return;
    }

    if (swipe) {
      let left;

      if (e.touches[0].clientX - cursor.left < 0) {
        if (imgPosition === totalImg) {
          return;
        }

        left = current.left + (e.touches[0].clientX - cursor.left);
        apply({ left });

        if (Math.abs(left - targetLeft) >= 100) {
          swipe = false;
          navActions.nextImg();
          return;
        }

        cursor.left = e.touches[0].clientX;
      } else if (e.touches[0].clientX - cursor.left > 0) {
        if (imgPosition === 1) {
          return;
        }

        left = current.left - (cursor.left - e.touches[0].clientX);
        apply({ left });

        if (Math.abs(left - targetLeft) >= 100) {
          swipe = false;
          navActions.prevImg();
          return;
        }
      }

      cursor.left = e.touches[0].clientX;
      return;
    }

    if (pinch) {
      handlePinch(e.touches, initial, current, apply);
    }
  };
}

/*function smoothReturn(current, apply) {
  const nextLeft = (() => {
    let left = 0;

    if (current.left < targetLeft) {
      left = current.left + 8;

      if (left > targetLeft) {
        return targetLeft;
      }
    } else {
      left = current.left - 8;

      if (left < targetLeft) {
        return targetLeft;
      }
    }

    return left;
  })();

  apply({ left: nextLeft });

  if (nextLeft !== targetLeft) {
    animationId = requestAnimationFrame(() => { smoothReturn(current, apply); });
  } else {
    cancelAnimationFrame(animationId);
  }
}*/

export function handleTouchEnd(current, apply) {
  return () => {
    if (pan) {
      pan = false;
      clearInterval(ticker);

      if (velocity > 10 || velocity < -10) {
        amplitude = 0.8 * velocity;
        target = Math.round(offset + amplitude);
        timestamp = Date.now();
        requestAnimationFrame(() => { autoScroll(current, apply); });
      }
    }

    if (swipe) {
      swipe = false;
      // animationId = requestAnimationFrame(() => { smoothReturn(current, apply); });
    }

    if (pinch) {
      pinch = false;
      distance = null;
      distanceMove = null;
    }
  };
}
