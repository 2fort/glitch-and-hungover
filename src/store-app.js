import { combineReducers, createStore } from 'redux';
import imageViewer from './components/ImageViewer/duck';

const rootReducer = combineReducers({
  imageViewer,
});

export default function configureStore() {
  let store = '';

  if (process.env.NODE_ENV === 'development') {
    store = createStore(rootReducer, undefined,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    if (module.hot) {
      module.hot.accept();
      store.replaceReducer(rootReducer);
    }
  } else {
    store = createStore(rootReducer, undefined);
  }

  return store;
}
