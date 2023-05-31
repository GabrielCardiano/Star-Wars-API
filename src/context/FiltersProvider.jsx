import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FilterContext } from './AppContext';

const initialState = {
  planetName: '',
};

function FiltersProvider({ children }) {
  const [formData, setFormData] = useState(initialState);

  const values = useMemo(() => ({
    formData,
    setFormData,
  }), [
    formData,
    setFormData,
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
