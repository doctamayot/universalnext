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
import NextLink from 'next/link';
import {
  TextField,
  TableBody,
  TableRow,
  TableCell,
  Button,
  withStyles,
} from '@material-ui/core';
import useTable from '../../components/useTable';
import { Search, ShoppingCart } from '@material-ui/icons';

const headCells = [
  { id: 'student', label: 'Student' },
  { id: 'celphone', label: 'celphone' },
  { id: 'desc', label: 'description' },
];

const CartButton = withStyles(() => ({
  root: {
    color: '#fff',
    fontFamily: 'Bebas Neue',
    fontSize: '2rem',
  },
}))(Button);

export default function ProductScreen(props) {
  const [filterFn, setFilterFn] = useState({
    fn: (orders) => {
      return orders;
    },
  });
  const [students, setStudents] = useState([]);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const { userInfo } = state;

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(students, headCells, filterFn);

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

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (students) => {
        if (target.value == '') return students;
        else
          return students.filter((x) =>
            x.user.toLowerCase().includes(target.value)
          );
      },
    });
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
          <p className={styles.classscreen__right__desc}>
            {product.description}
          </p>
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
            {userInfo && userInfo.isAdmin && students.length > 0 && (
              <>
                <div className={styles.searchbox}>
                  <Search className={styles.searchbox__icon} fontSize="large" />
                  <TextField
                    onChange={handleSearch}
                    placeholder="Search By Student"
                    className={styles.searchbox__input}
                  />
                </div>
                <TblContainer>
                  <TblHead />
                  <TableBody>
                    {userInfo &&
                      userInfo.isAdmin &&
                      students &&
                      recordsAfterPagingAndSorting().map((x) => (
                        <TableRow key={x._id}>
                          <TableCell>
                            <NextLink href={`/order/${x.orderid}`}>
                              {x.user}
                            </NextLink>
                          </TableCell>
                          <TableCell>{x.celphone}</TableCell>
                          <TableCell>{x.desc}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </TblContainer>
                <TblPagination />
              </>
            )}

            <p className={styles.classscreen__right__sec1__starts}>
              <span className={styles.classscreen__right__sec1__starts__title}>
                Dates: {product.days}
              </span>
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
                <CartButton
                  onClick={addToCartHandler}
                  startIcon={<ShoppingCart />}
                  variant="contained"
                  color="primary"
                >
                  ADD TO CART
                </CartButton>
              )}
            </div>
          </div>
        </div>
        <div className={styles.classscreen__right__sec2}>
          <p className={styles.classscreen__right__sec2__teach}>
            {product.teacher}
          </p>
          <p className={styles.classscreen__right__sec1__shedule}>
            {product.shedule}
          </p>

          <div className={styles.classscreen__right__sec2__table}>
            <p className={styles.classscreen__right__sec2__table__fec}>
              {product.age} years
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
