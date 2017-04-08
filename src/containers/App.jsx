import React from 'react';
import data from '../json/data.json';
import * as css from './App.style';
import Gallery from '../components/Gallery';
import ImageViewer from '../components/ImageViewer';

const App = () => {
  const formattedData = Object.values(data).map(elem => (
    <div key={elem.title}>
      <div className={css.header}>
        <h4 id={elem.anchor}>{elem.title}</h4>
        <p className={css.date}>{elem.date}</p>
      </div>
      <hr className={css.hr} />
      <Gallery images={elem.files} alt={elem.title} />
    </div>
  ));

  return (
    <div>
      <div className="container">
        <div className={css.main}>
          {formattedData}
        </div>
      </div>
      <ImageViewer />
    </div>
  );
};

export default App;
