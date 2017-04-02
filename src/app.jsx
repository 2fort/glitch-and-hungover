import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store-app';
import App from './containers/App';

/*eslint-disable */
// require('!file-loader?name=og-image.[ext]!../img/glitch.png');
/*eslint-enable */

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
