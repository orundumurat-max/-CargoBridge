import type { LoadListing } from './types';

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const seedLoads: LoadListing[] = [
  {
    id: 'CB-1048',
    origin: 'İstanbul, Türkiye',
    destination: 'Ankara, Türkiye',
    country: 'Türkiye',
    routeType: 'domestic',
    cargoType: 'Ambalajlı gıda',
    weightTons: 18,
    vehicleType: 'Tenteli tır',
    loadingDate: daysFromNow(2),
    price: 38500,
    currency: 'TRY',
    notes: 'Paletli yük. Yükleme için randevu alınmalıdır.',
    companyName: 'Marmara Gıda Lojistik',
    verified: true,
    createdAt: new Date().toISOString(),
    status: 'open',
    offers: [
      { id: 'OF-1', companyName: 'Anadolu Nakliyat', price: 36000, currency: 'TRY', note: 'Yükleme saatine uygunum.', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'CB-1047',
    origin: 'İzmir, Türkiye',
    destination: 'Bursa, Türkiye',
    country: 'Türkiye',
    routeType: 'domestic',
    cargoType: 'Makine parçaları',
    weightTons: 12,
    vehicleType: 'Kapalı kasa',
    loadingDate: daysFromNow(1),
    price: null,
    currency: 'TRY',
    notes: 'Fiyat tekliflerine açık. Yükleme adresi anlaşma sonrası paylaşılacak.',
    companyName: 'Ege Endüstri A.Ş.',
    verified: false,
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    status: 'open',
    offers: []
  },
  {
    id: 'CB-1046',
    origin: 'İstanbul, Türkiye',
    destination: 'Moskova, Rusya',
    country: 'Rusya',
    routeType: 'international',
    cargoType: 'Tekstil ürünleri',
    weightTons: 20,
    vehicleType: 'Tenteli tır',
    loadingDate: daysFromNow(5),
    price: 6200,
    currency: 'EUR',
    notes: 'Uluslararası taşıma. Gerekli belgeler ve taşıma koşulları taraflarca teyit edilmelidir.',
    companyName: 'Boğaz Dış Ticaret',
    verified: true,
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    status: 'open',
    offers: []
  },
  {
    id: 'CB-1045',
    origin: 'Gaziantep, Türkiye',
    destination: 'Tahran, İran',
    country: 'İran',
    routeType: 'international',
    cargoType: 'Plastik ham madde',
    weightTons: 22,
    vehicleType: 'Tenteli tır',
    loadingDate: daysFromNow(4),
    price: null,
    currency: 'USD',
    notes: 'Yük ve güzergâh uygunluğu taraflarca doğrulanmalıdır.',
    companyName: 'Güney Ticaret',
    verified: true,
    createdAt: new Date(Date.now() - 10_800_000).toISOString(),
    status: 'open',
    offers: []
  },
  {
    id: 'CB-1044',
    origin: 'Mersin, Türkiye',
    destination: 'Almatı, Kazakistan',
    country: 'Kazakistan',
    routeType: 'international',
    cargoType: 'Kuru gıda',
    weightTons: 19,
    vehicleType: 'Frigorifik',
    loadingDate: daysFromNow(7),
    price: 7400,
    currency: 'EUR',
    notes: 'Sıcaklık gereksinimi teklif aşamasında teyit edilmelidir.',
    companyName: 'Akdeniz İhracat',
    verified: false,
    createdAt: new Date(Date.now() - 14_400_000).toISOString(),
    status: 'open',
    offers: []
  }
];
