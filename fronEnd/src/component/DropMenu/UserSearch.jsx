import React, {useState} from "react";
import { useUser } from "../../context/userContext";
import { searchUsers } from "../../api/auth";
import { Box, InputBase, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const UserSearch =()=>{
    const {user} = useUser()
    const currentUserId = user?._id
    const [query, setQuery] = useState('')
    const [userResults, setUserResults] = useState([])
    const [isLoading, setLoading] = useState(false)

    const handleSearchChange = async(event) => {
        const searchTerm = event.target.value
        setQuery(searchTerm)

        if(searchTerm.trim() && currentUserId){
            try{
                setLoading(true)
                const response = await searchUsers(searchTerm)
                const users = Array.isArray(response.users) ? response.users : []
                const filtredUsers = users.filter((user) => user._id !== currentUserId)
                setUserResults(filtredUsers)
            }catch(error){
                console.error('Error searching users', error)
                setUserResults([])
            }finally{
                setLoading(false)
            }
        }else{
            setUserResults([])
        }
    }

    return (
        <Box>
            <InputBase
            placeholder="Search"
            value={query}
            onChange={handleSearchChange}
            sx={{
                width: '100%',
                padding:'5px',
                marginBottom:'20px',
                background:'#efefef',
                borderRadius:'4px'
            }} />
            {isLoading ? (
                <Typography sx={{textAlign: 'center', marginTop:'20px'}}>Loading...</Typography>
            ) : userResults.length > 0 ? (
                userResults.map((user) => (
                    <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    style={{textDecoration: 'none', display: 'block', color: 'inherit'}}>
                        <Typography sx={{padding: '8px 0', cursor:'pointer', '&:hover': {backgroundColor: '#fafafa'},}}>
                            {user.fullName}
                        </Typography>
                    </Link>
                ))
            ) : (
                <Typography sx={{color:'#aaa'}}>No users found</Typography>
            )}
        </Box>
    )
}