import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, AlertCircle } from 'lucide-react';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);

  // API Configuration - Updated to match Laravel routes
  const API_BASE_URL = '/api';
  const API_TOKEN = localStorage.getItem('auth_token');

  // Fetch all quizzes
  useEffect(() => {
    fetchQuizzes();
  }, []);

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
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific quiz with questions
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
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching quiz details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
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
    const quizDetails = await fetchQuizDetails(quiz.id);
    
    if (quizDetails) {
      setSelectedQuiz(quizDetails);
      setTimeLeft(quizDetails.duration);
      setCurrentQuestion(0);
      setAnswers({});
      setQuizCompleted(false);
      setScore(null);
      setStartedAt(new Date().toISOString());
    }
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
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
      setError(null);

      const response = await fetch(`${API_BASE_URL}/quizzes/${selectedQuiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          started_at: startedAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
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
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={styles.errorTitle}>Error</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            style={styles.primaryButton}
            onClick={() => {
              setError(null);
              if (!selectedQuiz) {
                fetchQuizzes();
              }
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading && !selectedQuiz) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <Award size={48} color={score.passed ? "#10b981" : "#f59e0b"} />
            <h1 style={styles.resultTitle}>
              {score.passed ? "Congratulations!" : "Quiz Completed"}
            </h1>
          </div>
          
          <div style={styles.scoreDisplay}>
            <div style={{
              ...styles.scoreCircle,
              background: score.passed 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            }}>
              <span style={styles.scorePercentage}>{score.percentage}%</span>
              <span style={styles.scoreLabel}>Score</span>
            </div>
          </div>

          <div style={styles.scoreDetails}>
            <div style={styles.scoreItem}>
              <CheckCircle size={24} color="#10b981" />
              <span>Correct: {score.correct}</span>
            </div>
            <div style={styles.scoreItem}>
              <XCircle size={24} color="#ef4444" />
              <span>Incorrect: {score.total - score.correct}</span>
            </div>
          </div>

          <div style={styles.passStatus}>
            {score.passed ? (
              <span style={styles.passedBadge}>✓ Passed</span>
            ) : (
              <span style={styles.failedBadge}>✗ Not Passed</span>
            )}
          </div>

          <button 
            style={styles.primaryButton}
            onClick={() => {
              setSelectedQuiz(null);
              setQuizCompleted(false);
              setScore(null);
              fetchQuizzes();
            }}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;
    const isLastQuestion = currentQuestion === selectedQuiz.questions.length - 1;
    const hasAnsweredCurrent = answers[question.id] !== undefined;

    return (
      <div style={styles.container}>
        <div style={styles.quizCard}>
          <div style={styles.quizHeader}>
            <h2 style={styles.quizTitle}>{selectedQuiz.title}</h2>
            <div style={styles.timer}>
              <Clock size={20} />
              <span style={{fontWeight: '600'}}>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>

          <div style={styles.questionInfo}>
            <span style={styles.questionCounter}>
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </span>
            <span style={styles.answeredCount}>
              Answered: {Object.keys(answers).length}/{selectedQuiz.questions.length}
            </span>
          </div>

          <div style={styles.questionText}>{question.question}</div>

          <div style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <div
                key={index}
                style={{
                  ...styles.option,
                  ...(answers[question.id] === index ? styles.optionSelected : {})
                }}
                onClick={() => handleAnswer(question.id, index)}
              >
                <div style={{
                  ...styles.optionRadio,
                  ...(answers[question.id] === index ? styles.optionRadioSelected : {})
                }}>
                  {answers[question.id] === index && <div style={styles.optionRadioInner} />}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>

          <div style={styles.navigationButtons}>
            <button
              style={{...styles.secondaryButton, ...(currentQuestion === 0 ? styles.buttonDisabled : {})}}
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                style={{
                  ...styles.primaryButton,
                  ...(Object.keys(answers).length === 0 ? styles.buttonDisabled : {})
                }}
                onClick={handleSubmitQuiz}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                style={styles.primaryButton}
                onClick={nextQuestion}
              >
                Next
              </button>
            )}
          </div>

          {!hasAnsweredCurrent && (
            <div style={styles.warningText}>
              Please select an answer before moving to the next question
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Available Quizzes</h1>
        <p style={styles.subtitle}>Select a quiz to test your knowledge</p>
      </div>

      {quizzes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No quizzes available at the moment.</p>
        </div>
      ) : (
        <div style={styles.quizGrid}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={styles.quizListCard}>
              <h3 style={styles.cardTitle}>{quiz.title}</h3>
              <p style={styles.cardDescription}>{quiz.description}</p>
              
              <div style={styles.cardMeta}>
                <div style={styles.metaItem}>
                  <Clock size={16} />
                  <span>{Math.floor(quiz.duration / 60)} minutes</span>
                </div>
                <div style={styles.metaItem}>
                  <span>{quiz.questions_count} questions</span>
                </div>
              </div>

              <button
                style={styles.startButton}
                onClick={() => startQuiz(quiz)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loading: {
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    maxWidth: '500px',
    margin: '100px auto',
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  errorTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '16px 0'
  },
  errorMessage: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  mainTitle: {
    color: 'white',
    fontSize: '42px',
    fontWeight: '700',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px',
    margin: 0
  },
  emptyState: {
    textAlign: 'center',
    color: 'white',
    fontSize: '18px',
    marginTop: '60px'
  },
  quizGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  quizListCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: '0 0 20px 0'
  },
  cardMeta: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#6b7280'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  startButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },
  quizCard: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  quizTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#fef3c7',
    borderRadius: '8px',
    color: '#92400e',
    fontSize: '18px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease'
  },
  questionInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '14px'
  },
  questionCounter: {
    color: '#6b7280',
    fontWeight: '500'
  },
  answeredCount: {
    color: '#667eea',
    fontWeight: '600'
  },
  questionText: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px'
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    color: '#374151'
  },
  optionSelected: {
    border: '2px solid #667eea',
    background: '#f0f4ff'
  },
  optionRadio: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease'
  },
  optionRadioSelected: {
    border: '2px solid #667eea'
  },
  optionRadioInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#667eea'
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  },
  primaryButton: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  },
  secondaryButton: {
    padding: '12px 32px',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  warningText: {
    textAlign: 'center',
    color: '#f59e0b',
    fontSize: '14px',
    marginTop: '16px',
    fontWeight: '500'
  },
  resultCard: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  resultHeader: {
    marginBottom: '32px'
  },
  resultTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '16px 0 0 0'
  },
  scoreDisplay: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px'
  },
  scoreCircle: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
  },
  scorePercentage: {
    fontSize: '48px',
    fontWeight: '700'
  },
  scoreLabel: {
    fontSize: '16px',
    marginTop: '8px'
  },
  scoreDetails: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '24px'
  },
  scoreItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '500',
    color: '#374151'
  },
  passStatus: {
    marginBottom: '24px'
  },
  passedBadge: {
    display: 'inline-block',
    padding: '8px 24px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600'
  },
  failedBadge: {
    display: 'inline-block',
    padding: '8px 24px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600'
  }
};

export default QuizPage;