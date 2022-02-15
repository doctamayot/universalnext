import styles from '../../styles/sass/main.module.scss';
import Image from 'next/image';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { NextSeo } from 'next-seo';
import Product from '../../models/Product';
import db from '../../utils/db';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const [students, setStudents] = useState([]);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const { userInfo } = state;

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!product) {
    return <div>Class Not Found</div>;
  }

  //prueba

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    // if (data.countInStock < quantity) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }
    console.log(data);
    Cookies.set('clase', JSON.stringify(product._id));
    dispatch({ type: 'SAVE_CLASS', payload: product._id });
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    router.push('/cart');
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/products/${product._id}/student`
      );
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NextSeo
        title={`Universal Acting - ${product.slug}`}
        description={`Universal Acting - ${product.description}`}
      />
      <div className={styles.classscreen}>
        <div className={styles.classscreen__left}>
          <Image src={product.image} width={676} height={517} alt="kids" />
        </div>
        <div className={styles.classscreen__right}>
          <div className={styles.classscreen__right__sec1}>
            <h2 className={styles.classscreen__right__sec1__title}>
              <span>{product.direccion}</span>{' '}
              <span className={styles.classscreen__right__sec1__title__name}>
                {product.name}{' '}
              </span>
              <span>{product.location}</span>
            </h2>
            <p className={styles.classscreen__right__sec1__cat}>
              {product.category}
            </p>
            {userInfo && userInfo.isAdmin && (
              <div className={styles.studentscont}>
                <span className={styles.studentscont__campo1__title}>
                  Student
                </span>{' '}
                <span className={styles.studentscont__campo1__title}>Cel</span>{' '}
                <span className={styles.studentscont__campo1__title}>
                  About
                </span>{' '}
              </div>
            )}

            {userInfo &&
              userInfo.isAdmin &&
              students &&
              students.map((x) => (
                <div className={styles.studentscont} key={x._id}>
                  <a href={`/order/${x.orderid}`}>
                    <span className={styles.studentscont__campo1}>
                      {x.user}
                    </span>{' '}
                  </a>
                  <span className={styles.studentscont__campo2}>
                    {x.celphone}
                  </span>{' '}
                  <span className={styles.studentscont__campo3}>
                    Is the best student, Is the best student, Is the best
                    student, Is the best student, Is the best student
                  </span>{' '}
                </div>
              ))}

            <p className={styles.classscreen__right__sec1__starts}>
              <span className={styles.classscreen__right__sec1__starts__title}>
                Starts:{' '}
              </span>
              {product.days}
            </p>

            <p className={styles.classscreen__right__sec1__price}>
              ${product.price}
            </p>
            <p className={styles.classscreen__right__sec1__adv1}>
              No Audits, Refunds or Makeup classes will be given. CHILDREN MUST
              BE PICKED UP AT DISMISSAL TIME - IF NOT THERE IS A $ 15 LATE PICK
              UP FEE CHARGE PER INCIDENT.
            </p>
            <p className={styles.classscreen__right__sec1__starts__title}>
              <span>
                Places:{' '}
                <span className={styles.classlist__item__varios__li__res}>
                  {product.countInStock} Student(s)
                </span>{' '}
              </span>
            </p>

            <div className={styles.classscreen__right__sec1__cart}>
              {/* <button
              className={styles.classscreen__right__sec1__cart__buttonadd}
            >
              -
            </button>
            <div className={styles.classscreen__right__sec1__cart__numadd}>
              1
            </div>
            <button
              className={styles.classscreen__right__sec1__cart__buttonadd}
            >
              +
            </button> */}
              {product.countInStock <= 0 ? (
                <div
                  className={
                    styles.classscreen__right__sec1__cart__buttoncartout
                  }
                >
                  SOLD OUT
                </div>
              ) : (
                <button
                  className={styles.classscreen__right__sec1__cart__buttoncart}
                  onClick={addToCartHandler}
                >
                  ADD TO CART
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.classscreen__right__sec2}>
          <p className={styles.classscreen__right__sec2__title}>
            {product.description}
          </p>
          <p className={styles.classscreen__right__sec2__teach}>
            {product.teacher}
          </p>

          <div className={styles.classscreen__right__sec2__table}>
            <p className={styles.classscreen__right__sec2__table__fec}>
              {product.days}
            </p>
          </div>
          <p className={styles.classscreen__right__sec2__dura}>
            Session: {product.duration}
          </p>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, '-students').lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
