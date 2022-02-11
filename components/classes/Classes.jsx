import data from '../../utils/data';
import styles from '../../styles/sass/main.module.scss';
import Image from 'next/image';
import NextLink from 'next/link';

const Classes = () => {
  return (
    <div className={styles.classlist}>
      {data.classes.map((classe) => (
        <div key={classe.id} className={styles.classlist__item}>
          <div className={styles.classlist__item__title}>
            {classe.name}
            <h5 className={styles.classlist__item__title__location}>
              {classe.location}
            </h5>
            <h5 className={styles.classlist__item__title__category}>
              {classe.category}
            </h5>
          </div>
          <div className={styles.classlist__item__image}>
            <Image src={classe.image} width={476} height={317} alt="kids" />
          </div>
          <p className={styles.classlist__item__parrafo}>{classe.subtitle}</p>
          <ul className={styles.classlist__item__varios}>
            <li className={styles.classlist__item__varios__li}>
              <span>
                Age:{' '}
                <span className={styles.classlist__item__varios__li__res}>
                  {classe.age[0]} - {classe.age[classe.age.length - 1]} years
                </span>{' '}
              </span>
            </li>
            <li className={styles.classlist__item__varios__li}>
              <span>
                Starts:
                <span className={styles.classlist__item__varios__li__res}>
                  {' '}
                  {classe.days[0]}
                </span>{' '}
              </span>
            </li>

            <li className={styles.classlist__item__varios__li}>
              <span>Sessions: {classe.days.length} </span>
            </li>

            {/* {classe.days.map((day) => (
              <div key={day}>{day[0]}</div>
            ))} */}
          </ul>

          <p className={styles.classlist__item__precio}>${classe.price}</p>
          <NextLink href={`/classe/${classe.slug}`} passHref>
            <div className={styles.classlist__item__divboton}>
              <button className={styles.classlist__item__boton}>
                Book Now
              </button>
            </div>
          </NextLink>
        </div>
      ))}
    </div>
  );
};

export default Classes;
