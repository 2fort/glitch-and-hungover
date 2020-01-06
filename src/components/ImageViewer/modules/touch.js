import * as core from './core';

const cursor = { left: 0, top: 0 };

let lastTouchEnd;
let same;

let pan;
let ticker;
let timestamp;
const kinetic = {
  offset: 0,
  velocity: 0,
  frame: 0,
  timestamp: 0,
  ticker: 0,
  amplitude: 0,
  target: 0,
};
const timeConstant = 325;

let pinch;
let distance;
let distanceMove;

let swipe;
let targetLeft;

const kineticX = Object.assign({}, kinetic);
const kineticY = Object.assign({}, kinetic);

function track() {
  const now = Date.now();
  const elapsed = now - timestamp;
  timestamp = now;

  const deltaX = kineticX.offset - kineticX.frame;
  const deltaY = kineticY.offset - kineticY.frame;

  kineticX.frame = kineticX.offset;
  kineticY.frame = kineticY.offset;

  const vX = (1000 * deltaX) / (1 + elapsed);
  const vY = (1000 * deltaY) / (1 + elapsed);

  kineticX.velocity = (0.8 * vX) + (0.2 * kineticX.velocity);
  kineticY.velocity = (0.8 * vY) + (0.2 * kineticY.velocity);
}

function scroll(x, y, current, apply) {
  const rangeX = kineticX.offset - x;
  const rangeY = kineticY.offset - y;

  kineticX.offset = x;
  kineticY.offset = y;

  const left = rangeX < 0
    ? core.moveLeft(rangeX, current.left, current.width, window.innerWidth)
    : core.moveRight(rangeX, current.left, current.width, window.innerWidth);

  if (left === current.left) {
    kineticX.amplitude = 0;
  }

  const top = rangeY < 0
    ? core.moveTop(rangeY, current.top, current.height, window.innerHeight - 40, 40)
    : core.moveBottom(rangeY, current.top, current.height, window.innerHeight - 40, 40);

  if (top === current.top) {
    kineticY.amplitude = 0;
  }

  apply({ left, top });
}

function autoScroll(current, apply) {
  if (kineticX.amplitude || kineticY.amplitude) {
    const elapsed = Date.now() - timestamp;
    const deltaX = -kineticX.amplitude * Math.exp(-elapsed / timeConstant);
    const deltaY = -kineticY.amplitude * Math.exp(-elapsed / timeConstant);

    if (deltaX > 0.5 || deltaX < -0.5 || deltaY > 0.5 || deltaY < -0.5) {
      scroll(kineticX.target + deltaX, kineticY.target + deltaY, current, apply);
      requestAnimationFrame(() => { autoScroll(current, apply); });
    } else {
      scroll(kineticX.target, kineticY.target, current, apply);
    }
  }
}

function doubleTap(initial, current, apply) {
  const coordinates = { clientX: cursor.left, clientY: cursor.top };
  const params = (() => {
    if (current.scale === 1) {
      return core.zoom(coordinates, initial, current, { min: true });
    }

    return core.zoom(coordinates, initial, current, { max: true });
  })();

  apply(params);
}

export function handleTouchStart(initial, current) {
  return (e) => {
    e.preventDefault();

    if (e.touches.length === 1 && current.scale !== initial.scale) {
      pan = true;

      kineticX.velocity = 0;
      kineticY.velocity = 0;

      kineticX.amplitude = 0;
      kineticY.amplitude = 0;

      kineticX.frame = kineticX.offset;
      kineticY.frame = kineticY.offset;

      timestamp = Date.now();

      clearInterval(ticker);

      ticker = setInterval(track, 50);
    } else if (e.touches.length === 1 && current.scale === initial.scale) {
      swipe = true;
      targetLeft = initial.box.left;
    } else if (e.touches.length === 2) {
      pan = false;
      swipe = false;
      pinch = true;
    }

    if (
      e.touches.length === 1 &&
      Math.abs(cursor.left - e.touches[0].clientX < 25) &&
      Math.abs(cursor.top - e.touches[0].clientY < 25)
    ) {
      same = true;
    } else {
      same = false;
    }

    cursor.left = e.touches[0].clientX;
    cursor.top = e.touches[0].clientY;
  };
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

  apply(core.zoom(e, initial, current, { zoom: current.scale + (distanceMove / 200) }));
}

export function handleTouchMove(initial, current, apply, navActions, imgPosition, totalImg) {
  return (e) => {
    e.preventDefault();

    if (pan) {
      const deltaX = cursor.left - e.touches[0].clientX;
      const deltaY = cursor.top - e.touches[0].clientY;

      if (deltaY > 2 || deltaY < -2 || deltaX > 2 || deltaX < -2) {
        cursor.left = e.touches[0].clientX;
        cursor.top = e.touches[0].clientY;
        scroll(kineticX.offset + deltaX, kineticY.offset + deltaY, current, apply);
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

        if (Math.abs(left - targetLeft) >= 75) {
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

        if (Math.abs(left - targetLeft) >= 75) {
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

function smoothReturn(initial, current, apply) {
  if (current.scale !== initial.scale) return;

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
    requestAnimationFrame(() => { smoothReturn(initial, current, apply); });
  }
}

export function handleTouchEnd(initial, current, apply) {
  return (e) => {
    e.preventDefault();

    if (pan) {
      pan = false;
      clearInterval(ticker);

      if (kineticX.velocity > 10 || kineticX.velocity < -10 || kineticY.velocity > 10 || kineticY.velocity < -10) {
        kineticX.amplitude = 0.8 * kineticX.velocity;
        kineticY.amplitude = 0.8 * kineticY.velocity;

        kineticX.target = Math.round(kineticX.offset + kineticX.amplitude);
        kineticY.target = Math.round(kineticY.offset + kineticY.amplitude);

        timestamp = Date.now();
        requestAnimationFrame(() => { autoScroll(current, apply); });
      }
    }

    if (swipe) {
      swipe = false;
      requestAnimationFrame(() => { smoothReturn(initial, current, apply); });
    }

    if (pinch) {
      pinch = false;
      distance = null;
      distanceMove = null;
    }

    if (lastTouchEnd && lastTouchEnd + 300 > e.timeStamp && same) {
      doubleTap(initial, current, apply);
    }

    lastTouchEnd = e.timeStamp;
  };
}
