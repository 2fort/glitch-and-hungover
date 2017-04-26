export function adjust(img, viewportWidth, viewportHeight, offsetY) {
  const newImg = {
    width: img.width,
    height: img.height,
    left: 0,
    top: 0,
    scale: 0,
  };

  if (img.width > viewportWidth || img.height > viewportHeight) {
    newImg.scale = viewportWidth / img.width;

    if (img.height * newImg.scale > viewportHeight) {
      newImg.scale = viewportHeight / img.height;
    }

    newImg.width = Math.round(img.width * newImg.scale);
    newImg.height = Math.round(img.height * newImg.scale);
  }

  newImg.left = Math.round((viewportWidth - newImg.width) / 2);
  newImg.top = Math.round((viewportHeight - newImg.height) / 2) + offsetY;

  return newImg;
}

export function zoom(e, img, newOptions) {
  const options = {
    zoomFactor: 4,
    min: false,
    max: false,
    ...newOptions,
  };

  const newImg = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    scale: 0,
  };

  newImg.width = (() => {
    let width = 0;

    if (options.max) return img.initial.naturalWidth;
    if (options.min) return img.initial.width;

    if (e.deltaY < 0) {
      width = img.current.width + (Math.round(img.initial.naturalWidth / 100) * options.zoomFactor);
      if (width > img.initial.naturalWidth) {
        return img.initial.naturalWidth;
      }
    } else {
      width = img.current.width - (Math.round(img.initial.naturalWidth / 100) * options.zoomFactor);
      if (width < img.initial.width) {
        return img.initial.width;
      }
    }

    return width;
  })();

  newImg.height = (() => {
    let height = 0;

    if (options.max) return img.initial.naturalHeight;
    if (options.min) return img.initial.height;

    if (e.deltaY < 0) {
      height = img.current.height + (Math.round(img.initial.naturalHeight / 100) * options.zoomFactor);
      if (height > img.initial.naturalHeight) {
        return img.initial.naturalHeight;
      }
    } else {
      height = img.current.height - (Math.round(img.initial.naturalHeight / 100) * options.zoomFactor);
      if (height < img.initial.height) {
        return img.initial.height;
      }
    }

    return height;
  })();

  newImg.scale = (() => {
    let scale = 0;

    if (options.max) return 1;
    if (options.min) return img.initial.scale;

    if (e.deltaY < 0) {
      scale = Number(img.current.scale) + (options.zoomFactor / 100);
    } else {
      scale = Number(img.current.scale) - (options.zoomFactor / 100);
    }

    if (scale > 1) {
      return 1;
    }

    if (scale < img.initial.scale) {
      return img.initial.scale;
    }

    return scale;
  })();

  const newWidthPercent = (newImg.width / img.current.width) * 100;
  const newHeightPercent = (newImg.height / img.current.height) * 100;

  const leftSide = e.clientX - img.current.left;
  const topSide = e.clientY - img.current.top;

  const newLeftSide = leftSide - Math.round(leftSide * (newWidthPercent / 100));
  const newTopSide = topSide - Math.round(topSide * (newHeightPercent / 100));

  newImg.left = (() => {
    if (options.min) return img.initial.box.left;

    const left = img.current.left + newLeftSide;

    // sticky left
    if (img.current.left <= img.initial.box.left && left >= img.initial.box.left) {
      return img.initial.box.left;
    }

    // sticky right
    const newboxRight = newImg.width + left;
    if (img.current.width + img.current.left >= img.initial.box.right
      && newImg.width + left <= img.initial.box.right) {
      return left + (img.initial.box.right - newboxRight);
    }

    return left;
  })();

  newImg.top = (() => {
    if (options.min) return img.initial.box.top;

    const top = img.current.top + newTopSide;

    // sticky top
    if (img.current.top <= img.initial.box.top && top >= img.initial.box.top) {
      return img.initial.box.top;
    }

    // sticky bottom
    const newboxBot = newImg.height + top;
    if (img.current.height + img.current.top >= img.initial.box.bottom
      && newImg.height + top <= img.initial.box.bottom) {
      return top + (img.initial.box.bottom - newboxBot);
    }

    return top;
  })();

  return newImg;
}

export function moveLeft(rangeX, currentLeft, imgWidth, viewportWidth) {
  let shiftX = rangeX;
  // left frame border
  let border = 0;
  // how many pixels left from image left border to frame left border?
  let rangeToBorder = 0;

  if (imgWidth > viewportWidth) {
    border = Math.abs(viewportWidth - imgWidth);
    rangeToBorder = border + currentLeft;

    // stopper
    if (rangeToBorder < 0) {
      return currentLeft;
    }

    // rangeToBorder = 0, then stop
    if (Math.abs(shiftX) >= rangeToBorder) {
      shiftX = -rangeToBorder;
    }
  } else {
    border = Math.round((viewportWidth - imgWidth) / 2);
    rangeToBorder = currentLeft - border;

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (Math.abs(shiftX) >= rangeToBorder) {
      shiftX = -rangeToBorder;
    }
  }

  return currentLeft + shiftX;
}

export function moveRight(rangeX, currentLeft, imgWidth, viewportWidth) {
  let shiftX = rangeX;
  let border = 0;
  let rangeToBorder = 0;

  if (imgWidth > viewportWidth) {
    border = imgWidth;
    rangeToBorder = border - (currentLeft + imgWidth);

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (shiftX >= rangeToBorder) {
      shiftX = rangeToBorder;
    }
  } else {
    border = imgWidth + (Math.round(viewportWidth - imgWidth) / 2);
    rangeToBorder = border - (currentLeft + imgWidth);

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (shiftX >= rangeToBorder) {
      shiftX = rangeToBorder;
    }
  }

  return currentLeft + shiftX;
}

export function moveTop(rangeY, currentTop, imgHeight, viewportHeight, offsetY) {
  let shiftY = rangeY;
  let border = 0;
  let rangeToBorder = 0;

  if (imgHeight > viewportHeight) {
    border = Math.abs(viewportHeight - imgHeight) - offsetY;
    rangeToBorder = border + currentTop;

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (Math.abs(shiftY) >= rangeToBorder) {
      shiftY = -rangeToBorder;
    }
  } else {
    border = Math.round((viewportHeight - imgHeight) / 2) - offsetY;
    rangeToBorder = currentTop - border;

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (Math.abs(shiftY) >= rangeToBorder) {
      shiftY = -rangeToBorder;
    }
  }

  return currentTop + shiftY;
}

export function moveBottom(rangeY, currentTop, imgHeight, viewportHeight, offsetY) {
  let shiftY = rangeY;
  let border = 0;
  let rangeToBorder = 0;

  if (imgHeight > viewportHeight) {
    border = imgHeight + offsetY;
    rangeToBorder = border - (currentTop + imgHeight);

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (shiftY >= rangeToBorder) {
      shiftY = rangeToBorder;
    }
  } else {
    border = imgHeight + (Math.round(viewportHeight - imgHeight) / 2) + offsetY;
    rangeToBorder = border - (currentTop + imgHeight);

    // stopper
    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (shiftY >= rangeToBorder) {
      shiftY = rangeToBorder;
    }
  }

  return currentTop + shiftY;
}
