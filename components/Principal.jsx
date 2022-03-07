import styles from '../styles/sass/main.module.scss';

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
            The classes will develop and enhance a students potential as an
            actor, while nurturing his/her talents, creativity, and self-esteem.
          </p>
          <button className={styles.principal__main__button}>
            View Classes
          </button>
        </div>
      </div>

      <div className={styles.principal__main}>
        <div className={styles.principal__main__redes}>
          <a
            className={styles.principal__main__red}
            href="https://www.instagram.com/universalacting/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            <FiInstagram className={styles.principal__main__red} size="50px" />
          </a>
          <a
            className={styles.principal__main__red}
            href="https://www.facebook.com/UniversalActing/"
            target="_blank"
            rel="noreferrer"
          >
            <FiFacebook className={styles.principal__main__red} size="50px" />
          </a>

          <a
            className={styles.principal__main__red}
            href="https://www.youtube.com/channel/UCXVBPNvdeq6lHC62wepNBOw"
            target="_blank"
            rel="noreferrer"
          >
            <FiYoutube className={styles.principal__main__red} size="50px" />
          </a>

          <a
            className={styles.principal__main__red}
            href="https://www.twitter.com/universalacting"
            target="_blank"
            rel="noreferrer"
          >
            <FiTwitter className={styles.principal__main__red} size="50px" />
          </a>
        </div>

        <div className={styles.principal__image}>
          <Image
            src="/img/principa.png"
            alt="universal Acting"
            width={510}
            height={489}
          />
        </div>
      </div>
    </div>
  );
};

export default Principal;
