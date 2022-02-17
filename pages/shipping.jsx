import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/sass/main.module.scss';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';

import { NextSeo } from 'next-seo';

export default function Shipping() {
  const loginSchema = Yup.object().shape({
    student: Yup.string()
      .min(3, 'Name too short')
      .max(20, 'Name too large')
      .required('Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    age: Yup.string()
      .min(1, 'Age is too short')
      .max(2, 'Age is too large')
      .required('Age is required')
      .matches(/^[0-9]+$/, 'Must be only digits'),
    desc: Yup.string()
      .min(10, 'Description too short')
      .max(125, 'Description too large')
      .required('Description is required')
      .matches(/^[aA-zZ\s,.,]+$/, 'Only alphabets are allowed for this field '),
  });

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    //  cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
  }, []);

  const submitHandler = async (values) => {
    const { student, age, desc } = values;
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { student, age, desc },
    });

    Cookies.set('shippingAddress', { student, age, desc });
    router.push('/payment');
  };
  return (
    <>
      <CheckoutWizard activeStep={1} />

      <NextSeo
        title="Universal Acting - Shipping"
        description="Universal Acting Shipping "
      />
      <h4 className={styles.logincontact__title}>CLASS INFO </h4>
      <Formik
        validationSchema={loginSchema}
        initialValues={{
          student: '',
          age: '',
          desc: '',
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
                  Student(s)
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Student(s)"
                  id="student"
                  name="student"
                />
                {errors.student && touched.student ? (
                  <p className={styles.formerror}>{errors.student}</p>
                ) : null}
              </div>

              <div className={styles.logincontact__discampo}>
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="age"
                >
                  age
                </label>
                <Field
                  type="text"
                  className={styles.logincontact__campo}
                  placeholder="Student age"
                  id="age"
                  name="age"
                />
                {errors.age && touched.age ? (
                  <p className={styles.formerror}>{errors.age}</p>
                ) : null}
              </div>

              <div className={styles.logincontact__discampo}>
                <label
                  className={styles.logincontact__discampo__label}
                  htmlFor="desc"
                >
                  Tell us something about the student(short)
                </label>
                <Field
                  as="textarea"
                  className={styles.logincontact__campo__desc}
                  placeholder="About Student"
                  id="desc"
                  name="desc"
                />
                {errors.desc && touched.desc ? (
                  <p className={styles.formerror}>{errors.desc}</p>
                ) : null}
              </div>

              <div className={styles.logincontact__discampo}>
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
