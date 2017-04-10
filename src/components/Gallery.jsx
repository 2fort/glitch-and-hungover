import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setGalleryId, addImages, showOverlay, setGalleryTitle } from './ImageViewer.duck';
import * as css from './Gallery.style';
import ImageViewer from '../components/ImageViewer';

const Gallery = ({ images, title, id, actions, imageViewer }) => {
  const elemImages = images.map((files, i) => (
    <div className={css.imageContainer} key={files.small}>
      <button
        type="button"
        className={css.imgButton}
        onClick={() => {
          actions.setGalleryId(id);
          actions.setGalleryTitle(title);
          actions.addImages(images, i + 1);
          actions.showOverlay();
        }}
      >
        <img className={css.image} alt={`${title}, page ${i + 1}`} src={`/img/comics/${files.small}`} />
      </button>
    </div>
  ));
  return (
    <div className={css.images}>
      {elemImages}
      {imageViewer.visible && imageViewer.galleryId === id && <ImageViewer />}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    setGalleryId: PropTypes.func.isRequired,
    setGalleryTitle: PropTypes.func.isRequired,
    addImages: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
  }).isRequired,
  imageViewer: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    galleryId: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps({ imageViewer }) {
  return {
    imageViewer: {
      visible: imageViewer.visible,
      galleryId: imageViewer.galleryId,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ addImages, showOverlay, setGalleryId, setGalleryTitle }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
