import styles from '../styles/sass/main.module.scss';
import Image from 'next/image';

const Mision = () => {
  return (
    <div className={styles.containermision}>
      <div className={styles.containermision__right}>
        <Image
          src="/img/mision.png"
          width={730}
          height={342}
          alt="mision universal"
        />
      </div>
      <div className={styles.containermision__left}>
        <h3 className={styles.containermision__left__text1}>
          Mission Statement
        </h3>
        <div className={styles.containermision__left__text2}>
          Universal Acting will educate and guide students to work, develop, and
          strengthen their craft, while encouraging verbal communication, mental
          spontaneity, self-confidence, and social interaction.
          <p className={styles.space}></p> They will learn how to be expressive
          in a safe and fun environment, and have a better understanding
          /appreciation for themselves and the people they work with.
          <p className={styles.space}></p> This innovative learning facility
          provides actors and artists with the skills and vital information they
          will need in order to succeed in the entertainment industry.
          <p className={styles.space}></p>Classes are led by industry
          professionals / educators and will provide students with comprehensive
          curriculum and programs.
          <p className={styles.space}></p>
          Our variety of instructors and class levels will meet the needs of
          aspiring beginners, as well as the seasoned actor.
          <p className={styles.space}></p> The classes will develop and enhance
          a student’s potential as an actor, while nurturing his/her talents,
          creativity, and self-esteem.
          <p className={styles.space}></p> The philosophy of U.A. is to serve
          those who possess a strong commitment to their craft and to provide
          them with the guidance and tools they will need in order to cultivate
          and develop their talent.
        </div>
      </div>
    </div>
  );
};

export default Mision;
