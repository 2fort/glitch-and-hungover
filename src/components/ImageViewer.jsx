import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { px } from 'csx';
import * as ownActions from './ImageViewer.duck';
import * as css from './ImageViewer.style';

function rPx(string) {
  return Number(string.slice(0, -2));
}

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.cursor = { top: 0, left: 0 };
    this.state = {
      initialScale: '',
      initialWidth: '',
      initialHeight: '',
      currentScale: '',
      initialBox: {},
    };
  }

  scale = () => (this.img.width / this.img.naturalWidth) * 100;

  adjustSize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const imgWidth = this.img.naturalWidth;
    const imgHeight = this.img.naturalHeight;

    if (imgWidth > windowWidth || imgHeight > windowHeight) {
      let scale = (windowWidth / imgWidth);

      if (imgHeight * scale > windowHeight) {
        scale = windowHeight / imgHeight;
      }

      this.img.style.width = px(Math.round(imgWidth * scale));
      this.img.style.height = px(Math.round(imgHeight * scale));
    }

    const xOffset = Math.round((windowWidth - this.img.width) / 2);
    this.img.style.left = px(xOffset);

    const yOffset = Math.round((windowHeight - this.img.height) / 2);
    this.img.style.top = px(yOffset);

    this.img.style.visibility = 'visible';

    this.setState({ initialScale: this.scale().toFixed(2) });
    this.setState({ initialWidth: this.img.width });
    this.setState({ initialHeight: this.img.height });

    const box = this.img.getBoundingClientRect();
    this.setState({ initialBox: box });
  }

  wheel = (e) => {
    const { initialBox } = this.state;

    const currentWidth = rPx(this.img.style.width);
    const currentHeight = rPx(this.img.style.height);
    let newWidth = 0;
    let newHeight = 0;
    const currentLeft = rPx(this.img.style.left);
    const currentTop = rPx(this.img.style.top);

    if (e.deltaY < 0) {
      newWidth = rPx(this.img.style.width) + (Math.round(this.img.naturalWidth / 100) * 4);
      if (newWidth > this.img.naturalWidth) {
        newWidth = this.img.naturalWidth;
      }

      newHeight = rPx(this.img.style.height) + (Math.round(this.img.naturalHeight / 100) * 4);
      if (newHeight > this.img.naturalHeight) {
        newHeight = this.img.naturalHeight;
      }
    } else {
      newWidth = rPx(this.img.style.width) - (Math.round(this.img.naturalWidth / 100) * 4);
      if (newWidth < this.state.initialWidth) {
        newWidth = this.state.initialWidth;
      }

      newHeight = rPx(this.img.style.height) - (Math.round(this.img.naturalHeight / 100) * 4);
      if (newHeight < this.state.initialHeight) {
        newHeight = this.state.initialHeight;
      }
    }

    const newWidthPercent = (newWidth / this.img.width) * 100;
    const newHeightPercent = (newHeight / this.img.height) * 100;

    const leftSide = e.offsetX ? (e.offsetX) : e.pageX - this.img.offsetLeft;
    const topSide = e.offsetY ? (e.offsetY) : e.pageY - this.img.offsetTop;

    const newLeftSide = leftSide - Math.round(leftSide * (newWidthPercent / 100));
    const newTopSide = topSide - Math.round(topSide * (newHeightPercent / 100));

    let newLeft = currentLeft + newLeftSide;
    let newTop = currentTop + newTopSide;

    // sticky top
    if (currentTop <= initialBox.top && newTop >= initialBox.top) {
      newTop = initialBox.top;
    }

    // sticky bottom
    const newboxBot = newHeight + newTop;
    if (currentHeight + currentTop >= initialBox.bottom
      && newHeight + newTop <= initialBox.bottom) {
      newTop += initialBox.bottom - newboxBot;
    }

    // sticky left
    if (currentLeft <= initialBox.left && newLeft >= initialBox.left) {
      newLeft = initialBox.left;
    }

    // sticky right
    const newboxRight = newWidth + newLeft;
    if (currentWidth + currentLeft >= initialBox.right
      && newWidth + newLeft <= initialBox.right) {
      newLeft += initialBox.right - newboxRight;
    }

    this.img.style.width = px(newWidth);
    this.img.style.height = px(newHeight);
    this.img.style.left = px(newLeft);
    this.img.style.top = px(newTop);
    this.setState({ currentScale: this.scale() });
  }

  move = (e) => {
    this.cursor.left = e.pageX;
    this.cursor.top = e.pageY;

    this.img.ondragstart = () => false;

    if (this.scale().toFixed(2) === this.state.initialScale) {
      return;
    }

    document.onmousemove = (event) => {
      const box = this.img.getBoundingClientRect();
      const rangeX = event.pageX - this.cursor.left;
      const rangeY = event.pageY - this.cursor.top;

      if (rangeX < 0) {
        this.moveLeft(event, rangeX, box);
      } else {
        this.moveRight(event, rangeX, box);
      }

      if (rangeY < 0) {
        this.moveTop(event, rangeY, box);
      } else {
        this.moveBottom(event, rangeY, box);
      }

      this.cursor.left = event.pageX;
      this.cursor.top = event.pageY;
    };

    this.img.onmouseup = () => {
      document.onmousemove = null;
      this.img.onmouseup = null;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      this.img.onmouseup = null;
    };
  }

  moveLeft = (e, rangeX, box) => {
    let shiftX = rangeX;
    // left frame border
    let border = 0;
    // how many pixels left from image left border to frame left border?
    let rangeToBorder = 0;

    if (this.img.width > window.innerWidth) {
      border = Math.abs(window.innerWidth - this.img.width);
      rangeToBorder = border + box.left;

      // stopper
      if (rangeToBorder < 0) {
        return;
      }

      // rangeToBorder = 0, then stop
      if (Math.abs(shiftX) >= rangeToBorder) {
        shiftX = -rangeToBorder;
      }
    } else {
      border = Math.round((window.innerWidth - this.img.width) / 2);
      rangeToBorder = box.left - border;

      if (rangeToBorder < 0) {
        return;
      }

      if (Math.abs(shiftX) >= rangeToBorder) {
        shiftX = -rangeToBorder;
      }
    }

    this.img.style.left = px(rPx(this.img.style.left) + shiftX);
  }

  moveRight = (e, rangeX, box) => {
    let shiftX = rangeX;
    let border = 0;
    let rangeToBorder = 0;

    if (this.img.width > window.innerWidth) {
      border = this.img.width;
      rangeToBorder = border - box.right;

      if (rangeToBorder < 0) {
        return;
      }

      if (shiftX >= rangeToBorder) {
        shiftX = rangeToBorder;
      }
    } else {
      border = this.img.width + (Math.round(window.innerWidth - this.img.width) / 2);
      rangeToBorder = border - box.right;

      if (rangeToBorder < 0) {
        return;
      }

      if (shiftX >= rangeToBorder) {
        shiftX = rangeToBorder;
      }
    }

    this.img.style.left = px(rPx(this.img.style.left) + shiftX);
  }

  moveTop = (e, rangeY, box) => {
    let shiftY = rangeY;
    let border = 0;
    let rangeToBorder = 0;

    if (this.img.height > window.innerHeight) {
      border = Math.abs(window.innerHeight - this.img.height);
      rangeToBorder = border + box.top;

      if (rangeToBorder < 0) {
        return;
      }

      if (Math.abs(shiftY) >= rangeToBorder) {
        shiftY = -rangeToBorder;
      }
    } else {
      border = Math.round((window.innerHeight - this.img.height) / 2);
      rangeToBorder = box.top - border;

      if (rangeToBorder < 0) {
        return;
      }

      if (Math.abs(shiftY) >= rangeToBorder) {
        shiftY = -rangeToBorder;
      }
    }

    this.img.style.top = px(rPx(this.img.style.top) + shiftY);
  }

  moveBottom = (e, rangeY, box) => {
    let shiftY = rangeY;
    let border = 0;
    let rangeToBorder = 0;

    if (this.img.height > window.innerHeight) {
      border = this.img.height;
      rangeToBorder = border - box.bottom;

      if (rangeToBorder < 0) {
        return;
      }

      if (shiftY >= rangeToBorder) {
        shiftY = rangeToBorder;
      }
    } else {
      border = this.img.height + (Math.round(window.innerHeight - this.img.height) / 2);
      rangeToBorder = border - box.bottom;

      // stopper
      if (rangeToBorder < 0) {
        return;
      }

      if (shiftY >= rangeToBorder) {
        shiftY = rangeToBorder;
      }
    }

    this.img.style.top = px(rPx(this.img.style.top) + shiftY);
  }

  render() {
    const { currentImg } = this.props;
    const { initialScale } = this.state;
    let scale = 0;

    if (!currentImg) {
      return null;
    }

    if (this.img) {
      scale = this.scale().toFixed(2);
    }

    document.body.classList.add('noscroll');

    return (
      <div className={css.overlay}>
        <div style={{ position: 'absolute', color: 'red', zIndex: 100550 }}>
          {initialScale}, {scale},
        </div>
        <img
          className={css.fullimg}
          alt={currentImg}
          key={currentImg}
          src={`/img/m/${currentImg}`}
          ref={(img) => { this.img = img; }}
          onLoad={this.adjustSize}
          onWheel={this.wheel}
          onMouseDown={this.move}
        />
      </div>
    );
  }
}

function mapStateToProps({ imageViewer }) {
  return { ...imageViewer };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
  };
}

ImageViewer.propTypes = {
  currentImg: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
