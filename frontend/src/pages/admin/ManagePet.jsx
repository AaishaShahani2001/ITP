import React, { useEffect, useState } from 'react'
import { assets, dummyPetData } from '../../assets/assets'
import Title from '../../components/Title'

const ManagePet = () => {

  const [pets, setPets] = useState([])

  const fetchCaretakerPet = async () => {
    setPets(dummyPetData)
  }

  const currency = import.meta.env.VITE_CURRENCY

  useEffect(() => {
    fetchCaretakerPet()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Pets" subTitle="View all listed pets, update their details, or remove them from the list." align="left" />

      <div className='max-w-7xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Pet</th>
              <th className='p-3 font-medium'>Gender</th>
              <th className='p-3 font-medium'>Color</th>
              <th className='p-3 font-medium'>Age</th>
              <th className='p-3 font-medium'>Diet</th>
              <th className='p-3 font-medium'>Medical</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium'>Action</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={pet.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{pet.species} ● {pet.breed}</p>
                    <p className='text-xs text-gray-500'>Born on: {pet.born}</p>
                  </div>
                </td>
                <td className='p-3'>{pet.gender}</td>
                <td className='p-3'>{pet.color}</td>
                <td className='p-3'>{pet.age}</td>
                <td className='p-3'>{pet.diet}</td>
                <td className='p-3'>{pet.medical}</td>
                <td className='p-3'>{currency} {pet.price}</td>

                <td className='items-center p-3'>
                    <img src={assets.edit_black} alt="edit" className='cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ManagePet