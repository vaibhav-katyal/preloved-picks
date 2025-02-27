document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        updateUserUI(currentUser);
    }
}

function updateUserUI(user) {
    const loginButton = document.querySelector('.login-button');
    const userWelcome = document.querySelector('.user-welcome');
    const usernameElement = document.querySelector('.username');
    const avatarInitials = document.querySelector('.avatar-initials');

    if (loginButton && userWelcome && usernameElement && avatarInitials) {
        loginButton.classList.add('hidden');
        userWelcome.classList.remove('hidden');
        usernameElement.textContent = user.username;

        // Set avatar initials
        if (user.username) {
            const initials = getInitials(user.username);
            avatarInitials.textContent = initials;
        }
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}