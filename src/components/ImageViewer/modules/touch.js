import * as core from './core';

export function onTouchStart(e) {
  // console.log('onTouchStart', e.touches[0]);
  // console.loog(e.touches[0].length);
  /* if (e.touches.length === 1 && this.props.scale !== this.props.initial.scale) {
    console.log('It is pan!');
  } else if (e.touches.length === 1 && this.props.scale === this.props.initial.scale) {
    console.log('it is a swipe!');
  } else if (e.touches.length === 2) {
    console.log('It is pinch!');
  }*/
  const touch = e.touches[0];
  this.cursor.left = touch.clientX;
  this.cursor.top = touch.clientY;
}

export function onTouchMove(e) {
  console.log('onTouchMove', e.touches[0]);

  /* if (e.touches.length === 1 && this.props.scale !== this.props.initial.scale) {
    console.log('It is pan!');
    this.onMouseMove(e.touches[0]);
    return;
  }

  if (e.touches.length === 1 && this.props.scale === this.props.initial.scale) {
    if (e.touches[0].clientX - this.cursor.left < 0) {
      console.log('It is left swipe!');
      this.swipeLeftActive = true;
      this.swipeLeft(e.touches[0]);
    }

    if (e.touches[0].clientX - this.cursor.left > 0) {
      console.log('It is right swipe!');
      this.swipeRight(e.touches[0]);
    }
  } */
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

export function onTouchEnd(e) {
  /* if (this.swipeLeftActive) {
    this.swipeLeftActive = false;

    const currentLeft = this.current.left;
    const currentTop = this.current.top;

    window.setTimeout(() => {
      this.img.style.transition = 'all 300ms linear';
      this.img.style.transform = `translate3d(${currentLeft}px, ${currentTop}px, 0)`;
    }, 50);
  }*/
  console.log('onTouchEnd', e.touches[0]);
}
