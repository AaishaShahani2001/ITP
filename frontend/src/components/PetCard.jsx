import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PetCard = ({pet}) => {

  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate()

  return (
    <div onClick={() => {navigate(`/adoption/${pet._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>

          <div className='relative  h-48 overglow-hidden'>
            <img src={pet.image} alt="Pet Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />

            {pet.isAvailable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}

            <div className='absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                <span className='font-semibold'>{currency} {pet.price}</span>
            </div>
          </div>

        <div className='p-4 sm:p-5'>
            <div className='flex justify-between items-start mb-2'>
                <div>
                    <h3 className='text-lg font-medium'>{pet.breed} {pet.type}</h3>
                    <p className='text-muted-foreground text-sm'>Born on: {pet.born}</p>
                </div>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.user} alt="" className='h-4 mr-2' />
                    <span>{pet.age} years old</span>
                </div>

                <div className='flex items-center text-sm text-muted-foreground'>
                    <img src={assets.fuel} alt="" className='h-4 mr-2' />
                    <span>Name: {pet.name}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PetCard