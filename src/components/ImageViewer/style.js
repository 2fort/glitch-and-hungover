import { style } from 'typestyle';
import { white } from 'csx';
import * as csstips from 'csstips';

export const overlay = style(csstips.vertical, {
  width: '100%',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100500,
  visibility: 'visible',
});

export const topbar = style(csstips.horizontal, {
  color: white.toHexString(),
  zIndex: 100550,
  height: '41px',
  backgroundColor: 'rgba(20,20,20,0.85)',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
});

export const title = style({
  margin: 'auto auto auto 0',
  fontSize: '.95rem',
});

export const scale = style({
  margin: 'auto 7px auto 0',
  fontSize: '.95rem',
  minWidth: '50px',
  textAlign: 'right',
});

const buttons = {
  color: white.toHexString(),
  opacity: 0.8,
  boxShadow: 'none',
  outline: 0,
  border: 0,
  $nest: {
    '&:hover': {
      textDecoration: 'none',
      color: white.toHexString(),
      opacity: 1,
    },
    '&:focus': {
      opacity: 1,
      border: 0,
      boxShadow: 'none',
      color: white.toHexString(),
    },
    '&:disabled': {
      boxShadow: 'none',
      outline: 0,
      border: 0,
      '&:hover': {
        textDecoration: 'none',
        color: '#636c72',
      },
    },
  },
};

export const closeBtn = style(buttons, {
  padding: '8px 10px 7px 15px',
  marginRight: 'auto',
});

export const zoomBtn = style(buttons, {
  padding: '7px',
});

export const downloadBtn = style(buttons, {
  padding: '10px 20px',
});

export const navButton = style(buttons, {
  padding: '15px',
  zIndex: 100503,
});

export const navigation = style(csstips.horizontal, csstips.betweenJustified, {
  height: '100%',
});

export const navButtonContainer = style(csstips.vertical, csstips.centerJustified, {
  height: '100%',
});

export const previewimg = style({
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100501,
});

export const fullimg = style({
  // transition: 'all 500ms linear',
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100502,
});
