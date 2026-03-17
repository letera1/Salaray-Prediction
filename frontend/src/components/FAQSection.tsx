'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon as PlusIconSolid } from '@heroicons/react/24/solid';

interface FAQItem {
  id: string;
  category: 'general' | 'accuracy' | 'career' | 'data';
  question: string;
  answer: string;
  icon: any;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'How accurate are the salary predictions?',
    answer: 'Our machine learning model achieves an R² score of 0.86 (86% accuracy), which means it can explain 86% of the variance in salaries. The model is trained on 200+ verified salary records from Ethiopian tech professionals. However, actual salaries may vary based on factors like company size, specific skills, negotiation abilities, and current market conditions.',
    icon: ChartBarIcon,
  },
  {
    id: '2',
    category: 'general',
    question: 'What data sources are used for training the model?',
    answer: 'Our dataset is compiled from multiple authoritative sources including Ethiopian universities, industry surveys, government statistics, and verified salary reports from tech companies. All data is anonymized and aggregated to protect individual privacy while maintaining statistical accuracy.',
    icon: GlobeAltIcon,
  },
  {
    id: '3',
    category: 'accuracy',
    question: 'What factors influence the salary prediction?',
    answer: 'The model considers four main factors: (1) Years of Experience - including internships and part-time work, (2) Technical Assessment Score - from coding tests and interviews, (3) Department - your area of specialization, and (4) Education Level - Bachelor\'s, Master\'s, or PhD. Location also plays a significant role, with Addis Ababa typically offering 25-30% higher salaries.',
    icon: BriefcaseIcon,
  },
  {
    id: '4',
    category: 'accuracy',
    question: 'How often is the model updated?',
    answer: 'We update our model quarterly to reflect current market conditions and incorporate new salary data. This ensures that predictions remain relevant and accurate as the Ethiopian tech job market evolves. Major updates are also released when significant economic changes occur.',
    icon: ShieldCheckIcon,
  },
  {
    id: '5',
    category: 'career',
    question: 'How can I increase my predicted salary?',
    answer: 'Based on our data analysis: (1) Gain more experience - each year adds approximately 60,000 ETB, (2) Improve technical skills - higher test scores correlate with 15-20% salary increases, (3) Pursue advanced education - Master\'s adds ~40% and PhD adds ~85% to base salary, (4) Consider relocating to Addis Ababa for higher-paying opportunities, (5) Specialize in high-demand departments like Data Science or Software Engineering.',
    icon: AcademicCapIcon,
  },
  {
    id: '6',
    category: 'career',
    question: 'Which tech department has the highest salaries?',
    answer: 'According to our latest data, Engineering roles have the highest average salary at 821,731 ETB, followed by Software (804,200 ETB), Data Science (673,750 ETB), and IT (638,600 ETB). However, Data Science roles are growing fastest and may offer better long-term prospects.',
    icon: CurrencyDollarIcon,
  },
  {
    id: '7',
    category: 'data',
    question: 'Is my prediction data stored or shared?',
    answer: 'No. All predictions are generated in real-time and are not stored on our servers. We don\'t track or share your personal information. The prediction form data is only used to generate your immediate result and is discarded afterward. Your privacy is our priority.',
    icon: ShieldCheckIcon,
  },
  {
    id: '8',
    category: 'data',
    question: 'Can I use this for salary negotiations?',
    answer: 'Yes! Our predictions provide a data-driven reference point for salary discussions. We recommend using the prediction along with the confidence interval range to understand the market rate for your profile. However, remember that individual negotiations, company budgets, and specific role requirements also significantly impact final offers.',
    icon: CurrencyDollarIcon,
  },
];

const categories = [
  { id: 'all', label: 'All Questions', icon: QuestionMarkCircleIcon },
  { id: 'general', label: 'General', icon: QuestionMarkCircleIcon },
  { id: 'accuracy', label: 'Accuracy', icon: ChartBarIcon },
  { id: 'career', label: 'Career', icon: BriefcaseIcon },
  { id: 'data', label: 'Data & Privacy', icon: ShieldCheckIcon },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1']));

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredFAQs = activeCategory === 'all'
    ? faqData
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
            <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Common Questions
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display mb-4">
            Frequently Asked <span className="text-gradient-primary">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about the salary prediction tool
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div
                  className={`card-glass backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                    openItems.has(faq.id)
                      ? 'border-primary-300 dark:border-primary-700 shadow-soft-lg'
                      : 'border-white/40 dark:border-dark-700/50'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        openItems.has(faq.id)
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                          : 'bg-gray-100 dark:bg-dark-800'
                      }`}>
                        <faq.icon className={`w-5 h-5 ${
                          openItems.has(faq.id)
                            ? 'text-white'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <span className={`font-semibold text-lg ${
                        openItems.has(faq.id)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openItems.has(faq.id) ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 ${
                        openItems.has(faq.id)
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'bg-gray-100 dark:bg-dark-800'
                      }`}
                    >
                      <PlusIconSolid className={`w-5 h-5 ${
                        openItems.has(faq.id)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="pl-14">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="card-glass backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-dark-700/50 shadow-soft-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're here to help. Reach out to us for any inquiries or support.
            </p>
            <motion.a
              href="mailto:support@ethiopiansalary.ml"
              className="btn-primary inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Contact Support</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
