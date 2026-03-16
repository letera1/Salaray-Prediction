'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon, GlobeAltIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'ML-Powered Predictions',
      description: 'Advanced regression models trained on real Ethiopian data',
    },
    {
      icon: GlobeAltIcon,
      title: 'Local Market Insights',
      description: 'Accurate salary data from major Ethiopian cities',
    },
    {
      icon: AcademicCapIcon,
      title: 'Education & Experience',
      description: 'Factors in your qualifications and professional background',
    },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-display">
              Predict Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-ethiopia-500">
                Tech Salary
              </span>{' '}
              in Ethiopia
            </h1>
            
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              Get accurate salary predictions for Ethiopian technology professionals using 
              machine learning models trained on real market data from universities, 
              industry surveys, and government statistics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#predict"
              className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get My Salary Prediction
            </a>
            <a
              href="#insights"
              className="btn-secondary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              View Market Insights
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">200+</div>
              <div className="text-gray-600 mt-1">Real Salary Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">86%</div>
              <div className="text-gray-600 mt-1">Model Accuracy (R²)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">10+</div>
              <div className="text-gray-600 mt-1">Ethiopian Cities</div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}