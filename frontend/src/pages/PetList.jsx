import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, dummyPetData } from '../assets/assets'
import PetCard from '../components/PetCard'

const PetList = () => {

  const [input, setInput]  = useState('')

  return (
    <div className='mb-20'>
        <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
            <Title title='Available Pets' subTitle='Browse our selection of pets available for your adoption.' />

            <div className='flex items-center by-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
                <img src={assets.search} alt="" className='w-4.5 h-4.5 mr-2' />

                    <input onClick={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by type, breed and age' className='w-full h-full outline-none text-gray-500' />

                <img src={assets.filter} alt="" className='w-4.5 h-4.5 ml-2' />
            </div>
        </div>

        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
          <p>Showing {dummyPetData.length} pets</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-4 xl:px-20 max-w-7xl mx-auto'>
            {dummyPetData.map((pet, index) => (
              <div key={index}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default PetList