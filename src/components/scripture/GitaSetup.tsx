import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface GitaSetupProps {
    onComplete: (goal: number) => void;
    onSignIn: (goal: number) => void;
}

export function GitaSetup({ onComplete, onSignIn }: GitaSetupProps) {
    const { language } = useLanguage();
    const [selectedGoal, setSelectedGoal] = useState(1);

    const goals = [1, 2, 3, 5, 10, 20];

    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#5D4037] flex items-center justify-center gap-2">
                    <span className="text-3xl">📜</span>
                    {language === 'hindi' ? 'आपके दैनिक गीता श्लोक' : 'Your Daily Geeta Shlokas'}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {language === 'hindi'
                        ? 'ऐसी गति चुनें जो शांत, अर्थपूर्ण और अनुसरण करने में आसान लगे'
                        : 'Choose a pace that feels calm, meaningful, and easy to follow'}
                </p>
            </div>

            {/* Goal Selection */}
            <div className="text-left space-y-2">
                <label className="block text-gray-800 font-semibold">
                    {language === 'hindi' ? 'आप प्रतिदिन कितने श्लोक पढ़ना चाहेंगे?' : 'How many shlokas would you like per day?'}
                </label>
                <div className="relative">
                    <select
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(Number(e.target.value))}
                        className="w-full appearance-none bg-white border-2 border-gray-800 rounded-lg py-3 px-4 text-gray-800 font-medium focus:outline-none focus:border-orange-500 transition-colors"
                    >
                        {goals.map(g => (
                            <option key={g} value={g}>
                                {g} {language === 'hindi' ? 'श्लोक प्रतिदिन' : 'Shloka per day'}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-800">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Why Sign In Box */}
            <div className="bg-[#FFF8F0] rounded-xl p-5 text-left border-l-4 border-orange-400 space-y-3">
                <h3 className="font-bold text-[#4A3B32]">
                    {language === 'hindi' ? 'Google के साथ साइन इन क्यों करें?' : 'Why sign in with Google?'}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-black font-bold">✓</span>
                        {language === 'hindi' ? 'आपकी दैनिक श्लोक वरीयता सुरक्षित रूप से सहेजी जाएगी' : 'Your daily shloka preference will be saved securely'}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-black font-bold">✓</span>
                        {language === 'hindi' ? 'ट्रैक करें कि आपने कितने श्लोक पूरे किए हैं' : 'Track how many shlokas you’ve completed'}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-black font-bold">✓</span>
                        {language === 'hindi' ? 'प्रगति खोए बिना अपनी गति से सीखें' : 'Learn at your own pace without losing progress'}
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-black font-bold">✓</span>
                        {language === 'hindi' ? 'सभी उपकरणों पर सहज अनुभव' : 'Seamless experience across devices'}
                    </li>
                </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
                <button
                    onClick={() => onSignIn(selectedGoal)}
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform active:scale-95 text-lg"
                >
                    {language === 'hindi' ? 'Google के साथ साइन इन करें' : 'Sign in with Google'}
                </button>

                <button
                    onClick={() => onComplete(selectedGoal)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium underline decoration-gray-400 underline-offset-4"
                >
                    {language === 'hindi' ? 'अभी के लिए साइन इन छोड़ें' : 'Skip sign in for now'}
                </button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
                {language === 'hindi' ? 'आप इसे सेटिंग्स में कभी भी बदल सकते हैं' : 'You can change this anytime in Settings'}
            </p>
        </div>
    );
}
