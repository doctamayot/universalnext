import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  CircularProgress,
  Button,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  withStyles,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';

import styles from '../../styles/sass/main.module.scss';

import moment from 'moment';
import { NextSeo } from 'next-seo';
import useTable from '../../components/useTable';
import { Search } from '@material-ui/icons';
import teal from '@material-ui/core/colors/teal';
import EditIcon from '@material-ui/icons/Edit';
import Adminside from '../../components/AdminSide';

const headCells = [
  { id: 'orderId', label: 'Order Id' },
  { id: 'class', label: 'Class' },
  { id: 'fullName', label: 'User' },
  { id: 'createdAt', label: 'Order Date' },
  { id: 'student', label: 'Student' },
  { id: 'price', label: 'Price' },
  { id: 'paid', label: 'Paid' },
  { id: 'taken', label: 'Class Taken' },
  { id: 'actions', label: 'Actions' },
];

const ColorButton = withStyles(() => ({
  root: {
    color: '#fff',
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[900],
    },
  },
}))(Button);

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [filterFn, setFilterFn] = useState({
    fn: (orders) => {
      return orders;
    },
  });

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo.isAdmin) {
      router.push('/');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(orders, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (orders) => {
        if (target.value == '') return orders;
        else
          return orders.filter((x) =>
            x.shippingAddress.student.toLowerCase().includes(target.value)
          );
      },
    });
  };

  return (
    <>
      <NextSeo
        title="Universal Acting - Orders"
        description="Universal Acting Orders "
      />
      <h4 className={styles.orderhistcontainer__title}>Control Panel </h4>

      <div className={styles.orderhistcontainer}>
        <Adminside userInfo={userInfo} />
        <div className={styles.orderhistcontainer__right}>
          <h4 className={styles.profilefield__title}>Bookings Admin</h4>
          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
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
                  {recordsAfterPagingAndSorting().map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.substring(20, 24)}</TableCell>
                      <TableCell>{order.orderItems[0].name}</TableCell>
                      <TableCell>
                        {' '}
                        {order.user ? (
                          <p>
                            {order.user && order.user.firstname}{' '}
                            {order.user && order.user.lastname}
                          </p>
                        ) : (
                          'DELETED USER'
                        )}
                      </TableCell>

                      <TableCell>
                        {' '}
                        {moment(order.createdAt).format('lll')}
                      </TableCell>
                      <TableCell>{order.shippingAddress.student}</TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      <TableCell>
                        {' '}
                        {order.isPaid
                          ? `paid at ${moment(order.paidAt).format('lll')}`
                          : 'not paid'}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered
                          ? `Class taken at ${moment(order.deliveredAt).format(
                              'lll'
                            )}`
                          : 'not taken'}
                      </TableCell>
                      <NextLink href={`/order/${order._id}`} passHref>
                        <TableCell>
                          <ColorButton
                            startIcon={<EditIcon />}
                            variant="contained"
                          >
                            Detail
                          </ColorButton>
                        </TableCell>
                      </NextLink>
                    </TableRow>
                  ))}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
