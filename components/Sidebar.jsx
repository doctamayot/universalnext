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
          <li className={styles.sidebar__list__item} onClick={closeSidebar}>
            <Link className={styles.sidebar__link} href="/">
              Home
            </Link>
          </li>
          <li className={styles.sidebar__list__item} onClick={closeSidebar}>
            <Link className={styles.sidebar__link} href="/about">
              About
            </Link>
          </li>
          <li className={styles.sidebar__list__item} onClick={closeSidebar}>
            <Link className={styles.sidebar__link} href="/services">
              Classes
            </Link>
          </li>
          <li className={styles.sidebar__list__item} onClick={closeSidebar}>
            <Link className="sidebar__link" href="/gallery">
              Gallery
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
