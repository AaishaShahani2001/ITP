// assets.js
import groomingImg from './grooming.jpg';
import daycareImg from './daycCare.jpg';
import vetImg from './vet.jpg';
import doc1 from './doc1.png';

export const assets = {
  groomingImg,
  daycareImg,
  vetImg,
  doc1
};

export const services = [
  {
    id: 1,
    title: "Grooming",
    image: groomingImg,
    description:
      "Pamper your pet with our professional grooming services – including baths, haircuts, nail trimming, and more to keep them clean and stylish.",
    duration: "1 - 2 hours",
    fee: "Rs.1500 - Rs.2500 (depending on pet size)",
    buttonRedirect: "/careservicebooking"
  },
  {
    id: 2,
    title: "Overnight / Daycare",
    image: daycareImg,
    description:
      "Safe, comfortable, and fun daycare or overnight stays. Perfect for busy pet parents needing trusted care and companionship for their pets.",
    duration: "Daycare (8 hrs) / Overnight (24 hrs)",
    fee: "Rs.2500 Daycare | Rs.3500 Overnight",
    buttonRedirect: "/careservicebooking"
  },

  {
    id: 3,
    title: "Veterinary Care",
    image: vetImg,
    description:
      "Comprehensive health check-ups, vaccinations, and medical treatments by our certified veterinarians to ensure your pet’s wellbeing.",
    duration: "30 mins - 1 hour",
    fee: "Consultation starts at Rs.4000",
    buttonRedirect: "/Vetappointments"
  }
];

export const vetDoctor = {
  _id: "doc1",
  name: "Dr. Sarah Patel",
  image: doc1,
  speciality: "Veterinary Doctor",
  degree: "MBBS",
  experience: "2 Years",
  about:
    "Dr. Patel is committed to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
  fees: "Rs.4000",
};
