const prefix = 'ImageViewer';

const ADD_IMAGES = `${prefix}/ADD_IMAGES`;
const SHOW_OVERLAY = `${prefix}/SHOW_OVERLAY`;
const HIDE_OVERLAY = `${prefix}/HIDE_OVERLAY`;
const SET_GALLERY_ID = `${prefix}/SET_GALLERY_ID`;
const SET_GALLERY_TITLE = `${prefix}/SET_GALLERY_TITLE`;
const SET_IMAGE_LOADED = `${prefix}/SET_IMAGE_LOADED`;
const SET_INITIAL_VALUES = `${prefix}/SET_INITIAL_VALUES`;
const SET_CURRENT_SCALE = `${prefix}/SET_CURRENT_SCALE`;
const PREVIOUS_IMAGE = `${prefix}/PREVIOUS_IMAGE`;
const NEXT_IMAGE = `${prefix}/NEXT_IMAGE`;

export function addImages(images, imagePosition) {
  return {
    type: ADD_IMAGES,
    images,
    imagePosition,
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

export function setGalleryTitle(title) {
  return {
    type: SET_GALLERY_TITLE,
    title,
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

export function prevImage() {
  return {
    type: PREVIOUS_IMAGE,
  };
}

export function nextImage() {
  return {
    type: NEXT_IMAGE,
  };
}

const defaultState = {
  galleryId: '',
  galleryTitle: '',
  images: [],
  currentImg: 0,
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

    case SET_GALLERY_TITLE:
      return { ...state, galleryTitle: action.title };

    case ADD_IMAGES:
      return { ...state, images: action.images, currentImg: action.imagePosition };

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

    case PREVIOUS_IMAGE:
      return { ...state, currentImg: state.currentImg - 1, loaded: false };

    case NEXT_IMAGE:
      return { ...state, currentImg: state.currentImg + 1, loaded: false };

    default:
      return state;
  }
}
