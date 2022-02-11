import styles from '../styles/sass/main.module.scss';

import Image from 'next/image';
import Classes from '../components/classes/Classes';

const Second = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container__image}>
        <Image
          src="/img/second .jpg"
          width={700}
          height={250}
          alt="Universal Acting"
        ></Image>
      </div>
      <h2 className={styles.container__title}>Explore our Acting Classes</h2>
      <p className={styles.container__text}>
        They will learn how to be expressive in a safe and fun environment, and
        have a better understanding/appreciation for themselves and the people
        they work with.
      </p>
      <ul>
        <Classes />
      </ul>
    </div>
  );
};

export default Second;
