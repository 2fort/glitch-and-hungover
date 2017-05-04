export function adjust(naturalWidth, naturalHeight, viewportWidth, viewportHeight, offsetY) {
  const newImg = {
    width: naturalWidth,
    height: naturalHeight,
    left: 0,
    top: 0,
    scale: 1,
  };

  if (naturalWidth > viewportWidth || naturalHeight > viewportHeight) {
    newImg.scale = viewportWidth / naturalWidth;

    if (naturalHeight * newImg.scale > viewportHeight) {
      newImg.scale = viewportHeight / naturalHeight;
    }

    newImg.width = naturalWidth * newImg.scale;
    newImg.height = naturalHeight * newImg.scale;
  }

  newImg.left = (viewportWidth - newImg.width) / 2;
  newImg.top = ((viewportHeight - newImg.height) / 2) + offsetY;

  return newImg;
}

export function zoom({ deltaY, clientX, clientY }, initial, current, newOptions) {
  const options = {
    zoomFactor: 4,
    min: false,
    max: false,
    zoom: null,
    ...newOptions,
  };

  const newImg = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    scale: 0,
  };

  if (options.zoom && options.zoom > 1) {
    options.zoom = 1;
  } else if (options.zoom && options.zoom < initial.scale) {
    options.zoom = initial.scale;
  }

  newImg.width = (() => {
    let width = 0;

    if (options.max) return initial.naturalWidth;
    if (options.min) return initial.width;
    if (options.zoom) return initial.naturalWidth * options.zoom;

    if (deltaY < 0) {
      width = current.width + ((initial.naturalWidth / 100) * options.zoomFactor);
      if (width > initial.naturalWidth) {
        return initial.naturalWidth;
      }
    } else {
      width = current.width - ((initial.naturalWidth / 100) * options.zoomFactor);
      if (width < initial.width) {
        return initial.width;
      }
    }

    return width;
  })();

  newImg.height = (() => {
    let height = 0;

    if (options.max) return initial.naturalHeight;
    if (options.min) return initial.height;
    if (options.zoom) return initial.naturalHeight * options.zoom;

    if (deltaY < 0) {
      height = current.height + ((initial.naturalHeight / 100) * options.zoomFactor);
      if (height > initial.naturalHeight) {
        return initial.naturalHeight;
      }
    } else {
      height = current.height - ((initial.naturalHeight / 100) * options.zoomFactor);
      if (height < initial.height) {
        return initial.height;
      }
    }

    return height;
  })();

  newImg.scale = (() => {
    let scale = 0;

    if (options.max) return 1;
    if (options.min) return initial.scale;
    if (options.zoom) return options.zoom;

    if (deltaY < 0) {
      scale = Number(current.scale) + (options.zoomFactor / 100);
    } else {
      scale = Number(current.scale) - (options.zoomFactor / 100);
    }

    if (scale > 1) {
      return 1;
    }

    if (scale < initial.scale) {
      return initial.scale;
    }

    return scale;
  })();

  const newWidthPercent = (newImg.width / current.width) * 100;
  const newHeightPercent = (newImg.height / current.height) * 100;

  const leftSide = clientX - current.left;
  const topSide = clientY - current.top;

  const newLeftSide = leftSide - (leftSide * (newWidthPercent / 100));
  const newTopSide = topSide - (topSide * (newHeightPercent / 100));

  newImg.left = (() => {
    if (options.min) return initial.box.left;

    const left = current.left + newLeftSide;

    // sticky left
    if (Math.round(current.left) <= Math.round(initial.box.left)
      && Math.round(left) >= Math.round(initial.box.left)) {
      return initial.box.left;
    }

    // sticky right
    const newboxRight = newImg.width + left;
    if (Math.round(current.width + current.left) >= Math.round(initial.box.right)
      && Math.round(newImg.width + left) <= Math.round(initial.box.right)) {
      return left + (initial.box.right - newboxRight);
    }

    return left;
  })();

  newImg.top = (() => {
    if (options.min) return initial.box.top;

    const top = current.top + newTopSide;

    // sticky top
    if (Math.round(current.top) <= Math.round(initial.box.top)
      && Math.round(top) >= Math.round(initial.box.top)) {
      return initial.box.top;
    }

    // sticky bottom
    const newboxBot = newImg.height + top;
    if (Math.round(current.height + current.top) >= Math.round(initial.box.bottom)
      && Math.round(newImg.height + top) <= Math.round(initial.box.bottom)) {
      return top + (initial.box.bottom - newboxBot);
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
    border = (viewportWidth - imgWidth) / 2;
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
    border = imgWidth + ((viewportWidth - imgWidth) / 2);
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
    border = ((viewportHeight - imgHeight) / 2) + offsetY;
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
    border = imgHeight + ((viewportHeight - imgHeight) / 2) + offsetY;
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
