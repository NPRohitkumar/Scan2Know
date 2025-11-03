import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Scan2Know</h3>
            <p className="text-gray-400 text-sm">Know what you eat. Make healthier choices for a better life.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors"><FiGithub size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><FiLinkedin size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><FiMail size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/info" className="text-gray-400 hover:text-white transition-colors">Info</Link></li>
              <li><Link to="/manual" className="text-gray-400 hover:text-white transition-colors">User Manual</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get health tips and updates.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary-500 text-sm" />
              <button className="px-4 py-2 bg-primary-500 rounded-r-lg hover:bg-primary-600 transition-colors text-sm font-medium">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Scan2Know. All rights reserved. Built with ❤️ for healthier living.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer