import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { px } from 'csx';
import * as ownActions from './ImageViewer.duck';
import * as css from './ImageViewer.style';
import * as core from './ImageViewer.core';

function rPx(string) {
  return Number(string.slice(0, -2));
}

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.cursor = { top: 0, left: 0 };
    this.state = { rnd: Math.floor(Math.random() * (2000 - 1000)) + 1000 };
    document.body.classList.add('noscroll');
  }

  componentDidMount() {
    const wait = setInterval(() => {
      const w = this.img.naturalWidth;
      const h = this.img.naturalHeight;
      if (w && h) {
        clearInterval(wait);
        this.imgInit();
      }
    }, 30);
  }

  onWheel = (e) => {
    const img = {
      initialBox: this.props.initial.box,
      initialWidth: this.props.initial.width,
      initialHeight: this.props.initial.height,
      naturalWidth: this.img.naturalWidth,
      naturalHeight: this.img.naturalHeight,
      currentWidth: this.img.width,
      currentHeight: this.img.height,
      currentLeft: rPx(this.img.style.left),
      currentTop: rPx(this.img.style.top),
    };

    const newImg = core.zoom(e, img);

    // main
    this.img.style.width = px(newImg.width);
    this.img.style.height = px(newImg.height);
    this.img.style.left = px(newImg.left);
    this.img.style.top = px(newImg.top);

    // preview
    if (this.preview) {
      this.preview.style.width = px(newImg.width);
      this.preview.style.height = px(newImg.height);
      this.preview.style.left = px(newImg.left);
      this.preview.style.top = px(newImg.top);
    }

    this.props.actions.setCurrentScale(this.scale());
  }

  onMouseDown = (e) => {
    this.cursor.left = e.clientX;
    this.cursor.top = e.clientY;

    this.img.ondragstart = () => false;

    if (this.scale() === this.props.initial.scale) {
      return;
    }

    document.onmousemove = (event) => {
      const rangeX = event.clientX - this.cursor.left;
      const rangeY = event.clientY - this.cursor.top;
      const currentLeft = rPx(this.img.style.left);
      const curentTop = rPx(this.img.style.top);

      const box = this.img.getBoundingClientRect();

      let left = 0;
      let top = 0;

      if (rangeX < 0) {
        left = core.moveLeft(rangeX, box.left, currentLeft, this.img.width, window.innerWidth);
      } else {
        left = core.moveRight(rangeX, box.right, currentLeft, this.img.width, window.innerWidth);
      }

      if (rangeY < 0) {
        top = core.moveTop(rangeY, box.top, curentTop, this.img.height, window.innerHeight);
      } else {
        top = core.moveBottom(rangeY, box.bottom, curentTop, this.img.height, window.innerHeight);
      }

      // main
      if (currentLeft !== left) {
        this.img.style.left = px(left);
      }

      if (curentTop !== top) {
        this.img.style.top = px(top);
      }

      // preview
      if (this.preview) {
        if (currentLeft !== left) {
          this.preview.style.left = px(left);
        }

        if (curentTop !== top) {
          this.preview.style.top = px(top);
        }
      }

      this.cursor.left = event.clientX;
      this.cursor.top = event.clientY;
    };

    this.img.onmouseup = () => {
      document.onmousemove = null;
      this.img.onmouseup = null;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      this.img.onmouseup = null;
      document.onmouseup = null;
    };
  }

  scale = () => ((this.img.width / this.img.naturalWidth) * 100).toFixed(2);

  imgInit = () => {
    const img = {
      width: this.img.naturalWidth,
      height: this.img.naturalHeight,
    };

    const newImg = core.adjust(img, window.innerWidth, window.innerHeight);

    // main
    this.img.style.width = px(newImg.width);
    this.img.style.height = px(newImg.height);
    this.img.style.left = px(newImg.left);
    this.img.style.top = px(newImg.top);

    this.img.style.visibility = 'visible';

    // preview
    if (this.preview) {
      this.preview.style.width = px(newImg.width);
      this.preview.style.height = px(newImg.height);
      this.preview.style.left = px(newImg.left);
      this.preview.style.top = px(newImg.top);

      this.preview.style.visibility = 'visible';
    }

    const box = this.img.getBoundingClientRect();

    this.props.actions.setInitialValues(this.scale(), box, this.img.width, this.img.height);
  }

  closeOverlay = () => {
    document.body.classList.remove('noscroll');
    this.props.actions.hideOverlay();
  }

  loadingCompleted = () => {
    this.props.actions.setImageLoaded();
  }

  render() {
    const { currentImg, loaded, initial, scale } = this.props;

    return (
      <div className={css.overlay}>
        <div style={{ position: 'absolute', color: 'red', zIndex: 100550 }}>
          {initial.scale}, {scale}, <button className="btn" type="button" onClick={this.closeOverlay}>Close</button>
        </div>

        {!loaded &&
          <img
            className={css.previewimg}
            alt={currentImg}
            key={`${currentImg} preview`}
            src={`/img/comics/${currentImg.small}`}
            ref={(prev) => { this.preview = prev; }}
          />
        }

        <img
          className={css.fullimg}
          alt={currentImg}
          key={`${currentImg} full`}
          src={`/img/comics/${currentImg.medium}`}
          ref={(img) => { this.img = img; }}
          onLoad={this.loadingCompleted}
          onWheel={this.onWheel}
          onMouseDown={this.onMouseDown}
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
  currentImg: PropTypes.shape({
    small: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    large: PropTypes.string.isRequired,
  }).isRequired,
  loaded: PropTypes.bool.isRequired,
  initial: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  }).isRequired,
  scale: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    hideOverlay: PropTypes.func.isRequired,
    setImageLoaded: PropTypes.func.isRequired,
    setInitialValues: PropTypes.func.isRequired,
    setCurrentScale: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
