import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setShowModal(false);
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <header>
      <nav>
        <button className="nav-button" onClick={handleHomeClick}>Home</button>
        {!isLoggedIn && <button className="nav-button" onClick={handleRegisterClick}>Register</button>}
        {!isLoggedIn && <button className="nav-button" onClick={() => setShowModal(true)}>Login</button>}
        {isLoggedIn && <button className="nav-button" onClick={handleLogout}>Logout</button>}
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
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
            <button type="submit">Login</button>
          </form>
        </Modal>
        {isLoggedIn && (
          <div className="dropdown">
            <button className="dropbtn">Account</button>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link>
              <Link to="/groups">Groups</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}