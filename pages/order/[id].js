import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { Store } from '../../utils/Store';
//import NextLink from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../styles/sass/main.module.scss';
//import CheckoutWizard from '../../components/CheckoutWizard';
import moment from 'moment';
import {
  AchPay,
  CreditCardInput,
  SquarePaymentsForm,
} from 'react-square-web-payments-sdk';
import { getError } from '../../utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CircularProgress, ListItem } from '@material-ui/core';
import Swal from 'sweetalert2';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

const Order = ({ params }) => {
  const [squarepay, setSquarepay] = React.useState(false);
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const [
    { loading, order, successPay, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const {
    shippingAddress,
    paymentMethod,
    //orderItems,
    totalPrice,
    isPaid,
    paidAt,
    //isDelivered,
    //deliveredAt,
  } = order;

  console.log(paymentMethod);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  useEffect(() => {
    if (squarepay) {
      const udpateOrder = async () => {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = axios.put(
            `/api/orders/${order._id}/pay`,
            {},
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          Toast.fire({
            icon: 'success',
            title: 'Payment Success',
          });
        } catch (err) {
          dispatch({ type: 'PAY_FAIL', payload: getError(err) });
          Toast.fire({
            icon: 'error',
            title: 'Error',
          });
        }
      };
      const fetchOrder = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/orders/${orderId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      udpateOrder();
      fetchOrder();
    }
  }, [squarepay, order]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        Toast.fire({
          icon: 'success',
          title: 'Payment Success',
        });
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        Toast.fire({
          icon: 'error',
          title: getError(err),
        });
      }
    });
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      Toast.fire({
        icon: 'success',
        title: 'Class Deliver Success',
      });
      router.push('/admin/orders');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
  }

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

  function onError(err) {
    Toast.fire({
      icon: 'error',
      title: getError(err),
    });
  }

  const square = async (token) => {
    try {
      const response = await fetch('/api/paySuare', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          sourceId: token.token,
          amount: totalPrice,
        }),
      });
      if (response.status === 200) {
        setSquarepay(true);
      }

      if (response.status != 200) {
        Toast.fire({
          icon: 'error',
          title: 'Transaction Rejected, Call your Bank',
        });
      }
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: 'Transaction Rejected',
      });
      //console.log(err.message);
    }
  };

  return (
    <>
      <NextSeo
        title={`Order:  ${orderId}`}
        description="Universal Acting Place Order "
      />

      {/* <CheckoutWizard activeStep={3} /> */}
      {loading && (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      )}
      <div className={styles.placeordercontainer}>
        <div className={styles.placeordercontainer__child1}>
          <h4 className={styles.placeordercontainer__title}>
            ORDER: {orderId}
          </h4>
          <p className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              User:{' '}
            </span>

            {order.userInfo && order.userInfo.email}
          </p>
          <p className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Phone:{' '}
            </span>

            {order.userInfo && order.userInfo.celphone}
          </p>
          <p className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Student(s):{' '}
            </span>
            {shippingAddress && shippingAddress.student}
          </p>
          <p className={styles.placeordercontainer__items}>
            <span className={styles.placeordercontainer__items__title}>
              Age:{' '}
            </span>
            {shippingAddress && shippingAddress.age}
          </p>

          {/* <div className={styles.placeordercontainer__items}>
        Status:{' '} {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}
        </div> */}

          <div className={styles.placeordercontainer__hugo}>
            <div className={styles.placeordercontainer__cart}>
              {cartItems.map((item) => (
                <div
                  className={styles.placeordercontainer__cart__items}
                  key={item._id}
                >
                  <div className={styles.placeordercontainer__cart__items__u}>
                    <Image
                      src={item.image}
                      width={80}
                      height={50}
                      alt="mision universal"
                    ></Image>
                  </div>

                  <p className={styles.placeordercontainer__cart__items__u}>
                    {item.name}
                  </p>
                  <p className={styles.placeordercontainer__cart__items__u}>
                    ${item.price}
                  </p>
                  <p className={styles.placeordercontainer__cart__items__u}>
                    {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.placeordercontainer__pilas}>
          <div className={styles.placeordercontainer__total}>
            Total:${totalPrice} with {paymentMethod}
          </div>
          <div className={styles.placeordercontainer__items}>
            Status:{' '}
            {isPaid ? (
              `paid at ${moment(paidAt).format('lll')}`
            ) : (
              <span className={styles.notpaid}>Not paid</span>
            )}
          </div>
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <ListItem>
              {loadingDeliver && <CircularProgress />}
              <input
                type="submit"
                value="Update Taken"
                className={styles.logincontact__button}
                onClick={deliverOrderHandler}
              />
            </ListItem>
          )}
          {!isPaid && paymentMethod === 'Paypal' && (
            <div>
              {isPending ? (
                <CircularProgress />
              ) : (
                <div className={styles.paypal}>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              )}
            </div>
          )}

          {!isPaid && paymentMethod === 'Square' && (
            <div>
              <div className={styles.logosquare}>
                <Image
                  src="/img/square.jpg"
                  alt="square"
                  width={384}
                  height={216}
                />
              </div>

              <SquarePaymentsForm
                applicationId="sq0idp-D4NAPq4X0ENkRCxUlGkbVA"
                locationId="2FMPMZ3C4Z8FD"
                cardTokenizeResponseReceived={square}
              >
                <CreditCardInput />
                <div className={styles.botonsquare}></div>
                <AchPay accountHolderName="Universal Acting" />
              </SquarePaymentsForm>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
