import * as core from './core';

const initialWindow = { width: window.innerWidth, height: window.innerHeight };
let resizeDebounce;

export function load(img, apply, setInitialValues, activate) {
  function init() {
    const params = core.adjust(
      { width: img.naturalWidth, height: img.naturalHeight },
      window.innerWidth,
      window.innerHeight - 40,
      40,
    );

    apply(params);
    activate();
    setInitialValues({ ...params, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
  }

  if (img.naturalWidth && img.naturalHeight) {
    init();
  } else {
    const wait = setInterval(() => {
      if (img.naturalWidth && img.naturalHeight) {
        clearInterval(wait);
        init();
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
