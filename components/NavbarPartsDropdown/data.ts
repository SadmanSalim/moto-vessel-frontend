export const BRANDS = [
  "BMW",
  "AUDI",
  "MERCEDES",
  "PORSCHE",
  "TOYOTA",
  "HONDA",
  "TESLA",
  "FORD",
  "LEXUS",
  "VOLKSWAGEN",
] as const;

export type BrandName = (typeof BRANDS)[number];

export type VehicleData = {
  models: string[];
  engines: Record<string, string[]>;
};

export const vehicleData: Record<BrandName, VehicleData> = {
  BMW: {
    models: ["3 Series", "5 Series", "X5", "X3", "M3", "M5", "7 Series", "Z4"],
    engines: {
      "3 Series": ["2.0L 4-Cyl Petrol", "3.0L 6-Cyl Petrol", "2.0L Diesel"],
      "5 Series": ["2.0L 4-Cyl Petrol", "3.0L 6-Cyl Petrol", "3.0L Diesel"],
      X5: ["3.0L 6-Cyl Petrol", "3.0L Diesel", "4.4L V8 Petrol"],
      X3: ["2.0L 4-Cyl Petrol", "2.0L Diesel", "3.0L 6-Cyl Petrol"],
      M3: ["3.0L Twin-Turbo 6-Cyl", "3.0L Competition"],
      M5: ["4.4L Twin-Turbo V8", "4.4L Competition"],
      "7 Series": ["3.0L 6-Cyl Petrol", "4.4L V8 Petrol", "3.0L Diesel"],
      Z4: ["2.0L 4-Cyl Petrol", "3.0L 6-Cyl Petrol"],
    },
  },
  AUDI: {
    models: ["A3", "A4", "A6", "Q5", "Q7", "TT", "RS6", "e-tron"],
    engines: {
      A3: ["1.5L 4-Cyl Petrol", "2.0L 4-Cyl Petrol", "2.0L Diesel"],
      A4: ["2.0L 4-Cyl Petrol", "2.0L Diesel", "3.0L V6 Petrol"],
      A6: ["2.0L 4-Cyl Petrol", "3.0L V6 Petrol", "3.0L Diesel"],
      Q5: ["2.0L 4-Cyl Petrol", "3.0L V6 Petrol", "2.0L Diesel"],
      Q7: ["3.0L V6 Petrol", "3.0L Diesel", "4.0L V8 Petrol"],
      TT: ["2.0L 4-Cyl Petrol", "2.5L 5-Cyl Petrol"],
      RS6: ["4.0L Twin-Turbo V8", "4.0L Avant"],
      "e-tron": ["Dual Motor Electric", "Single Motor Electric"],
    },
  },
  MERCEDES: {
    models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "AMG GT", "A-Class", "G-Class"],
    engines: {
      "C-Class": ["2.0L 4-Cyl Petrol", "2.0L Diesel", "3.0L 6-Cyl Petrol"],
      "E-Class": ["2.0L 4-Cyl Petrol", "3.0L 6-Cyl Petrol", "2.0L Diesel"],
      "S-Class": ["3.0L 6-Cyl Petrol", "4.0L V8 Petrol", "3.0L Diesel"],
      GLC: ["2.0L 4-Cyl Petrol", "2.0L Diesel", "3.0L 6-Cyl Petrol"],
      GLE: ["3.0L 6-Cyl Petrol", "3.0L Diesel", "4.0L V8 Petrol"],
      "AMG GT": ["4.0L Twin-Turbo V8", "4.0L V8 Black Series"],
      "A-Class": ["1.3L 4-Cyl Petrol", "2.0L 4-Cyl Petrol", "2.0L Diesel"],
      "G-Class": ["4.0L V8 Petrol", "3.0L Diesel", "4.0L AMG V8"],
    },
  },
  PORSCHE: {
    models: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman", "718"],
    engines: {
      "911": ["3.0L Twin-Turbo 6-Cyl", "4.0L Flat-6", "3.8L Turbo"],
      Cayenne: ["3.0L V6 Petrol", "4.0L V8 Petrol", "3.0L Diesel"],
      Macan: ["2.0L 4-Cyl Petrol", "3.0L V6 Petrol", "2.9L Twin-Turbo"],
      Panamera: ["2.9L V6 Petrol", "4.0L V8 Petrol", "2.9L Hybrid"],
      Taycan: ["Dual Motor Electric", "Tri Motor Electric"],
      Boxster: ["2.0L Flat-4", "4.0L Flat-6"],
      Cayman: ["2.0L Flat-4", "4.0L Flat-6"],
      "718": ["2.0L Turbo Flat-4", "4.0L Flat-6"],
    },
  },
  TOYOTA: {
    models: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Supra", "Hilux", "Prius", "GR86"],
    engines: {
      Camry: ["2.5L 4-Cyl Petrol", "3.5L V6 Petrol", "2.5L Hybrid"],
      Corolla: ["1.8L 4-Cyl Petrol", "2.0L 4-Cyl Petrol", "1.8L Hybrid"],
      RAV4: ["2.5L 4-Cyl Petrol", "2.5L Hybrid", "2.0L 4-Cyl Petrol"],
      "Land Cruiser": ["3.5L Twin-Turbo V6", "4.5L V8 Diesel", "3.3L Diesel"],
      Supra: ["2.0L Turbo 4-Cyl", "3.0L Turbo 6-Cyl"],
      Hilux: ["2.4L Diesel", "2.8L Diesel", "2.7L Petrol"],
      Prius: ["1.8L Hybrid", "2.0L Hybrid"],
      GR86: ["2.4L Flat-4 Petrol", "2.4L Track Edition"],
    },
  },
  HONDA: {
    models: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey", "Fit", "Ridgeline"],
    engines: {
      Civic: ["2.0L 4-Cyl Petrol", "1.5L Turbo Petrol", "2.0L Hybrid"],
      Accord: ["1.5L Turbo Petrol", "2.0L Turbo Petrol", "2.0L Hybrid"],
      "CR-V": ["1.5L Turbo Petrol", "2.0L Hybrid", "2.4L 4-Cyl Petrol"],
      "HR-V": ["1.5L Turbo Petrol", "2.0L 4-Cyl Petrol", "e:HEV Hybrid"],
      Pilot: ["3.5L V6 Petrol", "3.5L AWD Petrol"],
      Odyssey: ["3.5L V6 Petrol", "3.5L Hybrid"],
      Fit: ["1.5L 4-Cyl Petrol", "1.5L Hybrid"],
      Ridgeline: ["3.5L V6 Petrol", "3.5L AWD Petrol"],
    },
  },
  TESLA: {
    models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster", "Model 3 Performance", "Model Y Long Range"],
    engines: {
      "Model 3": ["RWD Electric", "Long Range Dual Motor", "Performance Dual Motor"],
      "Model Y": ["RWD Electric", "Long Range Dual Motor", "Performance Dual Motor"],
      "Model S": ["Dual Motor Electric", "Plaid Tri Motor"],
      "Model X": ["Dual Motor Electric", "Plaid Tri Motor"],
      Cybertruck: ["Dual Motor Electric", "Tri Motor Electric"],
      Roadster: ["Tri Motor Electric", "Plaid Electric"],
      "Model 3 Performance": ["Dual Motor Performance", "Track Package"],
      "Model Y Long Range": ["Dual Motor AWD", "Long Range AWD"],
    },
  },
  FORD: {
    models: ["F-150", "Mustang", "Explorer", "Bronco", "Ranger", "Escape", "Edge", "Maverick"],
    engines: {
      "F-150": ["3.3L V6 Petrol", "5.0L V8 Petrol", "3.5L EcoBoost V6"],
      Mustang: ["2.3L EcoBoost 4-Cyl", "5.0L V8 Petrol", "5.2L Supercharged V8"],
      Explorer: ["2.3L EcoBoost 4-Cyl", "3.0L V6 Petrol", "3.3L Hybrid"],
      Bronco: ["2.3L EcoBoost 4-Cyl", "2.7L V6 Petrol", "3.0L V6 Petrol"],
      Ranger: ["2.3L EcoBoost 4-Cyl", "2.7L V6 Diesel", "3.0L V6 Diesel"],
      Escape: ["1.5L EcoBoost 3-Cyl", "2.5L Hybrid", "2.0L EcoBoost"],
      Edge: ["2.0L EcoBoost 4-Cyl", "2.7L V6 Petrol", "2.0L Hybrid"],
      Maverick: ["2.5L Hybrid", "2.0L EcoBoost 4-Cyl"],
    },
  },
  LEXUS: {
    models: ["ES", "IS", "RX", "NX", "GX", "LX", "LC", "UX"],
    engines: {
      ES: ["2.5L 4-Cyl Petrol", "3.5L V6 Petrol", "2.5L Hybrid"],
      IS: ["2.0L Turbo 4-Cyl", "3.5L V6 Petrol", "5.0L V8 Petrol"],
      RX: ["2.4L Turbo 4-Cyl", "3.5L V6 Petrol", "2.5L Hybrid"],
      NX: ["2.5L 4-Cyl Petrol", "2.5L Hybrid", "2.4L Turbo Hybrid"],
      GX: ["3.4L Twin-Turbo V6", "4.6L V8 Petrol"],
      LX: ["3.4L Twin-Turbo V6", "3.5L Twin-Turbo V6"],
      LC: ["5.0L V8 Petrol", "3.5L V6 Hybrid"],
      UX: ["2.0L 4-Cyl Petrol", "2.0L Hybrid"],
    },
  },
  VOLKSWAGEN: {
    models: ["Golf", "Jetta", "Tiguan", "Passat", "Atlas", "ID.4", "Arteon", "Taos"],
    engines: {
      Golf: ["1.5L Turbo 4-Cyl", "2.0L Turbo 4-Cyl", "2.0L Diesel"],
      Jetta: ["1.5L Turbo 4-Cyl", "2.0L Turbo 4-Cyl", "1.4L Turbo"],
      Tiguan: ["2.0L Turbo 4-Cyl", "2.0L Diesel", "1.5L Turbo"],
      Passat: ["2.0L Turbo 4-Cyl", "2.0L Diesel", "1.4L Turbo"],
      Atlas: ["2.0L Turbo 4-Cyl", "3.6L V6 Petrol"],
      "ID.4": ["RWD Electric", "AWD Dual Motor"],
      Arteon: ["2.0L Turbo 4-Cyl", "2.0L Diesel"],
      Taos: ["1.5L Turbo 4-Cyl", "1.5L AWD Turbo"],
    },
  },
};

export function brandSlug(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

export function modelSlug(model: string) {
  return model.toLowerCase().replace(/\s+/g, "-");
}

export function getModels(brand: BrandName) {
  return vehicleData[brand]?.models ?? [];
}

export function getEngines(brand: BrandName, model: string) {
  return vehicleData[brand]?.engines[model] ?? ["2.0L 4-Cyl Petrol", "2.5L 4-Cyl Petrol", "3.0L V6 Petrol"];
}

export function getYears() {
  const years: string[] = [];
  for (let y = 2025; y >= 2000; y--) {
    years.push(String(y));
  }
  return years;
}
