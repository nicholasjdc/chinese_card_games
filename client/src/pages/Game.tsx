import { useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useOnSocketConnect } from "../hooks/useOnSocketConnect"

function Game({socket}){
    const {session} = useAuthContext()
    const onPressMe = () =>{
        console.log(localStorage.getItem("userInfo"))
    }
    useOnSocketConnect(socket)
    useEffect(()=> {
        socket.on("messageResponse", data => {})
      }, [socket])
    return(
        <div className="love">
        {session && <p>{session['username']} </p>}
        <button>Press Me</button>
        <p></p>
        </div>
    )
}
export default Game