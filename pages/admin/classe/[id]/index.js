import Swal from 'sweetalert2';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { getError } from '../../../../utils/error';
import { Store } from '../../../../utils/Store';
import styles from '../../../../styles/sass/main.module.scss';
import { Formik, Form, Field } from 'formik';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import * as Yup from 'yup';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

const ProductEdit = ({ params }) => {
  const [nombre, setValue] = useState('');
  const [imagecloud, setImage] = useState('');
  const productId = params.id;
  const { state } = useContext(Store);
  const [{ loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const router = useRouter();

  const { userInfo } = state;

  const loginSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name too short')
      .max(50, 'Name too large')
      .required('Name is required')
      .matches(
        /^[aA-zZ\s, /, -]+$/,
        'Only alphabets are allowed for this field '
      ),
    category: Yup.string()
    .required('Category is required'),
    //.matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    age: Yup.string()
      .min(1, 'Age is too short')
      .max(50, 'Age is too large')
      .required('Age is required')
      .matches(/^[0-9,-]+$/, 'Must be only digits'),
    teacher: Yup.string()
      .min(3, 'Teacher too short')
      .max(30, 'Teacher too large')
      .required('Teacher is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),

    shedule: Yup.string()
      .min(3, 'Shedule too short')
      .max(100, 'Shedule too large')
      .required('Shedule is required'),

    days: Yup.string()
      .min(3, 'Days too short')
      .max(100, 'Days too large')
      .required('Days is required'),

    duration: Yup.string()
      .min(3, 'Duration too short')
      .max(50, 'Duration too large')
      .required('Duration is required'),
    location: Yup.string()
      .min(3, 'Location too short')
      .max(50, 'Location too large')
      .required('Location is required'),
    price: Yup.string()
      .min(1, 'Price is too short')
      .max(6, 'Price is too large')
      .required('Price is required')
      .matches(/^[0-9,.]+$/, 'Must be only digits'),
    subtitle: Yup.string()
      .min(3, 'Subtitle too short')
      .max(100, 'Subtitle too large')
      .required('Subtitle is required'),
    countInStock: Yup.string()
      .min(1, 'Places is too short')
      .max(3, 'Places is too large')
      .required('Places is required')
      .matches(/^[0-9]+$/, 'Must be only digits'),
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue(data);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, [setValue, productId]);

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);

      Toast.fire({
        icon: 'success',
        title: 'Image updated successfully',
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
  };

  const submitHandler = async ({
    name,
    category,
    description,
    age,
    teacher,
    shedule,
    days,
    duration,
    price,
    subtitle,
    countInStock,
    location,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          category,
          description,
          age,
          teacher,
          shedule,
          days,
          duration,
          price,
          subtitle,
          countInStock,
          location,
          image: imagecloud ? imagecloud : nombre.image,
          slug: productId,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });

      Toast.fire({
        icon: 'success',
        title: 'Class updated successfully',
      });

      setValue(data);
      router.push('/admin/classes');
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return (
    <>
      <NextSeo
        title="Universal Acting - Edit Classes"
        description="Universal Edit Classes "
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
          <h4 className={styles.profilefield__title}>Edit Class</h4>
          <div className={styles.botonimagen}>
            <Image
              src={!imagecloud ? '/img/kids2.jpg' : imagecloud}
              alt="imagen universal"
              width={610}
              height={489}
            />
            <div className={styles.botonimagen__boton}>
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" onChange={uploadHandler} hidden />
              </Button>
              <div></div>
              {loadingUpload && (
                <div className={styles.spinner}>
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>

          <Formik
            enableReinitialize={true}
            validationSchema={loginSchema}
            initialValues={{
              name: nombre ? nombre.name : '',

              location: nombre ? nombre.location : '',
              category: nombre ? nombre.category : '',
              description: nombre ? nombre.description : '',
              age: nombre ? nombre.age : '',
              teacher: nombre ? nombre.teacher : '',
              shedule: nombre ? nombre.shedule : '',
              days: nombre ? nombre.days : '',
              duration: nombre ? nombre.duration : '',
              price: nombre ? nombre.price : '',
              subtitle: nombre ? nombre.subtitle : '',
              countInStock: nombre ? nombre.countInStock : '',
            }}
            onSubmit={async (values, { resetForm }) => {
              await submitHandler(values);
              resetForm();
            }}
          >
            {({ errors, touched }) => {
              return (
                <Form className={styles.profilefield}>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="location"
                    >
                      Location
                    </label>
                    <Field
                      as="select"
                      id="location"
                      name="location"
                      placeholder="Location"
                      className={styles.profilefield__campo}
                    >
                      <option value="" label="Select a location" />
                      <option value="miami" label="Miami" />
                      <option value="fort laurdedale" label="Fort Laurdedale" />
                    </Field>
                    {/* <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Location"
                      id="location"
                      name="location"
                    /> */}
                    {errors.location && touched.location ? (
                      <p className={styles.formerror}>{errors.location}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Name"
                      id="name"
                      name="name"
                    />
                    {errors.name && touched.name ? (
                      <p className={styles.formerror}>{errors.name}</p>
                    ) : null}
                  </div>

                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="subtitle"
                    >
                      Subtitle
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Subtitle"
                      id="subtitle"
                      name="subtitle"
                    />

                    {errors.subtitle && touched.subtitle ? (
                      <p className={styles.formerror}>{errors.subtitle}</p>
                    ) : null}
                  </div>

                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <Field
                      as="select"
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Category"
                      id="category"
                      name="category"
                    >
                      <option value="" label="Select a category" />
                      <option value="kids" label="Kids" />
                      <option value="teens" label="Teens" />
                      <option value="adults" label="Adults" />
                    </Field>
                    {errors.category && touched.category ? (
                      <p className={styles.formerror}>{errors.category}</p>
                    ) : null}
                  </div>

                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      className={styles.logincontact__campo__desc}
                      placeholder="Category"
                      id="description"
                      name="description"
                    />
                    {errors.description && touched.description ? (
                      <p className={styles.formerror}>{errors.description}</p>
                    ) : null}
                  </div>

                  <div className={styles.profilefield__container}>
                    <label className={styles.profilefield__label} htmlFor="age">
                      Age
                    </label>

                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Age"
                      id="age"
                      name="age"
                    />

                    {errors.age && touched.age ? (
                      <p className={styles.formerror}>{errors.age}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="teacher"
                    >
                      Teacher
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Teacher"
                      id="teacher"
                      name="teacher"
                    />
                    {errors.teacher && touched.teacher ? (
                      <p className={styles.formerror}>{errors.teacher}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="shedule"
                    >
                      Shedule
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Shedule"
                      id="shedule"
                      name="shedule"
                    />
                    {errors.shedule && touched.shedule ? (
                      <p className={styles.formerror}>{errors.shedule}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="days"
                    >
                      Days
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="days"
                      id="days"
                      name="days"
                    />
                    {errors.days && touched.days ? (
                      <p className={styles.formerror}>{errors.days}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="duration"
                    >
                      Duration
                    </label>
                    <Field
                      type="text"
                      className={styles.profilefield__campo}
                      placeholder="Duration"
                      id="duration"
                      name="duration"
                    />
                    {errors.duration && touched.duration ? (
                      <p className={styles.formerror}>{errors.duration}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="price"
                    >
                      price
                    </label>
                    <Field
                      type="number"
                      className={styles.profilefield__campo}
                      placeholder="price"
                      id="price"
                      name="price"
                    />
                    {errors.price && touched.price ? (
                      <p className={styles.formerror}>{errors.price}</p>
                    ) : null}
                  </div>
                  <div className={styles.profilefield__container}>
                    <label
                      className={styles.profilefield__label}
                      htmlFor="countInStock"
                    >
                      Places
                    </label>
                    <Field
                      type="number"
                      className={styles.profilefield__campo}
                      placeholder="countInStock"
                      id="countInStock"
                      name="countInStock"
                    />
                    {errors.countInStock && touched.countInStock ? (
                      <p className={styles.formerror}>{errors.countInStock}</p>
                    ) : null}
                  </div>

                  <div className={styles.profilefield__container}>
                    <input
                      type="submit"
                      value="Update"
                      className={styles.logincontact__button}
                    />
                  </div>
                  {loadingUpdate && (
                    <div className={styles.spinner}>
                      <CircularProgress />
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
