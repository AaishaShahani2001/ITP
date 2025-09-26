import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import {  useNavigate } from 'react-router-dom';

const NavbarAdmin = () => {

  const navigate = useNavigate()

  const user = dummyUserData[0];

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 bg-light border-b border-borderColor relative transition-all'>
        <div className='flex'>
                <img src={assets.logo} alt="" className='w-10 ml-3 mr-2' />
                <p className='font-semibold text-4xl md:text-[30px]'>PetPulse</p>
        </div>


        <div className='flex items-center gap-2 cursor-pointer group relative'>
           <p className=' text-gray-500 '>Welcome, {user.name || "Admin"}</p>
           <img src={assets.dropdown} alt=""className='w-2.5' />
        
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                 <div className='min-w-48 bg-gray-200 rounded flex flex-col gap-4 p-4'>
                    <p onClick={() => navigate('')} className='hover:text-black hover:font-semibold cursor-pointer'>My Profile</p>
                    <p onClick={() => navigate('')} className='hover:text-black hover:font-semibold cursor-pointer'>Logout</p>
                 </div>
              </div>
         </div>

    </div>
  )
}

export default NavbarAdmin