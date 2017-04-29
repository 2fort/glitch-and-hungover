const prefix = 'ImageViewer';

const ADD_IMAGES = `${prefix}/ADD_IMAGES`;
const RESET = `${prefix}/RESET`;
const SET_GALLERY_ID = `${prefix}/SET_GALLERY_ID`;
const SET_GALLERY_TITLE = `${prefix}/SET_GALLERY_TITLE`;
const SET_INITIAL_VALUES = `${prefix}/SET_INITIAL_VALUES`;
const SET_CURRENT_IMAGE = `${prefix}/SET_CURRENT_IMAGE`;

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

export function setCurrentImage(page) {
  return {
    type: SET_CURRENT_IMAGE,
    page,
  };
}

export function setInitialValues({ width, height, naturalWidth, naturalHeight, left, top, scale }) {
  return {
    type: SET_INITIAL_VALUES,
    initial: {
      scale,
      box: {
        top,
        left,
        right: left + width,
        bottom: top + height,
      },
      width,
      height,
      naturalWidth,
      naturalHeight,
    },
  };
}

const defaultState = {
  galleryId: '',
  galleryTitle: '',
  images: [],
  currentImg: 0,
  visible: false,
  initial: {
    scale: 0,
    box: {},
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_GALLERY_ID:
      return { ...state, galleryId: action.id };

    case SET_GALLERY_TITLE:
      return { ...state, galleryTitle: action.title };

    case ADD_IMAGES:
      return { ...state, images: action.images, currentImg: action.imagePosition };

    case RESET:
      return { ...defaultState };

    case SET_INITIAL_VALUES:
      return { ...state, initial: action.initial };

    case SET_CURRENT_IMAGE:
      return { ...state, currentImg: action.page };

    default:
      return state;
  }
}
