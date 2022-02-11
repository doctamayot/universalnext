import React, { useContext, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/sass/main.module.scss';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { NextSeo } from 'next-seo';

const Login = () => {
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

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

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email not valid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password too short')
      .max(20, 'Password too large')
      .required('Password is required'),
  });

  const submitHandler = async (values) => {
    try {
      const { email, password } = values;
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response.data ? err.response.data.message : err.message,
      });
    }
  };
  return (
    <>
      <NextSeo
        title="Universal Acting - Login"
        description="Universal Acting Login "
      />
      <h4 className={styles.logincontact__title}>LOGIN </h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          email: '',
          password: '',
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
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Password"
                  id="password"
                  name="password"
                />
                {errors.password && touched.password ? (
                  <p className={styles.formerror}>{errors.password}</p>
                ) : null}
              </div>
              <div className={styles.logincontact__discampo}>
                <input
                  type="submit"
                  value="LOGIN"
                  className={styles.logincontact__button}
                />
              </div>
              <div className={styles.logincontact__note}>
                Don`t have an account?
                <NextLink href="/register" passHref>
                  <a className={styles.logincontact__note__title}>Register</a>
                </NextLink>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Login;
