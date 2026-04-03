import "./Computer.css";
import { TbFileCv } from "react-icons/tb";
import { GrProjects } from "react-icons/gr";
import { TiContacts } from "react-icons/ti";
import { ImProfile } from "react-icons/im";
import { FaPowerOff } from "react-icons/fa";
import { useState } from "react";

export default function Computer({ setShowComputer }) {
  const [shuttingDown, setShuttingDown] = useState(false);

  function handlePowerOff() {
    setShuttingDown(true);
    setTimeout(() => setShowComputer(false), 5500); // slight delay after bar fills
  }
  return (
    <div className="computer-main">
      {shuttingDown && (
        <div className="shutdown-overlay">
          <p className="shutdown-text">Shutting down...</p>
          <div className="shutdown-bar-track">
            <div className="shutdown-bar-fill" />
          </div>
        </div>
      )}
      <div className="computer-middle"></div>
      <div className="computer-bottom">
        <button className="btn" onClick={handlePowerOff}>
          <FaPowerOff className="icon" />
        </button>
        <button className="btn">
          <ImProfile className="icon" />
        </button>
        <button className="btn">
          <GrProjects className="icon" />
        </button>
        <button className="btn">
          <TbFileCv className="icon" />
        </button>
        <button className="btn">
          <TiContacts className="icon" />
        </button>
      </div>
    </div>
  );
}
