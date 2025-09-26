import React, { useEffect, useState } from 'react'
import { assets, dummyAdoptionData } from '../../assets/assets'
import Title from '../../components/Title'

const ManageAdoption = () => {

  const [adoption, setAdoption] = useState([])

  const fetchAdminAdoption = async () => {
    setAdoption(dummyAdoptionData)
  }

  const currency = import.meta.env.VITE_CURRENCY

  useEffect(() => {
    fetchAdminAdoption()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Adoptions" subTitle="Tract all adopter adoptions, approve or reject the requests, and manage adoption statuses." align="left" />

      <div className='max-w-7xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Pet</th>
              <th className='p-3 font-medium'>Adopter Name</th>
              <th className='p-3 font-medium'>Adopter Age</th>
              <th className='p-3 font-medium'>Address</th>
              <th className='p-3 font-medium'>Phone Number</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium'>Appointment Date</th>
              <th className='p-3 font-medium'>Visiting Date</th>
              <th className='p-3 font-medium'>Action</th>
            </tr>
          </thead>
          <tbody>
            {adoption.map((adopt, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500'>
                
                <td className='p-3 flex items-center gap-3'>
                  <img src={adopt.pet.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <p className='font-medium max-md:hidden'>{adopt.pet.species} ● {adopt.pet.breed}</p>
                </td>
                <td className='p-3 max-md:hidden'>{adopt.adopter}</td>
                <td className='p-3 max-md:hidden'>{adopt.age}</td>
                <td className='p-3 max-md:hidden'>{adopt.address}</td>
                <td className='p-3 max-md:hidden'>{adopt.phone}</td>
                <td className='p-3 max-md:hidden'>{currency} {adopt.pet.price}</td>
                <td className='p-3 max-md:hidden'>{adopt.date}</td>
                <td className='p-3 max-md:hidden'>{adopt.visit}</td>

                <td className='grid grid-cols-2 items-center p-3'>
                  <img src={assets.accept} alt="accept" className='cursor-pointer' />
                  <img src={assets.reject} alt="reject" className='cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ManageAdoption