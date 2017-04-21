import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import App from '../containers/App';
import ImageViewer from '../components/ImageViewer';
import Route404 from '../components/404/Route404';

class Entrance extends Component {
  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  previousLocation = this.props.location;

  render() {
    const { location } = this.props;

    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    );

    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={App} />
          <Route exact path="/:issue/:page?" component={ImageViewer.standalone} />
          <Route component={Route404} />
        </Switch>
        {isModal ? <Route path="/:issue/:page?" component={ImageViewer.modal} /> : null}
      </div>
    );
  }
}

Entrance.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

export default Entrance;
