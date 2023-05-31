import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PlanetProvider from './context/PlanetProvider';
import FiltersProvider from './context/FiltersProvider';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <PlanetProvider>
      <FiltersProvider>
        <App />
      </FiltersProvider>
    </PlanetProvider>,
  );
