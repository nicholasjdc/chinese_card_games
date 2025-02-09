import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import { useOnSocketConnect } from "../hooks/useOnSocketConnect";
import { Socket } from "socket.io-client";

const Home = ({ socket }) => {
    const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [gameID, setGameID] = useState("")
  const {session, dispatch} = useAuthContext();

  useOnSocketConnect(socket)
  const onCreateGame = (e) => {
    e.preventDefault();
    /*
    localStorage.setItem("userInfo", JSON.stringify({'username': userName, 'userID': session['userID'], 'sessionID':session['sessionID']}))

    dispatch({type:'UPDATE', payload: {'userInfo': {'username': userName, 'userID': session['userID'], 'sessionID':session['sessionID']}}})
*/
  
    socket.emit("sessionUpdate", session );
    socket.emit("gameroomCreate", {}, function(gameroomID){
      socket.emit("gameroomJoin", {'id': gameroomID}, function(gameID){
        navigate("/game/" + gameID)
      })

    })
  };
  return (
    <div id="homePage">
      {session && <p>{session['username']}</p>}
      <form className="home__container">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          minLength={6}
          name="username"
          id="username"
          className="username__input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <p></p>
        <label htmlFor="gameid">Game ID</label>
        <input
          type="text"
          minLength={6}
          name="gameid"
          id="gameid"
          className="gameid__input"
          value={gameID}
          onChange={(e) => setGameID(e.target.value)}
        />
        <p></p>
        <button className="home__cta">JOIN GAME</button>
      </form>
      <p></p>
      <button className="host_butt" onClick={onCreateGame}>CREATE NEW GAME</button>
    </div>
  );
};
export default Home;