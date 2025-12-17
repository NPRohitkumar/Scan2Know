// import React, { useState, useEffect } from 'react'

// const OrganAnimation = ({ organs }) => {
//   const [stage, setStage] = useState('healthy')

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setStage((prev) => (prev === 'healthy' ? 'unhealthy' : 'healthy'))
//     }, 3000)
//     return () => clearInterval(interval)
//   }, [])

//   // Organ image paths
//   const organImages = {
//     digestive_system: { 
//       healthy: '/images/organs/h_digestive.png', 
//       unhealthy: '/images/organs/uh_digestive.png' 
//     },
//     heart: { 
//       healthy: '/images/organs/h_heart.png', 
//       unhealthy: '/images/organs/uh_heart.png' 
//     },
//     pancreas: { 
//       healthy: '/images/organs/h_pancreas.png', 
//       unhealthy: '/images/organs/uh_pancreas.png' 
//     },
//     metabolic_system: { 
//       healthy: '/images/organs/h_metabolic.png', 
//       unhealthy: '/images/organs/uh_metabolic.png' 
//     },
//     nervous_system: { 
//       healthy: '/images/organs/h_nervous.png', 
//       unhealthy: '/images/organs/uh_nervous.png' 
//     },
//     immune_system: { 
//       healthy: '/images/organs/h_immune.png', 
//       unhealthy: '/images/organs/uh_immune.png' 
//     },
//     teeth: { 
//       healthy: '/images/organs/h_teeth.png', 
//       unhealthy: '/images/organs/uh_teeth.png' 
//     }
//   }

//   // Helper function to format organ names
//   const formatOrganKey = (organ) => {
//     return organ.toLowerCase().replace(/ /g, '_')
//   }

//   return (
//     <div className="glass p-6 rounded-xl bg-white shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <h4 className="font-semibold text-lg">Affected Organs - Long Term Impact</h4>
//         <span className="text-sm text-gray-600">Animation shows regular consumption effects</span>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//         {organs && organs.length > 0 ? (
//           organs.map((organ, index) => {
//             const organKey = formatOrganKey(organ)
//             const imageData = organImages[organKey] || { 
//               healthy: '/images/organs/default.png', 
//               unhealthy: '/images/organs/default.png' 
//             }
            
//             return (
//               <div
//                 key={index}
//                 className="text-center p-4 bg-gray-50 rounded-lg transition-transform duration-500"
//                 style={{
//                   transform: stage === 'unhealthy' ? 'scale(1.05)' : 'scale(1)'
//                 }}
//               >
//                 <div
//                   className="mb-2 flex justify-center"
//                   style={{
//                     opacity: stage === 'unhealthy' ? 0.7 : 1,
//                     transition: 'opacity 1s'
//                   }}
//                 >
//                   <img
//                     src={stage === 'healthy' ? imageData.healthy : imageData.unhealthy}
//                     alt={`${organ} ${stage}`}
//                     className="w-24 h-24 object-contain"
//                     onError={(e) => {
//                       e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"%3E%3Crect fill="%23ddd" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40"%3E❓%3C/text%3E%3C/svg%3E'
//                     }}
//                   />
//                 </div>
//                 <p className="font-medium capitalize">{organ.replace(/_/g, ' ')}</p>
//                 <p className={`text-sm mt-1 font-semibold ${stage === 'unhealthy' ? 'text-red-600' : 'text-green-600'}`}>
//                   {stage === 'healthy' ? 'Healthy' : 'At Risk'}
//                 </p>
//               </div>
//             )
//           })
//         ) : (
//           <div className="col-span-full text-center text-gray-500 py-8">
//             No specific organs affected
//           </div>
//         )}
//       </div>

//       <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//         <p className="text-sm text-yellow-800">
//           <strong>Note:</strong> This animation shows potential long-term effects with regular consumption. 
//           Occasional intake may not cause significant harm.
//         </p>
//       </div>
//     </div>
//   )
// }

// export default OrganAnimation

import React from 'react'

const OrganAnimation = ({ organs }) => {
  // Helper function to format organ names
  const formatOrganKey = (organ) => {
    return organ.toLowerCase().replace(/ /g, '_')
  }

  // Organ image paths
  const organImages = {
    digestive_system: { 
      healthy: '/images/organs/h_digestive.png', 
      unhealthy: '/images/organs/uh_digestive.png' 
    },
    heart: { 
      healthy: '/images/organs/h_heart.png', 
      unhealthy: '/images/organs/uh_heart.png' 
    },
    pancreas: { 
      healthy: '/images/organs/h_pancreas.png', 
      unhealthy: '/images/organs/uh_pancreas.png' 
    },
    liver: { 
      healthy: '/images/organs/h_liver.png', 
      unhealthy: '/images/organs/uh_liver.png' 
    },
    kidney: { 
      healthy: '/images/organs/h_kidney.png', 
      unhealthy: '/images/organs/uh_kidney.png' 
    },
    kidneys: { 
      healthy: '/images/organs/h_kidney.png', 
      unhealthy: '/images/organs/uh_kidney.png' 
    },
    metabolic_system: { 
      healthy: '/images/organs/h_metabolic.png', 
      unhealthy: '/images/organs/uh_metabolic.png' 
    },
    nervous_system: { 
      healthy: '/images/organs/h_nervous.png', 
      unhealthy: '/images/organs/uh_nervous.png' 
    },
    immune_system: { 
      healthy: '/images/organs/h_immune.png', 
      unhealthy: '/images/organs/uh_immune.png' 
    },
    brain: { 
      healthy: '/images/organs/h_brain.png', 
      unhealthy: '/images/organs/uh_brain.png' 
    },
    teeth: { 
      healthy: '/images/organs/h_teeth.png', 
      unhealthy: '/images/organs/uh_teeth.png' 
    },
    cells: { 
      healthy: '/images/organs/h_cells.png', 
      unhealthy: '/images/organs/uh_cells.png' 
    },
    dna: { 
      healthy: '/images/organs/h_dna.png', 
      unhealthy: '/images/organs/uh_dna.png' 
    },
    arteries: { 
      healthy: '/images/organs/h_arteries.png', 
      unhealthy: '/images/organs/uh_arteries.png' 
    },
    thyroid: { 
      healthy: '/images/organs/h_thyroid.png', 
      unhealthy: '/images/organs/uh_thyroid.png' 
    }
  }

  // Fallback emoji if images don't exist
  const organEmojis = {
    digestive_system: { healthy: '🫁', unhealthy: '💔' },
    digestive: { healthy: '🫁', unhealthy: '💔' },
    heart: { healthy: '❤️', unhealthy: '💔' },
    liver: { healthy: '🫀', unhealthy: '🩸' },
    kidney: { healthy: '🫘', unhealthy: '💀' },
    kidneys: { healthy: '🫘', unhealthy: '💀' },
    brain: { healthy: '🧠', unhealthy: '😵' },
    pancreas: { healthy: '🥞', unhealthy: '🩸' },
    nervous_system: { healthy: '🧠', unhealthy: '😵' },
    immune_system: { healthy: '🛡️', unhealthy: '⚠️' },
    metabolic_system: { healthy: '⚡', unhealthy: '⚠️' },
    teeth: { healthy: '🦷', unhealthy: '🪥' },
    cells: { healthy: '🔬', unhealthy: '☠️' },
    dna: { healthy: '🧬', unhealthy: '⚠️' },
    arteries: { healthy: '🩸', unhealthy: '💔' },
    thyroid: { healthy: '🦋', unhealthy: '⚠️' }
  }

  return (
    <div className="glass p-6 rounded-xl bg-white shadow-lg">
      <div className="mb-6">
        <h4 className="font-semibold text-xl text-gray-800 mb-2">Affected Organs - Long Term Impact</h4>
        <p className="text-sm text-gray-600">Side-by-side comparison: Regular consumption effects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organs && organs.length > 0 ? (
          organs.map((organ, index) => {
            const organKey = formatOrganKey(organ)
            const imageData = organImages[organKey]
            const emojiData = organEmojis[organKey] || { healthy: '❓', unhealthy: '⚠️' }
            
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Side-by-Side Comparison */}
                <div className="flex items-center justify-between mb-4">
                  {/* Healthy Side */}
                  <div className="flex-1 text-center">
                    <div className="mb-2 flex justify-center items-center h-20">
                      {imageData ? (
                        <img
                          src={imageData.healthy}
                          alt={`${organ} healthy`}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            // Fallback to emoji
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      ) : null}
                      <span 
                        className="text-5xl"
                        style={{ display: imageData ? 'none' : 'block' }}
                      >
                        {emojiData.healthy}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Healthy
                    </p>
                  </div>

                  {/* Arrow Separator */}
                  <div className="px-3 flex flex-col items-center">
                    <svg 
                      className="w-8 h-8 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Regular use</span>
                  </div>

                  {/* Unhealthy Side */}
                  <div className="flex-1 text-center">
                    <div className="mb-2 flex justify-center items-center h-20">
                      {imageData ? (
                        <img
                          src={imageData.unhealthy}
                          alt={`${organ} unhealthy`}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            // Fallback to emoji
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      ) : null}
                      <span 
                        className="text-5xl"
                        style={{ display: imageData ? 'none' : 'block' }}
                      >
                        {emojiData.unhealthy}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      At Risk
                    </p>
                  </div>
                </div>

                {/* Organ Name */}
                <div className="text-center pt-3 border-t border-gray-300">
                  <p className="font-bold text-gray-800 capitalize text-sm">
                    {organ.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <p className="text-lg">No specific organs affected</p>
            <p className="text-sm text-gray-400 mt-2">This product appears to have minimal organ-specific impact</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
        <div className="flex items-start space-x-3">
          <span className="text-yellow-600 text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm text-yellow-800 font-semibold mb-1">Important Notice</p>
            <p className="text-sm text-yellow-700">
              This comparison shows potential long-term effects with <strong>regular consumption</strong>. 
              Occasional intake may not cause significant harm. Always consult a healthcare professional 
              for personalized dietary advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganAnimation
