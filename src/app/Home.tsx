import React from 'react';
import { SearchForm } from './components';

import FilmsWrapper from './Films';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <SearchForm />
      <FilmsWrapper />
    </div>
  );
};

export default Home;
