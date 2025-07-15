import React, { useRef } from 'react';
import './../Css/Hero.css';
import AnimationText from './AnimationText';
import HeroImage from './HeroImage';
import ExploreAll from './ExploreAll';
import RandomElement from './RandomElement';
import Info from './Info';
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowDown } from "react-icons/fa6";
import Footer from './Footer';
const Hero = () => {
  const heroRef = useRef(null);
  const downRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start center", "center center"]
  });

  const { scrollYProgress: downProgress } = useScroll({
    target: downRef,
    offset: ["start center", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const hintOpacity = useTransform(downProgress, [0,1], [1, 0]);

  return (
    <div className="hero">
      <div className="UpperCon">
        <AnimationText />

        <div className="hero-img">
          <HeroImage />
        </div>

        <motion.div
          ref={downRef}
          className="mobile-view hero-scroll-down"
          style={{
            opacity: hintOpacity,
            scrollBehavior : "smooth"
          }}
        >
          <div className="hero-scroll-circle">
            <a href='#random'>
            <FaArrowDown style={{ fontSize: "1em" }} />
            </a>
          </div>
          <div>Scroll Down</div>
        </motion.div>
      </div>

      <div
      style={{
        scrollBehavior : "smooth"
      }}
      id="random">
        <motion.div
          ref={heroRef}
          style={{
            scale,
            opacity
          }}
        >
          <RandomElement />
        </motion.div>

        <ExploreAll />
        <Info />
        <Footer />
      </div>
    </div>
  );
};

export default Hero;
