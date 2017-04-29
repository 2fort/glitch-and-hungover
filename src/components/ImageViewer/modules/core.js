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

    newImg.width = img.width * newImg.scale;
    newImg.height = img.height * newImg.scale;
  }

  newImg.left = (viewportWidth - newImg.width) / 2;
  newImg.top = ((viewportHeight - newImg.height) / 2) + offsetY;

  return newImg;
}

export function zoom(e, img, newOptions) {
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
  } else if (options.zoom && options.zoom < img.initial.scale) {
    options.zoom = img.initial.scale;
  }

  newImg.width = (() => {
    let width = 0;

    if (options.max) return img.initial.naturalWidth;
    if (options.min) return img.initial.width;
    if (options.zoom) return img.initial.naturalWidth * options.zoom;

    if (e.deltaY < 0) {
      width = img.current.width + ((img.initial.naturalWidth / 100) * options.zoomFactor);
      if (width > img.initial.naturalWidth) {
        return img.initial.naturalWidth;
      }
    } else {
      width = img.current.width - ((img.initial.naturalWidth / 100) * options.zoomFactor);
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
    if (options.zoom) return img.initial.naturalHeight * options.zoom;

    if (e.deltaY < 0) {
      height = img.current.height + ((img.initial.naturalHeight / 100) * options.zoomFactor);
      if (height > img.initial.naturalHeight) {
        return img.initial.naturalHeight;
      }
    } else {
      height = img.current.height - ((img.initial.naturalHeight / 100) * options.zoomFactor);
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
    if (options.zoom) return options.zoom;

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

  const newLeftSide = leftSide - (leftSide * (newWidthPercent / 100));
  const newTopSide = topSide - (topSide * (newHeightPercent / 100));

  newImg.left = (() => {
    if (options.min) return img.initial.box.left;

    const left = img.current.left + newLeftSide;

    // sticky left
    if (Math.round(img.current.left) <= Math.round(img.initial.box.left)
      && Math.round(left) >= Math.round(img.initial.box.left)) {
      return img.initial.box.left;
    }

    // sticky right
    const newboxRight = newImg.width + left;
    if (Math.round(img.current.width + img.current.left) >= Math.round(img.initial.box.right)
      && Math.round(newImg.width + left) <= Math.round(img.initial.box.right)) {
      return left + (img.initial.box.right - newboxRight);
    }

    return left;
  })();

  newImg.top = (() => {
    if (options.min) return img.initial.box.top;

    const top = img.current.top + newTopSide;

    // sticky top
    if (Math.round(img.current.top) <= Math.round(img.initial.box.top)
      && Math.round(top) >= Math.round(img.initial.box.top)) {
      return img.initial.box.top;
    }

    // sticky bottom
    const newboxBot = newImg.height + top;
    if (Math.round(img.current.height + img.current.top) >= Math.round(img.initial.box.bottom)
      && Math.round(newImg.height + top) <= Math.round(img.initial.box.bottom)) {
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
