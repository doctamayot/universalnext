import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

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

import DeleteIcon from '@material-ui/icons/Delete';

import { Search } from '@material-ui/icons';

import useTable from '../../components/useTable';
import Adminside from '../../components/AdminSide';

const headCells = [
  { id: 'firstname', label: 'First Name' },
  { id: 'lastname', label: 'Last Name' },
  { id: 'email', label: 'Email' },
  { id: 'message', label: 'Message' },
  { id: 'actions', label: 'Actions' },
];

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, messages: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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

const Messages = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [filterFn, setFilterFn] = useState({
    fn: (orders) => {
      return orders;
    },
  });

  const [{ loading, error, messages, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      messages: [],
      error: '',
    });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/messages`, {
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
          await axios.delete(`/api/admin/messages/${productId}`, {
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

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(messages, headCells, filterFn);

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
        title="Universal Acting - Messages"
        description="Universal Acting Messages "
      />
      {loadingDelete && (
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      )}

      <h4 className={styles.orderhistcontainer__title}>Control Panel </h4>
      <div className={styles.orderhistcontainer}>
        <Adminside userInfo={userInfo} />
        <div className={styles.orderhistcontainer__right}>
          <h4 className={styles.profilefield__title}>Community Admin</h4>

          {loading ? (
            <div className={styles.spinner}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {!messages.length === 0 ? (
                <div className={styles.nohaybookings}>
                  You have not made classes
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
                      placeholder="Search By Email"
                      className={styles.searchbox__input}
                    />
                  </div>
                  <TblContainer>
                    <TblHead />
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((order) => (
                        <StyledTableRow key={order._id}>
                          <StyledTableCell>{order.firstname}</StyledTableCell>
                          <StyledTableCell>{order.lastname}</StyledTableCell>
                          <StyledTableCell>{order.email}</StyledTableCell>
                          <StyledTableCell>{order.desc}</StyledTableCell>

                          {/* <StyledTableCell>{order.rating}</StyledTableCell> */}
                          <StyledTableCell>
                            <Button
                              color="secondary"
                              startIcon={<DeleteIcon />}
                              variant="contained"
                              onClick={() => deleteHandler(order._id)}
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

export default dynamic(() => Promise.resolve(Messages), { ssr: false });
