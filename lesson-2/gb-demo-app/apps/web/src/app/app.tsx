// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import News, { PeaceOfNews } from './news/news';
import CreateNews from './create-news/create-news';
import { useEffect, useState } from 'react';
import { NewsContext } from './context';

export function App() {
  return (
    <>
      {/*<NxWelcome title="web" />*/}

      <div />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/news">Новости</Link>
          </li>
          <li>
            <Link to="/create">Добавить новость</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Главная страница</h1>
            </div>
          }
        />
        <Route path="/news" element={<News />} />
        <Route path="/create" element={<CreateNews />} />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;