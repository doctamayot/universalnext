import styles from '../styles/sass/main.module.scss';

const Jobs = () => {
  return (
    <div className={styles.contjobs}>
      <h4 className={styles.contjobs__title}>Some of our work</h4>
      <iframe
        sandbox="allow-scripts allow-same-origin"
        className={styles.contjobs__video}
        width="284"
        height="200"
        src="https://www.youtube.com/embed/eU0QfiDBWBw"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/5_fs1bPYDyo"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/Ykr9drQwGvc"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/i5Z6dUCoCCI"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/WB6qQQ-04PU"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/0xAf4wY-7jo"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
      <iframe
        className={styles.contjobs__video}
        width="460"
        height="460"
        src="https://www.youtube.com/embed/ZOtUc6MpbPM"
        title="The Watering"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
      />
    </div>
  );
};

export default Jobs;
