import { useState, useEffect, useReducer, useContext } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { withRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { NextSeo } from 'next-seo';
import { CircularProgress } from '@material-ui/core';
import { Store } from '../../utils/Store';
import styles from '../../styles/sass/main.module.scss';

function reducer(state, action) {
  switch (action.type) {
    case 'RESET_REQUEST':
      return { ...state, loading: true };
    case 'RESET_SUCCESS':
      return { ...state, loading: false };
    case 'RESET_FAIL':
      return { ...state, loading: false };
  }
}

const ResetPassword = ({ router }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [state2, setState] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Reset Password',
  });
  const { name, token } = state2;

  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password too short')
      .max(20, 'Password too large')
      .required('Password is required'),
    confirmpassword: Yup.string()
      .min(6, 'Password too short')
      .max(20, 'Password too large')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password is required'),
  });

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
    //console.log(router.query.id);
    const decoded = jwt.decode(router.query.id);

    if (decoded)
      setState({ ...state2, name: decoded.name, token: router.query.id });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
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

  const submitHandler = async (values) => {
    // console.log('post email to ', email);

    try {
      dispatch({ type: 'RESET_REQUEST' });
      const { password } = values;
      await axios.put('/api/users/reset-password', {
        resetPasswordLink: token,
        password,
      });
      dispatch({ type: 'RESET_SUCCESS' });
      Toast.fire({
        icon: 'success',
        title: `Great! ${name}.. Now you can login with your new password`,
      });
      // console.log('FORGOT PASSWORD', response);
    } catch (error) {
      dispatch({ type: 'RESET_FAIL' });
      Toast.fire({
        icon: 'error',
        title: 'Token is not valid ... Try again ',
      });
    }
  };

  return (
    <>
      <NextSeo
        title="Universal Acting - Reset Password"
        description="Universal Acting Reset Password "
      />
      <h4 className={styles.logincontact__title}>Reset your password</h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          password: '',
          confirmpassword: '',
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
                  value="Change Password"
                  className={styles.logincontact__button}
                />
              </div>
              {loading && (
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
export default withRouter(ResetPassword);
