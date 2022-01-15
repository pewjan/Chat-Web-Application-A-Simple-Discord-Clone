import React, { useState, useContext } from "react";
import styles from "./ChatBar.module.css";
import { Link, useParams } from "react-router-dom";
import { ServerContext } from "../context/ServerContext";

const ChatBar = () => {
  const { serverList, setServerList } = useContext(ServerContext);
  const [showServer, setShowServer] = useState(null);
  const { id } = useParams();

  const handleMouseEnter = (id) => {
    setShowServer(id);
  };
  const handleMouseLeave = (id) => {
    setShowServer(null);
  };
  return (
    <div className={styles.ChatBar}>
      {serverList.map((server) => {
        return (
          <div className={styles.serverIcon} id={server.id} key={server.id}>
            <Link to={`/app/${server.name}`}>
              <div className="line"></div>
              <img
                className={
                  server.name == id
                    ? styles.serverIconImageClicked
                    : styles.serverIconImage
                }
                onMouseEnter={() => handleMouseEnter(server.id)}
                onMouseLeave={() => handleMouseLeave(server.id)}
                src={server.image}
                alt=""
              />
            </Link>

            {server.id === showServer && (
              <div className={styles.serverIconNameBackground}>
                <p className={styles.serverIconName}>{server.name}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBar;
