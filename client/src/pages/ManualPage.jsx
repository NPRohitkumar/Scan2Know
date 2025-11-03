import React from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiSearch, FiCamera, FiBarChart, FiCheckCircle } from 'react-icons/fi'

const ManualPage = () => {
  const steps = [
    {
      icon: <FiUser size={32} />,
      title: 'Step 1: Create Account',
      description: 'Sign up with your username, email, password, and age. This helps us personalize your experience.'
    },
    {
      icon: <FiSearch size={32} />,
      title: 'Step 2: Search or Scan',
      description: 'Navigate to the Scan page. You can either search by product name or use your camera to scan the product label.'
    },
    {
      icon: <FiCamera size={32} />,
      title: 'Step 3: Capture Image',
      description: 'If scanning, take a clear photo of the ingredients list. You can crop, rotate, and adjust the image before uploading.'
    },
    {
      icon: <FiBarChart size={32} />,
      title: 'Step 4: View Analysis',
      description: 'Get instant results showing ingredient severity levels, health effects, organs affected, and healthier alternatives.'
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Step 5: Make Better Choices',
      description: 'Use the information to make informed decisions. Check your profile for history and personalized recommendations.'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            User Manual
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to use Scan2Know effectively
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass p-8 rounded-2xl"
        >
          <h2 className="font-display text-2xl font-bold mb-4 text-gray-800">Tips for Best Results</h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 text-xl">•</span>
              <span className="text-gray-700">Ensure good lighting when taking photos of product labels</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 text-xl">•</span>
              <span className="text-gray-700">Focus on the ingredients section for better OCR accuracy</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 text-xl">•</span>
              <span className="text-gray-700">Use the crop tool to include only the relevant text</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 text-xl">•</span>
              <span className="text-gray-700">Check your profile regularly for personalized recommendations</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 text-xl">•</span>
              <span className="text-gray-700">Browse the Info page to learn about common products</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default ManualPage