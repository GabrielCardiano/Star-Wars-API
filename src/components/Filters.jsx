import React, { useContext } from 'react';
import { FilterContext, PlanetContext } from '../context/AppContext';

import '../styles/Filter.css';

const sortOptions = ['population',
  'orbital_period', 'diameter', 'rotation_period', 'surface_water'];
const comparisonOptions = ['maior que', 'menor que', 'igual a'];

function Filters() {
  const {
    planetName,
    formFilters,
    saveInputInState,
    filterTable,
    columnOptions,
    removeColumnOptions,
    activeFilters,
    removeFilter,
    saveActiveFilters,
    removeAllFilters,
    sortFilters,
    sortTable,
  } = useContext(FilterContext);

  const { columnFilter, comparisonFilter, valueFilter } = formFilters;
  const { order: { column } } = sortFilters;

  const { tableData } = useContext(PlanetContext);

  return (
    <>
      <header>
        <h1>Star Wars</h1>

        <input
          className="planetName"
          type="text"
          name="planetName"
          value={ planetName }
          placeholder="Search planet..."
          onChange={ saveInputInState }
          data-testid="name-filter"
        />
      </header>

      <form className="formFilters">

        <label>
          Coluna
          <select
            name="columnFilter"
            value={ columnFilter }
            onChange={ saveInputInState }
            data-testid="column-filter"
          >
            {columnOptions.map((option, index) => (
              <option
                key={ index }
                value={ option }
                className="option"
              >
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Operador
          <select
            name="comparisonFilter"
            value={ comparisonFilter }
            onChange={ saveInputInState }
            data-testid="comparison-filter"
          >
            {comparisonOptions.map((option, index) => (
              <option
                key={ index }
                value={ option }
                className="option"
              >
                {option}
              </option>
            ))}
          </select>
        </label>

        <input
          type="number"
          name="valueFilter"
          value={ valueFilter }
          placeholder="Select value..."
          data-testid="value-filter"
          onChange={ saveInputInState }
          className="valueFilter"
        />

        <button
          type="button"
          data-testid="button-filter"
          className="formButton"
          onClick={ () => {
            saveActiveFilters(formFilters);
            filterTable(tableData, formFilters);
            removeColumnOptions(columnFilter);
          } }
        >
          Filtrar
        </button>

        <label>
          Ordenar
          <select
            name="columnSort"
            data-testid="column-sort"
            value={ column }
            onChange={ saveInputInState }
          >
            {sortOptions.map((option, index) => (
              <option key={ index } value={ option }>{option}</option>
            )) }
          </select>
        </label>

        <label>
          Ascendente
          <input
            type="radio"
            name="sortRadio"
            value="ASC"
            data-testid="column-sort-input-asc"
            onChange={ saveInputInState }
          />
        </label>

        <label>
          Descendente
          <input
            type="radio"
            name="sortRadio"
            value="DESC"
            data-testid="column-sort-input-desc"
            onChange={ saveInputInState }
          />
        </label>

        <button
          type="button"
          className="formButton"
          data-testid="column-sort-button"
          onClick={ () => sortTable(tableData, sortFilters) }
        >
          Ordenar

        </button>

        <button
          type="button"
          className="formButton"
          data-testid="button-remove-filters"
          onClick={ removeAllFilters }
        >
          Remover todas filtragens

        </button>
      </form>

      <section className="tagSection">
        {
          activeFilters && activeFilters.map((tag, index) => (
            <div key={ index } className="tag" data-testid="filter">
              <span>
                {`${tag.columnFilter} 
              ${tag.comparisonFilter} -
              ${tag.valueFilter}`}
              </span>

              <button
                type="button"
                onClick={ () => removeFilter(tag) }
                data-testid="remove-filter"
              >
                Excluir
              </button>
            </div>
          ))
        }
      </section>
    </>
  );
}

export default Filters;
