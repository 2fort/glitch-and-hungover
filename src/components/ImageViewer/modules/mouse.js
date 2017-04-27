import * as core from './core';

const cursor = {
  left: 0,
  top: 0,
};

let move = false;

function apply(elem, initial, newCurrent) {
  elem.style.transform = `translate(${newCurrent.left}px, ${newCurrent.top}px) scale(${newCurrent.scale})`; // eslint-disable-line
}

export function handleWheel(scale, initial, current, setScale, preview, loaded) {
  return (e) => {
    if ((current.scale === 1 && e.deltaY < 0) || (current.scale === initial.scale && e.deltaY > 0)) {
      return;
    }

    const newCurrent = core.zoom(e, { initial, current });
    apply(e.target, initial, newCurrent);

    if (!loaded) {
      apply(preview, initial, newCurrent);
    }

    current.set(newCurrent);
    // setScale(newCurrent.width, initial.naturalWidth);
  };
}

export function handleDoubleClick(scale, initial, current, setScale, preview, loaded) {
  return (e) => {
    const newCurrent = (() => {
      if (current.scale === 1) {
        return core.zoom(e, { initial, current }, { min: true });
      }

      return core.zoom(e, { initial, current }, { max: true });
    })();

    apply(e.target, initial, newCurrent);

    if (!loaded) {
      apply(preview, initial, newCurrent);
    }

    current.set(newCurrent);
    // setScale(newCurrent.width, initial.naturalWidth);
  };
}

export function handleMouseDown(scale, initial, current) {
  return (e) => {
    cursor.left = e.clientX;
    cursor.top = e.clientY;

    const img = e.target;

    img.ondragstart = () => false;

    if (current.scale === initial.scale) {
      return;
    }

    img.style.cursor = 'move';
    move = true;
  };
}

export function handleMouseMove(img, initial, current, preview, loaded) {
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

    const newCurrent = {
      top,
      left,
      width: current.width,
      height: current.height,
      scale: current.scale,
    };

    // main
    if (current.left !== left || current.top !== top) {
      apply(img, initial, newCurrent);
    }

    // preview
    if (!loaded) {
      if (current.left !== left || current.top !== top) {
        apply(preview, initial, newCurrent);
      }
    }

    current.set({ left, top, width: current.width, height: current.height, scale: current.scale });

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
