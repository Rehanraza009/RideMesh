// ==============================================================================
// RIDEMESH GOOGLE MAPS & GEOLOCATION CONFIGURATION
// ==============================================================================
// To connect your real Google Maps account:
// 1. Create a project in Google Cloud Console (https://console.cloud.google.com/)
// 2. Enable Maps JavaScript API, Places API, and Directions API
// 3. Create an API Key with HTTP referrer restrictions for your app
// 4. Set VITE_GOOGLE_MAPS_API_KEY in your .env file:
//    VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
// ==============================================================================

export const GOOGLE_MAPS_CONFIG = {
  // Read from Vite environment variable with safe fallback
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  defaultCenter: {
    lat: 28.4744, // Pari Chowk, Greater Noida
    lng: 77.5040
  },
  defaultZoom: 14,
  mapId: 'ridemesh_map_style',
  libraries: ['places', 'geometry']
};

// Preset Verified Delhi NCR Places with accurate GPS Coordinates
export const VERIFIED_PLACES = [
  {
    id: 'pari_chowk',
    name: 'Pari Chowk Metro Station',
    address: 'Alpha 1, Greater Noida, UP 201310',
    lat: 28.4744,
    lng: 77.5040,
    category: 'Transit',
    popular: true
  },
  {
    id: 'sec_62',
    name: 'Noida Sector 62 (Electronic City)',
    address: 'Sector 62, Noida, Gautam Buddha Nagar, UP 201309',
    lat: 28.6280,
    lng: 77.3649,
    category: 'Work',
    popular: true
  },
  {
    id: 'galgotias_univ',
    name: 'Galgotias University Campus',
    address: 'Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida',
    lat: 28.4595,
    lng: 77.5336,
    category: 'College',
    popular: true
  },
  {
    id: 'dlf_mall_18',
    name: 'DLF Mall of India (Sector 18)',
    address: 'Plot No. M-03, Sector 18, Noida, UP 201301',
    lat: 28.5672,
    lng: 77.3211,
    category: 'Shopping',
    popular: true
  },
  {
    id: 'botanical_garden',
    name: 'Botanical Garden Metro Station',
    address: 'Captain Shashi Kant Marg, Sector 38, Noida',
    lat: 28.5644,
    lng: 77.3344,
    category: 'Transit',
    popular: true
  },
  {
    id: 'connaught_place',
    name: 'Connaught Place (Inner Circle)',
    address: 'Block A, Connaught Place, New Delhi, Delhi 110001',
    lat: 28.6315,
    lng: 77.2167,
    category: 'Work',
    popular: true
  },
  {
    id: 'india_gate',
    name: 'India Gate & Kartavya Path',
    address: 'Rajpath, India Gate, New Delhi, Delhi 110001',
    lat: 28.6129,
    lng: 77.2295,
    category: 'Transit',
    popular: true
  },
  {
    id: 'kp_2',
    name: 'Knowledge Park II Metro Station',
    address: 'Knowledge Park II, Greater Noida, UP 201310',
    lat: 28.4610,
    lng: 77.4985,
    category: 'College',
    popular: true
  }
];
