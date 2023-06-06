import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { PlanetContext } from './AppContext';

const URL_API = 'https://swapi.dev/api/planets';

function PlanetProvider({ children }) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [originalData, SetOriginalData] = useState([]);

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
      setTableData((filterDataAPI));
      SetOriginalData((filterDataAPI));
    } catch (e) {
      setErrorMessage('Falha na requisição da API');
      // throw new Error('Falha na requisição da API');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAPI(URL_API);
  }, [fetchAPI]);

  const values = useMemo(() => ({
    isFetching,
    tableData,
    setTableData,
    errorMessage,
    originalData,
  }), [isFetching, tableData, setTableData, errorMessage, originalData]);

  return (
    <PlanetContext.Provider value={ values }>
      {children}
    </PlanetContext.Provider>
  );
}

PlanetProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default PlanetProvider;
