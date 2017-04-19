import React from 'react';
import { style } from 'typestyle';

const css = style({
  margin: '2rem',
  textAlign: 'center',
  fontSize: '1.5rem',
});

export default () => (
  <div className={css}>
    Страница не найдена!
  </div>
);
