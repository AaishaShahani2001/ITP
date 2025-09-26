import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../../components/admin/NavbarAdmin'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/Title'

const AdminDashboard = () => {

  const [data, setData] = useState({
    totalPet: 0,
    totalAdoption: 0,
    pendingAdoption: 0,
    completedAdoption: 13,
    rejectedAdoption: 7,
    revenue_Adoption: 0
  })

  const dashboardCards = [
    {title: "Total Pets", value: data.totalPet, icon: assets.petIcon},
    {title: "Total Adoptions", value: data.totalAdoption, icon: assets.list},
    {title: "Total Pending Adoptions", value: data.pendingAdoption, icon: assets.add},
    {title: "Total Completed Adoptions", value: data.completedAdoption, icon: assets.list},
    {title: "Total Rejected Adoptions", value: data.rejectedAdoption, icon: assets.add}
  ]

  useEffect(() => {
    setData(dummyDashboardData)
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title='Admin Dashboard' subTitle='Monitor overall platform perfomance including total pets, adoptions, revenue and recent activities' align='left' />

      <div className='grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 my-8 max-w-5xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor'>
              <div>
                <h1 className='text-xs text-gray-500'>{card.title}</h1>
                <p className='text-lg font-semibold'>{card.value}</p>
              </div>
              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
                <img src={card.icon} className='h-4 w-4' />
              </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard