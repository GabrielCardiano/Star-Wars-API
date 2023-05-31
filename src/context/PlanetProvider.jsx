import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PlanetContext from './AppContext';

const URL_API = 'https://swapi.dev/api/planets';

function PlanetProvider({ children }) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Falha na requisição');
  const [planetsAPI, setPlanetsAPI] = useState([]);

  const fetchAPI = useCallback(async (url) => {
    try {
      setIsFetching(true);

      const response = await fetch(url);
      const data = await response.json();

      const filterDataAPI = data.results
        .map((planetResult) => {
          delete planetResult.residents;
          return planetResult;
        });
      setPlanetsAPI((filterDataAPI));
    } catch (e) {
      setErrorMessage('Falha na requisição');
      throw new Error(errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    fetchAPI(URL_API);
  }, [fetchAPI]);

  const context = useMemo(() => ({
    isFetching,
    planetsAPI,
  }), [
    isFetching,
    planetsAPI,
  ]);

  return (
    <PlanetContext.Provider value={ context }>
      {children}
    </PlanetContext.Provider>
  );
}

PlanetProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default PlanetProvider;
