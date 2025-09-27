import React from 'react'
import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Adoption from './pages/Adoption'
import AllCareService from "./pages/AllCareService.jsx";
import GroomingDetails from './pages/GroomingDetails.jsx';
import VetCareDetails from './pages/VetCareDetails.jsx';
import PetDaycareDetails from './pages/PetDaycareDetails.jsx';
import CareArea from './pages/CareArea.jsx';
import DaycareBookingForm from './pages/DayCareBookingForm.jsx';
import VeterinaryBookingForm from './pages/VeterinaryBookingForm.jsx';
import GroomingBookingForm from './pages/GroomingBookingForm.jsx';
import MyAppointmentPage from './pages/MyAppointmentPage.jsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import EditVetForm from './components/EditVetForm.jsx';
import EditGroomForm from './components/EditGroomForm.jsx';
import EditDaycareForm from './components/EditDaycareForm.jsx';
import PetList from './pages/PetList'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from './pages/Home'
import MyAdoptions from './pages/MyAdoptions'
import Layout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CaretackerDashboard from './pages/caretaker/CaretackerDashboard'
import ManageAdoption from './pages/admin/ManageAdoption'
import AddPet from './pages/caretaker/AddPet'
import ManagePet from './pages/admin/ManagePet'
import ManageInventory from './pages/admin/ManageInventory'
import Layout_Caretaker from './pages/caretaker/Layout_Caretaker'
import Layout_Doctor from './pages/doctor/Layout_Doctor.jsx';
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyCareAppointments from './pages/MyCareAppointments'


const App = () => {
  const isAdminPath = useLocation().pathname.startsWith('/admin') || useLocation().pathname.startsWith('/caretaker')

  return (
    <div>
        {!isAdminPath && <Navbar />}
    <Routes>
      <Route path="/" element={<Home />} />
      {/* All Care Services Page */}
      <Route path='/careservice' element={<AllCareService />} />
        {/*  Care Area  */}
      <Route path='/carearea' element={<CareArea />} />

      {/* Grooming details Page */}
      <Route path="/book/grooming" element={<GroomingDetails />} />
      {/* Grooming appointment Form */}
      <Route path="/grooming-booking" element={<GroomingBookingForm />} />
      {/* Vet Edit Form */}
      <Route path="/grooming-edit" element={<EditGroomForm />} />

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
      {/* Vet Edit Form */}
      <Route path="/daycare-edit" element={<EditDaycareForm />} />
      
      {/* My Appointment Page-Care services*/}
      <Route path='/myCareappointments' element={<MyAppointmentPage />} />
     

      {/* Cart Page */}
      <Route path='/cart' element={<Cart/>} />

      {/* Checkout Page */}
      <Route path="/checkout" element={<Checkout />} />

      {/* Payment Success Page */}
      <Route path="/payment-success" element={<PaymentSuccess />} />

      
              <Route path="/Adoption" element={<Adoption />} />
              <Route path="/PetList" element={<PetList />} />
              <Route path="/MyAdoptions" element={<MyAdoptions />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route path="/MyCareAppointments" element={<MyCareAppointments />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/adoption/:id" element={<Adoption />} />

              <Route path="/admin" element={<Layout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="/admin/manage-adoption" element={<ManageAdoption />} />
                <Route path="/admin/manage-pet" element={<ManagePet />} />
                <Route path="/admin/manage-inventory" element={<ManageInventory />} />
              </Route>

              <Route path="/caretaker" element={<Layout_Caretaker />}>
                <Route index element={<CaretackerDashboard />} />
                <Route path="/caretaker/add-pet" element={<AddPet />} />
              </Route>

              <Route path="/doctor-dashboard" element={<Layout_Doctor />}>
                <Route index element={<DoctorDashboard />} />
              </Route>
              

       {/* Fallback for unknown routes */}
      <Route path="*" element={<h2 className="text-red-500 text-3xl">404 Page Not Found</h2>} />
      
    </Routes>
    {!isAdminPath && <Footer />}
      </div>
  )
}

export default App