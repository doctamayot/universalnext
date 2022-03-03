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

const Register = () => {
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

    confirmpassword: Yup.string()
      .min(6, 'Password too short')
      .max(20, 'Password too large')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password is required'),

    firstname: Yup.string()
      .min(3, 'Name too short')
      .max(20, 'Name too large')
      .required('Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    lastname: Yup.string()
      .min(3, 'Lastname too short')
      .max(20, 'Lastname too large')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
      .required('Lastname is required'),

    celphone: Yup.string()
      .required('Celphone is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });

  const submitHandler = async (values) => {
    try {
      const { email, password, firstname, lastname, celphone } = values;
      const { data } = await axios.post('/api/users/register', {
        firstname,
        lastname,
        celphone,
        email,
        password,
      });

      Toast.fire({
        icon: 'success',
        title: 'Register is successfully',
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: 'This email already exist!!!',
      });
    }
  };
  return (
    <>
      <NextSeo
        title="Universal Acting - Register"
        description="Universal Acting Register "
      />
      <h4 className={styles.logincontact__title}>REGISTER </h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          email: '',
          password: '',
          confirmpassword: '',
          firstname: '',
          lastname: '',
          celphone: '',
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
                  htmlFor="firstname"
                >
                  Firstname
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Your firstname"
                  id="firstname"
                  name="firstname"
                />
                {errors.firstname && touched.firstname ? (
                  <p className={styles.formerror}>{errors.firstname}</p>
                ) : null}
              </div>

              <div className={styles.logincontact__discampo}>
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="lastname"
                >
                  Lastname
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Your lastname"
                  id="lastname"
                  name="lastname"
                />
                {errors.lastname && touched.lastname ? (
                  <p className={styles.formerror}>{errors.lastname}</p>
                ) : null}
              </div>
              <div className={styles.logincontact__discampo}>
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="celphone"
                >
                  celphone
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Your celphone"
                  id="celphone"
                  name="celphone"
                />
                {errors.celphone && touched.celphone ? (
                  <p className={styles.formerror}>{errors.celphone}</p>
                ) : null}
              </div>
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
                  type="password"
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
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="confirmpassword"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  className={styles.logincontact__campo}
                  placeholder="Confirm Password"
                  id="confirmpassword"
                  name="confirmpassword"
                />
                {errors.confirmpassword && touched.confirmpassword ? (
                  <p className={styles.formerror}>{errors.confirmpassword}</p>
                ) : null}
              </div>
              <div className={styles.logincontact__discampo}>
                <input
                  type="submit"
                  value="REGISTER"
                  className={styles.logincontact__button}
                />
              </div>
              <div className={styles.logincontact__note}>
                Already have an account? &nbsp;
                <NextLink href="/login" passHref>
                  <a className={styles.logincontact__note__title}>Login</a>
                </NextLink>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Register;
