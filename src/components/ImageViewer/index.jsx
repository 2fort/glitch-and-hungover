import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { classes } from 'typestyle';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Fetch404 from '../404/Fetch404';
import data from '../../json/data.json';
import * as ownActions from './duck';
import * as css from './style';
import { keys, loading, mouse, touch } from './modules';

const ProxyRoute = (props) => {
  const { issue, page } = props.match.params;
  const properPage = page || 1;

  const cursor = Object.keys(data).filter(comics => data[comics].anchor === issue);
  const comics = data[cursor[0]];
  const image = data[cursor[0]] && comics.files[properPage - 1];

  if (!comics || !image) {
    return <Fetch404>Страница не найдена!</Fetch404>;
  }

  return (
    <ImageViewer {...props} comics={comics} page={Number(properPage)} />
  );
};

ProxyRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      issue: PropTypes.string.isRequired,
      page: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.scrollY = window.scrollY;
    this.dom = { image: null, preview: null, scale: null };
    this.current = { left: 0, top: 0, width: 0, height: 0, scale: 0 };
    this.loaded = false;
    this.nav = { prevImg: this.prevImg, nextImg: this.nextImg, close: this.close };

    document.body.classList.add('overlay-active');
    document.documentElement.classList.add('html-noscroll');

    document.querySelector('meta[name=viewport]')
      .setAttribute('content', 'initial-scale=1, maximum-scale=1.0, user-scalable=0');

    document.onkeydown = keys(this.nav);

    window.onresize = loading.handleResizeWindow(() => ({
      initial: this.props.initial,
      current: this.current,
      setInitialValues: this.props.actions.setInitialValues,
      apply: this.apply,
    }));
  }

  componentDidMount() {
    const { comics, page, match: { params: { page: paramsPage } } } = this.props;

    this.props.actions.setGalleryId(comics.anchor);
    this.props.actions.setGalleryTitle(comics.title);
    this.props.actions.addImages(comics.files, page);

    if (!paramsPage) {
      this.props.history.replace(`/${comics.anchor}/1`);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page) {
      this.loaded = false;
      this.props.actions.setCurrentImage(Number(nextProps.match.params.page));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentImg !== prevProps.currentImg) {
      const { actions: { setInitialValues } } = this.props;
      loading.load(this.dom.image, this.apply, setInitialValues, this.activate);
    }
  }

  componentWillUnmount() {
    document.onkeydown = null;
    document.querySelector('meta[name=viewport]')
      .setAttribute('content', 'initial-scale=1.0,width=device-width');
    document.body.classList.remove('overlay-active');
    document.documentElement.classList.remove('html-noscroll');

    window.scrollTo(0, this.scrollY);
    window.onresize = null;

    this.props.actions.reset();
  }

  setScale = (width) => {
    this.dom.scale.innerHTML = `${((width / this.dom.image.naturalWidth) * 100).toFixed(2)}%`;
  }

  activate = () => {
    this.dom.image.style.visibility = 'visible';

    if (!this.loaded) {
      this.dom.preview.style.visibility = 'visible';
    }
  }

  hidePreview = () => {
    this.loaded = true;
    this.dom.preview.style.visibility = 'hidden';
  }

  apply = (params) => {
    if (params.width && params.width !== this.current.width) {
      this.setScale(params.width);
    }

    Object.assign(this.current, params);

    this.dom.image.style.transform = `translate3d(${this.current.left}px, ${this.current.top}px, 0) ` +
      `scale3d(${this.current.scale}, ${this.current.scale}, 1)`;

    if (!this.loaded) {
      const scale = this.current.width / this.dom.preview.naturalWidth;
      this.dom.preview.style.transform = `translate3d(${this.current.left}px, ${this.current.top}px, 0) ` +
        `scale3d(${scale}, ${scale}, 1)`;
    }
  }

  prevImg = () => {
    const { currentImg, history, galleryId, modal } = this.props;

    if (currentImg !== 1) {
      history.replace(`/${galleryId}/${currentImg - 1}`, { modal });
    }
  }

  nextImg = () => {
    const { currentImg, images, history, galleryId, modal } = this.props;

    if (currentImg !== images.length) {
      history.replace(`/${galleryId}/${currentImg + 1}`, { modal });
    }
  }

  close = () => {
    const { history, modal } = this.props;

    if (modal) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  render() {
    const { galleryTitle, galleryId, images, currentImg, modal, initial } = this.props;

    if (!currentImg) return null;

    const fullImgExt = images[currentImg - 1].large.split('.').pop();

    return (
      <div
        className={css.overlay}
        onMouseMove={mouse.handleMouseMove(initial, this.current, this.apply)}
        onMouseUp={mouse.handleMouseUp(this.dom.image)}
        onMouseLeave={mouse.handleMouseUp(this.dom.image)}
      >
        <div className={css.topbar}>
          <button className={classes(css.closeBtn, 'btn btn-link')} type="button" title="Назад" onClick={this.close}>
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
          </button>

          <div className={css.title}>
            {galleryTitle}, {currentImg} / {images.length}
          </div>

          <div className={css.scale} ref={(el) => { this.dom.scale = el; }} />

          <a
            href={`/img/comics/${images[currentImg - 1].large}`}
            className={classes(css.downloadBtn, 'btn btn-link')}
            title="Скачать в высоком разрешении"
            download={`${galleryId}_${currentImg}.${fullImgExt}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-download fa-lg" aria-hidden="true" />
          </a>
        </div>

        <div className={css.navigation}>
          <div className={css.navButtonContainer}>
            {currentImg !== 1 &&
              <Link
                replace
                to={{
                  pathname: `/${galleryId}/${currentImg - 1}`,
                  state: { modal },
                }}
                className={classes(css.navButton, 'btn btn-link')}
              >
                <i className="fa fa-angle-left fa-3x" aria-hidden="true" />
              </Link>
            }
          </div>
          {' '}
          <div className={css.navButtonContainer}>
            {currentImg !== images.length &&
              <Link
                replace
                to={{
                  pathname: `/${galleryId}/${currentImg + 1}`,
                  state: { modal },
                }}
                className={classes(css.navButton, 'btn btn-link')}
              >
                <i className="fa fa-angle-right fa-3x" aria-hidden="true" />
              </Link>
            }
          </div>
        </div>

        <div className={css.frame}>
          <img
            className={css.previewimg}
            alt={currentImg}
            key={`${currentImg} preview`}
            src={`/img/comics/${images[currentImg - 1].small}`}
            ref={(el) => { this.dom.preview = el; }}
          />

          <img
            className={css.fullimg}
            alt={currentImg}
            key={`${currentImg} full`}
            src={`/img/comics/${images[currentImg - 1].medium}`}
            // src={'/img/example.jpg'}
            ref={(el) => { this.dom.image = el; }}
            onLoad={this.hidePreview}
            onWheel={mouse.handleWheel(initial, this.current, this.apply)}
            onMouseDown={mouse.handleMouseDown(initial, this.current)}
            onDoubleClick={mouse.handleDoubleClick(initial, this.current, this.apply)}
            onTouchStart={touch.handleTouchStart(initial, this.current, this.apply)}
            onTouchMove={touch.handleTouchMove(initial, this.current, this.apply, this.nav, currentImg, images.length)}
            onTouchEnd={touch.handleTouchEnd(this.current, this.apply)}
          />
        </div>
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
  // props from obj
  modal: PropTypes.bool.isRequired,
  // props from hoc
  comics: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  page: PropTypes.number.isRequired,
  // props from react-router
  match: PropTypes.shape({
    params: PropTypes.shape({
      page: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  // props from duck
  galleryId: PropTypes.string.isRequired,
  galleryTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    small: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    large: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  currentImg: PropTypes.number.isRequired,
  initial: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    naturalWidth: PropTypes.number.isRequired,
    naturalHeight: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setGalleryId: PropTypes.func.isRequired,
    setGalleryTitle: PropTypes.func.isRequired,
    addImages: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    setInitialValues: PropTypes.func.isRequired,
    setCurrentImage: PropTypes.func.isRequired,
  }).isRequired,
};

const expObj = {
  standalone: props => <ProxyRoute modal={false} {...props} />,
  modal: props => <ProxyRoute modal {...props} />,
};

expObj.standalone = connect(mapStateToProps, mapDispatchToProps)(withRouter(expObj.standalone));
expObj.modal = connect(mapStateToProps, mapDispatchToProps)(withRouter(expObj.modal));

export default expObj;
