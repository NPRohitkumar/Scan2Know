import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductSearch from '../components/scan/ProductSearch'
import CameraCapture from '../components/scan/CameraCapture'
import ResultDisplay from '../components/scan/ResultDisplay'

const ScanPage = () => {
  const [scanMode, setScanMode] = useState('search') // 'search' or 'camera'
  const [scanResult, setScanResult] = useState(null)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Scan Your Product
          </h1>
          <p className="text-xl text-gray-600">
            Search by name or scan product label to get detailed ingredient analysis
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div
              key="scan-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-center mb-8">
                <div className="glass p-2 rounded-full inline-flex">
                  <button
                    onClick={() => setScanMode('search')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      scanMode === 'search'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Search by Name
                  </button>
                  <button
                    onClick={() => setScanMode('camera')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      scanMode === 'camera'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Scan Label
                  </button>
                </div>
              </div>

              {scanMode === 'search' ? (
                <ProductSearch onResult={setScanResult} />
              ) : (
                <CameraCapture onResult={setScanResult} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="scan-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultDisplay result={scanResult} onBack={() => setScanResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ScanPage