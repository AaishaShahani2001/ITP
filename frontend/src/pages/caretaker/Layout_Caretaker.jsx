import React from 'react'
import Sidebar from '../../components/careTaker/Sidebar'
import { Outlet } from 'react-router-dom'
import NavbarCaretaker from '../../components/caretaker/NavbarCaretaker'

const Layout_Caretaker = () => {
  return (
    <div className='flex flex-col'>
      <NavbarCaretaker />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout_Caretaker