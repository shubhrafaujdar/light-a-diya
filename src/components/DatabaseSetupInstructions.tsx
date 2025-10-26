'use client';

import React from 'react';
import { Language } from '@/types';

interface DatabaseSetupInstructionsProps {
  language: Language;
}

export const DatabaseSetupInstructions: React.FC<DatabaseSetupInstructionsProps> = ({ language }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔧</div>
        <h2 className={`text-2xl font-bold text-spiritual-primary mb-4 ${
          language === 'hindi' ? 'devanagari' : ''
        }`}>
          {language === 'hindi' ? 'डेटाबेस सेटअप आवश्यक' : 'Database Setup Required'}
        </h2>
        <p className={`text-gray-600 ${language === 'hindi' ? 'devanagari' : ''}`}>
          {language === 'hindi' 
            ? 'आरती संग्रह देखने के लिए पहले डेटाबेस सेटअप करना आवश्यक है।'
            : 'The database needs to be set up before you can view the aarti collection.'
          }
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            {language === 'hindi' ? 'सेटअप निर्देश:' : 'Setup Instructions:'}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>
              {language === 'hindi' 
                ? 'अपने Supabase डैशबोर्ड पर जाएं'
                : 'Go to your Supabase dashboard'
              } 
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                (supabase.com/dashboard)
              </a>
            </li>
            <li>
              {language === 'hindi' 
                ? 'अपना प्रोजेक्ट चुनें'
                : 'Select your project'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'SQL Editor पर जाएं'
                : 'Navigate to the SQL Editor'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'supabase/setup.sql फ़ाइल की सामग्री कॉपी करें'
                : 'Copy the contents of supabase/setup.sql'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'स्क्रिप्ट को पेस्ट करके चलाएं'
                : 'Paste and execute the script'
              }
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            {language === 'hindi' ? 'सेटअप में शामिल:' : 'Setup Includes:'}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-green-700">
            <li>
              {language === 'hindi' 
                ? 'सभी डेटाबेस टेबल्स'
                : 'All database tables'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'इंडेक्स और कंस्ट्रेंट्स'
                : 'Indexes and constraints'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'सुरक्षा नीतियां'
                : 'Security policies'
              }
            </li>
            <li>
              {language === 'hindi' 
                ? 'प्रारंभिक देवता और आरती डेटा'
                : 'Initial deity and aarti data'
              }
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            {language === 'hindi' ? 'CLI तरीका (सुझावित):' : 'CLI Method (Recommended):'}
          </h3>
          <p className="text-yellow-700 mb-3">
            {language === 'hindi' 
              ? 'यदि आपके पास Supabase CLI है, तो आप टर्मिनल में यह कमांड चला सकते हैं:'
              : 'If you have Supabase CLI installed, you can run these commands in your terminal:'
            }
          </p>
          <div className="space-y-2">
            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
              # {language === 'hindi' ? 'स्थानीय विकास के लिए' : 'For local development'}<br/>
              supabase start<br/>
              supabase db reset
            </div>
            <div className="bg-gray-800 text-blue-400 p-3 rounded font-mono text-sm">
              # {language === 'hindi' ? 'रिमोट डेटाबेस के लिए' : 'For remote database'}<br/>
              supabase link --project-ref your-project-ref<br/>
              supabase db push
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            {language === 'hindi' ? 'त्वरित सेटअप:' : 'Quick Setup:'}
          </h3>
          <p className="text-green-700 mb-3">
            {language === 'hindi' 
              ? 'पूरा विकास वातावरण सेटअप करने के लिए:'
              : 'To set up the complete development environment:'
            }
          </p>
          <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
            ./scripts/setup-dev.sh
          </div>
        </div>

        <div className="text-center pt-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition"
          >
            {language === 'hindi' ? 'सेटअप के बाद रीफ्रेश करें' : 'Refresh After Setup'}
          </button>
        </div>
      </div>
    </div>
  );
};