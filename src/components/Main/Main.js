import { useState } from "react";
import "./Main.css";
import {
  FaPython,
  FaJs,
  FaJava,
  FaHtml5,
  FaReact,
  FaAngular,
} from "react-icons/fa";
import { BsTypescript } from "react-icons/bs";
import { DiRuby } from "react-icons/di";
import { SiRubyonrails, SiExpressdotcom, SiFastapi } from "react-icons/si";
import { IoLogoCss3 } from "react-icons/io5";
import { BiLogoSpringBoot } from "react-icons/bi";

export default function Main() {
  let [showComputer, setShowComputer] = useState(false);

  return (
    <div className="main">
      {/* <div className="main-top">
        <nav>
          <h2>Me</h2>
        </nav>
        <nav>
          <h2>Skills</h2>
        </nav>
        <nav>
          <h2>Projects</h2>
        </nav>
        <nav>
          <h2>Work</h2>
        </nav>
      </div> */}
      {/* {!showComputer && <Home setShowComputer={setShowComputer}/>}
            {showComputer && <Computer setShowComputer={setShowComputer}/>} */}
      <div className="first-section">
        <h1>Hi</h1>
        <img src="profile-nobg.png" className="image" />
      </div>

      <div className="skills">
        <div className="skills-row">
          <FaReact className="skill-icon" title="React" />
          <FaAngular className="skill-icon" title="Angular" />
        </div>

        <div className="skills-row">
          <SiFastapi className="skill-icon" title="FastAPI" />
          <SiRubyonrails className="skill-icon" title="Ruby on Rails" />
          <BiLogoSpringBoot className="skill-icon" title="Spring Boot" />
          <SiExpressdotcom className="skill-icon" title="Express" />
        </div>

        <div className="skills-row">
          <FaPython className="skill-icon" title="Python" />
          <FaJs className="skill-icon" title="JavaScript" />
          <IoLogoCss3 className="skill-icon" title="CSS" />
          <FaHtml5 className="skill-icon" title="HTML" />
          <BsTypescript className="skill-icon" title="TypeScript" />
          <DiRuby className="skill-icon" title="Ruby" />
          <FaJava className="skill-icon" title="Java" />
        </div>
      </div>

      <div className="projects">

      </div>
    </div>
  );
}
