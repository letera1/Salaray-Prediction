'use client';

import { motion } from 'framer-motion';
import { DataStats } from '@/types';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  MapPinIcon, 
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

interface StatsSectionProps {
  stats: DataStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const formatCurrency = (amount: number, currency: 'ETB' | 'USD') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + (currency === 'ETB' ? ' ETB' : ' USD');
  };

  const statCards = [
    {
      icon: UsersIcon,
      title: 'Total Records',
      value: stats.total_records.toLocaleString(),
      subtitle: 'Tech professionals surveyed',
      color: 'blue',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Average Salary',
      value: formatCurrency(stats.salary_range_etb.mean, 'ETB'),
      subtitle: `≈ ${formatCurrency(stats.salary_range_usd.mean, 'USD')}`,
      color: 'green',
    },
    {
      icon: MapPinIcon,
      title: 'Cities Covered',
      value: stats.locations.length.toString(),
      subtitle: 'Major Ethiopian cities',
      color: 'purple',
    },
    {
      icon: AcademicCapIcon,
      title: 'Avg Experience',
      value: `${stats.average_experience} years`,
      subtitle: 'Professional experience',
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            Dataset Overview
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our machine learning model is trained on comprehensive data from the Ethiopian tech sector
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card text-center hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {stat.title}
              </div>
              <div className="text-sm text-gray-600">
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Salary Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card bg-gradient-to-r from-primary-50 to-ethiopia-50"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Salary Distribution
            </h3>
            <p className="text-gray-600">
              Range of salaries in our dataset
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(stats.salary_range_etb.min, 'ETB')}
              </div>
              <div className="text-sm text-gray-600">Minimum</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(stats.salary_range_etb.median, 'ETB')}
              </div>
              <div className="text-sm text-gray-600">Median</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(stats.salary_range_etb.mean, 'ETB')}
              </div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(stats.salary_range_etb.max, 'ETB')}
              </div>
              <div className="text-sm text-gray-600">Maximum</div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Departments ({stats.departments.length})
            </h4>
            <div className="space-y-2">
              {stats.departments.map((dept) => (
                <div
                  key={dept}
                  className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  {dept}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Education Levels ({stats.education_levels.length})
            </h4>
            <div className="space-y-2">
              {stats.education_levels.map((level) => (
                <div
                  key={level}
                  className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  {level}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="card"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Top Locations ({stats.locations.length})
            </h4>
            <div className="space-y-2">
              {stats.locations.slice(0, 6).map((location) => (
                <div
                  key={location}
                  className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  {location}
                </div>
              ))}
              {stats.locations.length > 6 && (
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-500 text-center">
                  +{stats.locations.length - 6} more cities
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}