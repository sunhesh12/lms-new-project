<?php

// database/seeders/QuizSeeder.php

namespace Database\Seeders;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        // JavaScript Fundamentals Quiz
        $jsQuiz = Quiz::create([
            'title' => 'JavaScript Fundamentals',
            'description' => 'Test your knowledge of JavaScript basics',
            'duration' => 1800, // 30 minutes
            'passing_score' => 70,
            'is_active' => true,
        ]);

        $jsQuestions = [
            [
                'question' => 'What is the correct syntax for referring to an external script?',
                'options' => [
                    '<script href="app.js">',
                    '<script name="app.js">',
                    '<script src="app.js">',
                    '<script file="app.js">'
                ],
                'correct_answer' => 2,
                'points' => 1,
                'order' => 1,
            ],
            [
                'question' => 'Which company developed JavaScript?',
                'options' => [
                    'Microsoft',
                    'Netscape',
                    'Oracle',
                    'IBM'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 2,
            ],
            [
                'question' => 'What does DOM stand for?',
                'options' => [
                    'Document Object Model',
                    'Data Object Model',
                    'Document Orientation Model',
                    'Digital Object Method'
                ],
                'correct_answer' => 0,
                'points' => 1,
                'order' => 3,
            ],
            [
                'question' => 'Which method is used to parse a string to an integer?',
                'options' => [
                    'parseInt()',
                    'parseInteger()',
                    'toInteger()',
                    'convertInt()'
                ],
                'correct_answer' => 0,
                'points' => 1,
                'order' => 4,
            ],
            [
                'question' => 'What is the output of: typeof null?',
                'options' => [
                    'null',
                    'undefined',
                    'object',
                    'number'
                ],
                'correct_answer' => 2,
                'points' => 1,
                'order' => 5,
            ],
        ];

        foreach ($jsQuestions as $questionData) {
            Question::create([
                'quiz_id' => $jsQuiz->id,
                ...$questionData
            ]);
        }

        // React Basics Quiz
        $reactQuiz = Quiz::create([
            'title' => 'React Basics',
            'description' => 'Evaluate your React knowledge',
            'duration' => 1200, // 20 minutes
            'passing_score' => 70,
            'is_active' => true,
        ]);

        $reactQuestions = [
            [
                'question' => 'What is JSX?',
                'options' => [
                    'JavaScript XML',
                    'Java Syntax Extension',
                    'JavaScript Extension',
                    'JSON XML'
                ],
                'correct_answer' => 0,
                'points' => 1,
                'order' => 1,
            ],
            [
                'question' => 'Which hook is used for side effects?',
                'options' => [
                    'useState',
                    'useEffect',
                    'useContext',
                    'useReducer'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 2,
            ],
            [
                'question' => 'What does the key prop do in React lists?',
                'options' => [
                    'Styles the element',
                    'Helps React identify which items have changed',
                    'Adds encryption',
                    'Creates a unique ID'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 3,
            ],
            [
                'question' => 'Which company created React?',
                'options' => [
                    'Google',
                    'Twitter',
                    'Facebook',
                    'Amazon'
                ],
                'correct_answer' => 2,
                'points' => 1,
                'order' => 4,
            ],
            [
                'question' => 'What is the virtual DOM?',
                'options' => [
                    'A lightweight copy of the actual DOM',
                    'A type of database',
                    'A CSS framework',
                    'A testing library'
                ],
                'correct_answer' => 0,
                'points' => 1,
                'order' => 5,
            ],
        ];

        foreach ($reactQuestions as $questionData) {
            Question::create([
                'quiz_id' => $reactQuiz->id,
                ...$questionData
            ]);
        }

        // PHP & Laravel Quiz
        $phpQuiz = Quiz::create([
            'title' => 'PHP & Laravel',
            'description' => 'Test your PHP and Laravel framework knowledge',
            'duration' => 1500, // 25 minutes
            'passing_score' => 65,
            'is_active' => true,
        ]);

        $phpQuestions = [
            [
                'question' => 'What does PHP stand for?',
                'options' => [
                    'Personal Home Page',
                    'PHP: Hypertext Preprocessor',
                    'Private Home Page',
                    'Public Hypertext Processor'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 1,
            ],
            [
                'question' => 'Which artisan command creates a new controller?',
                'options' => [
                    'php artisan controller:make',
                    'php artisan create:controller',
                    'php artisan make:controller',
                    'php artisan new:controller'
                ],
                'correct_answer' => 2,
                'points' => 1,
                'order' => 2,
            ],
            [
                'question' => 'What is Eloquent in Laravel?',
                'options' => [
                    'A template engine',
                    'An ORM (Object-Relational Mapping)',
                    'A routing system',
                    'A testing framework'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 3,
            ],
            [
                'question' => 'Which method is used to retrieve all records in Eloquent?',
                'options' => [
                    'get()',
                    'all()',
                    'fetch()',
                    'select()'
                ],
                'correct_answer' => 1,
                'points' => 1,
                'order' => 4,
            ],
            [
                'question' => 'What is the default port for Laravel development server?',
                'options' => [
                    '3000',
                    '8080',
                    '8000',
                    '5000'
                ],
                'correct_answer' => 2,
                'points' => 1,
                'order' => 5,
            ],
        ];

        foreach ($phpQuestions as $questionData) {
            Question::create([
                'quiz_id' => $phpQuiz->id,
                ...$questionData
            ]);
        }

        $this->command->info('Quizzes seeded successfully!');
    }
}
