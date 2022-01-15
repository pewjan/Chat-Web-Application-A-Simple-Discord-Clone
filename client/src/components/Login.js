import React, { useState, useContext } from "react";
import styles from "./Login.module.css";
import Qr from "../images/qr.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const { loginInfo, setLoginInfo } = useContext(UserContext);

  const [info, setInfo] = useState({ email: "", password: "" });
  const handleLogin = async (e) => {
    e.preventDefault();

    if (info.email === "" || info.password === "") {
      return;
    } else {
      await axios
        .get(`http://localhost:4000/${info.email}`)
        .then((res) => {
          const { data } = res;
          if (
            info.email === data[0].email &&
            info.password === data[0].password
          ) {
            setIsLoggedIn(true);
            setLoginInfo(data[0]);
            localStorage.setItem("user", JSON.stringify(data[0]));
            console.log("data set");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.Login}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={styles.loginform}
      >
        <div className={styles.leftside}>
          <div className={styles.logingreet}>
            <h2 className={styles.loginTitle}>Welcome back!</h2>
            <p>We're excited to see you again!</p>
          </div>
          <div className={styles.email}>
            <label htmlFor="">EMAIL OR PHONE NUMBER</label>
            <input
              required
              onChange={(e) => {
                const newInfo = info;
                newInfo["email"] = e.target.value;
                setInfo(newInfo);
              }}
              type="email"
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="">PASSWORD</label>
            <input
              required
              onChange={(e) => {
                const newInfo = info;
                newInfo["password"] = e.target.value;
                setInfo(newInfo);
              }}
              type="text"
            />
            <a href="#">Forgot your password?</a>
          </div>
          <div className={styles.submitinfo}>
            <button onClick={handleLogin} className={styles.submitbottom}>
              Login
            </button>
            <p className={styles.register}>
              Need an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
        <div className={styles.rightside}>
          <div className={styles.content}>
            <img className={styles.Qrpng} src={Qr} alt="" />
            <div className={styles.contenttext}>
              <h3>Log in wth QR Code</h3>
              <p>
                Scan this with the Discord mobile <br />
                app to log in instantly.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
