import memoize from 'lodash.memoize';
import { PeaceOfNews } from '../news/news';

const fetchOneNewsAll = (id: string | undefined) => {
  return new Promise<PeaceOfNews>((resolve) => {
    fetch(`http://localhost:3001/api/news/${id}`)
      .then<PeaceOfNews>((response) => response.json())
      .then((data) => resolve(data));
  });
};

export default memoize(fetchOneNewsAll);