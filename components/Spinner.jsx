import styles from '../styles/sass/main.module.scss';

const Spinner = () => {
  return (
    <div className="skchase">
      <div className={styles.skchasedot}></div>
      <div className={styles.skchasedot}></div>
      <div className={styles.skchasedot}></div>
      <div className={styles.skchasedot}></div>
      <div className={styles.skchasedot}></div>
      <div className={styles.skchasedot}></div>
    </div>
  );
};

export default Spinner;
