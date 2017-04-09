const prefix = 'ImageViewer';

const ADD_IMAGES = `${prefix}/ADD_IMAGES`;
const REMOVE_IMAGES = `${prefix}/REMOVE_IMAGES`;
const SHOW_OVERLAY = `${prefix}/SHOW_OVERLAY`;
const HIDE_OVERLAY = `${prefix}/HIDE_OVERLAY`;
const SET_GALLERY_ID = `${prefix}/SET_GALLERY_ID`;
const SET_IMAGE_LOADED = `${prefix}/SET_IMAGE_LOADED`;
const SET_INITIAL_VALUES = `${prefix}/SET_INITIAL_VALUES`;
const SET_CURRENT_SCALE = `${prefix}/SET_CURRENT_SCALE`;

export function addImages(images, file) {
  return {
    type: ADD_IMAGES,
    images,
    file,
  };
}

export function removeImages() {
  return {
    type: REMOVE_IMAGES,
  };
}

export function showOverlay() {
  return {
    type: SHOW_OVERLAY,
  };
}

export function hideOverlay() {
  return {
    type: HIDE_OVERLAY,
  };
}

export function setGalleryId(id) {
  return {
    type: SET_GALLERY_ID,
    id,
  };
}

export function setImageLoaded() {
  return {
    type: SET_IMAGE_LOADED,
  };
}

export function setInitialValues(scale, box, width, height) {
  return {
    type: SET_INITIAL_VALUES,
    initial: {
      scale,
      box,
      width,
      height,
    },
  };
}

export function setCurrentScale(scale) {
  return {
    type: SET_CURRENT_SCALE,
    scale,
  };
}

const defaultState = {
  galleryId: '',
  images: [],
  currentImg: '',
  visible: false,
  loaded: false,
  initial: {
    scale: 0,
    box: {},
    width: 0,
    height: 0,
  },
  scale: 0,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_GALLERY_ID:
      return { ...state, galleryId: action.id };

    case ADD_IMAGES:
      return { ...state, images: action.images, currentImg: action.file };

    case REMOVE_IMAGES:
      return { ...state, images: [], currentImg: '' };

    case SET_IMAGE_LOADED:
      return { ...state, loaded: true };

    case SHOW_OVERLAY:
      return { ...state, visible: true };

    case HIDE_OVERLAY:
      return { ...defaultState };

    case SET_INITIAL_VALUES:
      return { ...state, initial: action.initial };

    case SET_CURRENT_SCALE:
      return { ...state, scale: action.scale };

    default:
      return state;
  }
}
