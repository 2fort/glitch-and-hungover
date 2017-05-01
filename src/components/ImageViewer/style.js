import { style } from 'typestyle';
import { white } from 'csx';
import * as csstips from 'csstips';

export const overlay = style(csstips.vertical, {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100500,
  visibility: 'visible',
});

export const topbar = style(csstips.horizontal, {
  color: white.toHexString(),
  zIndex: 100550,
  height: '41px',
  backgroundColor: 'rgba(20,20,20,0.85)',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  textOverflow: 'ellipsis',
});

export const title = style({
  margin: 'auto 0',
  fontSize: '.95rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

export const pageNumber = style({
  margin: 'auto auto auto 0',
  fontSize: '.95rem',
  whiteSpace: 'nowrap',
});

export const scale = style({
  margin: 'auto 7px auto 0',
  fontSize: '.95rem',
  // minWidth: '50px',
  textAlign: 'right',
  borderBottom: '1px dashed #FFFFFF',
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
  padding: '8px 10px 7px 12px',
  marginRight: 'auto',
});

export const zoomBtn = style(buttons, {
  margin: 0,
  lineHeight: 2,
  fontSize: '0.6rem',
});

export const downloadBtn = style(buttons, {
  padding: '10px 14px 10px 12px',
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

export const frame = style({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  position: 'absolute',
  zIndex: 100501,
});

export const previewimg = style({
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100502,
  transformOrigin: '0 0',
});

export const fullimg = style({
  // transition: 'all 500ms linear',
  position: 'absolute',
  visibility: 'hidden',
  zIndex: 100503,
  transformOrigin: '0 0',
});
