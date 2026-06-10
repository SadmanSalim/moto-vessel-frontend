export type Branch = {
  id: number;
  category: string;
  name: string;
  subtitle: string;
  location: string;
  status: "open" | "coming-soon";
  statusLabel?: string;
};

export const branches: Branch[] = [
  {
    id: 1,
    category: "AUTO MART",
    name: "Auto Mart",
    subtitle: "Main Branch",
    location: "Agrabad, Chattogram",
    status: "open",
  },
  {
    id: 2,
    category: "TURBO SHOP",
    name: "Turbo Shop",
    subtitle: "Parts Hub",
    location: "Nasirabad, Chattogram",
    status: "open",
  },
  {
    id: 3,
    category: "PARAMOUNT",
    name: "Paramount",
    subtitle: "Service Center",
    location: "GEC Circle, Chattogram",
    status: "open",
  },
  {
    id: 4,
    category: "LUBE ZONE",
    name: "Lube Zone",
    subtitle: "Oil & Fluids",
    location: "O.R. Nizam Rd, Chattogram",
    status: "open",
  },
  {
    id: 5,
    category: "DHAKA",
    name: "Dhaka",
    subtitle: "New Branch",
    location: "Dhaka, Bangladesh",
    status: "coming-soon",
    statusLabel: "Opening 2025",
  },
];
