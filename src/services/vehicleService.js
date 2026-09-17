// ==============================================================================
// VEHICLE SERVICE (FIRESTORE VEHICLES REPOSITORY)
// ==============================================================================
import {
  firestoreGetDoc,
  firestoreSetDoc,
  firestoreAddDoc,
  firestoreQueryDocs,
  COLLECTIONS
} from '../firebase/firestore';

export const vehicleService = {
  // Mask sensitive vehicle registration number for privacy
  maskPlate(plate) {
    if (!plate || plate.length < 5) return 'UP16AB****';
    const visibleStart = plate.slice(0, 4);
    const visibleEnd = plate.slice(-2);
    return `${visibleStart}****${visibleEnd}`;
  },

  // Register or update driver vehicle
  async saveVehicle(ownerId, vehicleData) {
    const payload = {
      ownerId,
      brand: vehicleData.brand || 'Hyundai',
      model: vehicleData.model || 'Creta',
      color: vehicleData.color || 'Polar White',
      registrationMasked: this.maskPlate(vehicleData.plate || 'UP16AB1234'),
      seatCapacity: Number(vehicleData.seatCapacity || 4),
      vehicleType: vehicleData.vehicleType || 'SUV',
      verified: true
    };

    if (vehicleData.id) {
      return firestoreSetDoc(COLLECTIONS.VEHICLES, vehicleData.id, payload);
    }
    return firestoreAddDoc(COLLECTIONS.VEHICLES, payload);
  },

  // Get driver vehicle
  async getVehicleByOwner(ownerId) {
    const list = await firestoreQueryDocs(COLLECTIONS.VEHICLES, [
      { field: 'ownerId', op: '==', value: ownerId }
    ]);
    if (list && list.length > 0) return list[0];

    // Default vehicle
    return {
      id: 'veh_default',
      ownerId,
      brand: 'Hyundai',
      model: 'Creta',
      color: 'Polar White',
      registrationMasked: 'UP16AB****',
      seatCapacity: 4,
      vehicleType: 'Compact SUV',
      verified: true
    };
  }
};
