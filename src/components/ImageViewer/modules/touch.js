import * as core from './core';

const cursor = { left: 0, top: 0 };
let distance;
let distanceMove;
let pan;
let swipe;
let swipeLeft;
let swipeRight;
let pinch;

export function handleTouchStart(initial, current) {
  return (e) => {
    if (e.touches.length === 1 && current.scale !== initial.scale) {
      pan = true;
    } else if (e.touches.length === 1 && current.scale === initial.scale) {
      swipe = true;
    } else if (e.touches.length === 2) {
      pan = false;
      pinch = true;
    }

    const touch = e.touches[0];
    cursor.left = touch.clientX;
    cursor.top = touch.clientY;
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
  // apply(core.zoom(e, { initial, current }, { zoomFactor: 2.5 }));
}

export function handleTouchMove(initial, current, apply) {
  return (e) => {
    e.preventDefault();
    if (pan) {
      handlePan(e.touches[0], current, apply);
      return;
    }
    if (pinch) {
      handlePinch(e.touches, initial, current, apply);
      return;
    }
  };

  /* if (e.touches.length === 1 && this.props.scale === this.props.initial.scale) {
    if (e.touches[0].clientX - this.cursor.left < 0) {
      console.log('It is left swipe!');
      this.swipeLeftActive = true;
    }

    if (e.touches[0].clientX - this.cursor.left > 0) {
      console.log('It is right swipe!');
    }
  }*/
}

/* swipeLeft = (touch) => {
  this.img.style.transition = 'none';
  const rangeX = touch.clientX - this.cursor.left;
  const currentLeft = this.current.left;
  const currentTop = this.current.top;

  const left = currentLeft + rangeX;

  if (touch.clientX - this.cursor.left <= -75) {
    this.onRightKeyDown();
  }

  // main
  this.img.style.transform = `translate3d(${left}px, ${currentTop}px, 0)`;

  // preview
  if (!this.props.loaded) {
    this.preview.style.transform = `translate3d(${left}px, ${currentTop}px, 0)`;
  }
}

swipeRight = (touch) => {
  if (touch.clientX - this.cursor.left >= 75) {
    this.onLeftKeyDown();
  }
}*/

export function handleTouchEnd(current) {
  return () => {
    swipe = false;
    swipeLeft = false;
    swipeRight = false;

    if (pan) {
      pan = false;
    }

    if (pinch) {
      pinch = false;
      distance = null;
      distanceMove = null;
    }

    /* if (this.swipeLeftActive) {
      this.swipeLeftActive = false;

      const currentLeft = this.current.left;
      const currentTop = this.current.top;

      window.setTimeout(() => {
        this.img.style.transition = 'all 300ms linear';
        this.img.style.transform = `translate3d(${currentLeft}px, ${currentTop}px, 0)`;
      }, 50);
    }*/
    // console.log('onTouchEnd', e.touches[0]);
  };
}
