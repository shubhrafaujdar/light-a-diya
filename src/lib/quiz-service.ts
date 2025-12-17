
import { promises as fs } from 'fs';
import path from 'path';

export interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_answer_index: number;
    type?: string;
}

export class QuizService {
    private dataDir: string;

    constructor() {
        this.dataDir = path.join(process.cwd(), 'src', 'data', 'quiz');
    }

    async getQuestions(categorySlug: string): Promise<Question[]> {
        // Map slug to filename if needed, or assume slug matches filename
        // Basic sanitization
        const safeSlug = categorySlug.replace(/[^a-z0-9-]/gi, '');
        const filePath = path.join(this.dataDir, `${safeSlug}.json`);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent) as Question[];
        } catch (error) {
            console.error(`Failed to load quiz data for ${categorySlug}:`, error);
            return [];
        }
    }

    getRandomQuestions(allQuestions: Question[], count: number): Question[] {
        // Fisher-Yates shuffle
        const shuffled = [...allQuestions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, count);
    }
}

export const quizService = new QuizService();
