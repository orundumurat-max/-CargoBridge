import { seedLoads } from './data';
import type { LoadListing, NewLoadInput, Offer } from './types';

const STORAGE_KEY = 'cargobridge.loads.v1';

function read(): LoadListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedLoads;
    const parsed = JSON.parse(raw) as LoadListing[];
    return Array.isArray(parsed) ? parsed : seedLoads;
  } catch {
    return seedLoads;
  }
}

export function getLoads(): LoadListing[] {
  return read();
}

export function saveLoads(loads: LoadListing[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loads));
}

export function createLoad(input: NewLoadInput): LoadListing {
  const listing: LoadListing = {
    ...input,
    id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
    verified: false,
    createdAt: new Date().toISOString(),
    status: 'open',
    offers: []
  };
  const loads = read();
  saveLoads([listing, ...loads]);
  return listing;
}

export function addOffer(loadId: string, offerInput: Omit<Offer, 'id' | 'createdAt'>): LoadListing[] {
  const loads = read().map(load => load.id === loadId
    ? { ...load, offers: [...load.offers, { ...offerInput, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] }
    : load
  );
  saveLoads(loads);
  return loads;
}

export function resetDemoData(): LoadListing[] {
  saveLoads(seedLoads);
  return seedLoads;
}
