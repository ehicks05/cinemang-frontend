import React from 'react';
import { SearchForm } from './components';

import FilmsWrapper from './Films';

const Home = () => (
  <div className="flex flex-col sm:gap-4">
    <SearchForm />
    <FilmsWrapper />
  </div>
);

export default Home;
