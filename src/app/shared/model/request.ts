export interface Request {
  id: string;
  propertyId: string;
  tenantId: string;
  issue: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  date: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}