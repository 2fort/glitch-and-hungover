import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as css from './Gallery.style';

const Gallery = ({ images, title, id }) => {
  const elemImages = images.map((files, i) => (
    <div className={css.imageContainer} key={files.small}>
      <Link
        to={{
          pathname: `/${id}/${i + 1}`,
          state: { modal: true },
        }}
        className={css.imgButton}
      >
        <img className={css.image} alt={`${title}, page ${i + 1}`} src={`/img/comics/${files.small}`} />
      </Link>
    </div>
  ));

  const layoutFix = new Array(10).fill(0).map((elem, i) => (
    <div key={`additional ${i + 1}`} className={css.imageContainer} />
  ));

  return (
    <div className={css.images}>
      {elemImages}
      {layoutFix}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Gallery;
