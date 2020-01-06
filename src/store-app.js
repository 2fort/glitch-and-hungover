import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import imageViewer from './components/ImageViewer/duck';

const rootReducer = combineReducers({
  imageViewer,
});

const composeEnhancers = composeWithDevTools({});

export default function configureStore() {
  let store = '';

  if (process.env.NODE_ENV === 'development') {
    store = createStore(
      rootReducer,
      composeEnhancers(),
    );

    if (module.hot) {
      module.hot.accept();
      store.replaceReducer(rootReducer);
    }
  } else {
    store = createStore(rootReducer);
  }

  return store;
}
