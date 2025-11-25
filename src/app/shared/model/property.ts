export interface Property {
  id: string;
  title: string;
  address: string;
  default_rent_amount: number;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  landlordId: string;
  imageUrl: string;
}