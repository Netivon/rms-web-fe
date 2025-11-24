export interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  status: 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';
  landlordId: string;
  imageUrl: string;
}