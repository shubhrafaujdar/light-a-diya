
"use client";

import React from 'react';
import { QuizSession } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { QuizTimer } from './QuizTimer';

interface QuizDisplayProps {
    session: QuizSession;
    selectAnswer: (index: number) => void;
    nextQuestion: () => void;
    isAnonymous?: boolean;
    questionsRemaining?: number | null;
    timerSeconds?: number | null;
    onTimerExpire?: () => void;
    onStopTimer?: () => void;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
    session,
    selectAnswer,
    nextQuestion,
    isAnonymous = false,
    questionsRemaining = null,
    timerSeconds = null,
    onTimerExpire,
    onStopTimer,
}) => {
    const { language } = useLanguage();

    if (!session || !session.questions || session.questions.length === 0) {
        return null;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const questionNumber = session.currentQuestionIndex + 1;
    const totalQuestions = session.questions.length;

    // Get content based on language
    const questionText = language === 'hindi'
        ? currentQuestion.question_text_hindi
        : currentQuestion.question_text_english;

    const options = language === 'hindi'
        ? currentQuestion.options.hindi
        : currentQuestion.options.english;

    const isCorrect = session.isAnswerCorrect === true;
    const isIncorrect = session.isAnswerCorrect === false;

    // Display question counter with limit for anonymous users
    const getQuestionCounter = () => {
        if (isAnonymous && questionsRemaining !== null) {
            const answered = session.completedQuestions;
            const limit = 10;
            return `${language === 'hindi' ? 'प्रश्न' : 'Question'} ${answered + 1}/${limit}`;
        }
        return `Question ${questionNumber} / ${totalQuestions}`;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100/50 spiritual-transition">

            {/* Progress Header */}
            <div className="mb-6">
                <div className="flex flex-wrap justify-between items-end mb-2 text-sm font-medium text-gray-500 gap-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-700 font-bold bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                            {getQuestionCounter()}
                        </span>

                        {/* Integrated Timer - Badge Style */}
                        {isAnonymous && timerSeconds !== null && onTimerExpire && onStopTimer && (
                            <QuizTimer
                                categoryName={language === 'hindi' ? session.categoryName.hindi : session.categoryName.english}
                                remainingSeconds={timerSeconds}
                                onTimerExpire={onTimerExpire}
                                onStopTimer={onStopTimer}
                            />
                        )}
                    </div>

                    <span className="text-gray-400 font-serif italic">
                        {language === 'hindi' ? session.categoryName.hindi : session.categoryName.english}
                    </span>
                </div>

                {/* Visual Progress Bar (Only one now!) */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={Math.round((questionNumber / totalQuestions) * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 ease-out"
                        style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <h2 className={`text-xl md:text-2xl font-bold mb-8 text-gray-800 leading-relaxed ${language === 'hindi' ? 'heading-font' : ''}`}>
                <span className="mr-2 text-orange-600">{questionNumber}.</span>
                {questionText}
            </h2>

            {/* Options Grid */}
            <div className="grid gap-4 mb-8">
                {options.map((option, index) => {
                    let buttonStyle = "border-gray-200 hover:border-orange-300 hover:bg-orange-50";

                    // Style based on selection status
                    if (session.selectedAnswer === index) {
                        if (isCorrect) {
                            buttonStyle = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                        } else if (isIncorrect) {
                            buttonStyle = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
                        }
                    } else if (isCorrect && index === currentQuestion.correct_answer_index) {
                        // Optional: highlight correct answer if they got it right (effectively same as above since selected is correct)
                        // or if we wanted to reveal it on wrong answer (requirements say 'try again', so maybe not)
                        buttonStyle = "border-green-500 bg-green-50 text-green-800";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => selectAnswer(index)}
                            disabled={isCorrect} // Disable all if correct answer found (waiting for next)
                            className={`
                w-full p-4 text-left border-2 rounded-lg transition-all duration-200
                flex items-center group
                ${buttonStyle}
                ${isCorrect ? 'cursor-default' : 'cursor-pointer'}
              `}
                            aria-label={`Option ${index + 1}: ${option}`}
                            aria-pressed={session.selectedAnswer === index}
                        >
                            <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 font-bold text-sm
                transition-colors
                ${session.selectedAnswer === index
                                    ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white')
                                    : 'border-gray-300 text-gray-500 group-hover:border-orange-400 group-hover:text-orange-600'}
              `}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className={`text-lg ${language === 'hindi' ? 'devanagari' : ''}`}>
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Feedback & Navigation */}
            <div className="min-h-[80px] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                {isCorrect && (
                    <div className="w-full bg-green-100 border border-green-200 rounded-lg p-4 mb-4 flex justify-between items-center text-green-800">
                        <span className="font-medium flex items-center">
                            <span className="text-xl mr-2">✨</span>
                            {language === 'hindi' ? 'बहुत अच्छा! सही उत्तर।' : 'Excellent! Correct answer.'}
                        </span>
                        <button
                            onClick={nextQuestion}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center"
                        >
                            {language === 'hindi' ? 'अगला प्रश्न' : 'Next Question'}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {isIncorrect && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-center animate-shake">
                        <p className="font-medium">
                            {language === 'hindi' ? 'गलत उत्तर, पुनः प्रयास करें।' : 'Incorrect. Try again!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
