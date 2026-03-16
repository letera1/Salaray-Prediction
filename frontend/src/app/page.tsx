'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import StatsSection from '@/components/StatsSection';
import InsightsSection from '@/components/InsightsSection';
import Footer from '@/components/Footer';
import { PredictionResult, DataStats } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial data stats
    const loadStats = async () => {
      try {
        const stats = await apiService.getStats();
        setDataStats(stats);
      } catch (error) {
        console.error('Failed to load stats:', error);
        toast.error('Failed to load dataset statistics');
      }
    };

    loadStats();
  }, []);

  const handlePrediction = async (formData: any) => {
    setIsLoading(true);
    try {
      const result = await apiService.predictSalary(formData);
      setPredictionResult(result);
      toast.success('Salary prediction generated successfully!');
    } catch (error) {
      console.error('Prediction failed:', error);
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prediction Form */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 font-display">
                  Get Your Salary Prediction
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Enter your details to get an accurate salary estimate based on real Ethiopian tech market data.
                </p>
              </div>
              
              <PredictionForm 
                onSubmit={handlePrediction}
                isLoading={isLoading}
                onReset={handleReset}
              />
            </div>

            {/* Results Display */}
            <div className="space-y-8">
              {predictionResult ? (
                <ResultsDisplay result={predictionResult} />
              ) : (
                <div className="card text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready for Your Prediction
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form to see your estimated salary based on our ML model trained on real Ethiopian data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {dataStats && <StatsSection stats={dataStats} />}

        {/* Insights Section */}
        <InsightsSection />
      </main>

      <Footer />
    </div>
  );
}