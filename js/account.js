document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadQuizStatistics();
    loadRecentActivities();
});

function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
    }
}

function loadQuizStatistics() {
    const user = JSON.parse(localStorage.getItem('user'));
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = quizResults.filter(result => result.userId === user.email);
    
    // Calculate statistics
    const totalQuizzes = userResults.length;
    const averageScore = userResults.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes || 0;
    const bestScore = Math.max(...userResults.map(result => result.score), 0);
    
    // Update display
    document.getElementById('total-quizzes').textContent = totalQuizzes;
    document.getElementById('average-score').textContent = `${averageScore.toFixed(1)}%`;
    document.getElementById('best-score').textContent = `${bestScore.toFixed(1)}%`;
}

function loadRecentActivities() {
    const user = JSON.parse(localStorage.getItem('user'));
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = quizResults
        .filter(result => result.userId === user.email)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const activitiesContainer = document.getElementById('recent-activities');
    activitiesContainer.innerHTML = '';
    
    userResults.forEach(result => {
        const date = new Date(result.date).toLocaleDateString();
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">Quiz Completed</h6>
                    <small class="text-muted">${date}</small>
                </div>
                <span class="badge bg-primary rounded-pill">${result.score.toFixed(1)}%</span>
            </div>
        `;
        activitiesContainer.appendChild(item);
    });
} 