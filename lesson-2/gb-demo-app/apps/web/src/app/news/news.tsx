import styles from './news.module.scss';
import { createContext, useEffect, useState } from 'react';
import fetchAllNewsAll from '../utils/fetchAllNewsAll';

/* eslint-disable-next-line */
export interface NewsProps {}

export interface PeaceOfNews {
  id: number;
  title: string;
  description: string;
  createdAt: number;
}

export function News(props: NewsProps) {
  const [news, setNews] = useState([] as any[]);

  const sortNews = (news: any[]) => {
    return news.sort((a, b) => a.createdAt - b.createdAt);
  };

  useEffect(() => {
    fetchAllNewsAll().then(news => {
      const sortedNews = sortNews(news as any[]);

      setNews(sortedNews);
    });
  }, []);

  return (
    <div>
      <h1>Последние новости</h1>
      <ul>
        {news.map((item, index) => {
          return (
            <div className="col-lg-6" key={index}>
              <div className="card">
                <img
                  src={'http://localhost:3002/' + item.cover}
                  className="card-img-top"
                  style={{ maxHeight: '250px' }}
                  alt=""
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Автор:
                    {item.user.firstName}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Дата создания:
                    {item.createdAt}
                  </h6>
                  <p className="card-text">{item.description}</p>

                  <a href="details/{{this.id}}" className="btn btn-primary">
                    Просмотреть новость
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default News;