"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, X } from "lucide-react"

export function CallToAction() {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    walletType: 'ethereum'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-800">
          Ready to Bridge Your Assets?
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          Join thousands of users who are already benefiting from the seamless bridge between Ethereum and Bitcoin.
          Start your journey today.
        </p>

        {!showWaitlistForm ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setShowWaitlistForm(true)}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              <span className="flex items-center">
                Start Bridging Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 mx-auto max-w-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Join Our Waitlist</h3>
              <button 
                onClick={() => {
                  setShowWaitlistForm(false);
                  if (isSubmitted) {
                    setIsSubmitted(false);
                    setFormData({ email: '', name: '', walletType: 'ethereum' });
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div className="text-left">
                  <label htmlFor="walletType" className="block text-sm font-medium text-gray-700 mb-1">Preferred Wallet</label>
                  <select
                    id="walletType"
                    name="walletType"
                    value={formData.walletType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="both">Both</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                </button>
                
                <p className="text-xs text-gray-500 mt-2">
                  By joining, you agree to receive updates about our platform. We respect your privacy and will never share your information.
                </p>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h4>
                <p className="text-gray-600 mb-6">
                  You've been added to our waitlist. We'll notify you when it's your turn to access our platform.
                </p>
                <button
                  onClick={() => {
                    setShowWaitlistForm(false);
                    setIsSubmitted(false);
                    setFormData({ email: '', name: '', walletType: 'ethereum' });
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
        <p className="mt-6 text-sm text-gray-500">
          No registration required. Connect your wallet and bridge in minutes.
        </p>
      </div>
    </section>
  )
}
