import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = ({ socket }) => {
    const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [gameID, setGameID] = useState("")
  const {session, dispatch} = useAuthContext();
  console.log(socket)

  useEffect(()=>{

  }, [])
  useEffect(()=>{
    socket.on("session", data =>{
      localStorage.setItem('sessionID', data['sessionID'])
      localStorage.setItem('username', data['username'])
      localStorage.setItem('userID', data['userID'])
    })
    }
  , [socket])
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userName);
    dispatch({type:'CHANGE_NAME', payload: {'username': localStorage.getItem('username'), 'userID': localStorage.getItem('userID'), 'sessionID':localStorage.getItem('')}})

    localStorage.setItem("username", userName);
  
    //socket.emit("newUser", { , {socketID: socket.id} });
    navigate("/game/" + gameID)
  };
  return (
    <div id="homePage">
      <form className="home__container" onSubmit={handleSubmit}>
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
      <button className="host_butt">CREATE NEW GAME</button>
    </div>
  );
};
export default Home;
