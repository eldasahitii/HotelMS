//import React from 'react'
import './LoginSignup.css'
import React, { useState } from 'react';  
import 'bootstrap/dist/css/bootstrap.min.css';

import user_icon from '../../Assets/user.png'
import email_icon from '../../Assets/emaill.png'
import password_icon from '../../Assets/password.png'



const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up")

    const toggleAction = () => {
        setAction(action === "Sign Up" ? "Log In" : "Sign Up")
    }

  return (
    <div className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style={{maxWidth: '500px'}}> 
    <div className="text-center mb-4">
        <h2 className="fw-bold">{action}</h2>
        <div className="bg-warning rounded-pill mx-auto" style={{width: '60px', height:'6px'}}></div>
    </div>
    <div className="w-100">
        {action === "Sign Up" && ( 
            <>
        <div className="mb-3 d-flex align-items-center">
            <img src={user_icon} alt="user" width="30" className='me-3' />
            <input type="text" className='form-control' placeholder='FirstName' />
        </div>
        <div className="mb-3 d-flex align-items-center">
            <img src={user_icon} alt="user" width="30" className='me-3' />
            <input type="text" className="form-control" placeholder='LastName' />
        </div>
        </>
        )}
        <div className="mb-3 d-flex align-items-center">
            <img src={email_icon} alt="email" width="30" className='me-3' />
            <input type="email" className='form-control' placeholder='Email' />
        </div>
        <div className="mb-3 d-flex align-items-center">
            <img src={password_icon} alt="password" width="30" className='me-3' />
            <input type="password" className='form-control' placeholder='Password' />
        </div>
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

    </div>
  )
}

export default LoginSignup





