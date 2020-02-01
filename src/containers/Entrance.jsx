import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import Main from './Main';
import ImageViewer from '../components/ImageViewer';
import Route404 from '../components/404/Route404';

const Entrance = () => {
  const location = useLocation();

  const background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route exact path="/" component={Main} />
        <Route path="/:issue/:page?" component={ImageViewer} />
        <Route component={Route404} />
      </Switch>

      {background && <Route path="/:issue/:page?" component={ImageViewer} />}
    </div>
  );
};

export default Entrance;
