import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import PasswordChecklist from 'react-password-checklist';

import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
    const [passwordAgain, setPasswordAgain] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      alert('Password does not meet the criteria');
      return;
    }
    try {
      await register(formData);
      console.log('User registered:', (formData));
      alert('Registration successful!')
        navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordAgain}
        onChange={(e) => setPasswordAgain(e.target.value)}
      />
        <button className="register-button">Register</button>
      <PasswordChecklist
        rules={["minLength", "number", "capital", "match"]}
        minLength={8}
        value={formData.password}
        valueAgain={passwordAgain}
        onChange={(isValid) => setIsValid(isValid)}
     />
    </form>
    </div>
  );
};

export default Register;