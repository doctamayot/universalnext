import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
  CircularProgress,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';

import styles from '../../styles/sass/main.module.scss';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { NextSeo } from 'next-seo';

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

  return (
    <>
      <NextSeo
        title="Universal Acting - Orders"
        description="Universal Acting Orders "
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
          <h4 className={styles.profilefield__title}>Bookings Admin</h4>
          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <Table>
              {orders.length === 0 ? (
                <div className={styles.nohaybookings}>
                  You have not made bookings
                </div>
              ) : (
                <>
                  <TableHead>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      // count={rows.length}
                      // rowsPerPage={rowsPerPage}
                      // page={page}
                      // onPageChange={handleChangePage}
                      // onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <TableRow>
                      <StyledTableCell key="id">ID</StyledTableCell>
                      <StyledTableCell>USER</StyledTableCell>
                      <StyledTableCell>DATE</StyledTableCell>
                      <StyledTableCell>STUDENT</StyledTableCell>
                      <StyledTableCell>TOTAL</StyledTableCell>
                      <StyledTableCell>PAID</StyledTableCell>
                      <StyledTableCell>TAKEN</StyledTableCell>
                      <StyledTableCell>ACTION</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <StyledTableRow key={order._id}>
                        <StyledTableCell>
                          {order._id.substring(20, 24)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {order.user ? (
                            <p>
                              {order.user && order.user.firstname}{' '}
                              {order.user && order.user.lastname}
                            </p>
                          ) : (
                            'DELETED USER'
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment(order.createdAt).format('lll')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {order.shippingAddress.student}
                        </StyledTableCell>
                        <StyledTableCell>${order.totalPrice}</StyledTableCell>
                        <StyledTableCell>
                          {' '}
                          {order.isPaid
                            ? `paid at ${moment(order.paidAt).format('lll')}`
                            : 'not paid'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {order.isDelivered
                            ? `Class taken at ${moment(
                                order.deliveredAt
                              ).format('lll')}`
                            : 'not taken'}
                        </StyledTableCell>

                        <NextLink href={`/order/${order._id}`} passHref>
                          <StyledTableCell>
                            <Button variant="contained">Details</Button>{' '}
                          </StyledTableCell>
                        </NextLink>
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
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
