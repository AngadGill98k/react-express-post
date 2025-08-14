import React, { useEffect, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { jwtToken } from '../../redux/slices/token';


const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    username: '',
    mail: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  let dispatch = useDispatch();
  
  let navigate=useNavigate()
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };


  
  const handleSubmit = () => {
    
    const url = isSignup ? 'http://localhost:3001/signup' : 'http://localhost:3001/signin';
    const { username, mail, password } = form;

    if (!username.trim() || !mail.trim() || !password.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(mail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
   
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name:username, mail, pass:password })

    })
      .then(res => res.json())
      .then(data => {
       
        if (data.message === 'Login successful') {
          console.log(data.token);
          dispatch(jwtToken(data.token))
          navigate('/home');  
        } 
        if(data.message==="Signup successful"){
          console.log(data.message);
        }else{
          setErrorMsg(data.message);
        }

      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Wrong Credentials');
      });
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          required
          onChange={handleChange}
        />

        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={form.mail}
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {isSignup ? 'Create Account' : 'Log In'}
        </button>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => {
            setIsSignup(!isSignup);
            setErrorMsg('');
          }}>
            {isSignup ? ' Sign In' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;