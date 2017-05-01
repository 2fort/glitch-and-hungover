import * as core from './core';

const initialWindow = { width: window.innerWidth, height: window.innerHeight };
let resizeDebounce;

function getInitialValues({ width, height, naturalWidth, naturalHeight, left, top, scale }) {
  return {
    scale,
    box: {
      top,
      left,
      right: left + width,
      bottom: top + height,
    },
    width,
    height,
    naturalWidth,
    naturalHeight,
  };
}

export function adjustByWidth(initial, current) {
  if (initial.scale < 1 && current.width !== window.innerWidth) {
    let zoom = window.innerWidth / initial.naturalWidth;

    if (zoom > 1) {
      zoom = 1;
    }

    const params = core.zoom({ clientX: 0, clientY: 0 }, { initial, current }, { zoom });

    const viewportCenter = window.innerWidth / 2;
    const imageCenterLeft = params.left + (params.width / 2);
    params.left += viewportCenter - imageCenterLeft;

    return params;
  }

  return current;
}

function init(img, apply, setInitialValues) {
  let params = core.adjust(
    { width: img.naturalWidth, height: img.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  const initial = getInitialValues({ ...params, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });

  const byWidth = false;

  if (byWidth) {
    params = adjustByWidth(initial, params, apply);
  }

  apply(params);

  setInitialValues(initial);
}

function reload(initial, setInitialValues) {
  const params = core.adjust(
    { width: initial.naturalWidth, height: initial.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  const newInitial = getInitialValues({
    ...params,
    naturalWidth: initial.naturalWidth,
    naturalHeight: initial.naturalHeight,
  });

  setInitialValues(newInitial);
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
