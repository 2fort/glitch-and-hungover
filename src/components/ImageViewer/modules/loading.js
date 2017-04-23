import * as core from './core';

function apply(elem, newCurrent) {
  elem.style.width = `${newCurrent.width}px`; // eslint-disable-line
  elem.style.height = `${newCurrent.height}px`; // eslint-disable-line
  elem.style.transform = `translate3d(${newCurrent.left}px, ${newCurrent.top}px, 0)`; // eslint-disable-line
  elem.style.visibility = 'visible'; // eslint-disable-line
}

function init(img, preview, current, loaded) {
  const newCurrent = core.adjust(
    { width: img.naturalWidth, height: img.naturalHeight },
    window.innerWidth,
    window.innerHeight - 40,
    40,
  );

  current.set(newCurrent);

  apply(img, newCurrent);

  if (!loaded) {
    apply(preview, newCurrent);
  }
}

export default function load(img, preview, current, setInitialValues, loaded) {
  const wait = setInterval(() => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (w && h) {
      clearInterval(wait);
      init(img, preview, current, loaded);
      setInitialValues(img);
    }
  }, 30);
}
