import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = ()=>{
    const context = useContext(AuthContext)
    if(!context) {
        throw Error('OUT OF BOUNDS-- useAuthContext must be used within AuthContextProvides')
    }
    return context
}