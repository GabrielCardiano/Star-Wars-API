import React, { useContext } from 'react';
import { FilterContext } from '../context/AppContext';

function Filters() {
  const { formData, setFormData } = useContext(FilterContext);
  const { planetName } = formData;

  return (
    <header>
      <h1> A wizard is never late</h1>

      <input
        type="text"
        name="planetName"
        value={ planetName }
        placeholder="Search planet..."
        onChange={ (e) => setFormData({ planetName: e.target.value }) }
        data-testid="name-filter"
      />

    </header>
  );
}

export default Filters;
