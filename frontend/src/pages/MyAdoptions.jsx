import React, { useEffect, useState } from 'react'
import { assets, dummyAdoptionData } from '../assets/assets'
import Title from '../components/Title'

const MyAdoptions = () => {

  const [adoption_detail, setAdoption_detail] = useState([])
  const currency = import.meta.env.VITE_CURRENCY

  const fetchMyAdoption = async() => {
    setAdoption_detail(dummyAdoptionData)
  }

  useEffect(() => {
    fetchMyAdoption()
  }, [])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mb-20'>

        <Title title='My Adoption' subTitle='View and manage your adoption' align='left' />

        <div>
            {adoption_detail.map((adoption, index) => (
                <div key={adoption._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

                {/* Image + Details */}
                    <div className='md:col-span-1'>
                        <div className='rounded-md overflow-hidden mb-3'>
                            <img src={adoption.pet.image} alt="" className='w-full h-auto aspect-video object-cover' />
                        </div>
                        <p className='text-lg font-medium mt-2'>{adoption.pet.breed} {adoption.pet.type}</p>
                        <p className='text-gray-500'>{adoption.pet.name}</p>
                    </div>

                    {/* Adoption Info */}
                    <div className='md:col-span-2'>
                        <div className='flex items-center gap-2'>
                            <p className='px-3 py-1.5 bg-light rounded'>Adoption #{index+1}</p>
                            <p className={`px-3 py-1 text-xs rounded-full ${adoption.status === 'pending'? 'bg-gray-400/15 text-gray-600': adoption.status === 'approved'? 'bg-green-400/15 text-green-600': 'bg-red-400/15 text-red-600'}`}>{adoption.status}</p>
                        </div>

                        <div className='flex items-start gap-2 mt-5'>
                            <img src={assets.calendar} alt="" className='w-4 h-4 mt-1' />

                            <div>
                                <p>Adoption date:</p>
                                <p>{adoption.date.split('T')[0]}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-2 mt-3'>
                            <img src={assets.calendar} alt="" className='w-4 h-4 mt-1' />

                            <div>
                                <p>Your appointment date:</p>
                                <p>{adoption.visit.split('T')[0]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className='md:col-span-1 flex flex-col justify-between gap-6 mt-35'>
                        <div className='text-sm text-gray-500 text-right'>
                            <p>Paid amount</p>
                            <h1 className='text-2xl font-semibold text-primary'>{currency} {adoption.price}</h1>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyAdoptions