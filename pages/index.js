import Comments from "../components/Comments";
import { NextSeo } from "next-seo";
import Jobs from "../components/Jobs";
import Mision from "../components/Mision";
import Principal from "../components/Principal";
import Head from "next/head";
import styles from "../styles/sass/main.module.scss";
import Image from "next/image";
import NextLink from "next/link";
// import db from "../utils/db";
// import Product from "../models/Product";
import { BsWhatsapp } from "react-icons/bs";
import { useEffect, useState } from "react";

const mensaje = `https://api.whatsapp.com/send?phone=573177936776&text=Hi universal acting%20!!!!!`;

export default function Home() {
  const [products, setProducts] = useState([]);
  //const [loading, setLoading] = useState(true);
  // const { products } = props;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        const jsonData = await response.json();
        setProducts(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  console.log(products);
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="acting school, acting schools, acting school Miami, how to become an actor, acting classes, study acting, kids classes, kids acting, teens classe, teens acting"
        />
      </Head>
      <NextSeo
        title="How to become an Actors - Universal Acting"
        description="Universal Acting will educate and guide students to work, develop, and strengthen their craft, while encouraging verbal communication, mental spontaneity, self-confidence, and social interaction.
        They will learn how to be expressive in a safe and fun environment, and have a better understanding /appreciation for themselves and the people they work with.
        This innovative learning facility provides actors and artists with the skills and vital information they will need in order to succeed in the entertainment industry.Classes are led by industry professionals / educators and will provide students with comprehensive curriculum and programs.
        Our variety of instructors and class levels will meet the needs of aspiring beginners, as well as the seasoned actor.
        The classes will develop and enhance a student’s potential as an actor, while nurturing his/her talents, creativity, and self-esteem.
        The philosophy of U.A. is to serve those who possess a strong commitment to their craft and to provide them with the guidance and tools they will need in order to cultivate and develop their talent."
        keywords="acting school, acting schools, acting school Miami, how to become an actor, acting classes, study acting, kids classes, kids acting, teens classe, teens acting"
      />

      <div className="whatsapp2">
        <a href={mensaje} rel="noreferrer" target="_blank">
          <BsWhatsapp className="iconow2" />
        </a>
      </div>

      <Principal />
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
          They will learn how to be expressive in a safe and fun environment,
          and have a better understanding/appreciation for themselves and the
          people they work with.
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
                  <Image
                    src={classe.image}
                    width={476}
                    height={317}
                    alt="kids"
                  />
                </div>
                <p className={styles.classlist__item__parrafo}>
                  {classe.subtitle}
                </p>
                <ul className={styles.classlist__item__varios}>
                  <li className={styles.classlist__item__varios__li}>
                    <span>
                      Age:{" "}
                      <span className={styles.classlist__item__varios__li__res}>
                        {classe.age} years
                      </span>{" "}
                    </span>
                  </li>
                  <li className={styles.classlist__item__varios__li}>
                    <span>
                      Duration:
                      <span className={styles.classlist__item__varios__li__res}>
                        {" "}
                        {classe.duration}
                      </span>{" "}
                    </span>
                  </li>

                  <li className={styles.classlist__item__varios__li}>
                    <span>Sessions: {classe.days} </span>
                  </li>
                  <li className={styles.classlist__item__varios__li}>
                    <span>
                      Places:{" "}
                      <span className={styles.classlist__item__varios__li__res}>
                        {classe.countInStock} Student(s)
                      </span>{" "}
                    </span>
                  </li>

                  {/* {classe.days.map((day) => (
        <div key={day}>{day[0]}</div>
      ))} */}
                </ul>

                <p className={styles.classlist__item__precio}>
                  ${classe.price}
                </p>

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
      <Comments />
      <Jobs />
      <Mision />
    </>
  );
}

// export async function getServerSideProps() {
//   await db.connect();
//   const products = await Product.find({}, "-students").lean();
//   await db.disconnect();

//   return {
//     props: {
//       products: products.map(db.convertDocToObj),
//     },
//   };
//}
