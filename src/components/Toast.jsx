"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const isSuccess = type === "success"

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px]
        transition-all duration-300 ease-out
        ${isSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}
        ${isVisible && !isLeaving ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <span className={`flex-1 text-sm ${isSuccess ? "text-green-800" : "text-red-800"}`}>
        {message}
      </span>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 p-1 rounded-full transition-colors ${
          isSuccess ? "hover:bg-green-100 text-green-600" : "hover:bg-red-100 text-red-600"
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message) => addToast(message, "success")
  const showError = (message) => addToast(message, "error")

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
  }
}

export default Toast
