import memoize from 'lodash.memoize';
import { PeaceOfNews } from './news/news';

const getData = () => {
  return new Promise<PeaceOfNews[]>(resolve => {
    fetch('http://localhost:3001/api/news')
      .then<PeaceOfNews[]>(response => response.json())
      .then(data => resolve(data));
  });
};

export default memoize(getData);