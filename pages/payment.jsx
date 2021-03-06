import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Store } from '../utils/Store';
import CheckoutWizard from '../components/CheckoutWizard';

import { NextSeo } from 'next-seo';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/sass/main.module.scss';
import Image from 'next/image';

export default function Payment() {
  const loginSchema = Yup.object().shape({
    payment: Yup.string().required('Name is required'),
  });

  const router = useRouter();

  const { dispatch } = useContext(Store);
  // const {
  //   cart: { shippingAddress },
  // } = state;

  const submitHandler = async (values) => {
    const { payment } = values;

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: payment });
    Cookies.set('paymentMethod', JSON.stringify(payment));
    router.push('/placeorder');
  };

  return (
    <>
      <CheckoutWizard activeStep={2} />

      <NextSeo
        title="Universal Acting - Payment"
        description="Universal Acting Payment "
      />
      <h4 className={styles.logincontact__title}>PAYMENT METHOD </h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          payment: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          await submitHandler(values);
          resetForm();
        }}
      >
        {({ errors, touched, values }) => {
          return (
            <Form className={styles.payment}>
              <div className={styles.payment__discampo}>
                <label className={styles.payment__discampo__cont}>
                  <Field
                    type="radio"
                    className={styles.payment__discampo__select}
                    id="payment"
                    value="Paypal"
                    name="payment"
                  />
                  {/* <span className={styles.payment__discampo__select__title}>
                    Paypal
                  </span> */}
                  <div className={styles.payment__discampo__select__image}>
                    <Image
                      src="/img/paypal.jpg"
                      alt=""
                      width={60}
                      height={52}
                    />
                  </div>
                </label>
                {errors.student && touched.student ? (
                  <p className={styles.formerror}>{errors.payment}</p>
                ) : null}
              </div>

              <div className={styles.payment__discampo}>
                <label className={styles.payment__discampo__cont}>
                  <Field
                    type="radio"
                    className={styles.payment__discampo__select}
                    id="payment"
                    value="Square"
                    name="payment"
                  />
                  {/* <span className={styles.payment__discampo__select__title}>
                    Square
                  </span> */}
                  <div className={styles.payment__discampo__select__image}>
                    <Image
                      src="/img/square.jpg"
                      alt=""
                      width={80}
                      height={50}
                    />
                  </div>
                </label>
                {errors.age && touched.age ? (
                  <p className={styles.formerror}>{errors.age}</p>
                ) : null}
              </div>

              <div className={styles.payment__discampo__result}>
                Selected: {values.payment}
              </div>

              <div className={styles.payment__discampo__button}>
                <input
                  type="submit"
                  value="Continue"
                  className={styles.logincontact__button}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
