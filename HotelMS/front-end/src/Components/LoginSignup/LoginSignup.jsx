import './LoginSignup.css'
import React, { useState } from 'react';  
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import user_icon from '../../Assets/user.png'
import email_icon from '../../Assets/emaill.png'
import password_icon from '../../Assets/password.png'



const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
 

    const toggleAction = () => {
        setAction(action === "Sign Up" ? "Log In" : "Sign Up")
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  

        if (action === "Sign Up") {
            
            try {
                const response = await axios.post('https://localhost:7117/api/Auth/register', {
                    firstName,
                    lastName,
                    email,
                    password,
                    roleID: 1,
                  
                });
                console.log('User registered:', response.data);
               
            } catch (error) {
                console.error('Sign up error:', error.response ? error.response.data : error.message);
            }
        } else {
         
            try {
                const response = await axios.post('https://localhost:7117/api/Auth/login', {
                    email,
                    password
                });
                console.log('Login successful:', response.data);
               
            } catch (error) {
                console.error('Login error:', error.response ? error.response.data : error.message);
            }
        }
    };
       

  return (
    <div className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style={{maxWidth: '500px'}}> 
    <div className="text-center mb-4">
        <h2 className="fw-bold">{action}</h2>
        <div className="bg-warning rounded-pill mx-auto" style={{width: '60px', height:'6px'}}></div>
    </div>
    <form onSubmit={handleSubmit} className="w-100">
        {action === "Sign Up" && ( 
            <>
        <div className="mb-3 d-flex align-items-center">
            <img src={user_icon} alt="user" width="30" className='me-3' />
            <input type="text" className='form-control' placeholder='FirstName' value={firstName}
                onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div className="mb-3 d-flex align-items-center">
            <img src={user_icon} alt="user" width="30" className='me-3' />
            <input type="text" className="form-control" placeholder='LastName'value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
        </div>
        </>
        )}
        <div className="mb-3 d-flex align-items-center">
            <img src={email_icon} alt="email" width="30" className='me-3' />
            <input type="email" className='form-control' placeholder='Email' value={email}
                onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="mb-3 d-flex align-items-center">
            <img src={password_icon} alt="password" width="30" className='me-3' />
            <input type="password" className='form-control' placeholder='Password' value={password}
                onChange={(e) => setPassword(e.target.value)}/>
      
    </div>
    <div className="text-end mb-4">
    <small className='text-muted'>
        Forgot Password? <span className='text-primary' role='button'>Click Here</span>
    </small>
    </div>
    <div className="d-flex justify-content-between gap-2">
        <button type='submit' className='btn btn-dark w-50'>{action}</button>
        <button type='button' className='btn btn-outline-secondary w-50' onClick={toggleAction}>
            {action === "Sign Up"? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
    </div>
    </form>
    </div>
  );
};

export default LoginSignup;




