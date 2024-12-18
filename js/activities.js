document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
});

function loadActivities() {
    const user = JSON.parse(localStorage.getItem('user'));
    const activities = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userActivities = activities
        .filter(activity => activity.userId === user.email)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const tableBody = document.getElementById('activity-table-body');
    tableBody.innerHTML = '';

    userActivities.forEach(activity => {
        const row = document.createElement('tr');
        const date = new Date(activity.date);
        
        row.innerHTML = `
            <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
            <td>General Knowledge</td>
            <td>${activity.score}%</td>
            <td>${activity.timeTaken || 'N/A'}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(activity.score)}">
                    ${getStatusText(activity.score)}
                </span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getStatusBadgeClass(score) {
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-primary';
    if (score >= 50) return 'bg-warning';
    return 'bg-danger';
}

function getStatusText(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Needs Improvement';
} 