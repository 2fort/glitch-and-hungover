import { style } from 'typestyle';
import * as csstips from 'csstips';
import { white } from 'csx';

function retinaMixin(mixin) {
  return {
    '@media only screen and (-webkit-min-device-pixel-ratio: 2)': mixin,
    '@media only screen and (min--moz-device-pixel-ratio: 2)': mixin,
    '@media only screen and (-o-min-device-pixel-ratio: 2/1)': mixin,
    '@media only screen and (min-device-pixel-ratio: 2)': mixin,
    '@media only screen and (min-resolution: 192dpi)': mixin,
    '@media only screen and min-resolution: 2dppx)': mixin,
  };
}

export const images = style(
  csstips.horizontal,
  csstips.wrap,
  csstips.aroundJustified,
  csstips.center, {
    marginBottom: '3rem',
  });

export const imageContainer = (() => {
  const mixin = {
    width: '125px',
    height: '150px',
    '&:empty': {
      height: 0,
      width: '125px',
      margin: '0 0.5rem 0 0.5rem',
    },
  };

  return style({
    width: '250px',
    height: '300px',
    margin: '0 0.5rem 0.75rem 0.5rem',
    textAlign: 'center',
    '&:empty': {
      height: 0,
      width: '250px',
      margin: '0 0.5rem 0 0.5rem',
    },
    $nest: retinaMixin(mixin),
  });
})();

export const image = (() => {
  const mixin = {
    maxWidth: '125px',
    maxHeight: '150px',
  };

  return style({
    maxWidth: '250px',
    maxHeight: '300px',
    $nest: retinaMixin(mixin),
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
