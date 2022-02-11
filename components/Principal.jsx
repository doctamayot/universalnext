import styles from '../styles/sass/main.module.scss';
import Link from 'next/link';
import Image from 'next/image';

import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Principal = () => {
  return (
    <div className={styles.principal}>
      <div className={styles.principal__main}>
        <div className={styles.principal__main__pres}>
          <h1 className={styles.principal__main__title}>
            Acting Classes for kids and Adults that deliver results
          </h1>
          <p className={styles.principal__main__parr}>
            The classes will develop and enhance a student’s potential as an
            actor, while nurturing his/her talents, creativity, and self-esteem.
          </p>
          <button className={styles.principal__main__button}>
            View Classes
          </button>
        </div>
      </div>

      <div className={styles.principal__main}>
        <div className={styles.principal__main__redes}>
          <Link href="/">
            <a>
              <FiInstagram
                className={styles.principal__main__red}
                size="50px"
              />
            </a>
          </Link>
          <Link href="/">
            <a>
              <FiFacebook className={styles.principal__main__red} size="50px" />
            </a>
          </Link>

          <Link href="/">
            <a>
              <FiYoutube className={styles.principal__main__red} size="50px" />
            </a>
          </Link>

          <Link href="/">
            <a>
              <FiTwitter className={styles.principal__main__red} size="50px" />
            </a>
          </Link>
        </div>

        <div className={styles.principal__image}>
          <Image src="/img/principa.png" alt="" width={510} height={489} />
        </div>
      </div>
    </div>
  );
};

export default Principal;
