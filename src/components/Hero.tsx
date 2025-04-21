import React, { useState, useEffect } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import './Hero.css';
import devImage from '../assets/dev-desk.svg'; // optional, if you want image

interface HeroProps {
  onLoginClick: () => void;
}

const TEXTS = [
  '🚀 Ace Your Interviews',
  '📚 Master DSA',
  '💻 Crack Coding Rounds',
  '☁️ Learn Azure',
];

const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((prev) => prev + 1), 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-left">
        <h1>
          <TextTransition springConfig={presets.wobbly}>
            {TEXTS[index % TEXTS.length]}
          </TextTransition>
        </h1>
        <p className="hero-description">
          PrepSaga helps you prepare smartly for tech interviews with real-world problems,
          expert guidance, and career-boosting practice.
        </p>
        <button onClick={onLoginClick} className="small-btn">Start Preparing</button>
      </div>

      {/* Optional graphic on the right */}
      {/* <div className="hero-right">
        <img src={devImage} alt="Developer Desk" className="hero-image" />
      </div> */}
    </div>
  );
};

export default Hero;
