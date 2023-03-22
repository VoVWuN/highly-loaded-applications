import memoize from 'lodash.memoize';
import { PeaceOfNews } from '../news/news';

const fetchAllNewsAll = () => {
  return new Promise(resolve => {
    fetch(`http://localhost:3002/api/news/all`)
      .then<any[]>(response => response.json())
      .then(data => resolve(data));
  });
};

export default memoize(fetchAllNewsAll);