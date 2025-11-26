import "./CustomBackground.css";
import { useState } from "react";

const CustomBackground = ({neonColor, setNeonColor}) => {

  return (
    <div className="bg" style={{ "--neon-color": neonColor }}>
      {/* <img src="/brick_wall.jpg" alt="background" /> */}
      <div className="neon-right" />
      <div className="neon-left" />

      {/* Example buttons to test color change
      <div style={{ position: "fixed", top: "2vh", left: "2vw", zIndex: 10 }}>
        <button onClick={() => setNeonColor("#00bfff")}>Blue</button>
        <button onClick={() => setNeonColor("#00ff88")}>Green</button>
        <button onClick={() => setNeonColor("#ff0080")}>Pink</button>
      </div> */}
    </div>
  );
};

export default CustomBackground;
