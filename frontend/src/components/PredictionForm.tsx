'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import {
  SparklesIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const predictionSchema = z.object({
  experience: z.string().min(1, 'Experience is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 20,
    'Experience must be between 0 and 20 years'
  ),
  test_score: z.string().min(1, 'Test score is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
    'Test score must be between 0 and 100'
  ),
  department: z.string().min(1, 'Department is required'),
  education_level: z.string().min(1, 'Education level is required'),
  location: z.string().min(1, 'Location is required'),
});

type FormData = z.infer<typeof predictionSchema>;

interface PredictionFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onReset: () => void;
}

export default function PredictionForm({ onSubmit, isLoading, onReset }: PredictionFormProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      experience: '',
      test_score: '',
      department: '',
      education_level: '',
      location: 'Addis Ababa',
    },
  });

  const watchedValues = watch();

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
        setLoadingOptions(false);
      } catch (error) {
        console.error('Failed to load form data:', error);
        toast.error('Failed to load form options');
        setLoadingOptions(false);
      }
    };

    loadFormData();
  }, []);

  const onFormSubmit = (data: FormData) => {
    const formattedData = {
      experience: parseFloat(data.experience),
      test_score: parseInt(data.test_score),
      department: data.department,
      education_level: data.education_level,
      location: data.location,
    };

    onSubmit(formattedData);
  };

  const handleReset = () => {
    reset({
      experience: '',
      test_score: '',
      department: '',
      education_level: '',
      location: 'Addis Ababa',
    });
    onReset();
  };

  const getExperienceLevel = (years: string) => {
    const num = parseFloat(years);
    if (isNaN(num)) return { level: '', color: '' };
    if (num === 0) return { level: 'Entry Level', color: 'text-blue-500' };
    if (num < 2) return { level: 'Junior Level', color: 'text-green-500' };
    if (num < 5) return { level: 'Mid Level', color: 'text-yellow-500' };
    if (num < 8) return { level: 'Senior Level', color: 'text-orange-500' };
    return { level: 'Expert Level', color: 'text-red-500' };
  };

  const getTestScoreLevel = (score: string) => {
    const num = parseInt(score);
    if (isNaN(num)) return { level: '', stars: 0, color: '' };
    if (num >= 90) return { level: 'Excellent', stars: 5, color: 'text-green-500' };
    if (num >= 80) return { level: 'Very Good', stars: 4, color: 'text-blue-500' };
    if (num >= 70) return { level: 'Good', stars: 3, color: 'text-yellow-500' };
    if (num >= 60) return { level: 'Fair', stars: 2, color: 'text-orange-500' };
    return { level: 'Needs Improvement', stars: 1, color: 'text-red-500' };
  };

  const experienceInfo = getExperienceLevel(watchedValues.experience || '0');
  const testScoreInfo = getTestScoreLevel(watchedValues.test_score || '0');

  // Calculate progress
  const progress = [
    watchedValues.experience,
    watchedValues.test_score,
    watchedValues.department,
    watchedValues.education_level,
    watchedValues.location,
  ].filter(Boolean).length;
  const progressPercentage = (progress / 5) * 100;

  return (
    <motion.div
      id="predict"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-ethiopia-500 to-primary-500 rounded-3xl blur opacity-20 animate-gradient"></div>
      
      <div className="relative card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-ethiopia-500 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                Get Your Salary Prediction
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your details for an accurate estimate
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Form Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-ethiopia-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <label className="label flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="w-5 h-5 text-primary-500" />
                <span>Years of Experience</span>
              </div>
              <AnimatePresence>
                {watchedValues.experience && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-sm font-semibold ${experienceInfo.color}`}
                  >
                    {experienceInfo.level}
                  </motion.span>
                )}
              </AnimatePresence>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                placeholder="e.g., 3.5"
                className={`input-field pr-12 ${errors.experience ? 'input-field-error' : ''}`}
                {...register('experience')}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                years
              </div>
            </div>
            {/* Experience Slider */}
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={watchedValues.experience || 0}
              onChange={(e) => setValue('experience', e.target.value)}
              className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            {errors.experience && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center space-x-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span>{errors.experience.message}</span>
              </motion.p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Include internships and part-time experience
            </p>
          </motion.div>

          {/* Test Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label className="label flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-ethiopia-500" />
                <span>Technical Assessment Score</span>
              </div>
              <AnimatePresence>
                {watchedValues.test_score && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <span className={`text-sm font-semibold ${testScoreInfo.color}`}>
                      {testScoreInfo.level}
                    </span>
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`w-4 h-4 ${
                            i < testScoreInfo.stars
                              ? 'text-ethiopia-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 85"
                className={`input-field pr-12 ${errors.test_score ? 'input-field-error' : ''}`}
                {...register('test_score')}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                /100
              </div>
            </div>
            {/* Score Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={watchedValues.test_score || 0}
              onChange={(e) => setValue('test_score', e.target.value)}
              className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-ethiopia-500"
            />
            {errors.test_score && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center space-x-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span>{errors.test_score.message}</span>
              </motion.p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Score out of 100 (coding tests, technical interviews, etc.)
            </p>
          </motion.div>

          {/* Department */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label className="label flex items-center space-x-2">
              <BriefcaseIcon className="w-5 h-5 text-blue-500" />
              <span>Department</span>
            </label>
            {loadingOptions ? (
              <div className="skeleton h-11 w-full rounded-xl"></div>
            ) : (
              <select
                className={`input-field ${errors.department ? 'input-field-error' : ''}`}
                {...register('department')}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}
            {errors.department && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center space-x-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span>{errors.department.message}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Education Level */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="label flex items-center space-x-2">
              <AcademicCapIcon className="w-5 h-5 text-purple-500" />
              <span>Education Level</span>
            </label>
            {loadingOptions ? (
              <div className="skeleton h-11 w-full rounded-xl"></div>
            ) : (
              <select
                className={`input-field ${errors.education_level ? 'input-field-error' : ''}`}
                {...register('education_level')}
              >
                <option value="">Select Education Level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            )}
            {errors.education_level && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center space-x-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span>{errors.education_level.message}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="label flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-green-500" />
              <span>Location</span>
            </label>
            {loadingOptions ? (
              <div className="skeleton h-11 w-full rounded-xl"></div>
            ) : (
              <select
                className={`input-field ${errors.location ? 'input-field-error' : ''}`}
                {...register('location')}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            )}
            {errors.location && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 flex items-center space-x-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span>{errors.location.message}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Predict My Salary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary py-4 text-lg font-semibold"
            >
              Reset Form
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
