import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#fff',
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[900],
    },
  },
}))(Button);

const YellowButton = withStyles((theme) => ({
  root: {
    color: '#fff',
    backgroundColor: yellow[700],
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },
}))(Button);

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
    case 'SMS_REQUEST':
      return { ...state, loadingSms: true };
    case 'SMS_SUCCESS':
      return { ...state, loadingSms: false };
    case 'SMS_FAIL':
      return { ...state, loadingSms: false };
    default:
      state;
  }
}

const Classes = () => {
  const [datos, setDatos] = useState({});
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

  const smsHandler = async (productId) => {
    // if (!window.confirm('Are you sure?')) {
    //   return;
    // }

    try {
      dispatch({ type: 'SMS_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/products/${productId}/twilio`,
        {},

        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'SMS_SUCCESS' });
      Toast.fire({
        icon: 'success',
        title: 'Message sent successfully',
      });
      //router.push(`/admin/classe/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'SMS_FAIL' });
      Toast.fire({
        icon: 'error',
        title: getError(err),
      });
    }
  };

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
                      <StyledTableCell>PLACES</StyledTableCell>
                      {/* <StyledTableCell>RATING</StyledTableCell> */}
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
                        {/* <StyledTableCell>{order.rating}</StyledTableCell> */}
                        <StyledTableCell>
                          <NextLink href={`/classe/${order._id}`} passHref>
                            <YellowButton
                              startIcon={<EditIcon />}
                              variant="contained"
                            >
                              View
                            </YellowButton>
                          </NextLink>{' '}
                          <NextLink
                            href={`/admin/classe/${order._id}`}
                            passHref
                          >
                            <ColorButton
                              startIcon={<EditIcon />}
                              variant="contained"
                            >
                              Edit
                            </ColorButton>
                          </NextLink>{' '}
                          <Button
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            onClick={() => deleteHandler(order._id)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => smsHandler(order._id)}
                          >
                            sms
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

export default dynamic(() => Promise.resolve(Classes), { ssr: false });
