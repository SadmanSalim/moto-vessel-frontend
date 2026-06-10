export type Testimonial = {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Daniel Mercer",
    location: "Los Angeles, CA",
    quote:
      "Moto Vessel has been our go-to supplier for critical parts. Consistent quality, fast delivery, and outstanding support every time.",
    rating: 5,
    avatar: "/images/placeholders/logo.svg",
  },
  {
    id: 2,
    name: "Amelia Ortiz",
    location: "Houston, TX",
    quote:
      "The premium section is exactly what I needed for my build. Every component feels genuine and installation-ready.",
    rating: 5,
    avatar: "/images/placeholders/logo.svg",
  },
  {
    id: 3,
    name: "Michael Reeves",
    location: "Chicago, IL",
    quote:
      "Reliable stock, clear product details, and smooth service made this our preferred automotive ecommerce partner.",
    rating: 5,
    avatar: "/images/placeholders/logo.svg",
  },
];
