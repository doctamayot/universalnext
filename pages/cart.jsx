import React, { useContext } from 'react';
import styles from '../styles/sass/main.module.scss';
import Image from 'next/image';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';

const Cart = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    router.push('/shipping');
  };

  return (
    <>
      <h4 className={styles.cartcontainer__title}>Shopping Cart</h4>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <NextLink href="/" passHref>
            <a>Go shopping</a>
          </NextLink>
        </div>
      ) : (
        <div className={styles.cartcontainer}>
          {cartItems.map((item) => (
            <div className={styles.cartcontainer__articles} key={item._id}>
              <div className={styles.cartcontainer__articles__container}>
                <div className={styles.cartcontainer__articles__article}>
                  <Image
                    src={item.image}
                    width={80}
                    height={50}
                    alt="mision universal"
                  ></Image>
                  <p>{item.name}</p>
                  <select
                    value={item.quantity}
                    onChange={(e) => updateCartHandler(item, e.target.value)}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <p>${item.price}</p>
                  <p
                    className={styles.cartcontainer__articles__article__remove}
                    onClick={() => removeItemHandler(item)}
                  >
                    X
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.cartcontainer__cartresume}>
            <h2 className={styles.cartcontainer__cartresume__subtotal}>
              Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} classes)
              : ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
            </h2>

            <button
              className={styles.cartcontainer__cartresume__button}
              onClick={checkoutHandler}
            >
              CheckOut
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
