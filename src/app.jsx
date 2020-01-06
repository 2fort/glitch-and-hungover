import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import 'normalize.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import './style.css';
import configureStore from './store-app';
import Entrance from './containers/Entrance';

const store = configureStore();

render(
  <Provider store={store}>
    <Router>
      <Entrance />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
