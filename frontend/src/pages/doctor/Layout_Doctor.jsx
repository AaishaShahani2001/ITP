import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarDoctor from '../../components/doctor/NavbarDoctor'

const Layout_Doctor = () => {
  return (
    <div className='flex flex-col'>
      <NavbarDoctor />
      <div className='flex'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout_Doctor