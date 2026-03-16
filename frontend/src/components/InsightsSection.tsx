'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import { SalaryInsights } from '@/types';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  MapPinIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

export default function InsightsSection() {
  const [insights, setInsights] = useState<SalaryInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await apiService.getSalaryInsights();
        setInsights(data);
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ETB';
  };

  if (loading) {
    return (
      <section id="insights" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!insights) {
    return null;
  }

  const topDepartments = Object.entries(insights.by_department.mean)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const topCities = Object.entries(insights.top_paying_cities)
    .slice(0, 5);

  const educationLevels = Object.entries(insights.by_education.mean)
    .sort(([,a], [,b]) => b - a);

  return (
    <section id="insights" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            Market Insights
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Data-driven insights from the Ethiopian tech salary landscape
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Department Salaries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center mb-6">
              <ChartBarIcon className="w-6 h-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Average Salary by Department
              </h3>
            </div>
            
            <div className="space-y-4">
              {topDepartments.map(([dept, salary], index) => (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-primary-500' :
                      index === 1 ? 'bg-primary-400' :
                      index === 2 ? 'bg-primary-300' : 'bg-primary-200'
                    }`}></div>
                    <span className="font-medium text-gray-900">{dept}</span>
                  </div>
                  <span className="text-primary-600 font-semibold">
                    {formatCurrency(salary)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="w-6 h-6 text-ethiopia-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                Education Level Impact
              </h3>
            </div>
            
            <div className="space-y-4">
              {educationLevels.map(([level, salary], index) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-ethiopia-500' :
                      index === 1 ? 'bg-ethiopia-400' : 'bg-ethiopia-300'
                    }`}></div>
                    <span className="font-medium text-gray-900">{level}</span>
                  </div>
                  <span className="text-ethiopia-600 font-semibold">
                    {formatCurrency(salary)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Paying Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card mb-12"
        >
          <div className="flex items-center mb-6">
            <MapPinIcon className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              Top Paying Cities
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topCities.map(([city, salary], index) => (
              <div key={city} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  #{index + 1}
                </div>
                <div className="font-medium text-gray-900 mb-2">{city}</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(salary)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card text-center bg-gradient-to-br from-primary-50 to-white"
          >
            <TrendingUpIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {(insights.experience_correlation * 100).toFixed(0)}%
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              Experience Correlation
            </div>
            <div className="text-xs text-gray-600">
              Strong positive correlation between experience and salary
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card text-center bg-gradient-to-br from-ethiopia-50 to-white"
          >
            <ChartBarIcon className="w-8 h-8 text-ethiopia-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-ethiopia-600 mb-1">
              {formatCurrency(insights.salary_distribution.percentiles['75th'])}
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              75th Percentile
            </div>
            <div className="text-xs text-gray-600">
              Top 25% of professionals earn above this amount
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card text-center bg-gradient-to-br from-blue-50 to-white"
          >
            <MapPinIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(insights.salary_distribution.percentiles['90th'])}
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              90th Percentile
            </div>
            <div className="text-xs text-gray-600">
              Top 10% of professionals earn above this amount
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}