import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { isGroupMember, isGroupOwner } from '../models/groupModel.js';
import pool from '../db.js';
const router = express.Router();

  // delete group endpoint
router.delete('/:groupId', authenticateToken, isGroupOwner, async (req, res) => {
    const { groupId } = req.params;
    try {
      await pool.query('DELETE FROM Groups WHERE id = $1', [groupId]);
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({ error: 'Failed to delete group' });
    }
  });

// get group details and members
router.get('/:groupId', authenticateToken, isGroupMember, async (req, res) => {
    const { groupId } = req.params;
    try {
      const groupResult = await pool.query('SELECT * FROM Groups WHERE id = $1', [groupId]);
      const membersResult = await pool.query(
        'SELECT Users.id, Users.email FROM Groups_Users JOIN Users ON Groups_Users.user_id = Users.id WHERE Groups_Users.group_id = $1 AND Groups_Users.status = $2',
        [groupId, 'approved']
      );
  
      res.json({ group: groupResult.rows[0], members: membersResult.rows, isMember: req.isMember });
    } catch (error) {
      console.error('Error fetching group details:', error);
      res.status(500).json({ error: 'Failed to fetch group details' });
    }
  });

// get all groups
router.get('/', authenticateToken, async (req, res) => {
    try {
      const groupsResult = await pool.query('SELECT * FROM Groups');
      const groups = groupsResult.rows;
  
      // Fetch members for each group
      for (const group of groups) {
        const membersResult = await pool.query(
          'SELECT Users.id, Users.email FROM Groups_Users JOIN Users ON Groups_Users.user_id = Users.id WHERE Groups_Users.group_id = $1 AND Groups_Users.status = $2',
          [group.id, 'approved']
        );
        group.members = membersResult.rows;
      }
  
      res.json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Failed to fetch groups' });
    }
  });


// get join requests for a group
router.get('/:groupId/requests', authenticateToken, isGroupMember, async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      'SELECT Users.id, Users.email FROM Groups_Users JOIN Users ON Groups_Users.user_id = Users.id WHERE Groups_Users.group_id = $1 AND Groups_Users.status = $2',
      [groupId, 'pending']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ error: 'Failed to fetch join requests' });
  }
});


// create a new group
router.post('/', async (req, res) => {
    const { name, ownerId } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO Groups (name, owner_id) VALUES ($1, $2) RETURNING *',
        [name, ownerId]
      );
      await pool.query(
        'INSERT INTO Groups_Users (group_id, user_id, is_owner, status) VALUES ($1, $2, $3, $4)',
        [result.rows[0].id, ownerId, true, 'approved']
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create group' });
    }
  });

// request to join group
router.post('/:groupId/join', authenticateToken, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    try {
      const result = await pool.query(
        'INSERT INTO Groups_Users (group_id, user_id, status) VALUES ($1, $2, $3) RETURNING status',
        [groupId, userId, 'pending']
      );
      res.status(201).json({ message: 'Join request sent', status: result.rows[0].status });
    } catch (error) {
      console.error('Error sending join request:', error);
      res.status(500).json({ error: 'Failed to send join request' });
    }
  });

// get user group status
  router.get('/:groupId/status', authenticateToken, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    try {
      const result = await pool.query(
        'SELECT status FROM Groups_Users WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 'none' });
      }
      res.json({ status: result.rows[0].status });
    } catch (error) {
      console.error('Error fetching group status:', error);
      res.status(500).json({ error: 'Failed to fetch group status' });
    }
  });

// approve join request
router.post('/:groupId/approve', authenticateToken, isGroupOwner, async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    try {
      await pool.query(
        'UPDATE Groups_Users SET status = $1 WHERE group_id = $2 AND user_id = $3',
        ['approved', groupId, userId]
      );
      res.status(200).json({ message: 'User approved' });
    } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ error: 'Failed to approve user' });
    }
  });
  
// decline join request
router.post('/:groupId/decline', authenticateToken, isGroupOwner, async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    try {
      await pool.query(
        'DELETE FROM Groups_Users WHERE group_id = $1 AND user_id = $2 AND status = $3',
        [groupId, userId, 'pending']
      );
      res.status(200).json({ message: 'User declined' });
    } catch (error) {
      console.error('Error declining user:', error);
      res.status(500).json({ error: 'Failed to decline user' });
    }
  });

// remove a user from the group
router.delete('/:groupId/remove', authenticateToken, isGroupOwner, async (req, res) => {
    const { userId } = req.body;
    const { groupId } = req.params;
    try {
      await pool.query(
        'DELETE FROM Groups_Users WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      res.status(200).json({ message: 'User removed from the group' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove user from the group' });
    }
  });

// leave from a group
router.post('/:groupId/leave', authenticateToken, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    try {
      await pool.query(
        'DELETE FROM Groups_Users WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      res.status(200).json({ message: 'User left the group' });
    } catch (error) {
      console.error('Error leaving group:', error);
      res.status(500).json({ error: 'Failed to leave the group' });
    }
  });


export default router;