import React, { useState, useEffect } from 'react'

const OrganAnimation = ({ organs }) => {
  const [stage, setStage] = useState('healthy')

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev === 'healthy' ? 'unhealthy' : 'healthy'))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
    teeth: { 
      healthy: '/images/organs/h_teeth.png', 
      unhealthy: '/images/organs/uh_teeth.png' 
    }
  }

  // Helper function to format organ names
  const formatOrganKey = (organ) => {
    return organ.toLowerCase().replace(/ /g, '_')
  }

  return (
    <div className="glass p-6 rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-lg">Affected Organs - Long Term Impact</h4>
        <span className="text-sm text-gray-600">Animation shows regular consumption effects</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {organs && organs.length > 0 ? (
          organs.map((organ, index) => {
            const organKey = formatOrganKey(organ)
            const imageData = organImages[organKey] || { 
              healthy: '/images/organs/default.png', 
              unhealthy: '/images/organs/default.png' 
            }
            
            return (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg transition-transform duration-500"
                style={{
                  transform: stage === 'unhealthy' ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div
                  className="mb-2 flex justify-center"
                  style={{
                    opacity: stage === 'unhealthy' ? 0.7 : 1,
                    transition: 'opacity 1s'
                  }}
                >
                  <img
                    src={stage === 'healthy' ? imageData.healthy : imageData.unhealthy}
                    alt={`${organ} ${stage}`}
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"%3E%3Crect fill="%23ddd" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40"%3E❓%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
                <p className="font-medium capitalize">{organ.replace(/_/g, ' ')}</p>
                <p className={`text-sm mt-1 font-semibold ${stage === 'unhealthy' ? 'text-red-600' : 'text-green-600'}`}>
                  {stage === 'healthy' ? 'Healthy' : 'At Risk'}
                </p>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No specific organs affected
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This animation shows potential long-term effects with regular consumption. 
          Occasional intake may not cause significant harm.
        </p>
      </div>
    </div>
  )
}

export default OrganAnimation