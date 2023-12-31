import React from 'react';
import { queryAllByRole, render, screen, waitFor } from '@testing-library/react';
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
    global.fetch.mockRejectedValueOnce(new Error('Falha na requisição da API'))

    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    )

    expect(global.fetch).toHaveBeenCalledWith(URL_API);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /falha na requisição da api/i })).toBeInTheDocument();
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
      expect(screen.getByRole('cell', { name: /naboo/i })).toBeInTheDocument();
    })


  });

  // test('Testa filtragem da tabela MAIOR_QUE um valor', async () => {
  //   render(
  //     <PlanetProvider>
  //       <FiltersProvider>
  //         <App />
  //       </FiltersProvider>
  //     </PlanetProvider>
  //   );

  //   const columnFilters = screen.getByRole('combobox', {  name: /coluna/i})
  //   expect(columnFilters).toBeInTheDocument();

  //   const comparisonFilter = screen.getByRole('combobox', {  name: /operador/i})
  //   expect(comparisonFilter).toBeInTheDocument();

  //   const valueFilter = screen.getByRole('spinbutton');
  //   expect(valueFilter).toBeInTheDocument();

  //   const filterBtn = screen.getByRole('button', {  name: /filtrar/i})

  //   act(() => {
  //     userEvent.selectOptions(columnFilters, 'orbital_period');
  //     userEvent.selectOptions(comparisonFilter, 'maior que');
  //     userEvent.clear(valueFilter)
  //     userEvent.type(valueFilter, 500);
  //     userEvent.click(filterBtn)
  //   })

  //   await waitFor(() => {
  //     expect(screen.getByRole('cell', {  name: /yavin/i})).toBeInTheDocument();
  //     expect(screen.queryByText('Endor')).toBeInTheDocument();
  //   })
  // });

  test('Testa filtragem da tabela MENOR_QUE um valor', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    expect(await screen.findByRole('cell', { name: /yavin iv/i })).toBeInTheDocument();

    const columnFilters = screen.getByRole('combobox', { name: /coluna/i })
    const comparisonFilter = screen.getByRole('combobox', { name: /operador/i })
    const valueFilter = screen.getByRole('spinbutton');
    const filterBtn = screen.getByRole('button', { name: /filtrar/i })

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'menor que');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 500);
      userEvent.click(filterBtn)
    });

    await waitFor(() => {
      expect(screen.queryByRole('cell', { name: /yavin iv/i })).not.toBeInTheDocument();

    })

  });

  test('Testa filtragem da tabela IGUAL_A um valor', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    expect(await screen.findByRole('cell', { name: /yavin iv/i })).toBeInTheDocument();

    const columnFilters = screen.getByRole('combobox', { name: /coluna/i })
    const comparisonFilter = screen.getByRole('combobox', { name: /operador/i })
    const valueFilter = screen.getByRole('spinbutton');
    const filterBtn = screen.getByRole('button', { name: /filtrar/i })

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'igual a');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 402);
      userEvent.click(filterBtn)
    });

    await waitFor(() => {
      expect(screen.queryByRole('cell', { name: /yavin iv/i })).not.toBeInTheDocument();
    })
  });

  test('Testa filtro de Coluna é atualizado após um filtro ser escolhido', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const columnFilters = screen.getByTestId('column-filter');
    expect(columnFilters.children).toHaveLength(5);

    const filterBtn = screen.getByRole('button', { name: /filtrar/i })

    act(() => {
      userEvent.click(filterBtn)
    });

    await waitFor(() => {
      expect(columnFilters.children).toHaveLength(4);
    })


  })

  test('Testa se excluir um fitro atualiza novamente a tabela', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const columnFilters = screen.getByRole('combobox', { name: /coluna/i })
    const comparisonFilter = screen.getByRole('combobox', { name: /operador/i })
    const valueFilter = screen.getByRole('spinbutton');
    const filterBtn = screen.getByRole('button', { name: /filtrar/i })
    const tableCells = await screen.findAllByRole('cell');

    expect(tableCells).toHaveLength(130);

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'maior que');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 500);
      userEvent.click(filterBtn)
    })

    await waitFor(() => {
      const removeFilterBtn = screen.getByTestId('remove-filter')

      expect(removeFilterBtn).toBeInTheDocument();
      userEvent.click(removeFilterBtn)
    })

  })

  test('Testa se o botão remove todos os filtros', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );
    const columnFilters = screen.getByRole('combobox', { name: /coluna/i })
    const comparisonFilter = screen.getByRole('combobox', { name: /operador/i })
    const valueFilter = screen.getByRole('spinbutton');
    const filterBtn = screen.getByRole('button', { name: /filtrar/i })

    act(() => {
      userEvent.selectOptions(columnFilters, 'orbital_period');
      userEvent.selectOptions(comparisonFilter, 'maior que');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 500);
      userEvent.click(filterBtn)

      userEvent.selectOptions(columnFilters, 'rotation_period');
      userEvent.selectOptions(comparisonFilter, 'maior que');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 20);
      userEvent.click(filterBtn)

      userEvent.selectOptions(columnFilters, 'rotation_period');
      userEvent.selectOptions(comparisonFilter, 'menor que');
      userEvent.clear(valueFilter)
      userEvent.type(valueFilter, 8000);
      userEvent.click(filterBtn)
    })

    await waitFor(() => {
      expect(screen.getByText('Hoth')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /excluir/i })).toHaveLength(3);
    })

    const removeAllFilters = screen.getByRole('button', { name: /remover todas filtragens/i });
    userEvent.click(removeAllFilters);

    await waitFor(() => {
      expect(screen.queryAllByRole('button', { name: /excluir/i })).toHaveLength(0);
    })
  })

  test('Testa filtros de ordenação da tabela', async () => {
    render(
      <PlanetProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </PlanetProvider>
    );

    const sortColumn = screen.getByRole('combobox', {  name: /ordenar/i});
    expect(sortColumn).toBeInTheDocument();

    const sortASC = screen.getByRole('radio', {  name: /ascendente/i});
    expect(sortASC).toBeInTheDocument();

    const sortBtn = screen.getByRole('button', {  name: /ordenar/i})

    act(() => {
      userEvent.selectOptions(sortColumn, 'surface_water')
      userEvent.click(sortASC)
    })

    await waitFor(() => {
      const tableCells = screen.getAllByTestId('planet-name');
    })

  })
  
});
