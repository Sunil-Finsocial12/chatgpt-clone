import { useState } from 'react'
import Sidebar from "./Sidebar2"
import Heading from './Heading2'
import ChatInput from './ChatInput2'


const MainLayout2 = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className='min-h-screen flex bg-black bg-gradient-to-b from-[#001F3F] to-black via-black text-gray-100'>
      <Sidebar  />
      <main className={`flex-1  `}>
        <div className={`fixed top-0 h-16 flex items-center justify-between  z-50 transition-all duration-300 ${isOpen ? 'pl-64' : 'pl-20'}`}>
          
        </div>
        <div className="pt-20 px-4">
          <Heading/>
          <ChatInput/>
          
        </div>
      </main>
    </div>
  )
}

export default MainLayout2