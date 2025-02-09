import { useEffect } from "react"
import { useAuthContext } from "./useAuthContext"
import { Socket } from "socket.io-client";
export const useOnSocketConnect = (socket: Socket) =>{
    const {session, dispatch} = useAuthContext();
    useEffect(()=>{
        socket.on("session", data =>{
          const userInfo = {'sessionID': data['sessionID'], 'username': data['username'], 'userID': data['userID']}
          
          localStorage.setItem("userInfo", JSON.stringify(userInfo))
          if(!session){
            dispatch({type:'STARTUP', payload:  userInfo})

          }
        })
        }
      , [socket])
}