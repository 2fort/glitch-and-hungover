const ADD_IMAGES = 'ImageViewer/ADD_IMAGES';
const REMOVE_IMAGES = 'ImageViewer/REMOVE_IMAGES';

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

const defaultState = {
  images: [],
  currentImg: '',
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_IMAGES:
      return { ...state, images: action.images, currentImg: action.file };

    case REMOVE_IMAGES:
      return { ...state, images: [], currentImg: '' };

    default:
      return state;
  }
}
