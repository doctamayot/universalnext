import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  CircularProgress,
  Button,
  TextField,
  TableBody,
  TableRow,
  TableCell,
  withStyles,
} from '@material-ui/core';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import styles from '../styles/sass/main.module.scss';
import { Search } from '@material-ui/icons';
import teal from '@material-ui/core/colors/teal';
import EditIcon from '@material-ui/icons/Edit';
import useTable from '../components/useTable';
import moment from 'moment';
import { NextSeo } from 'next-seo';

const headCells = [
  { id: 'orderId', label: 'Order Id' },
  { id: 'class', label: 'Class' },
  { id: 'fullName', label: 'Student' },
  { id: 'createdAt', label: 'Order Date' },
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

function OrderHistory() {
  const [filterFn, setFilterFn] = useState({
    fn: (orders) => {
      return orders;
    },
  });
  const { state } = useContext(Store);
  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
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
            x.orderItems[0].name.toLowerCase().includes(target.value)
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
        <div className={styles.orderhistcontainer__left}>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink href="/profile" passHref>
              <a>
                <div className={styles.profilelink}>profile</div>
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
          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {orders.length === 0 ? (
                <div className={styles.nohaybookings}>
                  You have not made bookings
                </div>
              ) : (
                <>
                  <div className={styles.searchbox}>
                    <Search
                      className={styles.searchbox__icon}
                      fontSize="large"
                    />
                    <TextField
                      onChange={handleSearch}
                      placeholder="Search By Class"
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

                          <TableCell>{order.shippingAddress.student}</TableCell>
                          <TableCell>
                            {moment(order.createdAt).format('lll')}
                          </TableCell>
                          <TableCell>{order.totalPrice}</TableCell>
                          <TableCell>
                            {' '}
                            {order.isPaid
                              ? `paid at ${moment(order.paidAt).format('lll')}`
                              : 'not paid'}
                          </TableCell>
                          <TableCell>
                            {order.isDelivered
                              ? `delivered at ${order.deliveredAt}`
                              : 'not delivered'}
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
            </>
          )}
        </div>
      </div>
    </>
    // <Grid container spacing={1} className={styles.orderhistcont}>
    //   <Grid item md={3} xs={12}>
    //     <Card className={styles.orderhistcontleft}>
    //       <List>
    //         <NexLink href="/profile" passHref>
    //           <ListItem
    //             button
    //             component="a"
    //             className={styles.orderhistcontleft}
    //           >
    //             <ListItemText primary="User Profile"></ListItemText>
    //           </ListItem>
    //         </NexLink>
    //         <NexLink href="/order-history" passHref>
    //           <ListItem selected button component="a">
    //             <ListItemText primary="Order History"></ListItemText>
    //           </ListItem>
    //         </NexLink>
    //       </List>
    //     </Card>
    //   </Grid>
    //   <Grid item md={9} xs={12}>
    //     <Card className={styles.orderhistcontright}>
    //       <List>
    //         <ListItem>
    //           <Typography component="h1" variant="h1">
    //             Order History
    //           </Typography>
    //         </ListItem>
    //         <ListItem>
    //           {loading ? (
    //             <CircularProgress />
    //           ) : error ? (
    //             <Typography>{error}</Typography>
    //           ) : (
    //             <TableContainer>
    //               <Table>
    //                 <TableHead>
    //                   <TableRow>
    //                     <TableCell>ID</TableCell>
    //                     <TableCell>DATE</TableCell>
    //                     <TableCell>TOTAL</TableCell>
    //                     <TableCell>PAID</TableCell>
    //                     <TableCell>DELIVERED</TableCell>
    //                     <TableCell>ACTION</TableCell>
    //                   </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                   {orders.map((order) => (
    //                     <TableRow key={order._id}>
    //                       <TableCell>{order._id.substring(20, 24)}</TableCell>
    //                       <TableCell>{order.createdAt}</TableCell>
    //                       <TableCell>${order.totalPrice}</TableCell>
    //                       <TableCell>
    //                         {order.isPaid
    //                           ? `paid at ${order.paidAt}`
    //                           : 'not paid'}
    //                       </TableCell>
    //                       <TableCell>
    //                         {order.isDelivered
    //                           ? `delivered at ${order.deliveredAt}`
    //                           : 'not delivered'}
    //                       </TableCell>
    //                       <TableCell>
    //                         <NexLink href={`/order/${order._id}`} passHref>
    //                           <Button variant="contained">Details</Button>
    //                         </NexLink>
    //                       </TableCell>
    //                     </TableRow>
    //                   ))}
    //                 </TableBody>
    //               </Table>
    //             </TableContainer>
    //           )}
    //         </ListItem>
    //       </List>
    //     </Card>
    //   </Grid>
    // </Grid>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
