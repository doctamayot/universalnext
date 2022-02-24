import styles from '../styles/sass/main.module.scss';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import {
  AccountCircle,
  GroupOutlined,
  MailOutlineRounded,
  MenuBookRounded,
  ShoppingBasketRounded,
} from '@material-ui/icons';

const Adminside = ({ userInfo }) => {
  return (
    <div className={styles.orderhistcontainer__left}>
      <div className={styles.orderhistcontainer__left__menu}>
        <NextLink href="/profile" passHref>
          <Button
            startIcon={<AccountCircle />}
            variant="contained"
            color="primary"
            size="large"
          >
            Profile
          </Button>
        </NextLink>
      </div>
      <div className={styles.orderhistcontainer__left__menu}>
        <NextLink href="/admin/classes" passHref>
          <Button
            startIcon={<MenuBookRounded />}
            variant="contained"
            color="primary"
            size="large"
          >
            Classes
          </Button>
        </NextLink>
      </div>
      <div className={styles.orderhistcontainer__left__menu}>
        <NextLink
          href={
            userInfo && userInfo.isAdmin ? '/admin/orders' : '/order_history'
          }
          passHref
        >
          <Button
            startIcon={<ShoppingBasketRounded />}
            variant="contained"
            color="primary"
            size="large"
          >
            Bookings
          </Button>
        </NextLink>
      </div>
      {userInfo && userInfo.isAdmin ? (
        <>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink href="/admin/users" passHref>
              <Button
                startIcon={<GroupOutlined />}
                variant="contained"
                color="primary"
                size="large"
              >
                Users
              </Button>
            </NextLink>
          </div>
          <div className={styles.orderhistcontainer__left__menu}>
            <NextLink href="/admin/messages" passHref>
              <Button
                startIcon={<MailOutlineRounded />}
                variant="contained"
                color="primary"
                size="large"
              >
                Messages
              </Button>
            </NextLink>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Adminside;
