import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, AlertCircle, Grid, Home } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import styles from './css/quiz-page.module.css';

const QuizPage = ({ initialQuizId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null); // Settings like can_attempt, user_attempts
  const [selectedQuiz, setSelectedQuiz] = useState(null); // The quiz with questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);

  const API_BASE_URL = '';
  const API_TOKEN = localStorage.getItem('auth_token');

  useEffect(() => {
    const init = async () => {
      await fetchQuizzes();
      if (initialQuizId) {
        const matchingQuiz = quizzes.find(q => q.id === initialQuizId);
        if (matchingQuiz) {
          startQuiz(matchingQuiz);
        } else {
          // If quizzes not loaded yet, wait or try fetching details directly
          const details = await fetchQuizDetails(initialQuizId);
          if (details && details.quiz) {
            startQuiz(details.quiz);
          }
        }
      }
    };
    init();
  }, [initialQuizId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizDetails = async (quizId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch quiz details');
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuiz && timeLeft !== null && timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedQuiz, timeLeft, quizCompleted]);

  const startQuiz = async (quiz) => {
    const data = await fetchQuizDetails(quiz.id);
    if (data && data.quiz) {
      if (!data.quiz.can_attempt) {
        setError("You have reached the maximum number of attempts for this quiz.");
        return;
      }
      setQuizInfo(data.quiz);
      setSelectedQuiz(data.questions); // In the new response, selectedQuiz is the questions array
      setTimeLeft(data.quiz.duration);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizCompleted(false);
      setScore(null);
      setStartedAt(new Date().toISOString());
    }
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizInfo.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        credentials: 'include',
        body: JSON.stringify({ answers, started_at: startedAt }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit quiz');
      }
      const result = await response.json();
      setScore({
        correct: result.correct,
        total: result.total_questions,
        percentage: result.percentage,
        passed: result.passed,
        attempt_id: result.attempt_id,
      });
      setQuizCompleted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.errorCard}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.primaryButton} onClick={() => { setError(null); fetchQuizzes(); setSelectedQuiz(null); }}>
            Go Back
          </button>
        </div>
      );
    }

    if (loading && !selectedQuiz) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading quizzes...</p>
        </div>
      );
    }

    if (quizCompleted) {
      return (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <Award size={48} color={score.passed ? "#10b981" : "#f59e0b"} />
            <h1 className={styles.resultTitle}>{score.passed ? "Congratulations!" : "Quiz Completed"}</h1>
          </div>
          <div className={styles.scoreDisplay}>
            <div className={`${styles.scoreCircle} ${score.passed ? styles.passedScore : styles.failedScore}`}>
              <span className={styles.scorePercentage}>{score.percentage}%</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.scoreItem}>
              <CheckCircle size={24} color="#10b981" />
              <span>Correct: {score.correct}</span>
            </div>
            <div className={styles.scoreItem}>
              <XCircle size={24} color="#ef4444" />
              <span>Incorrect: {score.total - score.correct}</span>
            </div>
          </div>
          <div className={styles.passStatus}>
            {score.passed ? (
              <span className={styles.passedBadge}>✓ Passed</span>
            ) : (
              <span className={styles.failedBadge}>✗ Not Passed</span>
            )}
          </div>
          <button
            className={styles.primaryButton}
            onClick={() => { setSelectedQuiz(null); setQuizCompleted(false); setScore(null); fetchQuizzes(); }}
          >
            Back to Quizzes
          </button>
        </div>
      );
    }

    if (selectedQuiz) {
      const question = selectedQuiz[currentQuestion];
      const progress = ((currentQuestion + 1) / selectedQuiz.length) * 100;
      const isLastQuestion = currentQuestion === selectedQuiz.length - 1;
      const hasAnsweredCurrent = answers[question.id] !== undefined;

      return (
        <div className={styles.quizLayout}>
          <div className={styles.quizCard}>
            <div className={styles.quizHeader}>
              <h2 className={styles.quizTitle}>{quizInfo.title}</h2>
              <div className={styles.timer}>
                <Clock size={20} />
                <span style={{ fontWeight: '600' }}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.questionInfo}>
              <span className={styles.questionCounter}>Question {currentQuestion + 1} of {selectedQuiz.length}</span>
              <span className={styles.answeredCount}>Answered: {Object.keys(answers).length}/{selectedQuiz.length}</span>
            </div>
            <div className={styles.questionText}>{question.question}</div>
            {question.image_url && (
              <div className={styles.imageContainer}>
                <img src={question.image_url} alt="Question" className={styles.questionImage} />
              </div>
            )}
            <div className={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${answers[question.id] === index ? styles.optionSelected : ''}`}
                  onClick={() => handleAnswer(question.id, index)}
                >
                  <div className={`${styles.optionRadio} ${answers[question.id] === index ? styles.optionRadioSelected : ''}`}>
                    {answers[question.id] === index && <div className={styles.optionRadioInner} />}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
            <div className={styles.navigationButtons}>
              <button
                className={`${styles.secondaryButton} ${currentQuestion === 0 ? styles.buttonDisabled : ''}`}
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {isLastQuestion ? (
                <button
                  className={`${styles.primaryButton} ${Object.keys(answers).length === 0 ? styles.buttonDisabled : ''}`}
                  onClick={handleSubmitQuiz}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button className={styles.primaryButton} onClick={nextQuestion}>Next</button>
              )}
            </div>
            {!hasAnsweredCurrent && (
              <div className={styles.warningText}>Please select an answer before moving to the next question</div>
            )}
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <Grid size={20} />
              <h3>Question Navigator</h3>
            </div>
            <div className={styles.navigatorGrid}>
              {selectedQuiz.map((q, index) => (
                <button
                  key={q.id}
                  className={`${styles.navButton} ${currentQuestion === index ? styles.navActive : ''} ${answers[q.id] !== undefined ? styles.navAnswered : ''}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className={styles.navigatorLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.navAnswered}`} />
                <span>Answered</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.navActive}`} />
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={styles.quizListHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.mainTitle}>Available Quizzes</h1>
            <p className={styles.subtitle}>Select a quiz to test your knowledge</p>
          </div>
          <Link href={route('dashboard')} className={styles.homeLink}>
            <Home size={18} />
            Back to Dashboard
          </Link>
        </div>
        {quizzes.length === 0 ? (
          <div className={styles.emptyState}><p>No quizzes available at the moment.</p></div>
        ) : (
          <div className={styles.quizGrid}>
            {quizzes.map(quiz => (
              <div key={quiz.id} className={styles.quizListCard}>
                <h3 className={styles.cardTitle}>{quiz.title}</h3>
                <p className={styles.cardDescription}>{quiz.description}</p>
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{Math.floor(quiz.duration / 60)} minutes</span>
                  </div>
                  <div className={styles.metaItem}><span>{quiz.questions_count} questions</span></div>
                </div>
                <button
                  className={styles.startButton}
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Quizzes" />
      <div className={styles.container}>
        {renderContent()}
      </div>
    </AuthenticatedLayout>
  );
};

export default QuizPage;