import styles from '../styles/sass/main.module.scss';
import Image from 'next/image';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';

const classes = (props) => {
  const { products } = props;
  console.log(products);
  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>Explore our Acting Classes</h2>
      <p className={styles.container__text}>
        They will learn how to be expressive in a safe and fun environment, and
        have a better understanding/appreciation for themselves and the people
        they work with.
      </p>
      <ul>
        <div className={styles.classlist}>
          {products.map((classe) => (
            <div key={classe._id} className={styles.classlist__item}>
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
              <p className={styles.classlist__item__parrafo}>
                {classe.subtitle}
              </p>
              <ul className={styles.classlist__item__varios}>
                <li className={styles.classlist__item__varios__li}>
                  <span>
                    Age:{' '}
                    <span className={styles.classlist__item__varios__li__res}>
                      {classe.age[0]} - {classe.age[classe.age.length - 1]}{' '}
                      years
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
                <li className={styles.classlist__item__varios__li}>
                  <span>
                    Places:{' '}
                    <span className={styles.classlist__item__varios__li__res}>
                      {classe.countInStock} Student(s)
                    </span>{' '}
                  </span>
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
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, '-students').lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default classes;
classes;
