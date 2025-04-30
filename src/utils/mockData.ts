import { PropertyLink } from './types';

// Mock data for development purposes

export interface User {
  id: string;
  email: string;
  accountStatus: 'pending' | 'active' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  isAdmin?: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  photoUrl: string;
  phoneNumber: string;
  agencyAffiliation: string;
  experienceLevel: '0-1' | '1-3' | '3-5' | '5-10' | '10+';
  regionsServed: string[];
  languages: string[];
  bio: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  featuredStatus: boolean;
  verificationStatus: boolean;
}

export interface PropertyLink {
  id: string;
  profileId: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: number;
  externalUrl: string;
  imageUrl: string;
  creationDate: string;
  numRooms?: number;
  space?: number;
  floor?: number;
}

// Georgian regions
export const georgianRegions = [
  'Tbilisi',
  'Adjara',
  'Imereti',
  'Kakheti',
  'Samegrelo-Zemo Svaneti',
  'Kvemo Kartli',
  'Shida Kartli',
  'Samtskhe-Javakheti',
  'Guria',
  'Mtskheta-Mtianeti',
  'Racha-Lechkhumi and Kvemo Svaneti'
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'sarah.johnson@example.com',
    accountStatus: 'active',
    registrationDate: '2023-01-15',
    lastLogin: '2023-05-20',
  },
  {
    id: '2',
    email: 'michael.brown@example.com',
    accountStatus: 'active',
    registrationDate: '2023-02-10',
    lastLogin: '2023-05-19',
  },
  {
    id: '3',
    email: 'jessica.davis@example.com',
    accountStatus: 'active',
    registrationDate: '2023-03-05',
    lastLogin: '2023-05-18',
  },
  {
    id: '4',
    email: 'david.wilson@example.com',
    accountStatus: 'pending',
    registrationDate: '2023-05-18',
    lastLogin: '2023-05-18',
  },
  {
    id: '5',
    email: 'admin@georgiarealty.pro',
    accountStatus: 'active',
    registrationDate: '2023-01-01',
    lastLogin: '2023-05-20',
    isAdmin: true,
  },
];

// Mock Profiles with Georgian regions
export const profiles: Profile[] = [
  {
    id: '1',
    userId: '1',
    fullName: 'Sarah Johnson',
    photoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phoneNumber: '(+995) 555-123-456',
    agencyAffiliation: 'Tbilisi Premier Properties',
    experienceLevel: '5-10',
    regionsServed: ['Tbilisi', 'Mtskheta-Mtianeti'],
    languages: ['Georgian', 'English', 'Russian'],
    bio: 'With over 8 years of experience in the Tbilisi real estate market, I specialize in luxury properties and investment opportunities in the capital region.',
    socialLinks: {
      facebook: 'https://facebook.com/sarahjohnsonrealty',
      instagram: 'https://instagram.com/sarahjohnsonrealty',
      linkedin: 'https://linkedin.com/in/sarahjohnsonrealty',
    },
    featuredStatus: true,
    verificationStatus: true,
  },
  {
    id: '2',
    userId: '2',
    fullName: 'Michael Brown',
    photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phoneNumber: '(+995) 555-789-012',
    agencyAffiliation: 'Batumi Coastal Realty',
    experienceLevel: '10+',
    regionsServed: ['Adjara', 'Guria'],
    languages: ['Georgian', 'Turkish', 'English'],
    bio: 'Specializing in beachfront properties and holiday homes along the Black Sea coast. Expert in Batumi\'s growing real estate market.',
    socialLinks: {
      facebook: 'https://facebook.com/michaelbrownrealty',
      instagram: 'https://instagram.com/michaelbrownrealty',
    },
    featuredStatus: true,
    verificationStatus: true,
  },
  {
    id: '3',
    userId: '3',
    fullName: 'Jessica Davis',
    photoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phoneNumber: '(+995) 555-345-678',
    agencyAffiliation: 'Kutaisi Real Estate Group',
    experienceLevel: '3-5',
    regionsServed: ['Imereti', 'Samtskhe-Javakheti'],
    languages: ['Georgian', 'English'],
    bio: 'Focused on helping clients find their perfect home in historic Kutaisi and surrounding areas. Expert in traditional Georgian properties.',
    socialLinks: {
      instagram: 'https://instagram.com/jessicadavisrealty',
      linkedin: 'https://linkedin.com/in/jessicadavisrealty',
    },
    featuredStatus: false,
    verificationStatus: true,
  },
  {
    id: '4',
    userId: '4',
    fullName: 'David Wilson',
    photoUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phoneNumber: '(+995) 555-901-234',
    agencyAffiliation: 'Kakheti Wine Country Properties',
    experienceLevel: '1-3',
    regionsServed: ['Kakheti', 'Kvemo Kartli'],
    languages: ['Georgian', 'Russian'],
    bio: 'Specializing in vineyard properties and traditional wine-making estates in Georgia\'s premier wine region.',
    socialLinks: {
      facebook: 'https://facebook.com/davidwilsonrealty',
      instagram: 'https://instagram.com/davidwilsonrealty',
    },
    featuredStatus: false,
    verificationStatus: false,
  },
];

// Mock Property Links
export const propertyLinks: PropertyLink[] = [
  {
    id: '1',
    profileId: '1',
    title: 'Modern Apartment in Vake',
    description: 'Luxurious 3-bedroom apartment with city views in Tbilisi\'s most prestigious district.',
    propertyType: 'Apartment',
    location: 'Vake, Tbilisi',
    price: 250000,
    externalUrl: 'https://example.com/property/1',
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creationDate: '2023-04-10',
    numRooms: 3,
    space: 120,
    floor: 5
  },
  {
    id: '2',
    profileId: '2',
    title: 'Beachfront Condo in Batumi',
    description: 'Contemporary 2-bedroom condo with stunning Black Sea views.',
    propertyType: 'Condominium',
    location: 'New Boulevard, Batumi',
    price: 180000,
    externalUrl: 'https://example.com/property/2',
    imageUrl: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creationDate: '2023-04-15',
    numRooms: 2,
    space: 85,
    floor: 12
  },
  {
    id: '3',
    profileId: '3',
    title: 'Historic House in Kutaisi',
    description: 'Restored 19th-century home in the heart of old Kutaisi.',
    propertyType: 'House',
    location: 'Old Town, Kutaisi',
    price: 120000,
    externalUrl: 'https://example.com/property/3',
    imageUrl: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creationDate: '2023-03-22',
    numRooms: 4,
    space: 180,
    floor: 2
  },
  {
    id: '4',
    profileId: '4',
    title: 'Wine Estate in Telavi',
    description: 'Traditional wine-making estate with vineyard in Kakheti region.',
    propertyType: 'Estate',
    location: 'Telavi, Kakheti',
    price: 350000,
    externalUrl: 'https://example.com/property/4',
    imageUrl: 'https://images.pexels.com/photos/463996/pexels-photo-463996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creationDate: '2023-05-08',
    numRooms: 6,
    space: 450,
    floor: 1
  },
];