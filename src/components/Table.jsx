import React, { useContext, useEffect, useState } from 'react';
import { PlanetContext, FilterContext } from '../context/AppContext';

function Table() {
  const { tableData, errorMessage } = useContext(PlanetContext);
  const { planetName } = useContext(FilterContext);

  const [table, setTable] = useState([]);

  useEffect(() => {
    const filterTable = tableData
      .filter((planet) => planet.name.toLowerCase().includes(planetName.toLowerCase()));
    setTable(filterTable);
  }, [tableData, planetName]);

  if (errorMessage) return <h2>{errorMessage}</h2>;

  return (
    <main>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>

        <tbody>
          {table.map((planet, index) => (
            <tr key={ index }>
              <td>{planet.name}</td>
              <td>{planet.rotation_period}</td>
              <td>{planet.orbital_period}</td>
              <td>{planet.diameter}</td>
              <td>{planet.climate}</td>
              <td>{planet.gravity}</td>
              <td>{planet.terrain}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
              <td>{planet.films}</td>
              <td>{planet.created}</td>
              <td>{planet.edited}</td>
              <td>{planet.url}</td>
            </tr>
          ))}

        </tbody>

      </table>
    </main>
  );
}

export default Table;
