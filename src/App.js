import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Header from './components/Header';
import MovieDetail from './components/MovieDetail';
import PublicFavourites from './components/PublicFavourites';
import GroupPage from './components/GroupPage';
import GroupDetails from './components/GroupDetails';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <div className='content'>
      <Routes>   
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/public-favourites/:userId" element={<PublicFavourites />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          </Route>
        {/* for non-existent paths, navigates back to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;