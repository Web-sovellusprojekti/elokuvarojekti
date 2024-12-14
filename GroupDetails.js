import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const isOwner = group?.owner_id === user?.id;

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

    const fetchGroupDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroup(data.group);
        setMembers(data.members);
        setIsMember(data.isMember);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setError('Failed to fetch group details. Try again later.');
      }
    };

    const fetchJoinRequests = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/groups/${groupId}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(data);
      } catch (error) {
        console.error('Error fetching join requests:', error);
        setError('Failed to fetch join requests. Try again later.');
      }
    };

    fetchUser();
    fetchGroupDetails();
    fetchJoinRequests();
  }, [groupId, token]);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`http://localhost:3001/api/groups/${groupId}/approve`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(requests.filter(request => request.id !== userId));
      setMembers([...members, requests.find(request => request.id === userId)]);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDecline = async (userId) => {
    try {
      await axios.post(`http://localhost:3001/api/groups/${groupId}/decline`, { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(requests.filter(request => request.id !== userId));
    } catch (error) {
      console.error('Error declining user:', error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Group deleted successfully');
      navigate('/groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(`http://localhost:3001/api/groups/${groupId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('You have left the group');
      navigate('/groups');
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });
      setMembers(members.filter(member => member.id !== userId));
      alert('User removed from the group successfully!');
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  if (error) return <div>{error}</div>;
  if (!group) return <div>Loading...</div>;
  if (!isMember) return <div>You do not have access to this group.</div>;

  return (
    <div>
      <h1>{group.name}</h1>
      <h2>Members</h2>
      <ul>
        {members.map(member => (
          <li key={member.id}>{member.email}
        {isOwner && member.id !== group.owner_id && (
        <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
        )}
        </li>
    ))}
    </ul>
      {isOwner && (
        <>
          <h2>Join Requests</h2>
          <ul>
            {requests.map(request => (
              <li key={request.id}>
                {request.email}
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button onClick={() => handleDecline(request.id)}>Decline</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {isOwner ? (
        <button onClick={handleDeleteGroup}>Delete Group</button>
      ) : (
        <button onClick={handleLeaveGroup}>Leave Group</button>
      )}
    </div>
  );
};

export default GroupDetails;