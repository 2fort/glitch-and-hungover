import * as core from './core';

const initialWindow = { width: window.innerWidth, height: window.innerHeight };
let resizeDebounce;

function apply(elem, initial, newCurrent) {
  if (elem.style.visibility !== 'hidden') {
    elem.style.transform = `translate(${newCurrent.left}px, ${newCurrent.top}px) scale(${newCurrent.scale})`; // eslint-disable-line
    elem.style.visibility = 'visible'; // eslint-disable-line
  }
}

function init(img, preview, current, setInitialValues, setScale) {
  const newCurrent = core.adjust(
    { width: img.naturalWidth, height: img.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  current.set(newCurrent);

  const initial = {
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  };

  apply(img, initial, newCurrent);
  apply(preview, initial, newCurrent);

  setInitialValues({ ...newCurrent, ...initial });
  setScale(newCurrent.width, img.naturalWidth);
}

export function load(img, preview, current, setInitialValues, setScale, loaded) {
  function setInitial() {
    init(img, preview, current, setInitialValues, setScale);
  }

  if (loaded) {
    setInitial();
  } else {
    const wait = setInterval(() => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w && h) {
        clearInterval(wait);
        setInitial();
      }
    }, 30);
  }
}

export function reload(initial, setInitialValues) {
  const newCurrent = core.adjust(
    { width: initial.naturalWidth, height: initial.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  setInitialValues({
    ...newCurrent,
    naturalWidth: initial.naturalWidth,
    naturalHeight: initial.naturalHeight,
    scale: initial.scale,
  });
}

export function handleResizeWindow(getProps) {
  return () => {
    clearTimeout(resizeDebounce);

    resizeDebounce = setTimeout(() => {
      const { props, img, preview, current } = getProps();

      const differenceX = Math.abs(window.innerWidth - initialWindow.width);
      const differenceY = Math.abs(window.innerHeight - initialWindow.height);

      if (props.scale === props.initial.scale || differenceX > 80 || differenceY > 80) {
        load(img, preview, current, props.actions.setInitialValues, props.actions.setScale, props.loaded);
      } else {
        reload(props.initial, props.actions.setInitialValues);
      }

      initialWindow.width = window.innerWidth;
      initialWindow.height = window.innerHeight;
    }, 150);
  };
}
