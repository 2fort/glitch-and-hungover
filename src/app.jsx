import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import configureStore from './store-app';
import Entrance from './containers/Entrance';

const store = configureStore();

render(
  <Provider store={store}>
    <Router>
      <Route component={Entrance} />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
