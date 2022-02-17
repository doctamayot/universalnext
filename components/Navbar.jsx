import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/sass/main.module.scss';
import { MdOutlineMenu } from 'react-icons/md';
import { TiShoppingCart } from 'react-icons/ti';
import { BiLogInCircle } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

const Navbar = ({ toggleSidebar }) => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { cart, userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(false);

  const loginClickHandler = () => {
    setAnchorEl(!anchorEl);
  };

  const panelClickHandler = () => {
    setAnchorEl(!anchorEl);
    if (userInfo.isAdmin) router.push('/admin/classes');
    else router.push('/order_history');
  };

  const logoutClickHandler = () => {
    router.push('/');
    setAnchorEl(false);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('cartItems');
    Cookies.remove('userInfo');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <Link href="/" passHref>
          <a>
            <Image
              className={styles.navbar__logo}
              src="/img/logo.png"
              alt=""
              width={801}
              height={312}
            />
          </a>
        </Link>
      </div>
      <ul className={styles.navbar__list}>
        <li
          className={
            router.pathname == '/'
              ? styles.navbar__active
              : styles.navbar__list__item
          }
        >
          <Link href="/">
            <a className={styles.navbar__link}>Home</a>
          </Link>
        </li>
        {/* <li
          className={
            router.pathname == '/about'
              ? styles.navbar__active
              : styles.navbar__list__item
          }
        >
          <Link href="/about">
            <a className={styles.navbar__link}>About</a>
          </Link>
        </li> */}
        <li
          className={
            router.pathname == '/classes'
              ? styles.navbar__active
              : styles.navbar__list__item
          }
        >
          <Link className={styles.navbar__link} href="/classes">
            <a className={styles.navbar__link}>Classes</a>
          </Link>
        </li>
        {/* <li
          className={
            router.pathname == '/gallery'
              ? styles.navbar__active
              : styles.navbar__list__item
          }
        >
          <Link className={styles.navbar__link} href="/gallery">
            Gallery
          </Link>
        </li> */}
        <div className={styles.navbar__list__item}>
          <Link className={styles.navbar__link} href="/cart">
            {cart.cartItems.length > 0 ? (
              <p className={styles.cart}>
                {' '}
                <TiShoppingCart size="3.5rem" color="#5fee83" />
                <span className={styles.cart__badge}>
                  {cart.cartItems.length}
                </span>
              </p>
            ) : (
              <a>
                <TiShoppingCart size="3.5rem" color="#5fee83" />
              </a>
            )}
          </Link>
        </div>

        {userInfo ? (
          <p
            className={styles.navbar__list__item__user}
            onClick={loginClickHandler}
          >
            {userInfo.firstname}
          </p>
        ) : (
          <li className={styles.navbar__list__item}>
            <Link href="/login">
              <a className={styles.navbar__link__login__cont}>
                <BiLogInCircle size="3rem" color="#5fee83" />
                <span className={styles.navbar__link__login}>Login</span>
              </a>
            </Link>
          </li>
        )}

        {userInfo && anchorEl ? (
          <>
            <li
              className={styles.navbar__list__item__user__menu}
              onClick={panelClickHandler}
            >
              Panel
            </li>
            <li
              className={styles.navbar__list__item__user__menu2}
              onClick={logoutClickHandler}
            >
              Logout
            </li>
          </>
        ) : null}

        <div className={styles.navbar__button} onClick={toggleSidebar}>
          <MdOutlineMenu size="3rem" color="black" />
        </div>
      </ul>
    </nav>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
