import React, { useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FilterContext, PlanetContext } from './AppContext';

const MAIOR_QUE = 'maior que';
const MENOR_QUE = 'menor que';
const IGUAL_A = 'igual a';

const initialState = {
  columnFilter: 'population',
  comparisonFilter: 'maior que',
  valueFilter: 0,
};

function FiltersProvider({ children }) {
  const [planetName, setPlanetName] = useState('');
  const [formFilters, setFormFilters] = useState(initialState);

  const { setTableData } = useContext(PlanetContext);

  const saveInputInState = useCallback(({ target }) => {
    switch (target.name) {
    case 'planetName':
      setPlanetName(target.value);
      break;
    case 'columnFilter':
      setFormFilters({ ...formFilters, columnFilter: target.value });
      break;
    case 'comparisonFilter':
      setFormFilters({ ...formFilters, comparisonFilter: target.value });
      break;
    case 'valueFilter':
      setFormFilters({ ...formFilters, valueFilter: target.value });
      break;
    default:
    }
  }, [formFilters]);

  const filterTable = useCallback((table, filtersObj) => {
    const { columnFilter, comparisonFilter, valueFilter } = filtersObj;

    console.log(filtersObj);

    if (comparisonFilter === MAIOR_QUE) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) > Number(valueFilter));
      setTableData(filterDataTable);
    }

    if (comparisonFilter === MENOR_QUE) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) < Number(valueFilter));
      setTableData(filterDataTable);
    }

    if (comparisonFilter === IGUAL_A) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) === Number(valueFilter));
      setTableData(filterDataTable);
    }
  }, [setTableData]);

  const values = useMemo(() => ({
    planetName,
    setPlanetName,
    formFilters,
    setFormFilters,
    saveInputInState,
    filterTable,
  }), [
    planetName,
    setPlanetName,
    formFilters,
    setFormFilters,
    saveInputInState,
    filterTable,
  ]);

  return (
    <FilterContext.Provider value={ values }>
      {children}
    </FilterContext.Provider>
  );
}

FiltersProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default FiltersProvider;
