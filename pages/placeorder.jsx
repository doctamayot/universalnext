import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Store } from '../utils/Store';

import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/sass/main.module.scss';
import { NextSeo } from 'next-seo';
import CheckoutWizard from '../components/CheckoutWizard';

import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { CircularProgress, withStyles, Button } from '@material-ui/core';
import yellow from '@material-ui/core/colors/yellow';

const ColorButton = withStyles(() => ({
  root: {
    color: '#fff',
    backgroundColor: yellow[800],
    fontSize: '20px',
    fontFamily: 'Bebas Neue',
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },
}))(Button);

function Placeorder() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    userInfo,

    cart: { claseid, cartItems, shippingAddress, paymentMethod },
  } = state;

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const totalPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const cantidad = cartItems.reduce((a, c) => a + c.quantity, 0);

  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          totalPrice,
          userInfo,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');

      Toast.fire({
        icon: 'success',
        title: 'Success',
      });

      setLoading(false);
      const { data2 } = await axios.put(
        `/api/admin/products/${claseid}/student`,
        { userInfo, shippingAddress, data, cantidad },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data2);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      Toast.fire({
        icon: 'error',
        title: err,
      });
    }
  };

  return (
    <>
      <NextSeo
        title="Universal Acting - Place Order"
        description="Universal Acting Place Order "
      />

      <CheckoutWizard activeStep={3} />
      {loading && (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      )}
      <div className={styles.placeordercontainer}>
        <div className={styles.placeordercontainer__child1}>
          <h4 className={styles.placeordercontainer__title}>ORDER INFO</h4>
          <div className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              User:{' '}
            </span>

            {userInfo && userInfo.email}
          </div>
          <div className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Phone:{' '}
            </span>

            {userInfo && userInfo.celphone}
          </div>
          <div className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Student(s):{' '}
            </span>
            {shippingAddress && shippingAddress.student}
          </div>
          <div className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Age:{' '}
            </span>
            {shippingAddress && shippingAddress.age}
          </div>

          <div className={styles.placeordercontainer__hugo}>
            <div>
              {cartItems.map((item) => (
                <div
                  className={styles.placeordercontainer__items}
                  key={item._id}
                >
                  <div className={styles.placeordercontainer__items__title}>
                    <Image
                      src={item.image}
                      width={80}
                      height={50}
                      alt="mision universal"
                    ></Image>
                  </div>

                  <p className={styles.placeordercontainer__cart__items__title}>
                    {item.name}
                  </p>
                  <p className={styles.placeordercontainer__cart__items__title}>
                    ${item.price}
                  </p>
                  <p className={styles.placeordercontainer__cart__items__title}>
                    {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.placeordercontainer__pilas}>
          <div className={styles.placeordercontainer__total}>
            Total:({cartItems.reduce((a, c) => a + c.quantity, 0)} classes) : $
            {totalPrice} with {paymentMethod}
          </div>
          <div className={styles.cartcontainer__cartresume}>
            <ColorButton
              className={styles.placeorder__button}
              onClick={placeOrderHandler}
              variant="contained"
            >
              Place Order
            </ColorButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Placeorder), { ssr: false });
