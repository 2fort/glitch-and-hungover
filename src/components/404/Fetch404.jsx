import React from 'react';
import PropTypes from 'prop-types';
import { style } from 'typestyle';

const css = style({
  margin: '2rem',
  textAlign: 'center',
  fontSize: '1.5rem',
});

const Fetch404 = ({ children }) => (
  <div className={css}>
    {children}
  </div>
);

Fetch404.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Fetch404;
