import { createContext, useContext, useEffect, useState } from "react";
import { fetchProfile } from "../api/auth";

const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

useEffect(() => {
    const loadUser = async () =>{
        try{
            const profileData = await fetchProfile()
            setUser(profileData)
        }catch(error){
            setError(error.message || 'failed to load user data')
        }finally{
            setLoading(false)
        }
    }
    loadUser()
},[])

return(
    <UserContext.Provider value={{user, loading, error}}>
        {children}
    </UserContext.Provider>
)
}

export const useUser = () => useContext(UserContext)