export type RouteType = 'domestic' | 'international';
export type LoadStatus = 'open' | 'matched' | 'closed';

export interface LoadListing {
  id: string;
  origin: string;
  destination: string;
  country: string;
  routeType: RouteType;
  cargoType: string;
  weightTons: number;
  vehicleType: string;
  loadingDate: string;
  price: number | null;
  currency: 'TRY' | 'RUB' | 'EUR' | 'USD';
  notes: string;
  companyName: string;
  verified: boolean;
  createdAt: string;
  status: LoadStatus;
  offers: Offer[];
}

export interface Offer {
  id: string;
  companyName: string;
  price: number;
  currency: LoadListing['currency'];
  note: string;
  createdAt: string;
}

export interface NewLoadInput {
  origin: string;
  destination: string;
  country: string;
  routeType: RouteType;
  cargoType: string;
  weightTons: number;
  vehicleType: string;
  loadingDate: string;
  price: number | null;
  currency: LoadListing['currency'];
  notes: string;
  companyName: string;
}
