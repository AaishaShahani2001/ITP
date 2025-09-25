import React from 'react'
import "./index.css";
import { Routes, Route } from "react-router-dom";
import AllCareService from "./pages/AllCareService.jsx";
import GroomingDetails from './pages/GroomingDetails.jsx';
import VetCareDetails from './pages/VetCareDetails.jsx';
import PetDaycareDetails from './pages/PetDaycareDetails.jsx';
import CareArea from './pages/CareArea.jsx';
import DaycareBookingForm from './pages/DayCareBookingForm.jsx';
import VeterinaryBookingForm from './pages/VeterinaryBookingForm.jsx';
import GroomingBookingForm from './pages/GroomingBookingForm.jsx';
import MyAppointmentPage from './pages/MyAppointmentPage.jsx';
import CaretackerDashboard from './pages/CaretackerDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import EditVetForm from './components/EditVetForm.jsx';


const App = () => {
  return (
    <Routes>
      {/* All Care Services Page */}
      <Route path='/' element={<AllCareService />} />
        {/*  Care Area  */}
      <Route path='/carearea' element={<CareArea />} />

      {/* Grooming details Page */}
      <Route path="/book/grooming" element={<GroomingDetails />} />
      {/* Grooming appointment Form */}
      <Route path="/grooming-booking" element={<GroomingBookingForm />} />

      {/* Vet Care details Page */}
      <Route path="/book/vetappointment" element={<VetCareDetails />} />
      {/* Vet Appointment Form */}
      <Route path="/vet-booking" element={<VeterinaryBookingForm />} />
      {/* Vet Edit Form */}
      <Route path="/vet-edit" element={<EditVetForm />} />

      {/* Pet Day  Care details Page */}
      <Route path="/book/daycare" element={<PetDaycareDetails />} />
       {/* Pet dat Care service  Form */}
      <Route path='/daycarebooking' element={<DaycareBookingForm />} />
      
      {/* My Appointment Page-Care services*/}
      <Route path='/myCareappointments' element={<MyAppointmentPage />} />
     
      {/* Caretacker Dashboard */}
      <Route path='/caretacker-dashboard' element={<CaretackerDashboard/>} />

      {/* Caretacker Dashboard */}
      <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />

      {/* Cart Page */}
      <Route path='/cart' element={<Cart/>} />

      {/* Checkout Page */}
      <Route path="/checkout" element={<Checkout />} />

      {/* Payment Success Page */}
      <Route path="/payment-success" element={<PaymentSuccess />} />

       {/* Fallback for unknown routes */}
      <Route path="*" element={<h2 className="text-red-500 text-3xl">404 Page Not Found</h2>} />
    </Routes>
  )
}

export default App