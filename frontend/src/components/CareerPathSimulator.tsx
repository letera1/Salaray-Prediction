'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import {
  TrendingUpIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CareerScenario {
  years: number;
  baseSalary: number;
  withMasters: number;
  withPhD: number;
  withExperience: number;
}

export default function CareerPathSimulator() {
  const [baseExperience, setBaseExperience] = useState(2);
  const [baseTestScore, setBaseTestScore] = useState(75);
  const [department, setDepartment] = useState('');
  const [education, setEducation] = useState('');
  const [location, setLocation] = useState('Addis Ababa');
  const [departments, setDepartments] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<CareerScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [depts, eduLevels, locs] = await Promise.all([
          apiService.getDepartments(),
          apiService.getEducationLevels(),
          apiService.getLocations(),
        ]);

        setDepartments(depts);
        setEducationLevels(eduLevels);
        setLocations(locs);

        if (depts.length > 0) setDepartment(depts[1] || depts[0]);
        if (eduLevels.length > 0) setEducation(eduLevels[0]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load form data:', error);
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  const calculateCareerPath = async () => {
    setCalculating(true);
    try {
      const results: CareerScenario[] = [];

      // Calculate for 0, 2, 5, 8, 10, 15, 20 years
      for (let years = 0; years <= 20; years += 2) {
        const [base, masters, phd, experience] = await Promise.all([
          // Base scenario (current education)
          apiService.predictSalary({
            experience: years,
            test_score: baseTestScore,
            department: department,
            education_level: education,
            location: location,
          }).then(r => r.predicted_salary_etb),

          // With Masters
          apiService.predictSalary({
            experience: years,
            test_score: baseTestScore + 5,
            department: department,
            education_level: 'Master',
            location: location,
          }).then(r => r.predicted_salary_etb),

          // With PhD
          apiService.predictSalary({
            experience: years,
            test_score: baseTestScore + 10,
            department: department,
            education_level: 'PhD',
            location: location,
          }).then(r => r.predicted_salary_etb),

          // With experience growth (higher test scores)
          apiService.predictSalary({
            experience: years,
            test_score: Math.min(100, baseTestScore + (years * 2)),
            department: department,
            education_level: education,
            location: location,
          }).then(r => r.predicted_salary_etb),
        ]);

        results.push({
          years,
          baseSalary: base,
          withMasters: masters,
          withPhD: phd,
          withExperience: experience,
        });
      }

      setScenarios(results);
    } catch (error) {
      console.error('Failed to calculate career path:', error);
    } finally {
      setCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K';
    }
    return amount.toString();
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ETB';
  };

  const chartData = scenarios.map(s => ({
    years: s.years,
    'Current Path': s.baseSalary / 1000,
    "With Master's": s.withMasters / 1000,
    "With PhD": s.withPhD / 1000,
    'Skill Growth': s.withExperience / 1000,
  }));

  const COLORS = {
    current: '#22c55e',
    masters: '#f0770a',
    phd: '#a855f7',
    skill: '#3b82f6',
  };

  // Calculate final differences
  const finalYear = scenarios[scenarios.length - 1];
  const growthPercent = finalYear
    ? ((finalYear.withExperience - finalYear.baseSalary) / finalYear.baseSalary * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-300 dark:bg-dark-700 rounded w-64 mx-auto"></div>
            <div className="h-96 bg-gray-300 dark:bg-dark-700 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
            <TrendingUpIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              Career Planning
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Career Path <span className="text-gradient-rainbow">Simulator</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Visualize your salary growth over time with different career choices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="card-glass backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <BriefcaseIcon className="w-5 h-5 text-primary-500" />
                <span>Your Profile</span>
              </h3>

              <div className="space-y-5">
                {/* Current Experience */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Current Experience (years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={baseExperience}
                    onChange={(e) => setBaseExperience(parseFloat(e.target.value) || 0)}
                    className="input-field"
                  />
                </div>

                {/* Test Score */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Current Test Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={baseTestScore}
                    onChange={(e) => setBaseTestScore(parseInt(e.target.value) || 0)}
                    className="input-field"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="input-field"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Current Education
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="input-field"
                  >
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculate Button */}
                <motion.button
                  onClick={calculateCareerPath}
                  disabled={calculating}
                  className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {calculating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Simulate Career</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Chart Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {scenarios.length > 0 ? (
              <div className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Salary Growth Projection
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    20-year career path simulation
                  </p>
                </div>

                {/* Chart */}
                <div className="h-96 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.current} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.current} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorMasters" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.masters} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.masters} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPhD" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.phd} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.phd} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSkill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.skill} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.skill} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="years"
                        stroke="#6b7280"
                        fontSize={12}
                        label={{ value: 'Years of Experience', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${value}K`}
                        label={{ value: 'Salary (ETB)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value: number) => [formatCurrencyFull(value * 1000), '']}
                        labelFormatter={(label) => `${label} Years Experience`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Current Path"
                        stroke={COLORS.current}
                        fillOpacity={1}
                        fill="url(#colorCurrent)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="With Master's"
                        stroke={COLORS.masters}
                        fillOpacity={1}
                        fill="url(#colorMasters)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="With PhD"
                        stroke={COLORS.phd}
                        fillOpacity={1}
                        fill="url(#colorPhD)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="Skill Growth"
                        stroke={COLORS.skill}
                        fillOpacity={1}
                        fill="url(#colorSkill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        With Skill Development
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{growthPercent}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Higher salary at 20 years
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <AcademicCapIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                        Master's Premium
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrencyFull(finalYear?.withMasters || 0)}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      At 20 years experience
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <AcademicCapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                        PhD Premium
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrencyFull(finalYear?.withPhD || 0)}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      At 20 years experience
                    </div>
                  </motion.div>
                </div>

                {/* Legend Explanation */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-900 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Path Explanations:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>Current Path:</strong> Your trajectory with current education level
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>With Master's:</strong> Additional degree impact
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>With PhD:</strong> Doctoral degree impact
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>Skill Growth:</strong> Continuous learning & test score improvement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-glass backdrop-blur-xl p-12 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUpIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Simulate Your Career
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Enter your current profile details and click "Simulate Career" to see your
                  salary growth projection over the next 20 years.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
