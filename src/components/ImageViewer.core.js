export function adjust(img, viewportWidth, viewportHeight, offsetY) {
  const newImg = {
    width: img.width,
    height: img.height,
    left: 0,
    top: 0,
  };

  if (img.width > viewportWidth || img.height > viewportHeight) {
    let scale = viewportWidth / img.width;

    if (img.height * scale > viewportHeight) {
      scale = viewportHeight / img.height;
    }

    newImg.width = Math.round(img.width * scale);
    newImg.height = Math.round(img.height * scale);
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
  };

  newImg.width = (() => {
    let width = 0;

    if (options.max) return img.naturalWidth;
    if (options.min) return img.initialWidth;

    if (e.deltaY < 0) {
      width = img.currentWidth + (Math.round(img.naturalWidth / 100) * options.zoomFactor);
      if (width > img.naturalWidth) {
        return img.naturalWidth;
      }
    } else {
      width = img.currentWidth - (Math.round(img.naturalWidth / 100) * options.zoomFactor);
      if (width < img.initialWidth) {
        return img.initialWidth;
      }
    }

    return width;
  })();

  newImg.height = (() => {
    let height = 0;

    if (options.max) return img.naturalHeight;
    if (options.min) return img.initialHeight;

    if (e.deltaY < 0) {
      height = img.currentHeight + (Math.round(img.naturalHeight / 100) * options.zoomFactor);
      if (height > img.naturalHeight) {
        return img.naturalHeight;
      }
    } else {
      height = img.currentHeight - (Math.round(img.naturalHeight / 100) * options.zoomFactor);
      if (height < img.initialHeight) {
        return img.initialHeight;
      }
    }

    return height;
  })();

  const newWidthPercent = (newImg.width / img.currentWidth) * 100;
  const newHeightPercent = (newImg.height / img.currentHeight) * 100;

  const leftSide = e.clientX - img.currentLeft;
  const topSide = e.clientY - img.currentTop;

  const newLeftSide = leftSide - Math.round(leftSide * (newWidthPercent / 100));
  const newTopSide = topSide - Math.round(topSide * (newHeightPercent / 100));

  newImg.left = (() => {
    const left = img.currentLeft + newLeftSide;

    // sticky left
    if (img.currentLeft <= img.initialBox.left && left >= img.initialBox.left) {
      return img.initialBox.left;
    }

    // sticky right
    const newboxRight = newImg.width + left;
    if (img.currentWidth + img.currentLeft >= img.initialBox.right
      && newImg.width + left <= img.initialBox.right) {
      return left + (img.initialBox.right - newboxRight);
    }

    return left;
  })();

  newImg.top = (() => {
    const top = img.currentTop + newTopSide;

    // sticky top
    if (img.currentTop <= img.initialBox.top && top >= img.initialBox.top) {
      return img.initialBox.top;
    }

    // sticky bottom
    const newboxBot = newImg.height + top;
    if (img.currentHeight + img.currentTop >= img.initialBox.bottom
      && newImg.height + top <= img.initialBox.bottom) {
      return top + (img.initialBox.bottom - newboxBot);
    }

    return top;
  })();

  return newImg;
}

export function moveLeft(rangeX, boxLeft, currentLeft, imgWidth, viewportWidth) {
  let shiftX = rangeX;
  // left frame border
  let border = 0;
  // how many pixels left from image left border to frame left border?
  let rangeToBorder = 0;

  if (imgWidth > viewportWidth) {
    border = Math.abs(viewportWidth - imgWidth);
    rangeToBorder = border + boxLeft;

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
    rangeToBorder = boxLeft - border;

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (Math.abs(shiftX) >= rangeToBorder) {
      shiftX = -rangeToBorder;
    }
  }

  return currentLeft + shiftX;
}

export function moveRight(rangeX, boxRight, currentLeft, imgWidth, viewportWidth) {
  let shiftX = rangeX;
  let border = 0;
  let rangeToBorder = 0;

  if (imgWidth > viewportWidth) {
    border = imgWidth;
    rangeToBorder = border - boxRight;

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (shiftX >= rangeToBorder) {
      shiftX = rangeToBorder;
    }
  } else {
    border = imgWidth + (Math.round(viewportWidth - imgWidth) / 2);
    rangeToBorder = border - boxRight;

    if (rangeToBorder < 0) {
      return currentLeft;
    }

    if (shiftX >= rangeToBorder) {
      shiftX = rangeToBorder;
    }
  }

  return currentLeft + shiftX;
}

export function moveTop(rangeY, boxTop, currentTop, imgHeight, viewportHeight, offsetY) {
  let shiftY = rangeY;
  let border = 0;
  let rangeToBorder = 0;

  if (imgHeight > viewportHeight) {
    border = Math.abs(viewportHeight - imgHeight) - offsetY;
    rangeToBorder = border + boxTop;

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (Math.abs(shiftY) >= rangeToBorder) {
      shiftY = -rangeToBorder;
    }
  } else {
    border = Math.round((viewportHeight - imgHeight) / 2) - offsetY;
    rangeToBorder = boxTop - border;

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (Math.abs(shiftY) >= rangeToBorder) {
      shiftY = -rangeToBorder;
    }
  }

  return currentTop + shiftY;
}

export function moveBottom(rangeY, boxBottom, currentTop, imgHeight, viewportHeight, offsetY) {
  let shiftY = rangeY;
  let border = 0;
  let rangeToBorder = 0;

  if (imgHeight > viewportHeight) {
    border = imgHeight + offsetY;
    rangeToBorder = border - boxBottom;

    if (rangeToBorder < 0) {
      return currentTop;
    }

    if (shiftY >= rangeToBorder) {
      shiftY = rangeToBorder;
    }
  } else {
    border = imgHeight + (Math.round(viewportHeight - imgHeight) / 2) + offsetY;
    rangeToBorder = border - boxBottom;

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
