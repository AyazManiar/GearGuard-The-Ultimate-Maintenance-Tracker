import { Request, Response } from 'express';
import { query, execute, transaction } from '../database/db';
import db from '../database/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { MaintenanceTeamWithMembers } from '../types';

// Helper function to get team with members
async function getTeamWithMembers(teamId: string): Promise<MaintenanceTeamWithMembers | null> {
  const teamResult = await query('SELECT * FROM maintenance_teams WHERE id = ?', [teamId]);
  
  if (teamResult.rows.length === 0) {
    return null;
  }
  
  const team = teamResult.rows[0];
  
  // Get team members
  const membersResult = await query(`
    SELECT e.*
    FROM employees e
    INNER JOIN team_members tm ON e.id = tm.employee_id
    WHERE tm.team_id = ?
    ORDER BY e.name
  `, [teamId]);
  
  // Get equipment count
  const equipmentCount = await query(
    'SELECT COUNT(*) as count FROM equipment WHERE maintenance_team_id = ?',
    [teamId]
  );
  
  // Get open request count
  const openRequestCount = await query(
    `SELECT COUNT(*) as count FROM maintenance_requests 
     WHERE maintenance_team_id = ? AND status NOT IN ('repaired', 'scrap')`,
    [teamId]
  );
  
  return {
    ...team,
    members: membersResult.rows,
    memberIds: membersResult.rows.map((m: any) => m.id),
    equipmentCount: parseInt(equipmentCount.rows[0].count),
    openRequestCount: parseInt(openRequestCount.rows[0].count)
  };
}

export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  const teamsResult = await query('SELECT * FROM maintenance_teams ORDER BY name');
  
  const teamsWithMembers = await Promise.all(
    teamsResult.rows.map(async (team) => {
      return await getTeamWithMembers(team.id);
    })
  );
  
  res.status(200).json({
    status: 'success',
    data: teamsWithMembers
  });
});

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const team = await getTeamWithMembers(id);
  
  if (!team) {
    throw new AppError('Team not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: team
  });
});

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, memberIds } = req.body;
  
  if (!name || !memberIds || !Array.isArray(memberIds)) {
    throw new AppError('Name and memberIds array are required', 400);
  }
  
  const id = `team-${Date.now()}`;
  
  transaction(() => {
    // Insert team
    execute(
      'INSERT INTO maintenance_teams (id, name, description) VALUES (?, ?, ?)',
      [id, name, description || null]
    );
    
    // Insert team members
    if (memberIds.length > 0) {
      const insertMember = db.prepare('INSERT INTO team_members (team_id, employee_id) VALUES (?, ?)');
      memberIds.forEach((memberId: string) => {
        insertMember.run(id, memberId);
      });
    }
  });
  
  const newTeam = getTeamWithMembers(id);
  
  res.status(201).json({
    status: 'success',
    data: newTeam
  });
});

export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, memberIds } = req.body;
  
  transaction(() => {
    // Update team basic info
    if (name || description !== undefined) {
      const updates: string[] = [];
      const values: any[] = [];
      
      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      
      values.push(id);
      
      execute(
        `UPDATE maintenance_teams SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    // Update members if provided
    if (memberIds && Array.isArray(memberIds)) {
      // Delete existing members
      execute('DELETE FROM team_members WHERE team_id = ?', [id]);
      
      // Insert new members
      if (memberIds.length > 0) {
        const insertMember = db.prepare('INSERT INTO team_members (team_id, employee_id) VALUES (?, ?)');
        memberIds.forEach((memberId: string) => {
          insertMember.run(id, memberId);
        });
      }
    }
  });
  
  const updatedTeam = getTeamWithMembers(id);
  
  if (!updatedTeam) {
    throw new AppError('Team not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: updatedTeam
  });
});

export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM maintenance_teams WHERE id = ? RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Team not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Team deleted successfully'
  });
});
