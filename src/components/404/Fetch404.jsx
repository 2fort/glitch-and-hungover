import React from 'react';
import PropTypes from 'prop-types';

const Fetch404 = ({ children }) => (
  <div className="route404">
    {children}
  </div>
);

Fetch404.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Fetch404;
