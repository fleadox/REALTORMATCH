export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'available' | 'pending' | 'sold';
  createdAt: string;
  updatedAt: string;
  images: string[];
  features: string[];
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
} 