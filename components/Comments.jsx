import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styles from '../styles/sass/main.module.scss';

import Image from 'next/image';

const comments = () => {
  const antonella = `What a great class for Antonella! Just amazing!!`;
  const alexa =
    '"OMG I love the acting class!! It is soooo much fun!! It makes me soooo happy!!"';
  const daysi =
    '"Just wanted to thank you for the self tape! She got rave reviews and it opened some awesome doors for my small fry . She keeps asking for the acting classes. You guys are the best"';
  const Ayden =
    '"Ayden was showing dad his levels with this mad scientist story. We are so pleased with what you have done with him over the last few weeks. Keep inspiring people......you just don’t know how much they will value and treasure you for a lifetime. God bless you!"';
  const Rosemarie =
    '"Thank you Chris for all your insight and encouragement, I am enjoying your class so much!"';
  return (
    <div>
      <Carousel
        autoPlay="true"
        infiniteLoop="true"
        showThumbs={false}
        className={styles.containercomm}
      >
        <div className={styles.containercomm__main}>
          <Image
            className={styles.containercomm__main__image}
            src="/img/alexa.png"
            width={183}
            height={183}
            alt="comments universal"
          />

          <h4 className={styles.containercomm__main__name}>Alexa Freedman</h4>
          <p className={styles.containercomm__main__comm}>{alexa}</p>
        </div>
        <div className={styles.containercomm__main}>
          <Image
            className={styles.containercomm__main__image}
            src="/img/DAISY.png"
            width={183}
            height={183}
            alt="comments universal"
          />

          <h4 className={styles.containercomm__main__name}>Daisy Flores</h4>
          <p className={styles.containercomm__main__comm}>{daysi}</p>
        </div>
        <div className={styles.containercomm__main}>
          <Image
            className={styles.containercomm__main__image}
            src="/img/antonella.png"
            width={183}
            height={183}
            alt="comments universal"
          />

          <h4 className={styles.containercomm__main__name}>Antonella</h4>
          <p className={styles.containercomm__main__comm}>{antonella}</p>
        </div>
        <div className={styles.containercomm__main}>
          <Image
            className={styles.containercomm__main__image}
            src="/img/ay.png"
            width={183}
            height={183}
            alt="comments universal"
          />

          <h4 className={styles.containercomm__main__name}>Ayden</h4>
          <p className={styles.containercomm__main__comm}>{Ayden}</p>
        </div>
        <div className={styles.containercomm__main}>
          <Image
            className={styles.containercomm__main__image}
            src="/img/rosemarie.png"
            width={183}
            height={183}
            alt="comments universal"
          />

          <h4 className={styles.containercomm__main__name}>Rosemarie</h4>
          <p className={styles.containercomm__main__comm}>{Rosemarie}</p>
        </div>
      </Carousel>
    </div>
  );
};

export default comments;
