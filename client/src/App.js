import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Chat from "./components/Chat";
import ChatBar from "./components/ChatBar";
import Register from "./components/Register";

import { LoginContext } from "./context/LoginContext.js";
import { UserContext } from "./context/UserContext.js";
import { ServerContext } from "./context/ServerContext";
import { RegisteredContext } from "./context/RegisteredContext";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [registered, setRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInfo, setLoginInfo] = useState({});
  const [serverList, setServerList] = useState([
    {
      id: 1,
      name: "Public",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8479Ucg3dNkErrscpa3BemM8RUp9Z68HV7w4TJpEL1meuvgETwTvYdJXWm5A1cqkcFA8&usqp=CAU",
      channels: [{ id: 1, name: "Public Channel" }],
      messages: [],
    },

    {
      id: 2,
      name: "Fortnite",
      image: "https://i.imgur.com/13RZOhj.gif",
      channels: [
        { id: 1, name: "Fortnite Channel" },
        { id: 2, name: "Fortnite Channel 2" },
      ],
      messages: [],
    },
  ]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoginInfo(foundUser);
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ loginInfo, setLoginInfo }}>
          <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <ServerContext.Provider value={{ serverList, setServerList }}>
              <RegisteredContext.Provider value={{ registered, setRegistered }}>
                <Switch>
                  <Route path="/register">
                    {isLoggedIn ? (
                      <Redirect to="/app" />
                    ) : registered ? (
                      <Redirect to="/login" />
                    ) : (
                      <Register />
                    )}
                  </Route>
                  <Route path="/login">
                    {isLoggedIn ? <Redirect to="/app" /> : <Login />}
                  </Route>

                  <Route path={`/app/:id`}>
                    {isLoggedIn ? <Chat /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/app">
                    {!isLoggedIn ? (
                      <Redirect to="/login" />
                    ) : (
                      <Redirect to="/app/Public" />
                    )}
                  </Route>
                  <Route path="/" component={Home}></Route>
                </Switch>
              </RegisteredContext.Provider>
            </ServerContext.Provider>
          </LoginContext.Provider>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
