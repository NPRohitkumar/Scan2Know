import React from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi'

const ContactPage = () => {
  const developers = [
    {
      name: 'N P Rohitkumar',
      role: 'Full Stack Developer , ML Engineer',
      email: 'nprohitkumar28@gmail.com',
      phone: '+91 9036132890',
      image: '/placeholder1.jpg', // You'll add actual images
      github: 'https://github.com/NPRohitkumar',
      linkedin: 'https://www.linkedin.com/in/n-p-rohitkumar/'
    },
    {
      name: 'Shreyas H R',
      role: 'Frontend Developer',
      email: 'shreyas0hr32@gmail.com',
      phone: '+91 8073876823',
      image: '/placeholder2.jpg',
      github: 'https://github.com/dev2',
      linkedin: 'https://www.linkedin.com/in/shreyas-h-r-3328582a0/'
    },
    {
      name: 'Impana K K',
      role: 'Full Stack Developer',
      email: 'impanakumar65@gmail.com',
      phone: '+91 6363592510',
      image: '/placeholder3.jpg',
      github: 'https://github.com/Impanakumar',
      linkedin: 'http://linkedin.com/in/impana-kumar'
    },
    {
      name: 'Chandana D',
      role: 'FrontEnd developer',
      email: 'chandanadkm15@gmail.com',
      phone: '+91 6362265882',
      image: '/placeholder4.jpg',
      github: 'https://www.linkedin.com/in/chandana-d-621b4526a',
      linkedin: 'https://github.com/Chandana-278'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600">
            The people who made Scan2Know possible
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-gray-800">{dev.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{dev.role}</p>
                  
                  <div className="space-y-2 mb-4">
                    <a href={`mailto:${dev.email}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <FiMail />
                      <span className="text-sm">{dev.email}</span>
                    </a>
                    <a href={`tel:${dev.phone}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <FiPhone />
                      <span className="text-sm">{dev.phone}</span>
                    </a>
                  </div>

                  <div className="flex space-x-4">
                    <a href={dev.github} target="_blank" rel="noopener noreferrer" 
                       className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                      <FiGithub size={18} />
                    </a>
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <FiLinkedin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass p-8 rounded-2xl text-center"
        >
          <h2 className="font-display text-2xl font-bold mb-4 text-gray-800">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <a
            href="mailto:contact@scan2know.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage