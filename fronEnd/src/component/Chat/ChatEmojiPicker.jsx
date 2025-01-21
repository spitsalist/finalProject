import { Box } from "@mui/system"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"

export const ChatEmojiPicker = ({setNewMessage, setNewComment}) =>{
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef(null)

const handleEmojiSelect = (emojiObject) =>{
    setNewMessage((prev) => prev + (emojiObject?.emoji || ''))
}

const handleClickOutside = (event) => {
    if(pickerRef.current && !pickerRef.current.contains(event.target)){
        setShowPicker(false)
    }
}

useEffect(() =>{
    document.addEventListener('mousedown', handleClickOutside)
    return()=>{
        document.addEventListener('mousedown', handleClickOutside)
    }
},[])

return(
    <Box sx={{position: 'relative'}}>
        <button
        onClick={() => setShowPicker(true)}
        style={{
            background:'none',
            border:'none',
            cursor:'pointer',
            position:'absolute',
            right:'10px',
            top:'50%',
            transform:'translateY(-50%)',
            fontSize:'20px'
            }}
            >
                😀
        </button>
        {showPicker && (
            <Box
            ref={pickerRef}
            sx={{
                position:'absolute',
                right:'10px',
                top:'-450px',
                zIndex:100,
                boxShadow:'0 4px 8px rgba(0,0,0,0.2)',
                borderRadius:'8px',
                backgroundColor:'#fff',
                padding:'8px',
                width:'300px',
                display:'flex',
                flexWrap:'wrap',
                gap:'8px'
            }}>
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </Box>
        )}
    </Box>
)
}