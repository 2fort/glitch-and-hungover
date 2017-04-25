import * as core from './core';

const cursor = {
  left: 0,
  top: 0,
};

let move = false;

function apply(elem, newCurrent) {
  elem.style.width = `${newCurrent.width}px`; // eslint-disable-line
  elem.style.height = `${newCurrent.height}px`; // eslint-disable-line
  elem.style.transform = `translate3d(${newCurrent.left}px, ${newCurrent.top}px, 0)`; // eslint-disable-line
}

export function handleWheel(scale, initial, current, setScale, preview, loaded) {
  return (e) => {
    if ((scale === 100.00 && e.deltaY < 0) || (scale === initial.scale && e.deltaY > 0)) {
      return;
    }

    const newCurrent = core.zoom(e, { initial, current });
    apply(e.target, newCurrent);

    if (!loaded) {
      apply(preview, newCurrent);
    }

    current.set(newCurrent);
    setScale(newCurrent.width, initial.naturalWidth);
  };
}

export function handleDoubleClick(scale, initial, current, setScale, preview, loaded) {
  return (e) => {
    const newCurrent = (() => {
      if (scale === 100.00) {
        return core.zoom(e, { initial, current }, { min: true });
      }

      return core.zoom(e, { initial, current }, { max: true });
    })();

    apply(e.target, newCurrent);

    if (!loaded) {
      apply(preview, newCurrent);
    }

    current.set(newCurrent);
    setScale(newCurrent.width, initial.naturalWidth);
  };
}

export function handleMouseDown(scale, initial) {
  return (e) => {
    cursor.left = e.clientX;
    cursor.top = e.clientY;

    const img = e.target;

    img.ondragstart = () => false;

    if (scale === initial.scale) {
      return;
    }

    img.style.cursor = 'move';
    move = true;
  };
}

export function handleMouseMove(img, current, preview, loaded) {
  return (event) => {
    if (!move) return;

    const rangeX = event.clientX - cursor.left;
    const rangeY = event.clientY - cursor.top;

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

    cursor.left = event.clientX;
    cursor.top = event.clientY;
  };
}

export function handleMouseUp(img) {
  return () => {
    if (move) {
      move = false;
      img.style.cursor = 'default'; // eslint-disable-line
    }
  };
}
