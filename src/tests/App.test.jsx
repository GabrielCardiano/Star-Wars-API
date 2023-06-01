import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FiltersProvider from '../context/FiltersProvider';
import PlanetProvider from '../context/PlanetProvider';
import App from '../App';


import mockAPI from './mockAPI';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('Testa a aplicação Star Wars', () => {
  
  const URL_API = 'https://swapi.dev/api/planets';
  
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      json: async () => mockAPI
    }));
  })

  afterEach(() => jest.restoreAllMocks())

  test('Testa se a requisição à API foi bem-sucedida', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    expect(global.fetch).toHaveBeenCalledWith(URL_API);

    await waitFor(() => {
      expect(screen.getAllByRole('cell')).toHaveLength(130);
    })

  });

  test('Testa se há falha na requisição à API', async () => {
    global.fetch.mockRejectedValueOnce(new Error ('Falha na requisição da API'))

    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    )
    
    expect(global.fetch).toHaveBeenCalledWith(URL_API);

    await waitFor(() => {
      expect(screen.getByRole('heading', {  name: /falha na requisição da api/i})).toBeInTheDocument();
    });
  })
 
  test('Testa se os elementos do header estão renderizados na tela', async () => {    
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const titleH1 = screen.getByRole('heading', { name: /Star wars/i })
    expect(titleH1).toBeInTheDocument();

    const nameFilter = screen.getByPlaceholderText(/search planet\.\.\./i)
    expect(nameFilter).toBeInTheDocument();
  });

  test('Testa se filtragem da tabela por NOME de planeta', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const nameFilter = screen.getByPlaceholderText(/search planet\.\.\./i)
    userEvent.type(nameFilter, 'oo')

    await waitFor(() => {
      expect(screen.getByRole('cell', {  name: /naboo/i})).toBeInTheDocument();
    })


  });

  test('Testa filtragem da tabela MAIOR_QUE um valor', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const columnFilters = screen.getByRole('combobox', {  name: /coluna/i})
    expect(columnFilters).toBeInTheDocument();

    const comparisonFilter = screen.getByRole('combobox', {  name: /operador/i})
    expect(comparisonFilter).toBeInTheDocument();

    const valueFilter = screen.getByRole('spinbutton');
    expect(valueFilter).toBeInTheDocument();

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'maior que');
      userEvent.type(valueFilter, 500);      
    })
  });

  test('Testa filtragem da tabela MENOR_QUE um valor', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const columnFilters = screen.getByRole('combobox', {  name: /coluna/i})
    expect(columnFilters).toBeInTheDocument();

    const comparisonFilter = screen.getByRole('combobox', {  name: /operador/i})
    expect(comparisonFilter).toBeInTheDocument();

    const valueFilter = screen.getByRole('spinbutton');
    expect(valueFilter).toBeInTheDocument();

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'menor que');
      userEvent.type(valueFilter, 500);
    });
    
  });

  test('Testa filtragem da tabela IGUAL_A um valor', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const columnFilters = screen.getByRole('combobox', {  name: /coluna/i})
    expect(columnFilters).toBeInTheDocument();

    const comparisonFilter = screen.getByRole('combobox', {  name: /operador/i})
    expect(comparisonFilter).toBeInTheDocument();

    const valueFilter = screen.getByRole('spinbutton');
    expect(valueFilter).toBeInTheDocument();

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'igual a');
      userEvent.type(valueFilter, 402);
    });

   await waitFor(() => {
      expect(screen.getByRole('cell', {  name: /endor/i})).toBeInTheDocument()
    })
  });


});
