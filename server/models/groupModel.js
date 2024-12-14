import pool from '../db.js';

export const isGroupMember = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        'SELECT * FROM Groups_Users WHERE group_id = $1 AND user_id = $2 AND status = $3',
        [groupId, userId, 'approved']
      );
      req.isMember = result.rows.length > 0;
      next();
    } catch (error) {
      console.error('Error verifying group membership:', error);
      res.status(500).json({ error: 'Failed to verify group membership' });
    }
  };

export const isGroupOwner = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
  
    try {
      const result = await pool.query(
        'SELECT * FROM Groups WHERE id = $1 AND owner_id = $2',
        [groupId, userId]
      );
      if (result.rows.length === 0) {
        console.log('User is not the owner of the group');
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (error) {
      console.error('Error verifying group ownership:', error);
      res.status(500).json({ error: 'Failed to verify group ownership' });
    }
  };
