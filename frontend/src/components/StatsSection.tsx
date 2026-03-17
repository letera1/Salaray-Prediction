'use client';

import { motion } from 'framer-motion';
import { DataStats } from '@/types';
import {
  UsersIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
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
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Average Salary',
      value: formatCurrency(stats.salary_range_etb.mean, 'ETB'),
      subtitle: `≈ ${formatCurrency(stats.salary_range_usd.mean, 'USD')}`,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: MapPinIcon,
      title: 'Cities Covered',
      value: stats.locations.length.toString(),
      subtitle: 'Major Ethiopian cities',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: AcademicCapIcon,
      title: 'Avg Experience',
      value: `${stats.average_experience} years`,
      subtitle: 'Professional experience',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-dark-950 dark:to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Data Overview
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Dataset <span className="text-gradient-primary">Statistics</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our machine learning model is trained on comprehensive data from the Ethiopian tech sector
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
              
              <div className="relative card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg h-full">
                <div className={`${stat.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                </div>
                
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.title}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Salary Range Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg mb-12"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BriefcaseIcon className="w-6 h-6 text-primary-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Salary Distribution
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Range of salaries in our dataset
            </p>
          </div>

          {/* Visual Bar */}
          <div className="relative h-16 rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Markers */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-white/30"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white/30"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
          </div>

          {/* Labels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                {formatCurrency(stats.salary_range_etb.min, 'ETB')}
              </div>
              <div className="text-sm text-green-700 dark:text-green-400 font-medium">Minimum</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {formatCurrency(stats.salary_range_etb.median, 'ETB')}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Median</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {formatCurrency(stats.salary_range_etb.mean, 'ETB')}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-400 font-medium">Average</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {formatCurrency(stats.salary_range_etb.max, 'ETB')}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-400 font-medium">Maximum</div>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card-glass backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Departments ({stats.departments.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.departments.map((dept, index) => (
                <motion.span
                  key={dept}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-lg font-medium"
                >
                  {dept}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Education Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card-glass backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Education Levels ({stats.education_levels.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.education_levels.map((level, index) => (
                <motion.span
                  key={level}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-lg font-medium"
                >
                  {level}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="card-glass backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Locations ({stats.locations.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.locations.slice(0, 6).map((location, index) => (
                <motion.span
                  key={location}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm rounded-lg font-medium"
                >
                  {location}
                </motion.span>
              ))}
              {stats.locations.length > 6 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 text-sm rounded-lg font-medium"
                >
                  +{stats.locations.length - 6} more
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
