import React from 'react';
import data from '../json/data.json';
import * as css from './App.style';
import Gallery from '../components/Gallery';

const App = () => {
  const formattedData = Object.values(data).map(elem => (
    <div key={elem.title}>
      <div className={css.header}>
        <h4 id={elem.anchor}>{elem.title}</h4>
        <p className={css.date}>{elem.date}</p>
      </div>
      <hr className={css.hr} />
      <Gallery id={elem.anchor} images={elem.files} alt={elem.title} />
    </div>
  ));

  return (
    <div>
      <div className="container">
        <div className={css.main}>
          <p>
            Сайт посвящен комиксу «Глюк &amp; Отходняк», публиковавшемуся в журнале
            ПЛ: Компьютеры в конце 90х - начале 2000х годов.<br />
            Автор - А. Нимов. Производство студии ТЕМА.
          </p><br />
          {formattedData}
        </div>
      </div>
    </div>
  );
};

export default App;
