export const TANUKU_AREAS = [
    { name: "Sajja Puram", lat: 16.7561, lng: 81.6745 },
    { name: "Venkatarayapuram", lat: 16.7505, lng: 81.6789 },
    { name: "Tetali", lat: 16.7450, lng: 81.6934 },
    { name: "Velpur", lat: 16.7621, lng: 81.6702 },
    { name: "Old Town", lat: 16.7554, lng: 81.6811 },
    { name: "Paina", lat: 16.7689, lng: 81.6854 }
];

// Helper to calculate distance in meters between two lat/lng pairs using Haversine formula
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}
