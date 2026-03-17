'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PredictionResult } from '@/types';
import {
  BanknotesIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CalendarIcon,
  DownloadIcon,
  ShareIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Salary Prediction',
          text: `My predicted salary is ${formatCurrency(result.predicted_salary_etb, 'ETB')} per year!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `My predicted salary: ${formatCurrency(result.predicted_salary_etb, 'ETB')} per year!`
      );
    }
  };

  // Prepare chart data for confidence interval visualization
  const chartData = [
    { name: 'Lower', value: result.confidence_interval.lower / 1000, fill: '#94a3b8' },
    { name: 'Predicted', value: result.predicted_salary_etb / 1000, fill: '#22c55e' },
    { name: 'Upper', value: result.confidence_interval.upper / 1000, fill: '#94a3b8' },
  ];

  // Calculate percentage difference from median
  const medianSalary = 635000; // From the dataset
  const difference = result.predicted_salary_etb - medianSalary;
  const differencePercent = ((difference / medianSalary) * 100).toFixed(1);
  const isAboveMedian = difference > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card - Animated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden card-gradient border-primary-200 dark:border-primary-800"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-ethiopia-500/10"></div>
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative text-center py-8">
          {/* Icon with celebration animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-ethiopia-500 rounded-2xl flex items-center justify-center shadow-xl glow-primary"
          >
            <BanknotesIcon className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Predicted Annual Salary
          </motion.h3>

          {/* Animated Counter for Salary */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            className="space-y-3"
          >
            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-ethiopia-500 bg-clip-text text-transparent">
              {formatCurrency(result.predicted_salary_etb, 'ETB')}
            </div>
            <div className="text-2xl text-gray-600 dark:text-gray-400 font-medium">
              ≈ {formatCurrency(result.predicted_salary_usd, 'USD')} USD
            </div>
          </motion.div>

          {/* Comparison Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              isAboveMedian
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
            }`}
          >
            {isAboveMedian ? (
              <TrendingUpIcon className="w-5 h-5" />
            ) : (
              <TrendingDownIcon className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {isAboveMedian ? '+' : ''}{differencePercent}% {isAboveMedian ? 'above' : 'below'} market median
            </span>
          </motion.div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Annual salary estimate based on your profile
          </div>
        </div>
      </motion.div>

      {/* Confidence Interval with Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Confidence Range (95%)
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Statistical confidence interval
              </p>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `ETB ${value}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`ETB ${(value * 1000).toLocaleString()}`, 'Salary']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Lower Bound:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(result.confidence_interval.lower, 'ETB')}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <span className="text-sm text-primary-700 dark:text-primary-400">Your Prediction:</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(result.predicted_salary_etb, 'ETB')}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Upper Bound:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(result.confidence_interval.upper, 'ETB')}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Your predicted salary falls within this range with 95% confidence
        </p>
      </motion.div>

      {/* Model Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <InformationCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Model Information
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              About the prediction model
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Model Type:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {result.model_info.model_type}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span className="text-sm text-green-700 dark:text-green-400">Accuracy (R²):</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {result.model_info.accuracy}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-3">Features Used:</span>
            <div className="flex flex-wrap gap-2">
              {result.model_info.features_used.map((feature, index) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-100 to-ethiopia-100 dark:from-primary-900/30 dark:to-ethiopia-900/30 text-gray-700 dark:text-gray-300 text-sm rounded-lg font-medium border border-primary-200 dark:border-primary-800"
                >
                  {feature.replace('_', ' ')}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timestamp */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card bg-gray-50 dark:bg-dark-900"
      >
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <CalendarIcon className="w-4 h-4" />
          <span>Prediction generated on {formatDate(result.timestamp)}</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          onClick={handlePrint}
          className="btn-secondary flex-1 py-4 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Save Results</span>
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="btn-ethiopia flex-1 py-4 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShareIcon className="w-5 h-5" />
          <span>Share</span>
        </motion.button>

        <motion.button
          onClick={() => window.location.href = '#predict'}
          className="btn-primary flex-1 py-4 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>New Prediction</span>
        </motion.button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5"
      >
        <div className="flex">
          <InformationCircleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              Disclaimer
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 leading-relaxed">
              This prediction is based on historical data and machine learning models.
              Actual salaries may vary based on company size, specific skills,
              negotiation, and market conditions. Use this as a reference point for
              salary discussions and career planning.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed top-20 right-4 z-50"
        >
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Prediction Generated!</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
