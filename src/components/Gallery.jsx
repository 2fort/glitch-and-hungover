import React from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';

const useStyles = createUseStyles({
  images: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '3rem',
  },

  imageContainer: {
    width: '250px',
    height: '300px',
    margin: '0 0.5rem 0.75rem 0.5rem',
    textAlign: 'center',
    '&:empty': {
      height: 0,
      width: '250px',
      margin: '0 0.5rem 0 0.5rem',
    },
  },

  image: {
    maxWidth: '250px',
    maxHeight: '300px',
  },

  imgButton: {
    padding: 0,
    margin: 0,
    border: 0,
    backgroundColor: '#FFF',
    cursor: 'pointer',
    '&:focus': {
      outline: 0,
    },
  },
});

const Gallery = ({
  images, title, slug, location,
}) => {
  const classes = useStyles();

  const layoutFix = new Array(10).fill(0).map((elem, i) => (
    <div key={`additional ${i + 1}`} className={classes.imageContainer} />
  ));

  // fix this with grid
  return (
    <div className={classes.images}>
      {images.map((files, i) => (
        <div className={classes.imageContainer} key={files.small}>
          <Link
            to={{
              pathname: `/${slug}/${i + 1}`,
              state: { background: location },
            }}
            className={classes.imgButton}
          >
            <img className={classes.image} alt={`${title}, page ${i + 1}`} src={`/img/comics/${files.small}`} />
          </Link>
        </div>
      ))}
      {layoutFix}
    </div>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Gallery;
