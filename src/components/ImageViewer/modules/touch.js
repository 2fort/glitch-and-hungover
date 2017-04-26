import * as core from './core';

const cursor = { left: 0, top: 0 };
const shift = { x: 0, y: 0 };
let distance;
let pan;
let swipe;
let swipeLeft;
let swipeRight;
let pinch;

function apply(elem, newCurrent) {
  elem.style.width = `${newCurrent.width}px`; // eslint-disable-line
  elem.style.height = `${newCurrent.height}px`; // eslint-disable-line
  elem.style.transform = `translate3d(${newCurrent.left}px, ${newCurrent.top}px, 0)`; // eslint-disable-line
}

export function handleTouchStart(scale, initial, current) {
  return (e) => {
    if (e.touches.length === 1 && scale !== initial.scale) {
      pan = true;
    } else if (e.touches.length === 1 && scale === initial.scale) {
      swipe = true;
    } else if (e.touches.length === 2) {
      pan = false;
      pinch = true;
    }

    const touch = e.touches[0];

    // shift.x = touch.clientX - current.left;
    // shift.y = touch.clientY - current.top;

    cursor.left = touch.clientX;
    cursor.top = touch.clientY;
  };
}

function handlePan(touch, current, loaded, img, preview) {
  /* console.log('shift.x', shift.x);
  console.log('shift.y', shift.y);
  img.style.transform = `translate3d(${touch.clientX - shift.x}px, ${touch.clientY - shift.y}px, 0)`; // eslint-disable-line
  cursor.left = touch.clientX;
  cursor.top = touch.clientY;*/

  const rangeX = touch.clientX - cursor.left;
  const rangeY = touch.clientY - cursor.top;

  let left = 0;
  let top = 0;

  if (rangeX < 0) {
    left = core.moveLeft(rangeX, current.left, current.width, window.innerWidth);
  } else {
    left = core.moveRight(rangeX, current.left, current.width, window.innerWidth);
  }

  if (rangeY < 0) {
    top = core.moveTop(rangeY, current.top, current.height, window.innerHeight - 40, 40);
  } else {
    top = core.moveBottom(rangeY, current.top, current.height, window.innerHeight - 40, 40);
  }

  // main
  if (current.left !== left || current.top !== top) {
    img.style.transform = `translate3d(${left}px, ${top}px, 0)`; // eslint-disable-line
  }

  // preview
  if (!loaded) {
    if (current.left !== left || current.top !== top) {
      preview.style.transform = `translate3d(${left}px, ${top}px, 0)`; // eslint-disable-line
    }
  }

  current.set({ left, top, width: current.width, height: current.height });

  cursor.left = touch.clientX;
  cursor.top = touch.clientY;
}

function handlePinch(touches, initial, current, loaded, img, preview, scale, setScale) {
  const touch1 = touches[0];
  const touch2 = touches[1];

  const minX = Math.min(touch1.clientX, touch2.clientX);
  const minY = Math.min(touch1.clientY, touch2.clientY);

  const clientX = Math.round(minX + (Math.abs(touches[0].clientX - touches[1].clientX) / 2));
  const clientY = Math.round(minY + (Math.abs(touches[0].clientY - touches[1].clientY) / 2));

  const newDistance = Math.sqrt(
    (Math.round(touch1.clientX - touch2.clientX) ** 2) + (Math.round(touch1.clientY - touch2.clientY) ** 2),
  );

  if (!distance || Math.abs(newDistance - distance) > 2) {
    distance = newDistance;
    return;
  }

  const deltaY = newDistance > distance ? -1 : 1;

  distance = newDistance;

  if ((scale === 100.00 && deltaY < 0) || (scale === initial.scale && deltaY > 0)) {
    return;
  }

  const e = { clientX, clientY, deltaY };

  const newCurrent = core.zoom(e, { initial, current }, { zoomFactor: 3 });
  apply(img, newCurrent);

  if (!loaded) {
    apply(preview, newCurrent);
  }

  current.set(newCurrent);
  // setScale(newCurrent.width, initial.naturalWidth);

  // console.log(clientX, clientY);
}

export function handleTouchMove(initial, current, loaded, img, preview, scale, setScale) {
  return (e) => {
    if (pan) {
      handlePan(e.touches[0], current, loaded, img, preview);
      return;
    }
    if (pinch) {
      // console.log('it is pinch!');
      // console.log(e.touches[0].clientX, ' ', e.touches[1].clientX);
      handlePinch(e.touches, initial, current, loaded, img, preview, scale, setScale);
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
    // pan = false;
    swipe = false;
    swipeLeft = false;
    swipeRight = false;
    pinch = false;

    if (pan) {
      pan = false;
      /* current.set({
        left: cursor.left - shift.x,
        top: cursor.top - shift.y,
        width: current.width,
        height: current.height,
      });*/
    }

    if (pinch) {
      pinch = false;
      distance = null;
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
