let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let answeredQuestions = 0;

// Fetch quiz questions from API
async function fetchQuizQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=15&type=multiple');
        const data = await response.json();
        
        questions = data.results.map(q => ({
            question: q.question,
            choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct: q.correct_answer
        }));
        
        loadQuestion();
        startTimer();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function loadQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').innerHTML = question.question;
    document.getElementById('question-number').textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn btn btn-outline-primary';
        button.innerHTML = choice;
        button.onclick = () => selectAnswer(choice);
        choicesContainer.appendChild(button);
    });

    // Reset timer
    timeLeft = 30;
    document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
    document.getElementById('time-progress').style.width = '100%';
}

function selectAnswer(choice) {
    clearInterval(timer);
    answeredQuestions++;
    const buttons = document.getElementsByClassName('choice-btn');
    const question = questions[currentQuestion];
    
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        if (button.innerHTML === question.correct) {
            button.classList.add('btn-success');
        } else if (button.innerHTML === choice && choice !== question.correct) {
            button.classList.add('btn-danger');
        }
    });

    if (choice === question.correct) {
        score++;
    }

    document.getElementById('next-btn').style.display = 'inline-block';
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    
    timer = setInterval(() => {
        timeLeft--;
        const progressBar = document.getElementById('time-progress');
        const timerDisplay = document.getElementById('timer');
        
        progressBar.style.width = `${(timeLeft/30) * 100}%`;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 10) {
            progressBar.classList.add('bg-danger');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    answeredQuestions++;
    const buttons = document.getElementsByClassName('choice-btn');
    const question = questions[currentQuestion];
    
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        if (button.innerHTML === question.correct) {
            button.classList.add('btn-success');
        }
    });

    // Score remains unchanged (wrong answer)
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
        startTimer();
        document.getElementById('next-btn').style.display = 'none';
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const totalQuestions = questions.length;
    const scoreOutOf100 = Math.round((score / totalQuestions) * 100);
    const scoreDisplay = `${score}/${totalQuestions} (${scoreOutOf100}/100)`;
    
    saveQuizResult(scoreOutOf100);
    
    const modalHTML = `
        <div class="modal fade" id="quizCompleteModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Quiz Complete!</h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="score-circle mb-4">
                            <span class="score-number">${scoreOutOf100}</span>
                            <span class="score-percent">/100</span>
                        </div>
                        <h4 class="mb-3">${getScoreMessage(scoreOutOf100)}</h4>
                        <div class="score-details">
                            <p>Correct Answers: ${scoreDisplay}</p>
                            <p>Questions Answered: ${answeredQuestions}/${totalQuestions}</p>
                            <p>Unanswered Questions: ${totalQuestions - answeredQuestions}</p>
                        </div>
                        <div class="mt-4">
                            <a href="Quiz.html" class="btn btn-primary me-2">Try Again</a>
                            <a href="Home.html" class="btn btn-outline-primary">Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('quizCompleteModal'));
    modal.show();
}

function getScoreMessage(percentage) {
    if (percentage >= 90) return "Outstanding! You're a genius! 🏆";
    if (percentage >= 80) return "Excellent work! Keep it up! 🌟";
    if (percentage >= 70) return "Good job! You're getting better! 👏";
    if (percentage >= 60) return "Not bad! Room for improvement! 💪";
    return "Keep practicing! You can do better! 📚";
}

function saveQuizResult(percentage) {
    const user = JSON.parse(localStorage.getItem('user'));
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    quizResults.push({
        userId: user.email,
        score: percentage,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchQuizQuestions();
    
    // Next button handler
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
}); 