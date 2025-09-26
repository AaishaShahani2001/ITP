import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyAdoptionData, dummyPetData } from '../assets/assets'
import Loader from '../components/Loader'

const Adoption = () => {

  const {id} = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async(e) => {
    e.preventDefault();
  }

  useEffect(() => {
    setPet(dummyPetData.find(pet => pet._id === id))
  }, [id])


  // Validate phone number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

  if (value.length > 0) {
      const isValidLength = value.length >= 9 && value.length <= 10;
      const isNumeric = /^\d+$/.test(value);const isValidFirstDigitForTen = value.length === 10 ? value[0] === '0' : true;

      if (!isValidLength) {
        setError('Phone number must be 9 or 10 digits long.');
      }
      
      else if (!isNumeric) {
        setError('Phone number must contain only numbers.');
      }
      
      else if (!isValidFirstDigitForTen) {
        setError('For 10-digit numbers, the first digit must be 0.');
      }
      
      else {
        setError('');
      }
    }
    
    else {
      setError('Phone number is required.');
    }
  };


  // Validate age
  const [age, setAge] = useState('');
  const [errorAge, setErrorAge] = useState('');

  const handleChangeAge = (e) => {
    const value = e.target.value;
    setAge(value);

    if (value === '') {
      setErrorAge('Age is required.');
    }
    
    else {
      const numValue = parseInt(value, 10);

      if (isNaN(numValue)) {
        setErrorAge('Age must be a valid number.');
      }
      
      else if (numValue < 1 || numValue > 100) {
        setErrorAge('Age must be between 1 and 100.');
      }
      
      else {
        setErrorAge('');
      }
    }
  };

  return pet? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-20'>
        <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
          <img src={assets.arrow} alt="" className='rotate-180 opacity-65' />
          Back to pet list
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          {/* Left: Pet Image & Details */}
          <div className='lg:col-span-2'>
            <img src={pet.image} alt="" className='w-full h-auto md:max-h-200 object-cover rounded-xl mb-6 shadow-md' />
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold'>{pet.species} ● {pet.breed}</h1>
                <p className='text-gray-500 text-1g'>Born on: {pet.born}</p>
              </div>
              <hr className='border-borderColor my-6' />

              <div className='grid grid-cols-4 sm:grid cols-4 gap-4'>
                {[
                  {icon: assets.dog_icon1, text: `${pet.age} years`},
                  {icon: assets.cat_icon, text: `${pet.gender}`},
                  {icon: assets.color, text: `${pet.color}`},
                  {icon: assets.food, text: `${pet.diet}`}
                ].map(({icon, text}) => (
                  <div key={text} className='flex flex-col items-center bg-light p-4 rounded-3xl'>
                    <img src={icon} alt="" className='h-5 mb-2' />
                    {text}
                  </div>
                ))}
              </div>

              {/* Medical */}
              <div>
                <h1 className='text-xl font-medium mb-3'>Medical Status</h1>
                <p className='text-gray-500'>{pet.medical}</p>
              </div>

              {/* Features */}
              <div>
                <h1 className='text-xl font-medium mb-3'>Features</h1>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {
                    ["Friendly", "Playful", "Vaccinated", "Loves cuddles", "Indoor pet"].map((item) => (
                      <li key={item} className='flex items-center text-gray-500'>
                        <img src={assets.check} className='h-4 mr-2' alt="" />
                        {item}
                      </li>
                    ))
                  }
                </ul>
              </div>

            </div>
          </div>

          {/* Right: Booking Form */}
          <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency} {pet.price}</p>

            <hr className='border-borderColor my-6' />

            <div>
              <label htmlFor='adopter_name'>Your name:</label>
              <input type="text" id="adopter_name" className='w-full border borderColor px-3 py-2 rounded-lg' required />
            </div>

            <div>
              <label htmlFor='address'>Your address (City):</label>
              <input type="text" id="address" className='w-full border borderColor px-3 py-2 rounded-lg' required />
            </div>

            <div>
              <label htmlFor='p_number'>Your phone number:</label>
              <input type="number" id="p_number" value={phoneNumber} onChange={handleChange} className='w-full border borderColor px-3 py-2 rounded-lg' required />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <label htmlFor='age'>Your age:</label>
              <input type="number" id="age" value={age} onChange={handleChangeAge} className='w-full border borderColor px-3 py-2 rounded-lg' required />
              {errorAge && <p className="text-red-500 text-sm mt-1">{errorAge}</p>}
            </div>

            <div>
              <label htmlFor='other_pet'>Do you have any other pets?</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center">
                  <input type="radio" id="other_pet" name="hasOtherPets" value="yes" className="mr-2" required /> Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" id="other_pet" name="hasOtherPets" value="no" className="mr-2" required /> No
                </label>
              </div>
            </div>

            <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>Adopt Now</button>

            <p className='text-center text-sm'>No credit card required to adopt</p>

          </form>
        </div>
    </div>
  ): <Loader />
}

export default Adoption