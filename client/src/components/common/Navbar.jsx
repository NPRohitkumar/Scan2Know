import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Scan', path: '/scan', protected: true },
    { name: 'Compare', path: '/compare' }, // NEW
    { name: 'Info', path: '/info' },
    { name: 'Manual', path: '/manual' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">S2K</span>
            </motion.div>
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Scan2Know
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              (!link.protected || isAuthenticated) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-colors ${
                    isActive(link.path) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </Link>
              )
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors">
                  <FiUser />
                  <span className="text-sm font-medium">{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700">Login</Link>
                <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              (!link.protected || isAuthenticated) && (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg ${isActive(link.path) ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {link.name}
                </Link>
              )
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Profile</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg bg-primary-500 text-white">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar