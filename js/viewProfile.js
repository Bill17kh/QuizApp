document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const activities = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userActivities = activities.filter(activity => activity.userId === user.email);

    // Update profile image and name
    document.getElementById('profile-name').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;

    // Update detailed information
    document.getElementById('detail-username').textContent = user.username;
    document.getElementById('detail-email').textContent = user.email;
    document.getElementById('detail-joindate').textContent = new Date(user.joinDate || Date.now()).toLocaleDateString();
    document.getElementById('detail-quizzes').textContent = userActivities.length;

    // Handle edit profile button
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        // Implement edit profile functionality
        alert('Edit profile functionality coming soon!');
    });
} 