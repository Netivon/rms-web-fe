export interface Tenancy{
    id: string;
    tenant_id: string;
    property_id: string;
    lease_start: Date;
    lease_end: Date;
    rent_amount: number;
    previous_rent_amount?: number; // Added for rent increase detection
    status: 'ACTIVE' | 'ENDED' | 'UPCOMING'; // Added status
}