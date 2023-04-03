import memoize from 'lodash.memoize';

const fetchAllNewsAll = () => {
  return new Promise((resolve) => {
    fetch(`http://localhost:3001/api/news`)
      .then<any[]>((response) => response.json())
      .then((data) => resolve(data));
  });
};

export default memoize(fetchAllNewsAll);