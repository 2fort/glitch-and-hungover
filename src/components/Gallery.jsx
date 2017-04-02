import React, { PropTypes } from 'react';

const Gallery = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

Gallery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Gallery;
