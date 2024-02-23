import { useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"

function Game({socket}){
    const {session} = useAuthContext()
    console.log(socket.id)
    useEffect(()=> {
        socket.on("messageResponse", data => {})
      }, [socket])
    return(
        <div className="love">
        <p>{socket.id}</p>
        <p>{session['username']}</p>
        <p></p>
        </div>
    )
}
export default Game