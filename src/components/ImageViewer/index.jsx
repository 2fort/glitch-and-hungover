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
    this.current = { left: 0, top: 0, width: 0, height: 0 };
    Object.defineProperty(this.current, 'set', {
      value: function setValue({ left, top, width, height }) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
      },
    });

    document.body.classList.add('overlay-active');
    document.onkeydown = keys(() => this.props);

    let resizeDebounce;
    window.onresize = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        if (this.props.scale === this.props.initial.scale) {
          loading(this.img, this.preview, this.current, this.props.actions.setInitialValues, this.props.loaded);
        }
      }, 200);
    };
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
      this.props.actions.setCurrentImage(Number(nextProps.match.params.page));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentImg !== prevProps.currentImg) {
      loading(this.img, this.preview, this.current, this.props.actions.setInitialValues, this.props.loaded);
    }
  }

  componentWillUnmount() {
    document.onkeydown = null;
    document.body.classList.remove('overlay-active');
    window.onresize = null;

    this.props.actions.reset();
  }

  render() {
    const { galleryTitle, galleryId, images, currentImg, modal, scale, actions, initial, loaded } = this.props;

    if (!currentImg) return null;

    const fullImgExt = images[currentImg - 1].large.split('.').pop();

    return (
      <div
        className={css.overlay}
        onMouseMove={mouse.handleMouseMove(this.img, this.current, this.preview, loaded)}
        onMouseUp={mouse.handleMouseUp(this.img)}
        onMouseLeave={mouse.handleMouseUp(this.img)}
      >
        <div className={css.topbar}>
          <Link to="/" className={classes(css.closeBtn, 'btn btn-link')} title="Назад">
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
          </Link>
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

        <img
          className={css.previewimg}
          alt={currentImg}
          key={`${currentImg} preview`}
          src={`/img/comics/${images[currentImg - 1].small}`}
          ref={(prev) => { this.preview = prev; }}
        />

        <img
          className={css.fullimg}
          alt={currentImg}
          key={`${currentImg} full`}
          src={`/img/comics/${images[currentImg - 1].large}`}
          ref={(img) => { this.img = img; }}
          onLoad={() => { actions.setImageLoaded(); this.preview.style.visibility = 'hidden'; }}
          onWheel={mouse.handleWheel(scale, initial, this.current, actions.setScale, this.preview, loaded)}
          onMouseDown={mouse.handleMouseDown(scale, initial)}
          onDoubleClick={mouse.handleDoubleClick(scale, initial, this.current, actions.setScale, this.preview)}
          // onTouchStart={this.onTouchStart}
          // onTouchMove={this.onTouchMove}
          // onTouchEnd={this.onTouchEnd}
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
  loaded: PropTypes.bool.isRequired,
  initial: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    naturalWidth: PropTypes.number.isRequired,
    naturalHeight: PropTypes.number.isRequired,
  }).isRequired,
  scale: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    setGalleryId: PropTypes.func.isRequired,
    setGalleryTitle: PropTypes.func.isRequired,
    addImages: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    setImageLoaded: PropTypes.func.isRequired,
    setInitialValues: PropTypes.func.isRequired,
    setCurrentImage: PropTypes.func.isRequired,
    setScale: PropTypes.func.isRequired,
  }).isRequired,
};

const expObj = {
  standalone: props => <ProxyRoute modal={false} {...props} />,
  modal: props => <ProxyRoute modal {...props} />,
};

expObj.standalone = connect(mapStateToProps, mapDispatchToProps)(withRouter(expObj.standalone));
expObj.modal = connect(mapStateToProps, mapDispatchToProps)(withRouter(expObj.modal));

export default expObj;
