'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import { SalaryInsights } from '@/types';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Color palettes
const COLORS = {
  primary: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  ethiopia: ['#f0770a', '#e15c00', '#ba4502', '#953608', '#792e0a'],
  blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  purple: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  gradient: ['#22c55e', '#16a34a', '#f0770a', '#e15c00', '#3b82f6'],
};

export default function InsightsSection() {
  const [insights, setInsights] = useState<SalaryInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'department' | 'education' | 'location'>('department');

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

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ETB';
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K ETB';
    }
    return amount + ' ETB';
  };

  if (loading) {
    return (
      <section id="insights" className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-dark-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-5 bg-gray-300 dark:bg-dark-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!insights) {
    return null;
  }

  // Prepare data for charts
  const departmentData = Object.entries(insights.by_department.mean)
    .map(([name, value]) => ({ name, value, count: insights.by_department.count[name] }))
    .sort((a, b) => b.value - a.value);

  const educationData = Object.entries(insights.by_education.mean)
    .map(([name, value]) => ({ name, value, count: insights.by_education.count[name] }))
    .sort((a, b) => b.value - a.value);

  const locationData = Object.entries(insights.top_paying_cities)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 8);

  const pieData = departmentData.slice(0, 5).map((item) => ({
    name: item.name,
    value: item.count,
  }));

  const topCities = Object.entries(insights.top_paying_cities)
    .slice(0, 5);

  const educationLevels = educationData;

  return (
    <section id="insights" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-4">
            <ChartBarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
              Market Intelligence
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Market <span className="text-gradient-primary">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Data-driven insights from the Ethiopian tech salary landscape
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white dark:bg-dark-800 p-1.5 rounded-2xl shadow-soft border border-gray-200 dark:border-dark-700">
            {[
              { id: 'department', label: 'By Department', icon: BriefcaseIcon },
              { id: 'education', label: 'By Education', icon: AcademicCapIcon },
              { id: 'location', label: 'By Location', icon: MapPinIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {activeTab === 'department' && 'Average Salary by Department'}
                    {activeTab === 'education' && 'Education Level Impact'}
                    {activeTab === 'location' && 'Average Salary by Location'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comparative analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    activeTab === 'department' ? departmentData :
                    activeTab === 'education' ? educationData :
                    locationData
                  }
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(value) => formatCurrencyShort(value)} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Average Salary']}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    barSize={32}
                  >
                    {(
                      activeTab === 'department' ? departmentData :
                      activeTab === 'education' ? educationData :
                      locationData
                    ).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          activeTab === 'department' ? COLORS.primary[index % COLORS.primary.length] :
                          activeTab === 'education' ? COLORS.ethiopia[index % COLORS.ethiopia.length] :
                          COLORS.blue[index % COLORS.blue.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-ethiopia-500 to-ethiopia-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ChartPieIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Distribution by Department
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Professional representation
                  </p>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Top Paying Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPinIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Top Paying Cities
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Highest average salaries by location
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topCities.map(([city, salary], index) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative p-6 rounded-2xl text-center overflow-hidden ${
                  index === 0
                    ? 'bg-gradient-to-br from-ethiopia-500 to-ethiopia-600 text-white shadow-xl shadow-ethiopia-500/30'
                    : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700'
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="text-2xl">🏆</span>
                  </div>
                )}
                <div className={`text-3xl font-bold mb-2 ${
                  index === 0 ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  #{index + 1}
                </div>
                <div className={`font-semibold mb-2 ${
                  index === 0 ? 'text-white/90' : 'text-gray-900 dark:text-white'
                }`}>
                  {city}
                </div>
                <div className={`text-sm ${
                  index === 0 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {formatCurrency(salary)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 12, scale: 1.1 }}
              >
                <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                {(insights.experience_correlation * 100).toFixed(0)}%
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Experience Correlation
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Strong positive correlation between experience and salary
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ethiopia-500 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-ethiopia-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 12, scale: 1.1 }}
              >
                <CurrencyDollarIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-3xl font-bold bg-gradient-to-r from-ethiopia-600 to-amber-500 bg-clip-text text-transparent mb-2">
                {formatCurrencyShort(insights.salary_distribution.percentiles['75th'])}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                75th Percentile
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Top 25% of professionals earn above this amount
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 12, scale: 1.1 }}
              >
                <ChartBarIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {formatCurrencyShort(insights.salary_distribution.percentiles['90th'])}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                90th Percentile
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Top 10% of professionals earn above this amount
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
