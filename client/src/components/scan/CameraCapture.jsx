// import React, { useState, useRef, useCallback } from 'react'
// import { motion } from 'framer-motion'
// import { FiCamera, FiUpload, FiLoader, FiRotateCcw, FiRotateCw, FiX } from 'react-icons/fi'
// import ReactCrop from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
// import imageCompression from 'browser-image-compression'
// import axios from 'axios'
// import toast from 'react-hot-toast'

// const CameraCapture = ({ onResult }) => {
//   const [image, setImage] = useState(null)
//   const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 16 / 9 })
//   const [completedCrop, setCompletedCrop] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [rotation, setRotation] = useState(0)
//   const [showCamera, setShowCamera] = useState(false)
//   const [stream, setStream] = useState(null)
  
//   const fileInputRef = useRef(null)
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const imgRef = useRef(null)

//   // Start camera
//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: 'environment', // Use back camera on mobile
//           width: { ideal: 1920 },
//           height: { ideal: 1080 }
//         }
//       })
//       setStream(mediaStream)
//       setShowCamera(true)
      
//       // Wait for video element to be ready
//       setTimeout(() => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream
//         }
//       }, 100)
//     } catch (error) {
//       console.error('Camera access error:', error)
//       toast.error('Could not access camera. Please allow camera permissions or upload an image.')
//     }
//   }

//   // Stop camera
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop())
//       setStream(null)
//     }
//     setShowCamera(false)
//   }

//   // Capture photo from camera
//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) return

//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')

//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight
//     context.drawImage(video, 0, 0, canvas.width, canvas.height)

//     canvas.toBlob(async (blob) => {
//       try {
//         const compressed = await imageCompression(blob, {
//           maxSizeMB: 1,
//           maxWidthOrHeight: 1920
//         })
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           setImage(reader.result)
//           stopCamera()
//         }
//         reader.readAsDataURL(compressed)
//       } catch (error) {
//         toast.error('Failed to process image')
//       }
//     }, 'image/jpeg', 0.9)
//   }

//   // Handle file selection
//   const handleImageSelect = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     try {
//       const compressed = await imageCompression(file, {
//         maxSizeMB: 1,
//         maxWidthOrHeight: 1920
//       })
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImage(reader.result)
//       }
//       reader.readAsDataURL(compressed)
//     } catch (error) {
//       toast.error('Failed to process image')
//     }
//   }

//   // Rotate image
//   const handleRotate = (degrees) => {
//     setRotation((prev) => (prev + degrees) % 360)
//   }

//   // Handle manual rotation slider
//   const handleRotationChange = (e) => {
//     setRotation(parseInt(e.target.value))
//   }

//   // Upload and process
//   const handleUpload = async () => {
//     if (!image) {
//       toast.error('Please select an image first')
//       return
//     }

//     setLoading(true)
//     try {
//       // Convert base64 to blob
//       const response = await fetch(image)
//       const blob = await response.blob()
      
//       const formData = new FormData()
//       formData.append('image', blob, 'product.jpg')
//       formData.append('rotation', rotation)

//       const result = await axios.post('http://localhost:5000/api/scan/upload', formData, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       })

//       onResult(result.data)
//       toast.success('Image processed successfully!')
//     } catch (error) {
//       console.error('Upload error:', error)
//       toast.error(error.response?.data?.message || 'Upload failed. Make sure OCR service is running.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Cleanup on unmount
//   React.useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [stream])

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-4xl mx-auto"
//     >
//       <div className="glass p-8 rounded-2xl">
//         {!image && !showCamera ? (
//           <div className="text-center">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageSelect}
//               accept="image/*"
//               className="hidden"
//             />
            
//             {/* Option Buttons */}
//             <div className="grid md:grid-cols-2 gap-4">
//               {/* Camera Option */}
//               <button
//                 onClick={startCamera}
//                 className="py-12 border-4 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 transition-colors group"
//               >
//                 <FiCamera className="mx-auto text-6xl text-gray-400 group-hover:text-primary-500 transition-colors mb-4" />
//                 <p className="text-xl font-semibold text-gray-700 mb-2">Open Camera</p>
//                 <p className="text-gray-500">Take a photo with your camera</p>
//               </button>

//               {/* Upload Option */}
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="py-12 border-4 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 transition-colors group"
//               >
//                 <FiUpload className="mx-auto text-6xl text-gray-400 group-hover:text-primary-500 transition-colors mb-4" />
//                 <p className="text-xl font-semibold text-gray-700 mb-2">Upload Image</p>
//                 <p className="text-gray-500">Select from your device</p>
//               </button>
//             </div>

//             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 💡 <strong>Tip:</strong> Make sure the ingredients list is clearly visible and well-lit for best results.
//               </p>
//             </div>
//           </div>
//         ) : showCamera ? (
//           // Camera View
//           <div>
//             <div className="relative mb-4">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full rounded-lg"
//               />
//               <canvas ref={canvasRef} className="hidden" />
//             </div>

//             <div className="flex space-x-4">
//               <button
//                 onClick={stopCamera}
//                 className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
//               >
//                 <FiX />
//                 <span>Cancel</span>
//               </button>
//               <button
//                 onClick={capturePhoto}
//                 className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg flex items-center justify-center space-x-2"
//               >
//                 <FiCamera />
//                 <span>Capture Photo</span>
//               </button>
//             </div>
//           </div>
//         ) : (
//           // Image Editor
//           <div>
//             <div className="mb-4 flex justify-between items-center">
//               <h3 className="font-semibold text-lg">Adjust Image</h3>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handleRotate(-90)}
//                   className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                   title="Rotate Left 90°"
//                 >
//                   <FiRotateCcw size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleRotate(90)}
//                   className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                   title="Rotate Right 90°"
//                 >
//                   <FiRotateCw size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Free Rotation Slider */}
//             <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//               <label className="block text-sm font-medium mb-2">
//                 Free Rotation: {rotation}°
//               </label>
//               <input
//                 type="range"
//                 min="0"
//                 max="359"
//                 value={rotation}
//                 onChange={handleRotationChange}
//                 className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
//                 style={{
//                   background: `linear-gradient(to right, #f59e0b ${(rotation / 359) * 100}%, #d1d5db ${(rotation / 359) * 100}%)`
//                 }}
//               />
//               <div className="flex justify-between text-xs text-gray-500 mt-1">
//                 <span>0°</span>
//                 <span>90°</span>
//                 <span>180°</span>
//                 <span>270°</span>
//                 <span>360°</span>
//               </div>
//             </div>

//             {/* Image Preview with Crop */}
//             <div className="mb-6 bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
//               <div style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}>
//                 <ReactCrop
//                   crop={crop}
//                   onChange={(c) => setCrop(c)}
//                   onComplete={(c) => setCompletedCrop(c)}
//                 >
//                   <img
//                     ref={imgRef}
//                     src={image}
//                     alt="Product"
//                     className="max-w-full mx-auto"
//                   />
//                 </ReactCrop>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => {
//                   setImage(null)
//                   setRotation(0)
//                   setCrop({ unit: '%', width: 90, aspect: 16 / 9 })
//                 }}
//                 className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
//               >
//                 Retake
//               </button>
//               <button
//                 onClick={handleUpload}
//                 disabled={loading}
//                 className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
//               >
//                 {loading ? (
//                   <>
//                     <FiLoader className="animate-spin" />
//                     <span>Processing...</span>
//                   </>
//                 ) : (
//                   <>
//                     <FiUpload />
//                     <span>Upload & Analyze</span>
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
//               <p className="text-sm text-yellow-800">
//                 ⚠️ <strong>Note:</strong> Crop the image to include only the ingredients list for better accuracy.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Custom Slider Styles */}
//       <style jsx>{`
//         input[type="range"]::-webkit-slider-thumb {
//           appearance: none;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: #f59e0b;
//           cursor: pointer;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//         }

//         input[type="range"]::-moz-range-thumb {
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: #f59e0b;
//           cursor: pointer;
//           border: none;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//         }
//       `}</style>
//     </motion.div>
//   )
// }

// export default CameraCapture

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiUpload, FiLoader, FiRotateCcw, FiRotateCw, FiX } from 'react-icons/fi'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import imageCompression from 'browser-image-compression'
import axios from 'axios'
import toast from 'react-hot-toast'
import API_URL from '../../config/api'

const CameraCapture = ({ onResult }) => {
  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState(null)
  
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (error) {
      toast.error('Could not access camera. Please allow camera permissions or upload an image.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      try {
        const compressed = await imageCompression(blob, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        })
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result)
          stopCamera()
        }
        reader.readAsDataURL(compressed)
      } catch (error) {
        toast.error('Failed to process image')
      }
    }, 'image/jpeg', 0.9)
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(compressed)
    } catch (error) {
      toast.error('Failed to process image')
    }
  }

  const handleRotate = (degrees) => {
    setRotation((prev) => (prev + degrees) % 360)
  }

  const handleRotationChange = (e) => {
    setRotation(parseInt(e.target.value))
  }

  // Apply rotation and crop to create final image
  const getRotatedAndCroppedImage = async () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = imgRef.current

      if (!img) {
        resolve(null)
        return
      }

      // Convert rotation to radians
      const rotRad = (rotation * Math.PI) / 180

      // Calculate new canvas size after rotation
      const sin = Math.abs(Math.sin(rotRad))
      const cos = Math.abs(Math.cos(rotRad))
      const newWidth = img.width * cos + img.height * sin
      const newHeight = img.width * sin + img.height * cos

      canvas.width = newWidth
      canvas.height = newHeight

      // Rotate around center
      ctx.translate(newWidth / 2, newHeight / 2)
      ctx.rotate(rotRad)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleUpload = async () => {
    if (!image) {
      toast.error('Please select an image first')
      return
    }

    setLoading(true)
    try {
      // Get rotated image
      const rotatedBlob = await getRotatedAndCroppedImage()
      
      if (!rotatedBlob) {
        toast.error('Failed to process image')
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('image', rotatedBlob, 'product.jpg')

      const result = await axios.post(`${API_URL}/api/scan/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      onResult(result.data)
      toast.success('Image processed successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Upload failed. Make sure OCR service is running.')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass p-8 rounded-2xl">
        {!image && !showCamera ? (
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="py-12 border-4 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 transition-colors group"
              >
                <FiCamera className="mx-auto text-6xl text-gray-400 group-hover:text-primary-500 transition-colors mb-4" />
                <p className="text-xl font-semibold text-gray-700 mb-2">Open Camera</p>
                <p className="text-gray-500">Take a photo with your camera</p>
              </button>

              <button
                onClick={() => fileInputRef.current.click()}
                className="py-12 border-4 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 transition-colors group"
              >
                <FiUpload className="mx-auto text-6xl text-gray-400 group-hover:text-primary-500 transition-colors mb-4" />
                <p className="text-xl font-semibold text-gray-700 mb-2">Upload Image</p>
                <p className="text-gray-500">Select from your device</p>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Make sure the ingredients list is clearly visible and well-lit for best results.
              </p>
            </div>
          </div>
        ) : showCamera ? (
          <div>
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={stopCamera}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <FiX />
                <span>Cancel</span>
              </button>
              <button
                onClick={capturePhoto}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <FiCamera />
                <span>Capture Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Adjust Image</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRotate(-90)}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  title="Rotate Left 90°"
                >
                  <FiRotateCcw size={20} />
                </button>
                <button
                  onClick={() => handleRotate(90)}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  title="Rotate Right 90°"
                >
                  <FiRotateCw size={20} />
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Rotation: {rotation}° {rotation !== 0 && <span className="text-primary-600">(Will be applied before OCR)</span>}
              </label>
              <input
                type="range"
                min="0"
                max="359"
                value={rotation}
                onChange={handleRotationChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>

            <div className="mb-6 bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
              <div style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center', transition: 'transform 0.3s' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Product"
                    className="max-w-full mx-auto"
                  />
                </ReactCrop>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setImage(null)
                  setRotation(0)
                  setCrop({ unit: '%', width: 90, aspect: 16 / 9 })
                }}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Retake
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiUpload />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> The rotation you set will be applied to the image before sending to OCR for better accuracy.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CameraCapture