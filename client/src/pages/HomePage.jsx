import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCamera, FiShield, FiHeart, FiTrendingUp } from 'react-icons/fi'

const HomePage = () => {
  const features = [
    {
      icon: <FiCamera size={32} />,
      title: 'Easy Scanning',
      description: 'Scan product labels instantly with your camera to get detailed ingredient analysis'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Health Protection',
      description: 'Know which ingredients are harmful and their effects on your organs'
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Better Choices',
      description: 'Get healthier alternatives for harmful ingredients in your food'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Track Progress',
      description: 'Monitor your food choices and build healthier eating habits over time'
    }
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
          >
            Know What You Eat
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Scan products, understand ingredients, and make healthier food choices for you and your family
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/manual"
              className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold text-lg border-2 border-gray-300 hover:border-primary-500 hover:shadow-lg transition-all"
            >
              Learn How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why This App Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Why Scan2Know?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In today's world, processed foods contain hidden ingredients that can harm your health. 
              We believe everyone deserves to know exactly what they're consuming.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Importance Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold mb-6 text-gray-800">
                Your Health Matters
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Many common food products contain harmful additives, preservatives, and artificial ingredients 
                that can affect your digestive system, heart, liver, and overall wellbeing.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With Scan2Know, you get instant insights into ingredient safety levels, potential health 
                risks, and healthier alternatives - empowering you to make informed decisions.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Real-time ingredient analysis with severity levels</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Understand how ingredients affect specific organs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Get healthier alternatives for harmful ingredients</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🥗</div>
                <h3 className="font-display text-2xl font-bold text-gray-800">Make The Switch</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="font-semibold text-red-700">❌ Harmful Ingredients</p>
                  <p className="text-sm text-gray-600 mt-1">Artificial colors, preservatives, high sodium</p>
                </div>
                <div className="text-center text-2xl">↓</div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-700">✅ Healthier Alternatives</p>
                  <p className="text-sm text-gray-600 mt-1">Natural ingredients, organic options, low sodium</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass p-12 rounded-3xl"
        >
          <h2 className="font-display text-4xl font-bold mb-4 text-gray-800">
            Ready to Make Healthier Choices?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have transformed their eating habits with Scan2Know
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Start Scanning Now
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage