import React from 'react';
import styles from '../styles/sass/main.module.scss';
import Swal from 'sweetalert2';
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';
import { AiOutlineCopyright } from 'react-icons/ai';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { getError } from '../utils/error';

const Footer = () => {
  //const { state } = useContext(Store);
  //const { userInfo } = state;

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
  const loginSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, 'Name too short')
      .max(20, 'Name too large')
      .required('Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    lastname: Yup.string()
      .min(3, 'Name too short')
      .max(20, 'Name too large')
      .required('Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    email: Yup.string().email('Email not valid').required('Email is required'),
    desc: Yup.string()
      .min(10, 'Description too short')
      .max(125, 'Description too large')
      .required('Description is required')
      .matches(/^[aA-zZ\s,.,]+$/, 'Only alphabets are allowed for this field '),
  });

  const submitHandler = async (values) => {
    try {
      const { email, desc, firstname, lastname } = values;
      console.log(lastname);

      const { data } = await axios.post(`/api/admin/messages/`, {
        firstname,
        lastname,
        email,
        desc,
      });

      console.log(data);

      Toast.fire({
        icon: 'success',
        title: 'Message sent successfully',
      });
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
    console.log(values);
  };

  return (
    <div className={styles.contfood}>
      <h3 className={styles.contfood__title}>our study places</h3>
      <div className={styles.contfood__maps}>
        <div>
          <h5 className={styles.contfood__maps__title}>Ft. Lauderdale</h5>
          <p className={styles.contfood__maps__dir}>(786) 291-0287</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.822465049164!2d-80.14589748456852!3d26.104713400687764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d907a5ba22125f%3A0xd36dacf2fbf17b79!2sUniversal%20Acting!5e0!3m2!1ses!2sco!4v1641920370180!5m2!1ses!2sco"
            loading="lazy"
            allowFullScreen={true}
            className={styles.contfood__maps__map}
          ></iframe>
        </div>

        <div>
          <h5 className={styles.contfood__maps__title}>Miami</h5>
          <p className={styles.contfood__maps__dir}>(305) 674-1719</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.0287718540726!2d-80.19170038457206!3d25.835597211842583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b487bb6dbe0f%3A0x305036b7fd71ed7f!2sUniversal%20Casting!5e0!3m2!1ses!2sco!4v1641920300452!5m2!1ses!2sco"
            allowFullScreen={true}
            className={styles.contfood__maps__map}
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <h4 className={styles.contfood__title}>Join our community</h4>
      <p className={styles.contfood__text}>
        Sign up to be the first to hear about Universal Acting
      </p>

      <Formik
        validationSchema={loginSchema}
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          desc: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          await submitHandler(values);
          resetForm();
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form className={styles.formcontact}>
              <div className={styles.formcontact__discampo}>
                <Field
                  id="firstname"
                  type="text"
                  className={styles.formcontact__campo}
                  placeholder="First Name"
                  name="firstname"
                />
                {errors.firstname && touched.firstname ? (
                  <p className={styles.formerror}>{errors.firstname}</p>
                ) : null}
              </div>
              <div className={styles.formcontact__discampo}>
                <Field
                  id="lastname"
                  type="text"
                  className={styles.formcontact__campo}
                  placeholder="Last Name"
                  name="lastname"
                />
                {errors.lastname && touched.lastname ? (
                  <p className={styles.formerror}>{errors.lastname}</p>
                ) : null}
              </div>
              <div className={styles.formcontact__discampo}>
                <Field
                  id="email"
                  type="email"
                  className={styles.formcontact__campo}
                  placeholder="Your email"
                  name="email"
                />
                {errors.email && touched.email ? (
                  <p className={styles.formerror}>{errors.email}</p>
                ) : null}
              </div>
              <div className={styles.formcontact__discampo}>
                <Field
                  as="textarea"
                  className={styles.formcontact__campo__desc}
                  placeholder="Tell us"
                  id="desc"
                  name="desc"
                />
                {errors.desc && touched.desc ? (
                  <p className={styles.formerror}>{errors.desc}</p>
                ) : null}
              </div>
              <div className={styles.formcontact__discampo}>
                <input
                  type="submit"
                  value="Send"
                  className={styles.formcontact__button}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
      <div className={styles.contfood__down}>
        <BsFacebook className={styles.contfood__icons} />
        <BsInstagram className={styles.contfood__icons} />
        <BsYoutube className={styles.contfood__icons} />
        <BsTwitter className={styles.contfood__icons} />
      </div>
      <div className={styles.contfood__down__terms}>
        <p>Terms of Use</p>
        <p>Privacy Policy</p>
      </div>

      <h5 className={styles.contfood__down__terms__copy}>
        <AiOutlineCopyright />
        By Hugo Tamayo
      </h5>
    </div>
  );
};

export default Footer;
