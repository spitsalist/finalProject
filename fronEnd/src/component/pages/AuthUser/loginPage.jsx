import React, { useState } from 'react';
import {  Button, Typography, Box, Link, Alert } from "@mui/material";
import ichLogo from '../../../assets/ICHGRA.svg';
import bg from "../../../assets/Background.svg";
import { login } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';
import { SectionDivider } from './SectionDivider';
import { InputField } from './CustomTextField';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    setError('')
    try {
      const resultData = await login(email, password);
      const { token } = resultData.data;
      // console.log('Login successfully', resultData.data);
      setSuccessMessage("Login successfully");
          localStorage.setItem('token', token);

      // setTimeout(() => {
         navigate('/home');
      // }, 1000)
     
    } catch (error) {
      setError('Invalid email or password', error);
    }
  };

  return (
    <Box sx={{mt: 8}} display="flex" justifyContent="center" alignItems="center" padding="20px">
      <Box display="flex" justifyContent="center" alignItems="center" width="50%" marginRight="20px">
        <img src={bg} alt="Mobile preview" style={{ maxHeight: '80%', width: 'auto' }} />
      </Box>

      <Box maxWidth="sm" style={{ maxWidth:'350px', with: '100%', marginBottom: '90px', position:'relative'}}>
        <Box style={{ padding: '5px', border: '1px solid #DBDBDB', borderRadius: '3px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
          <img alt="ICHGRAM LOGO IMAGE" src={ichLogo} />

          <form onSubmit={handleLogin} style={{ padding: '15px' }}>
            {successMessage && <Alert severity='success' sx={{marginBottom: 2}}>{successMessage}</Alert>}
            {error && <Alert severity='error' sx={{marginBottom: 2}}>{error}</Alert>}
            
            <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: '20px', borderRadius: '8px' }}
            >
              {isSubmitting ? 'Loading...' : 'Log In'}
            </Button>

            {error && <p>{error}</p>}

            <SectionDivider/>

            <Typography align="center" style={{ marginTop: '30px' }}>
              <Link underline="hover" onClick={() => navigate('/reset-password')}>Forgot password?</Link>
            </Typography>
          </form>
        </Box>

        <Box maxWidth="sm" mt={1} align="center" style={{ padding: 15, border: '1px solid #DBDBDB', borderRadius: '3px' }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?
            <Link underline="hover" component="button"
            onClick={() => navigate('/register')}
               style={{ color: '#0095F6', marginLeft: '5px' }}>Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;