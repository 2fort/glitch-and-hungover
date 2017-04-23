const prefix = 'ImageViewer';

const ADD_IMAGES = `${prefix}/ADD_IMAGES`;
const RESET = `${prefix}/RESET`;
const SET_GALLERY_ID = `${prefix}/SET_GALLERY_ID`;
const SET_GALLERY_TITLE = `${prefix}/SET_GALLERY_TITLE`;
const SET_IMAGE_LOADED = `${prefix}/SET_IMAGE_LOADED`;
const SET_INITIAL_VALUES = `${prefix}/SET_INITIAL_VALUES`;
const SET_CURRENT_SCALE = `${prefix}/SET_CURRENT_SCALE`;
const SET_CURRENT_IMAGE = `${prefix}/SET_CURRENT_IMAGE`;

const getScale = (width, naturalWidth) => Number(((width / naturalWidth) * 100).toFixed(2));

export function addImages(images, imagePosition) {
  return {
    type: ADD_IMAGES,
    images,
    imagePosition,
  };
}

export function reset() {
  return {
    type: RESET,
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

export function setInitialValues(img) {
  const { width, height, naturalWidth, naturalHeight } = img;
  return {
    type: SET_INITIAL_VALUES,
    initial: {
      scale: getScale(width, naturalWidth),
      box: img.getBoundingClientRect(),
      width,
      height,
      naturalWidth,
      naturalHeight,
    },
  };
}

export function setScale(width, naturalWidth) {
  return {
    type: SET_CURRENT_SCALE,
    scale: getScale(width, naturalWidth),
  };
}

export function setCurrentImage(page) {
  return {
    type: SET_CURRENT_IMAGE,
    page,
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
    naturalWidth: 0,
    naturalHeight: 0,
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

    case RESET:
      return { ...defaultState };

    case SET_INITIAL_VALUES:
      return { ...state, initial: action.initial, scale: action.initial.scale };

    case SET_CURRENT_SCALE:
      return { ...state, scale: action.scale };

    case SET_CURRENT_IMAGE:
      return { ...state, currentImg: action.page, loaded: false };

    default:
      return state;
  }
}
