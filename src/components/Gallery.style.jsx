import { style } from 'typestyle';
import * as csstips from 'csstips';
import { white } from 'csx';

export const images = style(
  csstips.horizontal,
  csstips.wrap,
  csstips.aroundJustified,
  csstips.center, {
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
    marginBottom: '15px',
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

export const imgButton = style({
  padding: 0,
  margin: 0,
  border: 0,
  backgroundColor: white.toHexString(),
  cursor: 'pointer',
  $nest: {
    '&:focus': {
      outline: 0,
    },
  },
});
