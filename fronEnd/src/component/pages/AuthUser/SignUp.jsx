import React, { useState } from 'react';
import { Button, Typography, Box, Link } from "@mui/material";
import ichLogo from '../../../assets/ICHGRA.svg';
import { useNavigate } from 'react-router-dom';
import { InputField } from './CustomTextField';
import { register } from '../../../api/auth';

export const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
      e.preventDefault();
    
      try {
        const resultData = await register(fullName, username, email, password); 
        localStorage.setItem('token', resultData.data.token); 
        // console.log('Registration successfuly', resultData);
        navigate('/home'); 
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" >
            <Box maxWidth="sm" style={{ maxWidth: '350px', width: '100%', marginTop:'50px'}}>
                <Box style={{ padding: '5px', border: '1px solid #DBDBDB', borderRadius: '3px' }}>
                    <Box display="flex" justifyContent="center" style={{ padding: '5px' }}>
                        <img alt="ICHGRAM LOGO IMAGE" src={ichLogo} />
                    </Box>
                    <Typography variant='h6' align="center" mt={-3}style={{ color: '#737373', padding: '5px' }}>
                        Sign up to see photos and videos from your friends.
                    </Typography>

                    <form onSubmit={handleSignUp} style={{ padding: '15px' }}>
                        <InputField
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <InputField
                            label="Username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputField
                            label="Password"
                            placeholder="Create a password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <Typography color="error" align="center">{error}</Typography>}

                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, fontSize: '12px' }}>
                            People who use our service may have uploaded your contact information to Instagram. 
                            <Link sx={{ fontSize: '12px' }}>Learn More</Link>
                        </Typography>

                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, fontSize: '12px' }}>
                            By signing up, you agree to our 
                            <Link sx={{ mx: 0.5, fontSize: '12px' }}>Terms</Link>, 
                            <Link sx={{ mx: 0.5, fontSize: '12px' }}>Privacy</Link>.
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center" sx={{ fontSize: '12px' }}>
                            <Link sx={{ mx: 0.5, fontSize: '12px' }}>Policy</Link> and
                            <Link sx={{ mx: 0.5, fontSize: '12px' }}>Cookies Policy</Link>.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit"
                            style={{ marginTop: '20px', borderRadius: '8px' }}
                        >
                            Sign Up
                        </Button>
                    </form>
                </Box>

                <Box maxWidth="sm" mt={1} align="center" style={{ padding: 15, border: '1px solid #DBDBDB', borderRadius: '3px', marginTop: '15px' }}>
                    <Typography variant="body2" color="textSecondary">
                        Have an account? 
                        <Link underline="hover" component="button" onClick={() => navigate('/login')} style={{ color: '#0095F6', marginLeft: '5px' }}>
                            Log In
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};