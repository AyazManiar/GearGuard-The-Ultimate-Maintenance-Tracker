// API Service for GearGuard Backend

const API_BASE = '/api';

interface ApiResponse<T> {
  status: string;
  data: T;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      return result.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard
  getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Departments
  getDepartments() {
    return this.request('/departments');
  }

  getDepartmentById(id: string) {
    return this.request(`/departments/${id}`);
  }

  // Employees
  getEmployees() {
    return this.request('/employees');
  }

  getEmployeeById(id: string) {
    return this.request(`/employees/${id}`);
  }

  // Teams
  getTeams() {
    return this.request('/teams');
  }

  getTeamById(id: string) {
    return this.request(`/teams/${id}`);
  }

  createTeam(data: any) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateTeam(id: string, data: any) {
    return this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteTeam(id: string) {
    return this.request(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Equipment
  getEquipment(params?: { isActive?: boolean }) {
    const query = params?.isActive !== undefined ? `?isActive=${params.isActive}` : '';
    return this.request(`/equipment${query}`);
  }

  getEquipmentById(id: string) {
    return this.request(`/equipment/${id}`);
  }

  createEquipment(data: any) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateEquipment(id: string, data: any) {
    return this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteEquipment(id: string) {
    return this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance Requests
  getRequests(params?: { status?: string; equipmentId?: string; teamId?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.equipmentId) queryParams.append('equipmentId', params.equipmentId);
    if (params?.teamId) queryParams.append('teamId', params.teamId);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/requests${query}`);
  }

  getRequestById(id: string) {
    return this.request(`/requests/${id}`);
  }

  createRequest(data: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateRequest(id: string, data: any) {
    return this.request(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  updateRequestStatus(id: string, status: string, durationHours?: number) {
    return this.request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, durationHours }),
    });
  }

  deleteRequest(id: string) {
    return this.request(`/requests/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
