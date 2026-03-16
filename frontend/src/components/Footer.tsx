'use client';

import Link from 'next/link';
import { 
  HeartIcon,
  CodeBracketIcon,
  ChartBarIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    project: [
      { name: 'About', href: '#about' },
      { name: 'Dataset', href: '/dataset' },
      { name: 'API Docs', href: '/api/docs' },
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
    },
    {
      icon: GlobeAltIcon,
      title: 'Real Data',
      description: 'Authentic Ethiopian market data',
    },
    {
      icon: CodeBracketIcon,
      title: 'Open Source',
      description: 'Transparent methodology',
    },
  ];

  return (
    <footer id="about" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🇪🇹</span>
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">Ethiopian Salary ML</h3>
                <p className="text-xs text-gray-400">Tech Salary Predictor</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              ML-powered salary prediction for Ethiopian technology professionals using 
              real market data and advanced regression models.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500 mx-1" />
              <span>for the Ethiopian tech community</span>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Project
            </h4>
            <ul className="space-y-2">
              {links.project.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {links.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h5 className="font-medium text-white">{feature.title}</h5>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>
                © {currentYear} Ethiopian Tech Salary ML. Licensed under MIT License.
              </p>
              <p className="mt-1">
                Dataset compiled from Ethiopian universities, industry surveys, and government statistics.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
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
                href="/api/docs"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                API
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            <strong>Disclaimer:</strong> Salary predictions are based on historical data and machine learning models. 
            Actual salaries may vary based on company size, specific skills, negotiation, and current market conditions. 
            This tool is intended for informational and educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}