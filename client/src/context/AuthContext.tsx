import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext(null);

export const authReducer = (state, action) => {
  switch (action.type) {
    case "STARTUP":
      
      return { session: action.payload };

    case "LOGOUT":
      return { session: null };
    
    case 'CHANGE NAME':
      return { session: action.payload}

    default:
        return state

  }
};
export const AuthContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(authReducer, {
        session: null
    })


    useEffect(()=>{
      //check local storage for user
      const tempSession = {'username': localStorage.getItem('username'), 'userID': localStorage.getItem('userID'), 'sessionID':localStorage.getItem('sessionID')}
      console.log(tempSession)
      const session = JSON.parse(JSON.stringify(tempSession))

      if (session) {
        dispatch({type: 'STARTUP', payload: session})
      }
    }, [])
    console.log('AuthContext state: ', state)

    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

