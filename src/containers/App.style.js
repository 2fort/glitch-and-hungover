import { style } from 'typestyle';
import * as csstips from 'csstips';

export const hr = style({
  marginTop: 0,
  marginBottom: '.75rem',
  border: 0,
  borderTop: '1px solid rgba(0,0,0,.1)',
});

export const header = style(csstips.horizontal, csstips.betweenJustified);
export const date = style({ textAlign: 'right' });

export const images = style(
  csstips.horizontal,
  csstips.wrap,
  csstips.aroundJustified,
  csstips.center,
  csstips.verticallySpaced('15px'), {
    marginBottom: '3rem',
  });

export const imageContainer = style({
  minWidth: '150px',
  minHeight: '150px',
  textAlign: 'center',
});

export const image = (() => {
  const mixin = {
    maxWidth: '150px',
    maxHeight: '150px',
  };

  return style({
    $nest: {
      '@media only screen and (-webkit-min-device-pixel-ratio: 2)': mixin,
      '@media only screen and (min--moz-device-pixel-ratio: 2)': mixin,
      '@media only screen and (-o-min-device-pixel-ratio: 2/1)': mixin,
      '@media only screen and (min-device-pixel-ratio: 2)': mixin,
      '@media only screen and (min-resolution: 192dpi)': mixin,
      '@media only screen and min-resolution: 2dppx)': mixin,
    },
  });
})();

export const main = style({ marginTop: '2rem' });
