import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import Swal from 'sweetalert2';
import {
  CircularProgress,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import styles from '../../styles/sass/main.module.scss';
import { NextSeo } from 'next-seo';
import { withStyles } from '@material-ui/core/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

const classes = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/classes`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const createHandler = async () => {
    // if (!window.confirm('Are you sure?')) {
    //   return;
    // }

    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/products`,
        { data },

        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'CREATE_SUCCESS' });
      Toast.fire({
        icon: 'success',
        title: 'Class created successfully',
      });
      router.push(`/admin/classe/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
  };
  const deleteHandler = async (productId) => {
    // if (!window.confirm('Are you sure?')) {
    //   return;
    // }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'DELETE_SUCCESS' });
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        } else {
          dispatch({ type: 'DELETE_RESET' });
        }
      });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
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
        title="Universal Acting - Classes"
        description="Universal Acting Classes "
      />
      {loadingDelete && (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      )}
      {loadingCreate && (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      )}
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
          <h4 className={styles.profilefield__title}>Classes Admin</h4>
          <div className={styles.profilefield__create}>
            <button
              className={styles.profilefield__create__button}
              onClick={createHandler}
            >
              Create
            </button>
          </div>
          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <Table>
              {products.length === 0 ? (
                <div className={styles.nohaybookings}>
                  You have not made classes
                </div>
              ) : (
                <>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell key="id">ID</StyledTableCell>
                      <StyledTableCell>NAME</StyledTableCell>
                      <StyledTableCell>PRICE</StyledTableCell>
                      <StyledTableCell>CATEGORY</StyledTableCell>
                      <StyledTableCell>COUNT</StyledTableCell>
                      <StyledTableCell>RATING</StyledTableCell>
                      <StyledTableCell>ACTION</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((order) => (
                      <StyledTableRow key={order._id}>
                        <StyledTableCell>
                          {order._id.substring(20, 24)}
                        </StyledTableCell>
                        <StyledTableCell>{order.name}</StyledTableCell>
                        <StyledTableCell>${order.price}</StyledTableCell>
                        <StyledTableCell>{order.category}</StyledTableCell>
                        <StyledTableCell>{order.countInStock}</StyledTableCell>
                        <StyledTableCell>{order.rating}</StyledTableCell>
                        <StyledTableCell>
                          <NextLink
                            href={`/admin/classe/${order._id}`}
                            passHref
                          >
                            <Button size="small" variant="contained">
                              Edit
                            </Button>
                          </NextLink>{' '}
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => deleteHandler(order._id)}
                          >
                            Delete
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(classes), { ssr: false });
