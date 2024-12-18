// Quiz questions will be fetched from API
let questions = [];
let currentQuestion = 0;
let score = 0;

// Fetch quiz questions from API
async function fetchQuizQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=15&type=multiple');
        const data = await response.json();
        
        questions = data.results.map(q => ({
            question: q.question,
            choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
                .findIndex(answer => answer === q.correct_answer)
        }));
        
        if (document.getElementById('question')) {
            loadQuestion();
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Load question function
function loadQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').innerHTML = question.question;
    document.getElementById('question-number').textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    
    const choices = document.getElementsByClassName('choice-btn');
    for (let i = 0; i < choices.length; i++) {
        choices[i].innerHTML = question.choices[i];
        choices[i].onclick = () => checkAnswer(i);
    }
}

// Check answer function
function checkAnswer(choice) {
    const question = questions[currentQuestion];
    const isCorrect = choice === question.correct;
    
    // Save activity
    saveActivity(question.question, question.choices[choice], isCorrect);
    
    if (isCorrect) {
        score++;
    }
    
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// Save activity function
function saveActivity(question, answer, isCorrect) {
    const user = JSON.parse(localStorage.getItem('user'));
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    activities.push({
        userId: user.email,
        question: question,
        answer: answer,
        isCorrect: isCorrect,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Finish quiz function
function finishQuiz() {
    const percentage = (score / questions.length) * 100;
    localStorage.setItem('lastQuizScore', percentage);
    window.location.href = `Score.html?score=${score}&total=${questions.length}&percentage=${percentage}`;
}

// Update navbar to include account button
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav-links');
    
    if (navbar && user) {
        const accountButton = document.createElement('div');
        accountButton.className = 'dropdown';
        accountButton.innerHTML = `
            <button class="btn btn-link dropdown-toggle" type="button" id="accountDropdown" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                Account
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                <li><a class="dropdown-item" href="#" id="viewProfile">View Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            </ul>
        `;
        
        navbar.appendChild(accountButton);
        
        // Handle profile view
        document.getElementById('viewProfile').addEventListener('click', showProfile);
    }
}

// Show profile modal
function showProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const userActivities = activities.filter(a => a.userId === user.email);
    
    const totalQuizzes = new Set(userActivities.map(a => a.date)).size;
    const correctAnswers = userActivities.filter(a => a.isCorrect).length;
    const totalQuestions = userActivities.length;
    
    const modalHTML = `
        <div class="modal fade" id="profileModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Profile Information</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                                 alt="Profile" class="rounded-circle" width="100">
                        </div>
                        <div class="user-info">
                            <p><strong>Username:</strong> ${user.username}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <hr>
                            <h6>Statistics</h6>
                            <p><strong>Total Quizzes Taken:</strong> ${totalQuizzes}</p>
                            <p><strong>Correct Answers:</strong> ${correctAnswers}/${totalQuestions}</p>
                            <p><strong>Success Rate:</strong> ${((correctAnswers/totalQuestions) * 100 || 0).toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if it doesn't exist
    if (!document.getElementById('profileModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Show modal
    const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
    profileModal.show();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchQuizQuestions();
    updateNavbar();
    
    // Handle existing form submissions and other functionality...
    // (keep existing event listeners and functions)
});

// Handle sign up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Store user data (in real app, this would be sent to a server)
        localStorage.setItem('user', JSON.stringify({ username, email, password }));
        window.location.href = 'SignIn.html';
    });
}

// Handle sign in
const signinForm = document.getElementById('signinForm');
if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple authentication (in real app, this would verify with a server)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email === email && user.password === password) {
            window.location.href = 'Home.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Handle score display
const finalScore = document.getElementById('final-score');
if (finalScore) {
    const urlParams = new URLSearchParams(window.location.search);
    finalScore.textContent = urlParams.get('score') || 0;
}

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'SignIn.html';
    });
}
