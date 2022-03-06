import React, { useContext, useEffect, useReducer } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/sass/main.module.scss';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Store } from '../utils/Store';

import Swal from 'sweetalert2';
import { NextSeo } from 'next-seo';
import { CircularProgress } from '@material-ui/core';

function reducer(state, action) {
  switch (action.type) {
    case 'FORGOT_REQUEST':
      return { ...state, loadingSms: true };
    case 'FORGOT_SUCCESS':
      return { ...state, loadingSms: false };
    case 'FORGOT_FAIL':
      return { ...state, loadingSms: false };
  }
}

const Login = () => {
  const router = useRouter();
  // const { redirect } = router.query; // login?redirect=/shipping
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingSms }, dispatch] = useReducer(reducer, {
    loadingSms: false,
  });

  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email not valid').required('Email is required'),
  });

  const submitHandler = async (values) => {
    try {
      dispatch({ type: 'FORGOT_REQUEST' });
      const { email } = values;

      await axios.post('/api/users/forgot', {
        email,
      });

      dispatch({ type: 'FORGOT_SUCCESS' });
      await Toast.fire({
        icon: 'success',
        title: `Email has been sent to ${email}. Click on the link to reset your password, Look in spam in hotmail`,
      });
      //   dispatch({ type: 'USER_LOGIN', payload: data });
      //   Cookies.set('userInfo', JSON.stringify(data));
      //   router.push(redirect || '/');
    } catch (err) {
      dispatch({ type: 'FORGOT_FAIL' });
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.error : err.error,
      });
    }
  };

  return (
    <>
      <NextSeo
        title="Universal Acting - Forgot Password"
        description="Universal Acting Forgot Password "
      />
      <h4 className={styles.logincontact__title}>Reset your password</h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          email: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          await submitHandler(values);
          resetForm();
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form className={styles.logincontact}>
              <div className={styles.logincontact__discampo}>
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Your email"
                  id="email"
                  name="email"
                />
                {errors.email && touched.email ? (
                  <p className={styles.formerror}>{errors.email}</p>
                ) : null}
              </div>

              <div className={styles.logincontact__discampo}>
                <input
                  type="submit"
                  value="Send"
                  className={styles.logincontact__button}
                />
              </div>
              {loadingSms && (
                <div className={styles.spinner}>
                  <CircularProgress />
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Login;
