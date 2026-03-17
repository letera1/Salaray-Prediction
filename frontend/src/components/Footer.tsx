'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  CodeBracketIcon,
  ChartBarIcon,
  GlobeAltIcon,
  GithubIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { GithubIcon as GithubIconSolid } from '@heroicons/react/24/solid';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    project: [
      { name: 'About', href: '#about' },
      { name: 'Dataset', href: '/dataset' },
      { name: 'API Docs', href: 'http://localhost:8000/docs' },
      { name: 'GitHub', href: 'https://github.com/your-username/ethiopian-tech-salary-ml' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Model Info', href: '/model' },
      { name: 'Data Sources', href: '/sources' },
      { name: 'Research Paper', href: '/research' },
    ],
    community: [
      { name: 'Contribute', href: '/contribute' },
      { name: 'Issues', href: 'https://github.com/your-username/ethiopian-tech-salary-ml/issues' },
      { name: 'Discussions', href: 'https://github.com/your-username/ethiopian-tech-salary-ml/discussions' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  const features = [
    {
      icon: ChartBarIcon,
      title: 'ML-Powered',
      description: 'Advanced regression models',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: GlobeAltIcon,
      title: 'Real Data',
      description: 'Authentic Ethiopian market data',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CodeBracketIcon,
      title: 'Open Source',
      description: 'Transparent methodology',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/your-username/ethiopian-tech-salary-ml',
      icon: GithubIconSolid,
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      name: 'Email',
      href: 'mailto:support@ethiopiansalary.ml',
      icon: EnvelopeIcon,
      color: 'hover:text-primary-600',
    },
    {
      name: 'Location',
      href: '#',
      icon: MapPinIcon,
      color: 'hover:text-ethiopia-600',
    },
  ];

  return (
    <footer id="about" className="relative bg-gradient-to-b from-gray-900 to-dark-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ethiopia-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-ethiopia-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🇪🇹</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Ethiopian Salary ML</h3>
                <p className="text-sm text-gray-400">Tech Salary Predictor</p>
              </div>
            </motion.div>

            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              ML-powered salary prediction for Ethiopian technology professionals using
              real market data and advanced regression models. Built for the community,
              by the community.
            </p>

            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <HeartIcon className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>for the Ethiopian tech community</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 ${social.color}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
              Project
            </h4>
            <ul className="space-y-3">
              {links.project.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-ethiopia-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
              Community
            </h4>
            <ul className="space-y-3">
              {links.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-white">{feature.title}</h5>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-400 text-center lg:text-left">
              <p>
                © {currentYear} Ethiopian Tech Salary ML. Licensed under{' '}
                <Link href="/license" className="text-primary-400 hover:text-primary-300 transition-colors">
                  MIT License
                </Link>.
              </p>
              <p className="mt-1">
                Dataset compiled from Ethiopian universities, industry surveys, and government statistics.
              </p>
            </div>

            <div className="flex items-center space-x-6 flex-wrap justify-center">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Use
              </Link>
              <Link
                href="http://localhost:8000/docs"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                API
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700"
        >
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong className="text-gray-300">Disclaimer:</strong> Salary predictions are based on historical data and machine learning models.
            Actual salaries may vary based on company size, specific skills, negotiation, and current market conditions.
            This tool is intended for informational and educational purposes only. Always consult with industry professionals
            and conduct your own research when making career decisions.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
