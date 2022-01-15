import React, { useState, useContext, useEffect, useRef } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { LoginContext } from "../context/LoginContext";
import { ServerContext } from "../context/ServerContext";
import styles from "./Chat.module.css";
import ChatBar from "./ChatBar";
import { useParams } from "react-router-dom";
import cors from "cors";
import axios from "axios";

const socket = io("http://localhost:4000/", {
  transports: ["websocket", "polling"],
});

const Chat = () => {
  const { serverList, setServerList } = useContext(ServerContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const { loginInfo, setLoginInfo } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState({});
  const [message, setMessage] = useState("");
  const [showServer, setShowServer] = useState(null);

  const { email } = loginInfo;

  const { id } = useParams();

  const scrollRef = useRef();
  const messageRef = useRef();
  const textBoxRef = useRef();

  const handleMouseEnter = (id) => {
    setShowServer(id);
  };
  const handleMouseLeave = (id) => {
    setShowServer(null);
  };
  const handleLogOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };
  const handleSendMessage = (e) => {
    if (e.key === "Enter") {
      socket.emit("message", { email, message, id });
      e.target.value = "";
    }
  };

  const handleRemove = async (e, id, email, message, _id) => {
    if (loginInfo.email === email) {
      await axios
        .delete(`http://localhost:4000/messages/`, {
          data: { id, _id },
        })
        .then(() => {
          socket.emit("deletedMessage", { email, message, id, _id });
        });
    }
  };

  const handleEdit = async (e, email, _id, id) => {
    setEditMode(false);
    setEditMessageId({});
    if (loginInfo.email === email) {
      await axios
        .patch(`http://localhost:4000/editMessage`, {
          newMessage: e.target.value,
          _id: _id,
          id: id,
        })
        .then(() => {
          e.target.value = "";
          socket.emit("updatedMessage", { email, message, id, _id });
        });
    }
  };
  useEffect(() => {
    socket.emit("changeRoom", id);
    axios.get(`http://localhost:4000/app/${id}`).then((res) => {
      const { data } = res;
      const messages = [...data];
      const newServerList = [...serverList];
      newServerList.map((server) => {
        if (server.name == id) {
          server.messages = messages;
        }
      });
      setServerList(newServerList);
      textBoxRef.current.focus();
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    });
  }, [id]);
  useEffect(() => {
    const handleMessage = ({ email, message, id, _id }) => {
      const newServerList = [...serverList];
      newServerList.map((server) => {
        if (server.name == id) {
          server.messages.push({ email, message, _id });
        }
      });
      setServerList(newServerList);
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    };
    const handleMessageDelete = ({ email, message, id, _id }) => {
      const newServerList = [...serverList];
      newServerList.map((server) => {
        if (server.name == id) {
          server.messages = server.messages.filter((item) => {
            return item._id !== _id;
          });
        }
      });
      setServerList(newServerList);
    };
    const handleMessageUpdate = ({ email, message, id, _id }) => {
      const newServerList = [...serverList];
      const newMessage = { email, message, _id };
      for (let server in newServerList) {
        if (newServerList[server].name == id) {
          for (let message in newServerList[server].messages) {
            if (newServerList[server].messages[message]._id === _id) {
              newServerList[server].messages[message] = newMessage;
            }
          }
        }
      }
      setServerList(newServerList);
    };
    socket.on("message", handleMessage);

    socket.on("deletedMessage", handleMessageDelete);

    socket.on("updatedMessage", handleMessageUpdate);

    return () => {
      socket.off("message", handleMessage);
      socket.off("deletedMessage", handleMessageDelete);
      socket.off("updatedMessage", handleMessageUpdate);
    };
    //    socket.on("message", ({ email, message, id }) => {
    //      const newServerList = [...serverList];
    //      newServerList.map((server) => {
    //        if (server.name == id) {
    //          server.messages.push({ email, message });
    //        }
    //      });
    //      setServerList(newServerList);
    //      scrollRef.current.scrollIntoView({
    //        behavior: "smooth",
    //        block: "end",
    //        inline: "start",
    //      });
    //    });
    //    return () => {
    //      socket.off("message");
    //    };
  }, []);
  return (
    <div className={styles.chat}>
      <div className={styles.insideapp}>
        <div className={styles.server}>
          <ChatBar />
        </div>
        <div className={styles.leftside}>
          <div className={styles.channelList}>
            {serverList.map((server) => {
              return (
                id === server.name &&
                server.channels.map((channel) => {
                  return (
                    <div key={channel.id} className={styles.channel}>
                      <h3># {channel.name}</h3>
                    </div>
                  );
                })
              );
            })}
          </div>
          <div className={styles.logout}>
            <h5
              onClick={() => {
                handleLogOut();
              }}
            >
              Logout
            </h5>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.messagesView}>
            {serverList.map((server) => {
              return (
                id === server.name &&
                server.messages.map((message, index) => {
                  return (
                    <div ref={scrollRef} key={index} className={styles.message}>
                      <p>{message.email}</p>
                      <div className={styles.messageInfo}>
                        <p ref={messageRef}>{message.message}</p>
                        {message.email === loginInfo.email && (
                          <div>
                            <EditIcon
                              onClick={(e) => {
                                textBoxRef.current.focus();
                                setEditMode(true);
                                setEditMessageId({
                                  _id: message._id,
                                  email: message.email,
                                });
                              }}
                              className={styles.messageEdit}
                            />
                            <ClearIcon
                              onClick={(e) => {
                                textBoxRef.current.focus();
                                handleRemove(
                                  e,
                                  id,
                                  message.email,
                                  message.message,
                                  message._id
                                );
                              }}
                              className={styles.messageRemove}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              );
            })}
          </div>
          <input
            ref={textBoxRef}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyPress={(e) =>
              editMode
                ? e.key === "Enter" &&
                  handleEdit(e, editMessageId.email, editMessageId._id, id)
                : handleSendMessage(e)
            }
            className={styles.textBox}
            type="text"
          />
        </div>
        <div className={styles.rightside}></div>
      </div>
    </div>
  );
};

export default Chat;
