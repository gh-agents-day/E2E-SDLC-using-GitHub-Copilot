/**
 * API Response Envelope
 * All API responses follow this consistent structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  } | null;
  meta: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  uptime?: number;
}

/**
 * User Entity (from TSD 4.2)
 */
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'Developer' | 'QAEngineer' | 'TeamLead' | 'ProjectManager';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task Entity (from TSD 4.2)
 */
export interface Task {
  id: number;
  taskIdCode: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'ToDo' | 'InProgress' | 'Blocked' | 'Completed';
  assignedUserId: number;
  estimatedCompletionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: number;
  updatedByUserId?: number;
  version: number;
}

/**
 * Task Dependency (from TSD 4.2)
 */
export interface TaskDependency {
  id: number;
  taskId: number;
  dependsOnTaskId: number;
  createdAt: Date;
  createdByUserId: number;
}

/**
 * Status History Entry (from TSD 4.2)
 */
export interface StatusHistory {
  id: number;
  taskId: number;
  oldStatus?: 'ToDo' | 'InProgress' | 'Blocked' | 'Completed';
  newStatus: 'ToDo' | 'InProgress' | 'Blocked' | 'Completed';
  changedAt: Date;
  changedByUserId: number;
  comment?: string;
}
