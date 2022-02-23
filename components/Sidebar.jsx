import Link from 'next/link';
import styles from '../styles/sass/main.module.scss';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {isOpen ? (
        <div className={styles.sidebar__backdrop} onClick={closeSidebar}></div>
      ) : (
        <></>
      )}
      <nav className={isOpen ? styles.sidebar__open : styles.sidebar__closed}>
        <ul className={styles.sidebar__list}>
          <li className={styles.sidebar__list__item}>
            <Link className={styles.sidebar__link} href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.sidebar__list__item}>
            <Link className={styles.sidebar__link} href="/classes">
              Classes
            </Link>
          </li>
          <li className={styles.sidebar__list__item}>
            <Link className={styles.sidebar__link} href="/teachers">
              Teachers
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
