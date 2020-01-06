import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from './Main';
import Route404 from '../components/404/Route404';

const Entrance = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route component={Route404} />
  </Switch>
);

export default Entrance;
