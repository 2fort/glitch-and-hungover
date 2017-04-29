import * as core from './core';

const initialWindow = { width: window.innerWidth, height: window.innerHeight };
let resizeDebounce;

function init(img, apply, setInitialValues) {
  const params = core.adjust(
    { width: img.naturalWidth, height: img.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  apply(params);
  setInitialValues({ ...params, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
}

function reload(initial, setInitialValues) {
  const params = core.adjust(
    { width: initial.naturalWidth, height: initial.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  setInitialValues({ ...params, naturalWidth: initial.naturalWidth, naturalHeight: initial.naturalHeight });
}

export function load(img, apply, setInitialValues, activate) {
  if (img.naturalWidth && img.naturalHeight) {
    init(img, apply, setInitialValues);
    activate();
  } else {
    const wait = setInterval(() => {
      if (img.naturalWidth && img.naturalHeight) {
        clearInterval(wait);
        init(img, apply, setInitialValues);
        activate();
      }
    }, 30);
  }
}

export function handleResizeWindow(getProps) {
  return () => {
    clearTimeout(resizeDebounce);

    resizeDebounce = setTimeout(() => {
      const { initial, current, apply, setInitialValues } = getProps();

      const differenceX = Math.abs(window.innerWidth - initialWindow.width);
      const differenceY = Math.abs(window.innerHeight - initialWindow.height);

      if (current.scale === initial.scale || differenceX > 80 || differenceY > 80) {
        const img = { naturalWidth: initial.naturalWidth, naturalHeight: initial.naturalHeight };
        init(img, apply, setInitialValues);
      } else {
        reload(initial, setInitialValues);
      }

      initialWindow.width = window.innerWidth;
      initialWindow.height = window.innerHeight;
    }, 150);
  };
}
