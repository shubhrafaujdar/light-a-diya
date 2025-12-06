
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizDisplay } from './QuizDisplay'
import { QuizSession } from '@/types/database'
import '@testing-library/jest-dom'

// Mock LanguageContext
const mockUseLanguage = jest.fn()
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => mockUseLanguage()
}))

describe('QuizDisplay Component', () => {
    const mockSession: QuizSession = {
        categoryId: 'cat-1',
        categoryName: { hindi: 'Cat Hindi', english: 'Cat English' },
        questions: [{
            id: 'q1',
            category_id: 'cat-1',
            question_text_hindi: 'प्रश्न 1',
            question_text_english: 'Question 1',
            options: {
                hindi: ['विकल्प 1', 'विकल्प 2', 'विकल्प 3', 'विकल्प 4'],
                english: ['Option A', 'Option B', 'Option C', 'Option D']
            },
            correct_answer_index: 0,
            display_order: 1,
            is_active: true,
            created_at: '',
            updated_at: '',
            difficulty_level: 'easy'
        }],
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswerCorrect: null,
        completedQuestions: 0
    }

    const defaultHandlers = {
        selectAnswer: jest.fn(),
        nextQuestion: jest.fn()
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseLanguage.mockReturnValue({ language: 'english' })
    })

    it('renders question and options in English', () => {
        render(<QuizDisplay session={mockSession} {...defaultHandlers} />)

        expect(screen.getByText('Question 1')).toBeInTheDocument()
        expect(screen.getByText('Option A')).toBeInTheDocument()
        expect(screen.getByText('Option B')).toBeInTheDocument()
        expect(screen.getByText('Option C')).toBeInTheDocument()
        expect(screen.getByText('Option D')).toBeInTheDocument()
        expect(screen.getByText('Cat English')).toBeInTheDocument()
    })

    it('renders question and options in Hindi', () => {
        mockUseLanguage.mockReturnValue({ language: 'hindi' })
        render(<QuizDisplay session={mockSession} {...defaultHandlers} />)

        expect(screen.getByText('प्रश्न 1')).toBeInTheDocument()
        expect(screen.getByText('विकल्प 1')).toBeInTheDocument()
        expect(screen.getByText('Cat Hindi')).toBeInTheDocument()
    })

    it('calls selectAnswer when option is clicked', () => {
        render(<QuizDisplay session={mockSession} {...defaultHandlers} />)

        fireEvent.click(screen.getByText('Option B'))
        expect(defaultHandlers.selectAnswer).toHaveBeenCalledWith(1) // Index 1 for Option B
    })

    it('shows incorrect feedback when answer is wrong', () => {
        const wrongSession = {
            ...mockSession,
            selectedAnswer: 1,
            isAnswerCorrect: false
        }

        render(<QuizDisplay session={wrongSession} {...defaultHandlers} />)

        expect(screen.getByText(/Incorrect/i)).toBeInTheDocument()
        // Buttons should not be disabled (user can try again per requirements)
        // But the wrong one specifically might be visually indicated.
        // next button should NOT be visible
        expect(screen.queryByText(/Next Question/i)).not.toBeInTheDocument()
    })

    it('shows correct feedback and next button when answer is correct', () => {
        const correctSession = {
            ...mockSession,
            selectedAnswer: 0,
            isAnswerCorrect: true
        }

        render(<QuizDisplay session={correctSession} {...defaultHandlers} />)

        expect(screen.getByText(/Correct answer/i)).toBeInTheDocument()
        const nextBtn = screen.getByRole('button', { name: /Next Question/i })
        expect(nextBtn).toBeInTheDocument()

        fireEvent.click(nextBtn)
        expect(defaultHandlers.nextQuestion).toHaveBeenCalled()
    })

    it('shows progress bar with correct value', () => {
        const progressSession = {
            ...mockSession,
            questions: [
                ...mockSession.questions,
                { ...mockSession.questions[0], id: 'q2' } // Add 2nd question (total 2)
            ],
            currentQuestionIndex: 1 // 2nd question of 2
        }

        render(<QuizDisplay session={progressSession} {...defaultHandlers} />)

        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
        expect(progressBar).toHaveAttribute('aria-valuenow', '100')
        expect(progressBar).toHaveAttribute('aria-valuemin', '0')
        expect(progressBar).toHaveAttribute('aria-valuemax', '100')

        // Also check if text is correct
        expect(screen.getByText('Question 2 / 2')).toBeInTheDocument()
    })
})
