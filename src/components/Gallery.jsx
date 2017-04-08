import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addImages } from './ImageViewer.duck';
import * as css from './Gallery.style';

const Gallery = ({ images, alt, actions }) => {
  const elemImages = images.map((file, i) => (
    <div className={css.imageContainer} key={file}>
      <button type="button" className={css.imgButton} onClick={() => { actions.addImages(images, file); }}>
        <img className={css.image} alt={`${alt} ${i + 1}`} src={`/img/s/${file}`} />
      </button>
    </div>
  ));
  return (
    <div className={css.images}>
      {elemImages}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  alt: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    addImages: PropTypes.func.isRequired,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ addImages }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Gallery);
