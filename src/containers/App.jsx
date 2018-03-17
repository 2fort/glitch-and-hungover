import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { classes } from 'typestyle';
import data from '../json/data.json';
import * as css from './App.style';
import Gallery from '../components/Gallery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { year: 2000 };
  }

  componentWillMount() {
    if (this.props.location.hash) {
      const id = this.props.location.hash.substring(1);
      const issue = Object.values(data).filter(el => el.anchor === id);

      if (issue[0] && issue[0].year !== this.state.year) {
        this.setState({ year: issue[0].year });
      }
    }
  }

  componentDidMount() {
    if (this.props.location.hash) {
      const el = document.getElementById(this.props.location.hash.substring(1));

      if (!el) return;
      el.scrollIntoView();
    }
  }

  composeGalleries = () => Object.values(data).filter(elem => elem.year === this.state.year).map(elem => (
    <div key={elem.title}>
      <div className={css.header}>
        <h4 id={elem.anchor}>{elem.title}</h4>
        <a className={css.anchor} href={`#${elem.anchor}`}>
          <i className="fa fa-link fa-lg" aria-hidden="true" />
        </a>
        <p className={css.date}>{elem.date}</p>
      </div>
      <hr className={css.hr} />
      <Gallery title={elem.title} id={elem.anchor} images={elem.files} />
    </div>
  ));

  render() {
    const { year } = this.state;

    return (
      <div className="container">
        <div className={css.main}>
          <p>
            Сайт посвящен комиксу «Глюк &amp; Отходняк», публиковавшемуся в журнале
            ПЛ: Компьютеры в конце 90х – начале 2000х годов.
          </p>
          <p>Автор — А. Нимов. Производство студии ТЕМА.</p>
          <br />

          <p>Годы выпуска:</p>
          <div className="list-group">
            <button
              type="button"
              className={classes(css.buttons, 'list-group-item', year === 2000 && 'active')}
              onClick={() => { this.setState({ year: 2000 }); }}
            >
              2000–2001
            </button>
            <button
              type="button"
              className={classes(css.buttons, 'list-group-item', year === 1999 && 'active')}
              onClick={() => { this.setState({ year: 1999 }); }}
            >
              1999
            </button>
          </div>

          <br /> <br />

          {this.composeGalleries()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
};

export default withRouter(App);
