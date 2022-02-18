import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext } from 'react';
import styles from '../styles/sass/main.module.scss';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { NextSeo } from 'next-seo';
import { Store } from '../utils/Store';

import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function Profile() {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
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
    // const { password, confirmPassword } = values;
    // if (password !== confirmPassword) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: 'Password not Match',
    //   });
    //   return;
    // }
    try {
      const { email, password, firstname, lastname, celphone } = values;
      const { data } = await axios.put(
        '/api/users/profile',
        {
          firstname,
          lastname,
          celphone,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      Toast.fire({
        icon: 'success',
        title: 'Update Profile is successfully',
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      //router.push(redirect || '/');
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err,
      });
    }
  };

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
  return (
    <>
      <NextSeo
        title="Universal Acting - Profile"
        description="Universal Profile "
      />
      <h4 className={styles.orderhistcontainer__title}>Control Panel </h4>
      <div className={styles.orderhistcontainer}>
        <div className={styles.orderhistcontainer__left}>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink href="/profile" passHref>
              <a>
                <div className={styles.profilelink}>Profile</div>
              </a>
            </NextLink>
          </div>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink href="/admin/classes" passHref>
              <a>
                <div className={styles.profilelink}>Admin Classes</div>
              </a>
            </NextLink>
          </div>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink
              href={
                userInfo && userInfo.isAdmin
                  ? '/admin/orders'
                  : '/order_history'
              }
              passHref
            >
              <a>
                <div className={styles.profilelink}>Bookings</div>
              </a>
            </NextLink>
          </div>
        </div>
        <div className={styles.orderhistcontainer__right}>
          <h4 className={styles.profilefield__title}>PROFILE </h4>
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
                <Form className={styles.profilefield}>
                  <div className={styles.profilefield__group}>
                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="firstname"
                      >
                        Firstname
                      </label>
                      <Field
                        type="text"
                        className={styles.profilefield__campo}
                        placeholder="Your firstname"
                        id="firstname"
                        name="firstname"
                      />
                      {errors.firstname && touched.firstname ? (
                        <p className={styles.formerror}>{errors.firstname}</p>
                      ) : null}
                    </div>

                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="lastname"
                      >
                        Lastname
                      </label>
                      <Field
                        type="text"
                        className={styles.profilefield__campo}
                        placeholder="Your lastname"
                        id="lastname"
                        name="lastname"
                      />
                      {errors.lastname && touched.lastname ? (
                        <p className={styles.formerror}>{errors.lastname}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.profilefield__group}>
                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="celphone"
                      >
                        celphone
                      </label>
                      <Field
                        type="text"
                        className={styles.profilefield__campo}
                        placeholder="Your celphone"
                        id="celphone"
                        name="celphone"
                      />
                      {errors.celphone && touched.celphone ? (
                        <p className={styles.formerror}>{errors.celphone}</p>
                      ) : null}
                    </div>
                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <Field
                        type="text"
                        className={styles.profilefield__campo}
                        placeholder="Your email"
                        id="email"
                        name="email"
                      />
                      {errors.email && touched.email ? (
                        <p className={styles.formerror}>{errors.email}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.profilefield__group}>
                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        className={styles.profilefield__campo}
                        placeholder="Password"
                        id="password"
                        name="password"
                      />
                      {errors.password && touched.password ? (
                        <p className={styles.formerror}>{errors.password}</p>
                      ) : null}
                    </div>
                    <div className={styles.profilefield__container}>
                      <label
                        className={styles.profilefield__label}
                        htmlFor="confirmpassword"
                      >
                        Confirm Password
                      </label>
                      <Field
                        type="text"
                        className={styles.profilefield__campo}
                        placeholder="confirmPassword"
                        id="confirmpassword"
                        name="confirmpassword"
                      />
                      {errors.confirmpassword && touched.confirmpassword ? (
                        <p className={styles.formerror}>
                          {errors.confirmpassword}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.logincontact__discampo}>
                    <input
                      type="submit"
                      value="Update"
                      className={styles.logincontact__button}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
