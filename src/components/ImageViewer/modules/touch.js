import * as core from './core';

const cursor = { left: 0, top: 0 };
let pan;

let swipe;
let targetLeft;
let animationId;

let pinch;
let distance;
let distanceMove;

export function handleTouchStart(initial, current, apply) {
  return (e) => {
    if (animationId) {
      apply({ left: initial.box.left });
      cancelAnimationFrame(animationId);
    }

    if (e.touches.length === 1 && current.scale !== initial.scale) {
      pan = true;
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
    e.preventDefault();

    if (pan) {
      handlePan(e.touches[0], current, apply);
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

function smoothReturn(current, apply) {
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
}

export function handleTouchEnd(current, apply) {
  return () => {
    if (pan) {
      pan = false;
    }

    if (swipe) {
      swipe = false;
      animationId = requestAnimationFrame(() => { smoothReturn(current, apply); });
    }

    if (pinch) {
      pinch = false;
      distance = null;
      distanceMove = null;
    }
  };
}
