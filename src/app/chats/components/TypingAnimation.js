import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import animationData from "../assets/animation_lkrpqaom.json"; // Replace with the path to your Lottie JSON file

const TypingAni = ({ width, height }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      animationData: animationData,
      loop: true, // Set to false if you don't want the animation to loop
      autoplay: true, // Set to false if you don't want the animation to start automatically
    });

    // You can control the animation using anim methods like play(), pause(), etc.
    // For example, to stop the animation after a certain duration:
    // setTimeout(() => anim.pause(), 3000); // Stop the animation after 3 seconds

    // Don't forget to clean up the animation on unmount
    return () => anim.destroy();
  }, []);

  return <div ref={containerRef} style={{ width, height }} />;
};

export default TypingAni;
