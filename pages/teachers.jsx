import React from 'react';
import styles from '../styles/sass/main.module.scss';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

const teachers = () => {
  return (
    <div className={styles.teachcont}>
      <NextSeo
        title="Universal Acting - Teachers"
        description="Universal Acting Teachers "
      />
      <h4 className={styles.teachcont__title}> Our Teachers</h4>
      <div className={styles.teachcont__grid}>
        <div className={styles.teachcont__grid__image1}>
          <h5 className={styles.teachcont__grid__image1__title}>
            Elena Maria Garcia
          </h5>
          <Image
            src="/img/elena.webp"
            width={208}
            height={246}
            alt="Teacher universal acting"
          />
        </div>
        <div className={styles.teachcont__grid__text1}>
          Elena Maria Garcia: She is a three-time recipient of the prestigious
          Carbonell award best supporting actor Zoetic Stages Moscow and City
          Theatres Summer Shorts and best ensemble for City Theatre. The World
          Premiere of FUACATA! A Latinas Guide to Surviving the Universe,
          co-written with Stuart Meltzer of Zoetic Stage, earned her a Carbonell
          nomination for best performance and best new work. Elena also has
          presented her self-written, directed, and produced one-person show, DO
          YOU SPEAK MEXICAN? throughout South Florida. Elenas future project is
          OYEME! The Latinx Festival. She hopes this venture will bring light to
          our Latinx community of artists and thinkers. Elena was the founding
          member of Separate Checks Improv Troupe, Quien Sigue A Quien, the
          first Spanish speaking improv troupe in the US and the first
          all-female improv troupe on the East coast, Big Purse and Matching
          Shoes. She holds a Bachelor of Fine Arts and a Masters in
          Acting/Directing. She has appeared in numerous national commercials,
          feature films and television. Elenas students have garnered Critics
          Choice for Florida High School District competitions 2003-2017 and
          received ten Thespian State Champion titles in 2007-2017. Many of her
          students have been featured in national television shows and Broadway
          and have been accepted in top Universities and Colleges. Elena has
          taught improvisation and acting for over 30 years. She currently
          teaches at Universal Acting and New World School of the Arts, Nova
          Southeastern University, Florida International University and is a
          member of Screen Actors Guild and Actors Equity.
        </div>
        <div className={styles.teachcont__grid__image2}>
          <h5 className={styles.teachcont__grid__image2__title}>Chris Perez</h5>
          <Image
            src="/img/chris.webp"
            width={270}
            height={291}
            alt="Teacher universal acting"
          />
        </div>
        <div className={styles.teachcont__grid__text2}>
          Christian Perez graduated with a BFA from New World School of Arts. He
          has been seen in a numerous of production: Rashomon, Speed the Plow,
          The Miser, Lend me a Tenor, Lloyds Prayer, Six Characters in search of
          an Author, Our Town, Godspell, Working, Master and Margarita, Camino
          Real,The Cherry Orchard, The Seagull, Uncle Vanya, and As You Like it.
          Chris passion is comedy and he has been performing Stand Up Comedy
          since 2001 throughout the east coast. Chris has a great eye for the
          comedic side of life. He can take any individual and help him/her find
          the funny and put it in a sketch or stand up. Chris has written
          comedies for TV shows and wrote and performed his one man show Flying
          Lessons at the Fillmore Theater in Miami Beach. Chris continues to
          work the stand-up circuit on the east coast.
        </div>

        <div className={styles.teachcont__grid__image3}>
          <h5 className={styles.teachcont__grid__image3__title}>
            Jerry Seeger
          </h5>
          <Image
            src="/img/jerry.webp"
            width={282}
            height={417}
            alt="Teacher universal acting"
          />
        </div>

        <div className={styles.teachcont__grid__text3}>
          Director of Drama, St. Thomas Aquinas HS, Ft. Lauderdale, FL
          (1/06-Present) Faculty, Universal Acting School of Acting for Kids
          Speech & Debate teacher, St. Thomas Aquinas HS, Ft. Lauderdale, FL
          (8/04-6/06) Faculty, St. Jerome Catholic School, Ft. Lauderdale, FL
          (8/02-6/04) Faculty, St. Clement Catholic School, Wilton Manors, FL
          (3/02-6/02) Substitute Latin instructor, St. Thomas Aquinas HS, Ft.
          Lauderdale, FL (1/02-3/02) Professional: Producer, Underdog
          Productions (1995-Present) Founding member, Separate Checks Improv
          Troupe (1998-2008) HONORS AND AWARDS Broward County Theatre Teacher of
          the Year, 2016 Florida State Champion Critics Choice, 2010, 2015, 2017
          (2x) Florida District Champion Critics Choice, 2009, 2010, 2013, 2015,
          2017 Broward County Cultural Arts Grant Recipient, 2004, 2006
          Finalist, Broward County Theatre Teacher of the Year, 2014
        </div>
      </div>
    </div>
  );
};

export default teachers;
