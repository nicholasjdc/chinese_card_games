import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import socketIO from "socket.io-client";
import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
const socket = socketIO("http://localhost:4000", {
  auth: { sessionID: localStorage.getItem("sessionID") },
});

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/game/:id" element={<Game socket={socket} />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
