import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import Swal from 'sweetalert2';
import {
  CircularProgress,
  Button,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import styles from '../../styles/sass/main.module.scss';
import { NextSeo } from 'next-seo';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

import DeleteIcon from '@material-ui/icons/Delete';

import yellow from '@material-ui/core/colors/yellow';

import { Search } from '@material-ui/icons';

import useTable from '../../components/useTable';

const headCells = [
  { id: 'email', label: 'Email' },
  { id: 'FirstName', label: 'FirstName' },
  { id: 'LastName', label: 'LastName' },
  { id: 'celphone', label: 'Celphone' },
  { id: 'isAdmin', label: 'Admin' },
  { id: 'actions', label: 'Actions' },
];

const YellowButton = withStyles(() => ({
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
      return { ...state, loading: false, users: action.payload, error: '' };
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

const Users = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [filterFn, setFilterFn] = useState({
    fn: (orders) => {
      return orders;
    },
  });

  const [
    { loading, error, users, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
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

  //   const createHandler = async () => {
  //     // if (!window.confirm('Are you sure?')) {
  //     //   return;
  //     // }

  //     try {
  //       dispatch({ type: 'CREATE_REQUEST' });
  //       const { data } = await axios.post(
  //         `/api/admin/products`,
  //         { data },

  //         {
  //           headers: { authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );

  //       dispatch({ type: 'CREATE_SUCCESS' });
  //       Toast.fire({
  //         icon: 'success',
  //         title: 'Class created successfully',
  //       });
  //       router.push(`/admin/classe/${data.product._id}`);
  //     } catch (err) {
  //       dispatch({ type: 'CREATE_FAIL' });
  //       Toast.fire({
  //         icon: 'error',
  //         title: getError(err),
  //       });
  //     }
  //   };
  const deleteHandler = async (userId) => {
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
          await axios.delete(`/api/admin/users/${userId}`, {
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

  //   const smsHandler = async (productId) => {
  //     // if (!window.confirm('Are you sure?')) {
  //     //   return;
  //     // }

  //     try {
  //       dispatch({ type: 'SMS_REQUEST' });
  //       const { data } = await axios.post(
  //         `/api/admin/products/${productId}/twilio`,
  //         { data },

  //         {
  //           headers: { authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );

  //       dispatch({ type: 'SMS_SUCCESS' });
  //       Toast.fire({
  //         icon: 'success',
  //         title: 'Message sent successfully',
  //       });
  //       //router.push(`/admin/classe/${data.product._id}`);
  //     } catch (err) {
  //       dispatch({ type: 'SMS_FAIL' });
  //       Toast.fire({
  //         icon: 'error',
  //         title: getError(err),
  //       });
  //     }
  //   };

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(users, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (orders) => {
        if (target.value == '') return orders;
        else
          return orders.filter((x) =>
            x.email.toLowerCase().includes(target.value)
          );
      },
    });
  };

  return (
    <>
      <NextSeo
        title="Universal Acting - Users"
        description="Universal Acting Users "
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
          {userInfo && userInfo.isAdmin ? (
            <div className={styles.orderhistcontainer__left__menu}>
              <NextLink href="/admin/users" passHref>
                <a>
                  <div className={styles.profilelink}>Users</div>
                </a>
              </NextLink>
            </div>
          ) : null}
        </div>
        <div className={styles.orderhistcontainer__right}>
          <h4 className={styles.profilefield__title}>Users Admin</h4>
          {/* <div className={styles.profilefield__create}>
            <Button
              //className={styles.profilefield__create__button}
              onClick={createHandler}
              variant="contained"
              color="primary"
              startIcon={<AddBoxIcon />}
            >
              Create
            </Button>
          </div> */}
          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {users.length === 0 ? (
                <div className={styles.nohaybookings}>Not Users</div>
              ) : (
                <>
                  <div className={styles.searchbox}>
                    <Search
                      className={styles.searchbox__icon}
                      fontSize="large"
                    />
                    <TextField
                      onChange={handleSearch}
                      placeholder="Search By Email"
                      className={styles.searchbox__input}
                    />
                  </div>
                  <TblContainer>
                    <TblHead />
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((user) => (
                        <StyledTableRow key={user._id}>
                          <StyledTableCell>{user.email}</StyledTableCell>
                          <StyledTableCell>{user.firstname}</StyledTableCell>
                          <StyledTableCell>{user.lastname}</StyledTableCell>
                          <StyledTableCell>{user.celphone}</StyledTableCell>
                          <StyledTableCell>
                            {user.isAdmin ? 'Yes' : 'No'}
                          </StyledTableCell>
                          {/* <StyledTableCell>{order.rating}</StyledTableCell> */}
                          <StyledTableCell>
                            <NextLink href={`/user/${user._id}`} passHref>
                              <YellowButton
                                startIcon={<EditIcon />}
                                variant="contained"
                              >
                                View
                              </YellowButton>
                            </NextLink>{' '}
                            <Button
                              color="secondary"
                              startIcon={<DeleteIcon />}
                              variant="contained"
                              onClick={() => deleteHandler(user._id)}
                            >
                              Delete
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
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
  );
};

export default dynamic(() => Promise.resolve(Users), { ssr: false });
