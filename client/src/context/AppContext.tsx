import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Department,
  Employee,
  MaintenanceTeam,
  Equipment,
  MaintenanceRequest,
  EquipmentWithRelations,
  MaintenanceRequestWithRelations,
  MaintenanceTeamWithRelations,
  DashboardStats,
  EquipmentFormData,
  MaintenanceRequestFormData,
  MaintenanceTeamFormData,
  RequestStatus
} from '@/types';
import { isOverdue } from '@/lib/utils';
import api from '@/lib/api';

interface AppContextType {
  // Data
  departments: Department[];
  employees: Employee[];
  teams: MaintenanceTeam[];
  equipment: Equipment[];
  requests: MaintenanceRequest[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Computed data with relations
  getEquipmentWithRelations: (id: string) => EquipmentWithRelations | undefined;
  getAllEquipmentWithRelations: () => EquipmentWithRelations[];
  getRequestWithRelations: (id: string) => MaintenanceRequestWithRelations | undefined;
  getAllRequestsWithRelations: () => MaintenanceRequestWithRelations[];
  getTeamWithRelations: (id: string) => MaintenanceTeamWithRelations | undefined;
  getAllTeamsWithRelations: () => MaintenanceTeamWithRelations[];
  getRequestsForEquipment: (equipmentId: string) => MaintenanceRequestWithRelations[];
  getOpenRequestCountForEquipment: (equipmentId: string) => number;
  
  // Dashboard stats
  getDashboardStats: () => Promise<DashboardStats>;
  
  // CRUD Operations
  addEquipment: (data: EquipmentFormData) => Promise<Equipment>;
  updateEquipment: (id: string, data: Partial<EquipmentFormData>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  
  addRequest: (data: MaintenanceRequestFormData) => Promise<MaintenanceRequest>;
  updateRequest: (id: string, data: Partial<MaintenanceRequest>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, durationHours?: number) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  
  addTeam: (data: MaintenanceTeamFormData) => Promise<MaintenanceTeam>;
  updateTeam: (id: string, data: Partial<MaintenanceTeamFormData>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  
  // Helpers
  getEmployeeById: (id: string) => Employee | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getTeamById: (id: string) => MaintenanceTeam | undefined;
  getEquipmentById: (id: string) => Equipment | undefined;
  
  // Reload data
  reloadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [depts, emps, tms, equips, reqs] = await Promise.all([
        api.getDepartments(),
        api.getEmployees(),
        api.getTeams(),
        api.getEquipment(),
        api.getRequests()
      ]);
      
      setDepartments(depts);
      setEmployees(emps);
      setTeams(tms);
      setEquipment(equips);
      setRequests(reqs);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const reloadData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Helper functions
  const getEmployeeById = useCallback((id: string) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  const getDepartmentById = useCallback((id: string) => {
    return departments.find(d => d.id === id);
  }, [departments]);

  const getTeamById = useCallback((id: string) => {
    return teams.find(t => t.id === id);
  }, [teams]);

  const getEquipmentById = useCallback((id: string) => {
    return equipment.find(e => e.id === id);
  }, [equipment]);

  // Equipment with relations
  const getEquipmentWithRelations = useCallback((id: string): EquipmentWithRelations | undefined => {
    const eq = equipment.find(e => e.id === id);
    if (!eq) return undefined;
    
    const openCount = requests.filter(r => r.equipmentId === id && r.status !== 'repaired' && r.status !== 'scrap').length;
    
    return {
      ...eq,
      department: getDepartmentById(eq.departmentId),
      assignedEmployee: eq.assignedEmployeeId ? getEmployeeById(eq.assignedEmployeeId) : undefined,
      maintenanceTeam: getTeamById(eq.maintenanceTeamId),
      defaultTechnician: eq.defaultTechnicianId ? getEmployeeById(eq.defaultTechnicianId) : undefined,
      openRequestCount: openCount
    };
  }, [equipment, requests, getDepartmentById, getEmployeeById, getTeamById]);

  const getAllEquipmentWithRelations = useCallback((): EquipmentWithRelations[] => {
    return equipment.map(eq => getEquipmentWithRelations(eq.id)!);
  }, [equipment, getEquipmentWithRelations]);

  // Request with relations
  const getRequestWithRelations = useCallback((id: string): MaintenanceRequestWithRelations | undefined => {
    const req = requests.find(r => r.id === id);
    if (!req) return undefined;
    
    const eq = getEquipmentById(req.equipmentId);
    const overdue = req.scheduledDate && req.status !== 'repaired' && req.status !== 'scrap' 
      ? isOverdue(req.scheduledDate) 
      : false;
    
    return {
      ...req,
      equipment: eq,
      maintenanceTeam: getTeamById(req.maintenanceTeamId),
      assignedTechnician: req.assignedTechnicianId ? getEmployeeById(req.assignedTechnicianId) : undefined,
      requestedBy: getEmployeeById(req.requestedById),
      isOverdue: overdue
    };
  }, [requests, getEquipmentById, getTeamById, getEmployeeById]);

  const getAllRequestsWithRelations = useCallback((): MaintenanceRequestWithRelations[] => {
    return requests.map(req => getRequestWithRelations(req.id)!);
  }, [requests, getRequestWithRelations]);

  const getRequestsForEquipment = useCallback((equipmentId: string): MaintenanceRequestWithRelations[] => {
    return requests
      .filter(r => r.equipmentId === equipmentId)
      .map(r => getRequestWithRelations(r.id)!);
  }, [requests, getRequestWithRelations]);

  const getOpenRequestCountForEquipment = useCallback((equipmentId: string): number => {
    return requests.filter(r => r.equipmentId === equipmentId && r.status !== 'repaired' && r.status !== 'scrap').length;
  }, [requests]);

  // Team with relations
  const getTeamWithRelations = useCallback((id: string): MaintenanceTeamWithRelations | undefined => {
    const team = teams.find(t => t.id === id);
    if (!team) return undefined;
    
    return {
      ...team,
      members: team.memberIds.map(mId => getEmployeeById(mId)).filter(Boolean) as Employee[],
      equipmentCount: equipment.filter(e => e.maintenanceTeamId === id).length,
      openRequestCount: requests.filter(r => r.maintenanceTeamId === id && r.status !== 'repaired' && r.status !== 'scrap').length
    };
  }, [teams, employees, equipment, requests, getEmployeeById]);

  const getAllTeamsWithRelations = useCallback((): MaintenanceTeamWithRelations[] => {
    return teams.map(t => getTeamWithRelations(t.id)!);
  }, [teams, getTeamWithRelations]);

  // Dashboard stats
  const getDashboardStats = useCallback(async (): Promise<DashboardStats> => {
    try {
      return await api.getDashboardStats();
    } catch (err) {
      console.error('Failed to get dashboard stats:', err);
      // Return default stats on error
      return {
        totalEquipment: equipment.length,
        activeEquipment: equipment.filter(e => e.isActive).length,
        totalRequests: requests.length,
        openRequests: requests.filter(r => r.status === 'new').length,
        inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
        completedRequests: requests.filter(r => r.status === 'repaired').length,
        overdueRequests: 0,
        totalTeams: teams.length,
        avgRepairTime: 0
      };
    }
  }, [equipment, requests, teams]);

  // CRUD: Equipment
  const addEquipment = useCallback(async (data: EquipmentFormData): Promise<Equipment> => {
    try {
      const newEquipment = await api.createEquipment(data);
      setEquipment(prev => [...prev, newEquipment]);
      return newEquipment;
    } catch (err) {
      console.error('Failed to add equipment:', err);
      throw err;
    }
  }, []);

  const updateEquipment = useCallback(async (id: string, data: Partial<EquipmentFormData>) => {
    try {
      const updated = await api.updateEquipment(id, data);
      setEquipment(prev => prev.map(eq => eq.id === id ? updated : eq));
    } catch (err) {
      console.error('Failed to update equipment:', err);
      throw err;
    }
  }, []);

  const deleteEquipment = useCallback(async (id: string) => {
    try {
      await api.deleteEquipment(id);
      setEquipment(prev => prev.filter(eq => eq.id !== id));
      setRequests(prev => prev.filter(r => r.equipmentId !== id));
    } catch (err) {
      console.error('Failed to delete equipment:', err);
      throw err;
    }
  }, []);

  // CRUD: Requests
  const addRequest = useCallback(async (data: MaintenanceRequestFormData): Promise<MaintenanceRequest> => {
    try {
      const newRequest = await api.createRequest(data);
      setRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      console.error('Failed to add request:', err);
      throw err;
    }
  }, []);

  const updateRequest = useCallback(async (id: string, data: Partial<MaintenanceRequest>) => {
    try {
      const updated = await api.updateRequest(id, data);
      setRequests(prev => prev.map(req => req.id === id ? updated : req));
    } catch (err) {
      console.error('Failed to update request:', err);
      throw err;
    }
  }, []);

  const updateRequestStatus = useCallback(async (id: string, status: RequestStatus, durationHours?: number) => {
    try {
      const updated = await api.updateRequestStatus(id, status, durationHours);
      setRequests(prev => prev.map(req => req.id === id ? updated : req));
      
      // If moving to scrap, reload equipment to reflect status changes
      if (status === 'scrap') {
        const equips = await api.getEquipment();
        setEquipment(equips);
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
      throw err;
    }
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    try {
      await api.deleteRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete request:', err);
      throw err;
    }
  }, []);

  // CRUD: Teams
  const addTeam = useCallback(async (data: MaintenanceTeamFormData): Promise<MaintenanceTeam> => {
    try {
      const newTeam = await api.createTeam(data);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      console.error('Failed to add team:', err);
      throw err;
    }
  }, []);

  const updateTeam = useCallback(async (id: string, data: Partial<MaintenanceTeamFormData>) => {
    try {
      const updated = await api.updateTeam(id, data);
      setTeams(prev => prev.map(team => team.id === id ? updated : team));
    } catch (err) {
      console.error('Failed to update team:', err);
      throw err;
    }
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    try {
      await api.deleteTeam(id);
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete team:', err);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    departments,
    employees,
    teams,
    equipment,
    requests,
    loading,
    error,
    getEquipmentWithRelations,
    getAllEquipmentWithRelations,
    getRequestWithRelations,
    getAllRequestsWithRelations,
    getTeamWithRelations,
    getAllTeamsWithRelations,
    getRequestsForEquipment,
    getOpenRequestCountForEquipment,
    getDashboardStats,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addRequest,
    updateRequest,
    updateRequestStatus,
    deleteRequest,
    addTeam,
    updateTeam,
    deleteTeam,
    getEmployeeById,
    getDepartmentById,
    getTeamById,
    getEquipmentById,
    reloadData
  }), [
    departments,
    employees,
    teams,
    equipment,
    requests,
    loading,
    error,
    getEquipmentWithRelations,
    getAllEquipmentWithRelations,
    getRequestWithRelations,
    getAllRequestsWithRelations,
    getTeamWithRelations,
    getAllTeamsWithRelations,
    getRequestsForEquipment,
    getOpenRequestCountForEquipment,
    getDashboardStats,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addRequest,
    updateRequest,
    updateRequestStatus,
    deleteRequest,
    addTeam,
    updateTeam,
    deleteTeam,
    getEmployeeById,
    getDepartmentById,
    getTeamById,
    getEquipmentById,
    reloadData
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
