import React, { useState, useContext } from "react";
import styles from "./Register.module.css";
import { RegisteredContext } from "../context/RegisteredContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { Redirect } from "react-router-dom";
const Register = () => {
  const { setRegistered } = useContext(RegisteredContext);
  const [info, setInfo] = useState({ email: "", password: "" });
  const handleRegister = async (e) => {
    e.preventDefault();
    if (info.email === "" || info.password === "") {
      return;
    } else {
      await axios
        .get(`http://localhost:4000/${info.email}`)
        .then(async (res) => {
          if (res.data.length == 0) {
            await axios
              .post(`http://localhost:4000/register`, {
                email: info.email,
                password: info.password,
              })
              .then((res) => {
                if (res.status === 200) {
                  console.log("new account created!");
                  setRegistered(true);
                }
              });
          } else {
            console.log("account already exists");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div className={styles.Register}>
      <form className={styles.registerform}>
        <div className={styles.logingreet}>
          <h2 className={styles.loginTitle}>Create an account</h2>
        </div>
        <div className={styles.email}>
          <label htmlFor="">EMAIL</label>
          <input
            onChange={(e) => {
              const newInfo = { ...info };
              newInfo.email = e.target.value;
              setInfo(newInfo);
            }}
            type="email"
          />
        </div>
        <div className={styles.password}>
          <label htmlFor="">PASSWORD</label>
          <input
            onChange={(e) => {
              const newInfo = { ...info };
              newInfo.password = e.target.value;
              setInfo(newInfo);
            }}
            required
            type="text"
          />
        </div>
        <div className={styles.submitinfo}>
          <button
            onClick={(e) => {
              handleRegister(e);
            }}
            className={styles.submitbottom}
          >
            Continue
          </button>
          <p className={styles.register}>
            <Link to="/login">Already have an account?</Link>
          </p>
        </div>

        <div className={styles.registerPolicy}>
          <p>
            By registering, you agree to Discord's{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
