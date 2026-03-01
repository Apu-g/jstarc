"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoading } from "@/contexts/LoadingContext";
import "./Loader.css";

const Loader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const loaderRef = useRef(null);
  const { introShown, markLoaderDone } = useLoading();

  useGSAP(() => {
    // Don't run animation if intro was already shown (navigation, not reload)
    if (introShown) {
      setIsLoaded(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
        markLoaderDone();
      },
    });

    // Much faster loader: ~3.5s total instead of ~8s
    tl.from(".clip-top, .clip-bottom", {
      duration: 1,
      delay: 0.3,
      height: "50vh",
      ease: "power4.inOut",
    })
      .to(
        ".marquee",
        {
          duration: 1.5,
          delay: -0.5,
          top: "50%",
          ease: "power4.inOut",
        },
        "<"
      )
      .from(
        ".clip-top .marquee, .clip-bottom .marquee",
        {
          duration: 2,
          left: "100%",
          ease: "power3.inOut",
        },
        0
      )
      .from(
        ".clip-center .marquee",
        {
          duration: 2,
          opacity: 0.9,
          left: "-100%",
          ease: "power3.inOut",
        },
        0
      )
      .to(
        ".clip-top",
        {
          duration: 0.8,
          clipPath: "inset(0 0 100% 0)",
          ease: "power4.inOut",
        },
        2.5
      )
      .to(
        ".clip-bottom",
        {
          duration: 0.8,
          clipPath: "inset(100% 0 0 0)",
          ease: "power4.inOut",
        },
        2.5
      )
      .to(
        ".clip-top .marquee, .clip-bottom .marquee, .clip-center .marquee span",
        {
          duration: 0.5,
          backgroundColor: "transparent",
          opacity: 0,
          ease: "power2.inOut",
        },
        2.5
      )
      .to(
        loaderRef.current,
        {
          duration: 0.5,
          backgroundColor: "transparent",
          opacity: 0,
          ease: "power2.inOut",
        },
        3
      );
  }, { scope: loaderRef, dependencies: [introShown] });

  // Don't render if intro already shown (navigated back) or animation completed
  if (introShown || isLoaded) return null;

  return (
    <div className="loader-wrapper" ref={loaderRef}>
      <div className="loader">
        <div className="loader-clip clip-top">
          <div className="marquee">
            <div className="marquee-container">
              <span>JSTARC </span>
              <span>JSTARC </span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
            </div>
          </div>
        </div>

        <div className="loader-clip clip-bottom">
          <div className="marquee">
            <div className="marquee-container">
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
            </div>
          </div>
        </div>

        <div className="clip-center">
          <div className="marquee">
            <div className="marquee-container">
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
              <span>JSTARC</span>
            </div>
          </div>
        </div>
      </div>
      <div className="jstar-text">JSTARC WEBSITE</div>
    </div>
  );
};

export default Loader;
