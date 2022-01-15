import React, { useContext } from "react";
import styles from "./Home.module.css";
import Navbar from "./Navbar.js";
import { LoginContext } from "../context/LoginContext";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import subsection1 from "../images/subsection1.svg";
const Home = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <div className={styles.Home}>
      <div className={styles.hero}>
        <Navbar className={styles.Navbar} />
        <div className={styles.heroinfo}>
          <h1>IMAGINE A PLACE...</h1>
          <p>
            ...where you can belong to a school club, a gaming group, or a
            worldwide art community. <br />
            Where just you and a handful of friends can spend time together.
            <br />A place that makes it easy to talk every day and hang out more
            often.
          </p>
          <div className={styles.herobuttons}>
            <button className={styles.downloadbotton} downloadbotton>
              Download for Windows
            </button>
            <button className={styles.secondbutton}>
              Download for Windows
            </button>
          </div>
        </div>
      </div>
      <div className={styles.subsection1}>
        <img className={styles.subsection1Image} src={subsection1} alt="" />
        <div className={styles.subsection1Info}>
          <h2>
            Create an <br /> invite-only <br /> place where you
            <br /> belong
          </h2>
          <p>
            Discord servers are organized into topic-
            <br /> based channels where you can collaborate,
            <br /> share, and just talk about your day without
            <br /> clogging up a group chat.
          </p>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.top}>
          <div className={styles.logoFooter}>
            <h1>
              IMAGINE A <br />
              PLACE
            </h1>
            <p>English, USA </p>
          </div>
          <div className={styles.product}>
            <p style={{ color: "#5865f2" }}>Product</p>
            <p>Download</p>
            <p>Nitro</p>
            <p>Status</p>
          </div>
          <div clasName={styles.company}>
            <p style={{ color: "#5865f2" }}>Company</p>
            <p>About</p>
            <p>Jobs</p>
            <p>Branding</p>
            <p>Newsroom</p>
          </div>
          <div clasName={styles.listss}>
            <p style={{ color: "#5865f2" }}>College</p>
            <p>Support</p>
            <p>Safety</p>
            <p>Blog</p>
            <p>Feedback</p>
            <p>Developers</p>
            <p>StreamKit</p>
          </div>
          <div clasName={styles.listss}>
            <p style={{ color: "#5865f2" }}>Policies</p>
            <p>Terms</p>
            <p>Privacy</p>
            <p>Cookie Settings</p>
            <p>Guidelines</p>
            <p>Acknowledgments</p>
            <p>Licenses</p>
            <p>Moderation</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <h3 className={styles.discordLogo}>Discord</h3>
          <button className={styles.opendiscordbotton}>
            <Link to={isLoggedIn ? "/app" : "/login"}>
              {isLoggedIn ? "Open Discord" : "Login"}
            </Link>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
