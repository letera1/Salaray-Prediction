'use client';

import { motion } from 'framer-motion';
import { PredictionResult } from '@/types';
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  InformationCircleIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

interface ResultsDisplayProps {
  result: PredictionResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const formatCurrency = (amount: number, currency: 'ETB' | 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'ETB' ? 'USD' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currency === 'ETB' ? 'ETB ' : '$');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const confidenceWidth = ((result.predicted_salary_etb - result.confidence_interval.lower) / 
    (result.confidence_interval.upper - result.confidence_interval.lower)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <BanknotesIcon className="w-8 h-8 text-primary-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Predicted Salary
          </h3>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary-600">
              {formatCurrency(result.predicted_salary_etb, 'ETB')}
            </div>
            <div className="text-xl text-gray-600">
              ≈ {formatCurrency(result.predicted_salary_usd, 'USD')} USD
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Annual salary estimate based on your profile
          </div>
        </div>
      </div>

      {/* Confidence Interval */}
      <div className="card">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">
            Confidence Range (95%)
          </h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(result.confidence_interval.lower, 'ETB')}</span>
            <span>{formatCurrency(result.confidence_interval.upper, 'ETB')}</span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full relative"
                style={{ width: '100%' }}
              >
                <div 
                  className="absolute top-0 w-1 h-3 bg-white rounded-full shadow-sm"
                  style={{ left: `${confidenceWidth}%`, transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            Your predicted salary falls within this range with 95% confidence
          </p>
        </div>
      </div>

      {/* Model Information */}
      <div className="card">
        <div className="flex items-center mb-4">
          <InformationCircleIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">
            Model Information
          </h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Model Type:</span>
            <span className="font-medium text-gray-900">{result.model_info.model_type}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Accuracy:</span>
            <span className="font-medium text-primary-600">{result.model_info.accuracy}</span>
          </div>
          
          <div>
            <span className="text-gray-600 block mb-2">Features Used:</span>
            <div className="flex flex-wrap gap-2">
              {result.model_info.features_used.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  {feature.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="card bg-gray-50">
        <div className="flex items-center justify-center text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>Prediction generated on {formatDate(result.timestamp)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.print()}
          className="btn-secondary flex-1 py-3"
        >
          Save Results
        </button>
        <button
          onClick={() => window.location.href = '#predict'}
          className="btn-primary flex-1 py-3"
        >
          New Prediction
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Disclaimer</p>
            <p>
              This prediction is based on historical data and machine learning models. 
              Actual salaries may vary based on company size, specific skills, 
              negotiation, and market conditions. Use this as a reference point for 
              salary discussions and career planning.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}