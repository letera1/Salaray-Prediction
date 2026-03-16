'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
      } catch (error) {
        console.error('Failed to load form data:', error);
        toast.error('Failed to load form options');
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
    reset();
    onReset();
  };

  const getExperienceLabel = (years: string) => {
    const num = parseFloat(years);
    if (isNaN(num)) return '';
    if (num === 0) return 'Entry Level';
    if (num < 2) return 'Junior Level';
    if (num < 5) return 'Mid Level';
    if (num < 8) return 'Senior Level';
    return 'Expert Level';
  };

  return (
    <div id="predict" className="card">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Experience */}
        <div>
          <label className="label">
            Years of Experience
            {watchedValues.experience && (
              <span className="ml-2 text-sm text-primary-600 font-medium">
                ({getExperienceLabel(watchedValues.experience)})
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            placeholder="e.g., 3.5"
            className={`input-field ${errors.experience ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('experience')}
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Include internships and part-time experience
          </p>
        </div>

        {/* Test Score */}
        <div>
          <label className="label">
            Technical Assessment Score
            {watchedValues.test_score && (
              <span className="ml-2 text-sm text-primary-600 font-medium">
                ({parseInt(watchedValues.test_score) >= 90 ? 'Excellent' : 
                  parseInt(watchedValues.test_score) >= 80 ? 'Very Good' :
                  parseInt(watchedValues.test_score) >= 70 ? 'Good' :
                  parseInt(watchedValues.test_score) >= 60 ? 'Fair' : 'Needs Improvement'})
              </span>
            )}
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 85"
            className={`input-field ${errors.test_score ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('test_score')}
          />
          {errors.test_score && (
            <p className="mt-1 text-sm text-red-600">{errors.test_score.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Score out of 100 (coding tests, technical interviews, etc.)
          </p>
        </div>

        {/* Department */}
        <div>
          <label className="label">Department</label>
          <select
            className={`input-field ${errors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('department')}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        {/* Education Level */}
        <div>
          <label className="label">Education Level</label>
          <select
            className={`input-field ${errors.education_level ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('education_level')}
          >
            <option value="">Select Education Level</option>
            {educationLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.education_level && (
            <p className="mt-1 text-sm text-red-600">{errors.education_level.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <select
            className={`input-field ${errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('location')}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Predicting...
              </div>
            ) : (
              'Predict My Salary'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary py-3 text-lg font-semibold"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}