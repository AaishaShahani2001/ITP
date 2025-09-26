import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='pt-0.5 bg-light border-b border-b-gray-400 m-auto'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>
          {/* Left section */}
          <div>
            <div className='flex'>
               <img src={assets.logo} alt="" className='w-10 ml-3 mr-2' />
               <p className='font-semibold text-4xl md:text-[30px]'>PetPulse</p>
            </div>
            <p className='ml-5 mt-5 w-full md:w-2/3 text-gray-600 leading-6'>Thank you for exploring our collection of pets. Each animal is unique, full of love, and waiting for care. We are committed to their safety, health, and happiness. Your support helps us provide better homes, brighter futures, and lifelong companionship for these wonderful creatures.</p>
          </div>

          {/* Center section */}
          <div>
            <p className='text-xl font-medium mb-5 mt-2'>COMPANY</p>
            <ul className='flex- flex-col gap-2 text-gray-600 leading-6'>
             <li>Home</li>
             <li>About Us</li>
             <li>Contact Us</li>
             <li>Privacy policy</li>
            </ul>
          </div>

          {/* Right section */}
          <div>
            <p className='text-xl font-medium mb-5 mt-2'>GET IN TOUCH</p>
            <ul className='flex- flex-col gap-2 text-gray-600 leading-6'>
              <li>+94 123456789</li>
              <li>petpulse2025@gmail.com</li>
            </ul>
          </div>
        </div>


        {/* Copyright text */}
        <div>
          <hr className='border-gray-200' />
          <p className='py-5 text-sm text-center'>Copyright 2025@ PetPulse - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer;
