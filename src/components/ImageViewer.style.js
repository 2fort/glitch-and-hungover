import { style } from 'typestyle';
import { black } from 'csx';

export const overlay = style({
  width: '100%',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: black.toHexString(),
  zIndex: 100500,
});

export const fullimg = style({
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100502,
});

export const previewimg = style({
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100501,
});
