import React, { useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FilterContext, PlanetContext } from './AppContext';

const MAIOR_QUE = 'maior que';
const MENOR_QUE = 'menor que';
const IGUAL_A = 'igual a';

const initialOptions = ['population',
  'orbital_period', 'diameter', 'rotation_period', 'surface_water'];

const initialState = {
  columnFilter: 'population',
  comparisonFilter: 'maior que',
  valueFilter: 0,
};

const initialSort = { order: { column: 'population', sort: 'ASC' } };

function FiltersProvider({ children }) {
  const [planetName, setPlanetName] = useState('');
  const [formFilters, setFormFilters] = useState(initialState);
  const [activeFilters, setActiveFilters] = useState([]);
  const [columnOptions, setColumnOptions] = useState(initialOptions);
  const [sortFilters, setSortFilters] = useState(initialSort);

  const { setTableData, originalData } = useContext(PlanetContext);

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
    case 'columnSort':
      setSortFilters({ order: { ...sortFilters.order, column: target.value } });
      break;
    case 'sortRadio':
      setSortFilters({ order: { ...sortFilters.order, sort: target.value } });
      break;
    default:
    }
  }, [formFilters, sortFilters.order]);

  const saveActiveFilters = useCallback((filtersObj) => {
    setActiveFilters((prevFilters) => [...prevFilters, filtersObj]);

    setFormFilters(initialState);
  }, []);

  const removeColumnOptions = useCallback((columnFilter) => {
    const updateColumnOptions = columnOptions.filter((option) => option !== columnFilter);

    setColumnOptions(updateColumnOptions);
  }, [columnOptions]);

  const filterTable = useCallback((table, filtersObj) => {
    const { columnFilter, comparisonFilter, valueFilter } = filtersObj;

    if (comparisonFilter === MAIOR_QUE) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) > Number(valueFilter));
      return setTableData(filterDataTable);
    }

    if (comparisonFilter === MENOR_QUE) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) < Number(valueFilter));
      return setTableData(filterDataTable);
    }

    if (comparisonFilter === IGUAL_A) {
      const filterDataTable = table
        .filter((elem) => Number((elem[columnFilter])) === Number(valueFilter));
      return setTableData(filterDataTable);
    }
  }, [setTableData]);

  const newTable = useCallback((originalTable, newFiltersArray) => {
    let updatedTable = [...originalTable];
    newFiltersArray.forEach((filter) => {
      const { columnFilter, comparisonFilter, valueFilter } = filter;
      if (comparisonFilter === MAIOR_QUE) {
        updatedTable = originalTable
          .filter((elem) => Number((elem[columnFilter])) > Number(valueFilter));
        setTableData(updatedTable);
      } else if (comparisonFilter === MENOR_QUE) {
        updatedTable = originalTable
          .filter((elem) => Number((elem[columnFilter])) < Number(valueFilter));
        setTableData(updatedTable);
      } else if (comparisonFilter === IGUAL_A) {
        updatedTable = originalTable
          .filter((elem) => Number((elem[columnFilter])) === Number(valueFilter));
        setTableData(updatedTable);
      }
    });
    setTableData(updatedTable);
  }, [setTableData]);

  const removeFilter = useCallback((filterTag) => {
    const updateActiveFilters = activeFilters
      .filter((tag) => tag.columnFilter !== filterTag.columnFilter);

    setActiveFilters(updateActiveFilters);
    setColumnOptions([...columnOptions, filterTag.columnFilter]);

    newTable(originalData, updateActiveFilters);
  }, [activeFilters, columnOptions, originalData, newTable]);

  const removeAllFilters = useCallback(() => {
    setActiveFilters([]);

    newTable(originalData, []);
  }, [newTable, originalData]);

  const sortTable = useCallback((table, filterObj) => {
    const { order: { column, sort } } = filterObj;

    console.log(table);

    const unknownValues = table.filter((planet) => planet[column] === 'unknown');
    const knownValues = table.filter((planet) => planet[column] !== 'unknown');

    if (sort === 'ASC') {
      const sortValues = knownValues.sort((a, b) => (
        Number(a[column] - b[column])
      ));
      setTableData([...sortValues, ...unknownValues]);
    } else if (sort === 'DESC') {
      const sortValues = knownValues.sort((a, b) => (
        Number(b[column] - a[column])
      ));
      setTableData([...sortValues, ...unknownValues]);
    }
  }, [setTableData]);

  const values = useMemo(() => ({
    planetName,
    setPlanetName,
    formFilters,
    setFormFilters,
    saveInputInState,
    filterTable,
    activeFilters,
    saveActiveFilters,
    columnOptions,
    removeColumnOptions,
    removeFilter,
    removeAllFilters,
    sortFilters,
    sortTable,
  }), [
    planetName,
    setPlanetName,
    formFilters,
    setFormFilters,
    saveInputInState,
    filterTable,
    activeFilters,
    saveActiveFilters,
    columnOptions,
    removeColumnOptions,
    removeFilter,
    removeAllFilters,
    sortFilters,
    sortTable,
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
