import React, { useContext } from 'react';
import { FilterContext, PlanetContext } from '../context/AppContext';

import '../styles/Filter.css';

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
  } = useContext(FilterContext);

  const { columnFilter, comparisonFilter, valueFilter } = formFilters;

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
