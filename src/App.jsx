/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(userId) {
  return usersFromServer.find(user => user.id === userId) || null;
}

function getCategoryByProductId(categoryId) {
  return (
    categoriesFromServer.find(category => category.id === categoryId) || null
  );
}

const products = productsFromServer.map(product => {
  const category = getCategoryByProductId(product.categoryId);
  const user = category ? getUserById(category.ownerId) : null;

  return {
    ...product,
    category,
    user,
  };
});

function getPreparedGoods(goods, { ownerId, query }) {
  let prepearedGoods = [...goods];
  const normalizedQuery = query.trim().toLowerCase();

  if (ownerId) {
    prepearedGoods = prepearedGoods.filter(product => {
      return product.user?.id === ownerId;
    });
  }

  if (query) {
    prepearedGoods = prepearedGoods.filter(goods => {
      return goods.name.toLowerCase().includes(normalizedQuery);
    });
  }

  return prepearedGoods;
}

export const App = () => {
  const [query, setQuery] = useState('');
  const [activeOwnerId, setActiveOwnerId] = useState(null);
  const visibleGoods = getPreparedGoods(products, {
    ownerId: activeOwnerId,
    query,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!activeOwnerId ? 'is-active' : ''}
                onClick={() => setActiveOwnerId(null)}
              >
                All
              </a>

              {usersFromServer.map(owner => {
                return (
                  <a
                    key={owner.id}
                    data-cy="FilterAllUsers"
                    href="#/"
                    className={activeOwnerId === owner.id ? 'is-active' : ''}
                    onClick={() => setActiveOwnerId(owner.id)}
                  >
                    {owner.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => {
                    setQuery(event.currentTarget.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setActiveOwnerId(null);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleGoods.map(product => {
                return (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category
                        ? `${product.category.icon} - ${product.category.title}`
                        : '—'}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user?.sex === 'f'
                          ? 'has-text-danger'
                          : 'has-text-link'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
