import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { createUseStyles } from 'react-jss';
import * as ownActions from './duck';
import {
  loading, mouse, touch,
} from './modules';
import * as utils from '../../lib/utils';

const buttons = {
  color: '#FFF',
  opacity: 0.8,
  boxShadow: 'none',
  outline: 0,
  border: 0,
  backgroundColor: 'transparent',
  '&:hover': {
    textDecoration: 'none',
    color: '#FFF',
    opacity: 1,
    cursor: 'pointer',
  },
  '&:focus': {
    opacity: 1,
    border: 0,
    boxShadow: 'none',
    color: '#FFF',
  },
  '&:disabled': {
    boxShadow: 'none',
    outline: 0,
    border: 0,
    '&:hover': {
      textDecoration: 'none',
      color: '#636c72',
    },
  },
};

const useStyles = createUseStyles({
  overlay: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100500,
    visibility: 'visible',
  },

  topbar: {
    display: 'flex',
    flexDirection: 'row',
    color: '#FFF',
    zIndex: 100550,
    height: '41px',
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    textOverflow: 'ellipsis',
  },

  title: {
    margin: 'auto 0',
    fontSize: '.95rem',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },

  pageNumber: {
    margin: 'auto auto auto 0',
    fontSize: '.95rem',
    whiteSpace: 'nowrap',
  },

  buttons,

  scale: {
    ...buttons,
    margin: 'auto 7px auto 0',
    fontSize: '.95rem',
    textAlign: 'right',
    borderBottom: '1px dashed #FFFFFF',
  },

  closeBtn: {
    ...buttons,
    padding: '8px 10px 7px 12px',
    marginRight: 'auto',
  },

  zoomBtn: {
    ...buttons,
    margin: 0,
    lineHeight: 2,
    fontSize: '0.6rem',
  },

  downloadBtn: {
    ...buttons,
    padding: '10px 14px 10px 12px',
  },

  navButton: {
    ...buttons,
    padding: '15px',
    zIndex: 100503,
  },

  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },

  navButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },

  frame: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 100501,
  },

  previewimg: {
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 100502,
    transformOrigin: '0 0',
  },

  fullimg: {
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 100503,
    transformOrigin: '0 0',
  },

  byWidthModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100800,
    backgroundColor: 'white',
    padding: '15px',
    maxWidth: '220px',
    borderRadius: '5px',
    textAlign: 'center',
    '& button': {
      marginTop: '15px',
    },
    '& h5': {
      marginBottom: 0,
    },
  },
});

const ImageViewer = ({
  comics, page, galleryId, scaleByWidth, scaleModalVisible, initial, actions, prevImg, nextImg, close,
}) => {
  const classes = useStyles();
  const scrollY = useRef(window.scrollY);
  const image = useRef();
  const preview = useRef();
  const scale = useRef();
  const current = useRef({
    left: 0, top: 0, width: 0, height: 0, scale: 0,
  });
  const loaded = useRef(false);

  const images = comics.files;
  const galleryTitle = comics.title;

  useEffect(() => {
    document.body.classList.add('overlay-active');
    document.documentElement.classList.add('html-noscroll');
    document.querySelector('meta[name=viewport]')
      .setAttribute('content', 'initial-scale=1, maximum-scale=1.0, user-scalable=0');

    return () => {
      document.body.classList.remove('overlay-active');
      document.documentElement.classList.remove('html-noscroll');
      document.querySelector('meta[name=viewport]')
        .setAttribute('content', 'initial-scale=1.0,width=device-width');
      window.scrollTo(0, scrollY);
      actions.reset();
    };
  }, [actions]);

  const setScale = useCallback((width) => {
    scale.current.innerHTML = `${((width / image.current.naturalWidth) * 100).toFixed(2)}%`;
  }, []);

  const activate = useCallback(() => {
    image.current.style.visibility = 'visible';

    if (!loaded.current && preview.current) {
      preview.current.style.visibility = 'visible';
    }
  }, []);

  const hidePreview = useCallback(() => {
    loaded.current = true;

    if (preview.current) {
      preview.current.style.visibility = 'hidden';
    }
  }, []);

  const apply = useCallback((params) => {
    if (params.width && params.width !== current.current.width) {
      setScale(params.width);
    }

    Object.assign(current.current, params);

    if (!image.current) return;

    image.current.style.transform = `translate3d(${current.current.left}px, ${current.current.top}px, 0) ` +
      `scale3d(${current.current.scale}, ${current.current.scale}, 1)`;

    if (!loaded.current && preview.current) {
      const scaleNow = current.current.width / preview.current.naturalWidth;
      preview.current.style.transform = `translate3d(${current.current.left}px, ${current.current.top}px, 0) ` +
        `scale3d(${scaleNow}, ${scaleNow}, 1)`;
    }
  }, [setScale]);

  useEffect(() => {
    loaded.current = false;
    loading.load(image.current, apply, actions.setInitialValues, activate, false);
  }, [page, actions, activate, apply]);

  const nav = useRef({ prevImg, nextImg, close });

  const scaleModalClose = useCallback((e) => {
    if (scaleModalVisible) {
      const path = utils.getEventPath(e);
      let found = false;
      for (let i = 0; i < path.length; i++) {
        const node = path[i].id;

        if (node === 'scalemodal') {
          found = true;
          break;
        }
      }

      if (!found) {
        actions.closeScaleModal();
      }
    }
  }, [scaleModalVisible, actions]);

  const fullImgExt = images[page - 1].large.split('.').pop();

  return (
    <div // eslint-disable-line
      className={classes.overlay}
      onMouseMove={mouse.handleMouseMove(initial, current.current, apply)}
      onMouseUp={mouse.handleMouseUp(image.current)}
      onMouseLeave={mouse.handleMouseUp(image.current)}
      onMouseDown={scaleModalClose}
      onTouchEnd={scaleModalClose}
    >
      <div className={classes.topbar}>
        <button className={classNames(classes.closeBtn, 'btn btn-link')} type="button" title="Назад" onClick={close}>
          <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
        </button>

        <div className={classes.title}>
          {galleryTitle},
        </div>

        <div className={classes.pageNumber}>
          &nbsp;{page} / {images.length}
        </div>

        <button
          type="button"
          className={classNames(classes.zoomBtn, 'btn btn-link')}
          onClick={() => { apply(loading.adjustByWidth(initial, current.current)); }}
          title="Выровнять по ширине"
        >
          <span className="fa-stack fa-lg">
            <i className="fa fa-square-o fa-stack-2x" />
            <i className="fa fa-arrows-h fa-stack-1x" />
          </span>
        </button>

        <button
          type="button"
          className={classNames(classes.scale)}
          ref={scale}
          onClick={actions.openScaleModal}
        />

        <a
          href={`/img/comics/${images[page - 1].large}`}
          className={classNames(classes.downloadBtn, 'btn btn-link')}
          title="Скачать в высоком разрешении"
          download={`${galleryId}_${page}.${fullImgExt}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-download fa-lg" aria-hidden="true" />
        </a>
      </div>

      <div className={classes.navigation}>
        <div className={classes.navButtonContainer}>
          {page !== 1 &&
            <button
              type="button"
              onClick={prevImg}
              className={classNames(classes.navButton, 'btn btn-link')}
            >
              <i className="fa fa-angle-left fa-3x" aria-hidden="true" />
            </button>}
        </div>
        {' '}
        <div className={classes.navButtonContainer}>
          {page !== images.length &&
            <button
              type="button"
              onClick={nextImg}
              className={classNames(classes.navButton, 'btn btn-button')}
            >
              <i className="fa fa-angle-right fa-3x" aria-hidden="true" />
            </button>}
        </div>
      </div>

      <div className={classes.frame}>
        <img
          className={classes.previewimg}
          alt={page}
          key={`${page} preview`}
          src={`/img/comics/${images[page - 1].small}`}
          ref={preview}
        />

        <img
          className={classes.fullimg}
          alt={page}
          key={`${page} full`}
          src={`/img/comics/${images[page - 1].medium}`}
          ref={image}
          onLoad={hidePreview}
          onWheel={mouse.handleWheel(initial, current.current, apply)}
          onMouseDown={mouse.handleMouseDown(initial, current.current)}
          onDoubleClick={mouse.handleDoubleClick(initial, current.current, apply)}
          onTouchStart={touch.handleTouchStart(initial, current.current)}
          onTouchMove={touch.handleTouchMove(initial, current.current, apply, nav, page, images.length)}
          onTouchEnd={touch.handleTouchEnd(initial, current.current, apply)}
        />
      </div>

      {scaleModalVisible &&
        <div id="scalemodal" className={classes.byWidthModal}>
          <h5>Масштабирование по-умолчанию</h5>
          <button
            type="button"
            className={scaleByWidth ? 'btn btn-primary' : 'btn btn-success'}
            onClick={() => {
              actions.setDefaultScaleByWidth(false);
              apply({
                left: initial.box.left,
                top: initial.box.top,
                width: initial.width,
                height: initial.height,
                scale: initial.scale,
              });
              actions.closeScaleModal();
            }}
          >
            Вписать в окно
          </button>
          <button
            type="button"
            className={scaleByWidth ? 'btn btn-success' : 'btn btn-primary'}
            onClick={() => {
              actions.setDefaultScaleByWidth(true);
              apply(loading.adjustByWidth(initial, current.current));
              actions.closeScaleModal();
            }}
          >
            По ширине
          </button>
        </div>}
    </div>
  );
};

function mapStateToProps({ imageViewer }) {
  return { ...imageViewer };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ownActions, dispatch),
  };
}

ImageViewer.propTypes = {
  comics: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  page: PropTypes.number.isRequired,
  // props from duck
  galleryId: PropTypes.string.isRequired,
  scaleByWidth: PropTypes.bool.isRequired,
  scaleModalVisible: PropTypes.bool.isRequired,
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
    setDefaultScaleByWidth: PropTypes.func.isRequired,
    openScaleModal: PropTypes.func.isRequired,
    closeScaleModal: PropTypes.func.isRequired,
  }).isRequired,
  prevImg: PropTypes.func.isRequired,
  nextImg: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
