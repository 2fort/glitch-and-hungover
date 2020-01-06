import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import data from '../json/data.json';
import Gallery from '../components/Gallery';
import ImageViewer from '../components/ImageViewer';

const useStyles = createUseStyles({
  hr: {
    marginTop: 0,
    marginBottom: '.75rem',
    border: 0,
    borderTop: '1px solid rgba(0,0,0,.1)',
  },

  anchor: {
    marginRight: 'auto',
    marginLeft: '7px',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& a': {
      visibility: 'hidden',
    },
    '&:hover': {
      '& a': {
        visibility: 'visible',
      },
    },
  },

  date: {
    textAlign: 'right',
  },

  main: {
    marginTop: '2rem',
  },

  footer: {
    padding: '1.5rem 0 2rem',
  },

  buttons: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const Main = () => {
  const classes = useStyles();
  const [year, setYear] = useState(2000);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const prevImg = useCallback(() => {
    if (activePage === 1) return;
    setActivePage(activePage - 1);
  }, [activePage]);

  const nextImg = useCallback(() => {
    if (activePage === data[activeGallery].files.length) return;
    setActivePage(activePage + 1);
  }, [activePage, activeGallery]);

  const close = useCallback(() => {
    setActiveGallery(null);
    setActivePage(null);
  }, []);

  const setActive = useCallback((galleryId, page) => {
    setActiveGallery(galleryId);
    setActivePage(page);
  }, []);

  return (
    <div className="container">
      <div className={classes.main}>
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
            className={classNames(classes.buttons, 'list-group-item', year === 2000 && 'active')}
            onClick={() => { setYear(2000); }}
          >
            2000–2001
          </button>
          <button
            type="button"
            className={classNames(classes.buttons, 'list-group-item', year === 1999 && 'active')}
            onClick={() => { setYear(1999); }}
          >
            1999
          </button>
        </div>

        <br /> <br />

        {Object.values(data).filter((elem) => elem.year === year).map((elem) => (
          <div key={elem.title}>
            <div className={classes.header}>
              <h4 id={elem.anchor}>{elem.title}</h4>
              <a className={classes.anchor} href={`#${elem.anchor}`}>
                <i className="fa fa-link fa-lg" aria-hidden="true" />
              </a>
              <p className={classes.date}>{elem.date}</p>
            </div>
            <hr className={classes.hr} />
            <Gallery title={elem.title} id={elem.id} images={elem.files} setActive={setActive} />
          </div>
        ))}

        {activeGallery && activePage &&
          <ImageViewer
            comics={data[activeGallery]}
            page={activePage}
            prevImg={prevImg}
            nextImg={nextImg}
            close={close}
          />}
      </div>
    </div>
  );
};

Main.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
  }).isRequired,
};

export default Main;
