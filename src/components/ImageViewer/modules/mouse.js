import * as core from './core';

const cursor = { left: 0, top: 0 };
let move = false;

export function handleWheel(initial, current, apply) {
  return (e) => {
    if ((current.scale === 1 && e.deltaY < 0) || (current.scale === initial.scale && e.deltaY > 0)) {
      return;
    }

    apply(core.zoom(e, initial, current));
  };
}

export function handleDoubleClick(initial, current, apply) {
  return (e) => {
    const params = (() => {
      if (current.scale === 1) {
        return core.zoom(e, initial, current, { min: true });
      }

      return core.zoom(e, initial, current, { max: true });
    })();

    apply(params);
  };
}

export function handleMouseDown(initial, current) {
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

export function handleMouseMove(initial, current, apply) {
  return (event) => {
    if (!move) return;

    const rangeX = event.clientX - cursor.left;
    const rangeY = event.clientY - cursor.top;

    const left = rangeX < 0
      ? core.moveLeft(rangeX, current.left, current.width, window.innerWidth)
      : core.moveRight(rangeX, current.left, current.width, window.innerWidth);

    const top = rangeY < 0
      ? core.moveTop(rangeY, current.top, current.height, window.innerHeight - 40, 40)
      : core.moveBottom(rangeY, current.top, current.height, window.innerHeight - 40, 40);

    apply({ left, top });

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
