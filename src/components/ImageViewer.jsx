import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { px } from 'csx';
import { classes } from 'typestyle';
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

    document.onkeydown = (event) => {
      if (event.keyCode === 37) {
        this.onLeftKeyDown();
      }
      if (event.keyCode === 39) {
        this.onRightKeyDown();
      }
    };

    let resizeDebounce;

    window.onresize = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        this.imgInit();
      }, 200);
    };
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentImg !== prevProps.currentImg) {
      this.initialize();
    }
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  onResize = () => {
    this.imgInit();
  }

  onLeftKeyDown = () => {
    if (this.props.currentImg !== 1) {
      this.props.actions.prevImage();
    }
  }

  onRightKeyDown = () => {
    if (this.props.currentImg !== this.props.images.length) {
      this.props.actions.nextImage();
    }
  }

  onWheel = (e) => {
    const { scale, initial } = this.props;

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

    if ((scale === 100.00 && e.deltaY < 0) || (scale === initial.scale && e.deltaY > 0)) {
      return;
    }

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
        top = core.moveTop(rangeY, box.top, curentTop, this.img.height, window.innerHeight - 40, 40);
      } else {
        top = core.moveBottom(rangeY, box.bottom, curentTop, this.img.height, window.innerHeight - 40, 40);
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

  scale = () => Number(((this.img.width / this.img.naturalWidth) * 100).toFixed(2));

  initialize = () => {
    const wait = setInterval(() => {
      const w = this.img.naturalWidth;
      const h = this.img.naturalHeight;
      if (w && h) {
        clearInterval(wait);
        this.imgInit();
      }
    }, 30);
  }

  imgInit = () => {
    const img = {
      width: this.img.naturalWidth,
      height: this.img.naturalHeight,
    };

    const newImg = core.adjust(img, window.innerWidth, window.innerHeight - 40, 40);

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
    const scale = this.scale();

    this.props.actions.setInitialValues(scale, box, this.img.width, this.img.height);
    this.props.actions.setCurrentScale(scale);
  }

  closeOverlay = () => {
    document.body.classList.remove('noscroll');
    this.props.actions.hideOverlay();
  }

  loadingCompleted = () => {
    this.props.actions.setImageLoaded();
  }

  render() {
    const { galleryTitle, images, currentImg, loaded, scale, actions } = this.props;

    return (
      <div className={css.overlay}>
        <div className={css.topbar}>
          <button className={classes(css.closeBtn, 'btn btn-link')} type="button" onClick={this.closeOverlay}>
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
          </button>
          <div className={css.title}>
            {galleryTitle}, {currentImg} / {images.length}
          </div>
          <div className={css.scale}>
            {scale}%
          </div>
          <a
            href={`/img/comics/${images[currentImg - 1].large}`}
            className={classes(css.downloadBtn, 'btn btn-link')}
            title="Скачать в высоком разрешении"
          >
            <i className="fa fa-download fa-lg" aria-hidden="true" />
          </a>
        </div>

        <div className={css.navigation}>
          <div className={css.navButtonContainer}>
            {currentImg !== 1 &&
              <button className={classes(css.navButton, 'btn btn-link')} onClick={actions.prevImage}>
                <i className="fa fa-angle-left fa-3x" aria-hidden="true" />
              </button>
            }
          </div>
          {' '}
          <div className={css.navButtonContainer}>
            {currentImg !== images.length &&
              <button className={classes(css.navButton, 'btn btn-link')} onClick={actions.nextImage}>
                <i className="fa fa-angle-right fa-3x" aria-hidden="true" />
              </button>
            }
          </div>
        </div>

        {!loaded &&
          <img
            className={css.previewimg}
            alt={currentImg}
            key={`${currentImg} preview`}
            src={`/img/comics/${images[currentImg - 1].small}`}
            ref={(prev) => { this.preview = prev; }}
          />
        }

        <img
          className={css.fullimg}
          alt={currentImg}
          key={`${currentImg} full`}
          src={`/img/comics/${images[currentImg - 1].medium}`}
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
  galleryTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    small: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    large: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  currentImg: PropTypes.number.isRequired,
  loaded: PropTypes.bool.isRequired,
  initial: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  scale: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    hideOverlay: PropTypes.func.isRequired,
    setImageLoaded: PropTypes.func.isRequired,
    setInitialValues: PropTypes.func.isRequired,
    setCurrentScale: PropTypes.func.isRequired,
    prevImage: PropTypes.func.isRequired,
    nextImage: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
