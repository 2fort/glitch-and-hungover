import { style } from 'typestyle';
import * as csstips from 'csstips';

export const hr = style({
  marginTop: 0,
  marginBottom: '.75rem',
  border: 0,
  borderTop: '1px solid rgba(0,0,0,.1)',
});

export const anchor = style({
  marginRight: 'auto',
  marginLeft: '7px',
});

export const header = style(csstips.horizontal, csstips.betweenJustified, {
  $nest: {
    '& a': {
      visibility: 'hidden',
    },
    '&:hover': {
      '& a': {
        visibility: 'visible',
      },
    },
  },
});

export const date = style({ textAlign: 'right' });

export const main = style({ marginTop: '2rem' });

export const footer = style({ padding: '1.5rem 0 2rem' });
