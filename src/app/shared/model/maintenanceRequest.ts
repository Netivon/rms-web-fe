export interface MaintenanceRequest{
    id: string;
    tenancy_id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    created_at: Date;
    resolved_at?: Date;
}