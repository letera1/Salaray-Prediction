'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import StatsSection from '@/components/StatsSection';
import InsightsSection from '@/components/InsightsSection';
import SalaryComparison from '@/components/SalaryComparison';
import CareerPathSimulator from '@/components/CareerPathSimulator';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { PredictionResult, DataStats } from '@/types';
import { apiService } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Theme toggle
  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newDark = !prev;
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newDark;
    });
  };

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
      toast.success('Salary prediction generated successfully!', {
        icon: '🎯',
        duration: 3000,
      });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast.error('Failed to generate prediction. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Header onToggleTheme={toggleTheme} isDark={isDark} />

      <main>
        <Hero />

        {/* Prediction & Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prediction Form */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                  Get Your Salary Prediction
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
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
            <div id="results" className="space-y-8">
              {predictionResult ? (
                <ResultsDisplay result={predictionResult} />
              ) : (
                <div className="card-glass backdrop-blur-xl text-center py-16 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-ethiopia-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Ready for Your Prediction
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
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

        {/* Salary Comparison Tool */}
        <SalaryComparison />

        {/* Career Path Simulator */}
        <CareerPathSimulator />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
