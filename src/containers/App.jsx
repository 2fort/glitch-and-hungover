import React from 'react';
import data from '../json/data.json';
import * as css from './App.style';

const App = () => {
  const formattedData = Object.values(data).map((elem) => {
    const elemImages = elem.files.map((file, i) => (
      <div className={css.imageContainer} key={file}>
        <a href={`/img/m/${file}`}>
          <img className={css.image} alt={`${elem.title} ${i + 1}`} src={`/img/s/${file}`} />
        </a>
      </div>
    ));

    return (
      <div key={elem.title}>
        <div className={css.header}>
          <h4>{elem.title}</h4>
          <p className={css.date}>{elem.date}</p>
        </div>
        <hr className={css.hr} />
        <div className={css.images}>
          {elemImages}
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <div className={css.main}>
        {formattedData}
      </div>
    </div>
  );
};

export default App;
