import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GroupPage.css';

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [user, setUser] = useState(null);
  const [requestStatus, setRequestStatus] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchUser();
    fetchGroups();
  }, [token]);

  useEffect(() => {
    const fetchRequestStatus = async (groupId) => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/groups/${groupId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequestStatus(prevStatus => ({ ...prevStatus, [groupId]: data.status }));
      } catch (error) {
        console.error('Error fetching request status:', error);
      }
    };

    if (user && groups.length > 0) {
      groups.forEach(group => {
        fetchRequestStatus(group.id);
      });
    }
  }, [user, groups, token]);

  const handleCreateGroup = async () => {
    if (!user) return;
    try {
      const { data } = await axios.post('http://localhost:3001/api/groups', { name: newGroupName, ownerId: user.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups([...groups, data]);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleRequestToJoin = async (groupId) => {
    if (!user) return;
    try {
      const { data } = await axios.post(`http://localhost:3001/api/groups/${groupId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequestStatus({ ...requestStatus, [groupId]: data.status });
      alert('Request sent!');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleSelectGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };


  return (
    <div className="container">
      <div className="headerContainer">
        <h1>Groups</h1>
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Create group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={handleCreateGroup}>Create Group</button>
        </div>
      </div>
      <div className="groupList">
        {groups.map(group => (
          <div key={group.id} className="card">
            <h2>{group.name}</h2>
            {group.owner_id !== user?.id && !group.members?.some(member => member.id === user?.id) && (
              requestStatus[group.id] === 'pending' ? (
                <button disabled>Pending Request</button>
              ) : (
                <button onClick={() => handleRequestToJoin(group.id)}>Request to Join</button>
              )
            )}
            <button onClick={() => handleSelectGroup(group.id)}>View Group</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPage;