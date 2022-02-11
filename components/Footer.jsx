import styles from '../styles/sass/main.module.scss';
import Link from 'next/link';
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';
import { AiOutlineCopyright } from 'react-icons/ai';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import React from 'react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Footer = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

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

      <Formik>
        <Form className={styles.formcontact}>
          <div className={styles.formcontact__discampo}>
            <Field
              id="nombre"
              type="text"
              className={styles.formcontact__campo}
              placeholder="First Name"
              name="nombre"
            />
          </div>
          <div className={styles.formcontact__discampo}>
            <Field
              id="nombre"
              type="text"
              className={styles.formcontact__campo}
              placeholder="Last Name"
              name="nombre"
            />
          </div>
          <div className={styles.formcontact__discampo}>
            <Field
              id="nombre"
              type="email"
              className={styles.formcontact__campo}
              placeholder="Your email"
              name="nombre"
            />
          </div>
          <div className={styles.formcontact__discampo}>
            <input
              type="submit"
              value="SUBSCRIBE"
              className={styles.formcontact__button}
            />
          </div>
        </Form>
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
