'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/services/api';
import {
  ArrowRightLeftIcon,
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface ComparisonProfile {
  id: string;
  name: string;
  experience: number;
  test_score: number;
  department: string;
  education_level: string;
  location: string;
  predicted_salary?: number;
}

const COLORS = ['#22c55e', '#f0770a', '#3b82f6', '#a855f7', '#e11d48'];

export default function SalaryComparison() {
  const [profiles, setProfiles] = useState<ComparisonProfile[]>([
    {
      id: '1',
      name: 'Profile 1',
      experience: 3,
      test_score: 80,
      department: '',
      education_level: '',
      location: 'Addis Ababa',
    },
    {
      id: '2',
      name: 'Profile 2',
      experience: 5,
      test_score: 85,
      department: '',
      education_level: '',
      location: 'Addis Ababa',
    },
  ]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
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

        // Set default values
        if (depts.length > 0) {
          setProfiles(prev => prev.map((p, i) => ({
            ...p,
            department: i === 0 ? depts[0] : depts[1] || depts[0],
            education_level: eduLevels[0] || '',
          })));
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load form data:', error);
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  const updateProfile = (id: string, field: keyof ComparisonProfile, value: any) => {
    setProfiles(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addProfile = () => {
    if (profiles.length >= 4) return;
    const newProfile: ComparisonProfile = {
      id: Date.now().toString(),
      name: `Profile ${profiles.length + 1}`,
      experience: 3,
      test_score: 80,
      department: departments[0] || '',
      education_level: educationLevels[0] || '',
      location: 'Addis Ababa',
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const removeProfile = (id: string) => {
    if (profiles.length <= 2) return;
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const calculateComparisons = async () => {
    setCalculating(true);
    try {
      const predictions = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const result = await apiService.predictSalary({
              experience: profile.experience,
              test_score: profile.test_score,
              department: profile.department,
              education_level: profile.education_level,
              location: profile.location,
            });
            return { ...profile, predicted_salary: result.predicted_salary_etb };
          } catch (error) {
            console.error('Prediction failed for profile:', profile.name);
            return { ...profile, predicted_salary: 0 };
          }
        })
      );
      setProfiles(predictions);
    } catch (error) {
      console.error('Failed to calculate comparisons:', error);
    } finally {
      setCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ETB';
  };

  const chartData = profiles.map((p, i) => ({
    name: p.name,
    salary: p.predicted_salary || 0,
    fill: COLORS[i % COLORS.length],
  }));

  const maxSalary = Math.max(...profiles.map(p => p.predicted_salary || 0));
  const minSalary = Math.min(...profiles.map(p => p.predicted_salary || Infinity));
  const avgSalary = profiles.reduce((sum, p) => sum + (p.predicted_salary || 0), 0) / profiles.length;

  if (loading) {
    return (
      <section id="compare" className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-300 dark:bg-dark-700 rounded w-64 mx-auto"></div>
            <div className="h-64 bg-gray-300 dark:bg-dark-700 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="compare" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-ethiopia-100 dark:bg-ethiopia-900/30 px-4 py-2 rounded-full mb-4">
            <ArrowRightLeftIcon className="w-5 h-5 text-ethiopia-600 dark:text-ethiopia-400" />
            <span className="text-sm font-semibold text-ethiopia-700 dark:text-ethiopia-400">
              Compare & Analyze
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Salary <span className="text-gradient-ethiopia">Comparison Tool</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare multiple profiles side-by-side to understand salary differences
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AnimatePresence>
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div
                  className="absolute inset-0 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}, transparent)`,
                  }}
                />
                <div className="relative card-glass backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile(profile.id, 'name', e.target.value)}
                      className="bg-transparent text-lg font-bold text-gray-900 dark:text-white border-none focus:ring-0 p-0 w-full"
                      placeholder="Profile Name"
                    />
                    {profiles.length > 2 && (
                      <button
                        onClick={() => removeProfile(profile.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Experience */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mb-1">
                        <BriefcaseIcon className="w-3 h-3" />
                        <span>Experience (years)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.1"
                        value={profile.experience}
                        onChange={(e) => updateProfile(profile.id, 'experience', parseFloat(e.target.value) || 0)}
                        className="input-field py-2 text-sm"
                      />
                    </div>

                    {/* Test Score */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mb-1">
                        <StarIcon className="w-3 h-3" />
                        <span>Test Score</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={profile.test_score}
                        onChange={(e) => updateProfile(profile.id, 'test_score', parseInt(e.target.value) || 0)}
                        className="input-field py-2 text-sm"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mb-1">
                        <BriefcaseIcon className="w-3 h-3" />
                        <span>Department</span>
                      </label>
                      <select
                        value={profile.department}
                        onChange={(e) => updateProfile(profile.id, 'department', e.target.value)}
                        className="input-field py-2 text-sm"
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
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mb-1">
                        <AcademicCapIcon className="w-3 h-3" />
                        <span>Education</span>
                      </label>
                      <select
                        value={profile.education_level}
                        onChange={(e) => updateProfile(profile.id, 'education_level', e.target.value)}
                        className="input-field py-2 text-sm"
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
                      <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mb-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>Location</span>
                      </label>
                      <select
                        value={profile.location}
                        onChange={(e) => updateProfile(profile.id, 'location', e.target.value)}
                        className="input-field py-2 text-sm"
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Profile Button */}
          {profiles.length < 4 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addProfile}
              className="card-glass backdrop-blur-xl p-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-dark-700 flex flex-col items-center justify-center space-y-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
                <PlusIcon className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Add Profile
              </span>
            </motion.button>
          )}
        </div>

        {/* Calculate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.button
            onClick={calculateComparisons}
            disabled={calculating}
            className="btn-ethiopia px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {calculating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <ChartBarIcon className="w-6 h-6" />
                <span>Compare Salaries</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results Chart */}
        {profiles.some(p => p.predicted_salary) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Comparison Results
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visual comparison of predicted salaries
              </p>
            </div>

            {/* Bar Chart */}
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Predicted Salary']}
                  />
                  <Legend />
                  <Bar dataKey="salary" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-dark-900 rounded-2xl">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Salary</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(maxSalary)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lowest Salary</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(minSalary === Infinity ? 0 : minSalary)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Salary</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(avgSalary)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
