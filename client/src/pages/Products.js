import React, { useEffect } from 'react';
import Item from './Item';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRODUCTS } from '../utils/actions';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';


function ProductList() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { currentCategory } = state;

  const { loading, data } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <Item
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
    
    </div>
  );
}

export default ProductList;
