// Profile page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Load user data
  loadUserProfile()

  // Initialize profile form
  initProfileForm()
})

// Load user profile data
function loadUserProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (!currentUser) {
    // Redirect to home if not logged in
    window.location.href = "index.html"
    return
  }

  // Set profile header information
  document.querySelector(".profile-name").textContent = currentUser.username
  document.querySelector(".profile-email").textContent = currentUser.email

  // Set profile avatar initials
  const profileInitials = document.querySelector(".profile-initials")
  profileInitials.textContent = getInitials(currentUser.username)

  // Format and set join date
  const joinDate = new Date(currentUser.joinDate || Date.now())
  const formattedDate = joinDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
  document.querySelector(".join-date").textContent = formattedDate

  // Set form values
  document.getElementById("profileUsername").value = currentUser.username
  document.getElementById("profileEmail").value = currentUser.email
  document.getElementById("profileBio").value = currentUser.bio || ""
}

// Initialize profile form
function initProfileForm() {
  const accountForm = document.getElementById("accountForm")

  accountForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("profileUsername").value
    const email = document.getElementById("profileEmail").value
    const bio = document.getElementById("profileBio").value

    // Validate inputs
    if (!username || !email) {
      showNotification("Please fill in all required fields")
      return
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    // Check if email is already in use by another user
    const users = JSON.parse(localStorage.getItem("users")) || []
    const emailExists = users.some((u) => u.email === email && u.username !== currentUser.username)

    if (emailExists) {
      showNotification("Email is already in use")
      return
    }

    // Update user data
    currentUser.username = username
    currentUser.email = email
    currentUser.bio = bio

    // Update in local storage
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    // Update users array
    const updatedUsers = users.map((u) => {
      if (u.email === currentUser.email) {
        return currentUser
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update UI
    document.querySelector(".profile-name").textContent = username
    document.querySelector(".profile-email").textContent = email
    document.querySelector(".profile-initials").textContent = getInitials(username)

    // Update header avatar and username
    document.querySelector(".avatar-initials").textContent = getInitials(username)
    document.querySelector(".username").textContent = username

    // Show success notification
    showNotification("Profile updated successfully")
  })
}

// Get initials from username
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById("successNotification")
  const messageElement = notification.querySelector(".notification-message")

  messageElement.textContent = message
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

