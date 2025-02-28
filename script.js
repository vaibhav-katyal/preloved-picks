// Main JavaScript file

document.addEventListener("DOMContentLoaded", () => {
  // Initialize any interactive elements
  initializeUI()

  // Check if user is logged in
  checkLoginStatus()

  // Initialize auth functionality
  initializeAuth()

  // Initialize cart functionality
  initializeCart()

  // Initialize wishlist functionality
  initializeWishlist()

  // Update cart count on page load
  updateCartCount(getCart().length)
})

function initializeUI() {
  // Add event listeners for buttons
  const sellButton = document.querySelector(".sell-button")
  const loginButton = document.querySelector(".login-button")
  const getStartedButton = document.querySelector(".get-started-button")
  const menuButton = document.querySelector(".menu-button")

  if (sellButton) {
    sellButton.addEventListener("click", () => {
      console.log("Sell button clicked")
      // Add sell functionality here
    })
  }

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      openAuthModal()
    })
  }

  if (getStartedButton) {
    getStartedButton.addEventListener("click", () => {
      console.log("Get started button clicked")
      // Add get started functionality here
    })
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      console.log("Menu button clicked")
      // Add menu toggle functionality here
    })
  }

  // Add hover effects for cards
  const categoryCards = document.querySelectorAll(".category-card")
  const productCards = document.querySelectorAll(".product-card")

  categoryCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none"
    })
  })

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none"
    })
  })
}

// Authentication functionality
function initializeAuth() {
  const authModal = document.getElementById("authModal")
  if (!authModal) return;
  
  const closeModalBtn = document.querySelector(".close-modal")
  const authTabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const logoutButton = document.querySelector(".logout-button")

  // Close modal when clicking the close button
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      authModal.style.display = "none"
    })
  }

  // Close modal when clicking outside the modal content
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) {
      authModal.style.display = "none"
    }
  })

  // Tab switching functionality
  authTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      authTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Show the corresponding form
      const tabName = this.getAttribute("data-tab")
      document.querySelectorAll(".auth-form").forEach((form) => {
        form.classList.remove("active")
      })

      if (tabName === "login") {
        loginForm.classList.add("active")
      } else {
        signupForm.classList.add("active")
      }
    })
  })

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value
      const errorElement = document.getElementById("loginError")

      if (!email || !password) {
        errorElement.textContent = "Please fill in all fields"
        return
      }

      try {
        // For demo purposes, we'll simulate a successful login
        // In a real app, you would make an API call to your backend
        const mockUser = {
          id: "user123",
          username: email.split('@')[0],
          email: email
        };
        
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
        updateUserUI(mockUser);
        authModal.style.display = "none";
        loginForm.reset();
        errorElement.textContent = "";
        showNotification("Successfully logged in");
        
      } catch (error) {
        console.error("Login Error:", error)
      }
    })
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const username = document.getElementById("signupUsername").value.trim()
      const email = document.getElementById("signupEmail").value.trim()
      const password = document.getElementById("signupPassword").value
      const confirmPassword = document.getElementById("signupConfirmPassword").value
      const errorElement = document.getElementById("signupError")

      errorElement.textContent = "" // Clear previous errors

      // Basic validation
      if (!username || !email || !password || !confirmPassword) {
        errorElement.textContent = "Please fill in all fields"
        return
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
        errorElement.textContent = "Please enter a valid email address"
        return
      }

      // Password strength check (min 6 characters)
      if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters long"
        return
      }

      if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match"
        return
      }

      try {
        // Disable form during submission
        const submitButton = document.querySelector('#signupForm button[type="submit"]')
        submitButton.disabled = true
        submitButton.textContent = "Creating Account..."

        // For demo purposes, we'll simulate a successful signup
        // In a real app, you would make an API call to your backend
        
        setTimeout(() => {
          // Create a mock user
          const mockUser = {
            id: "user" + Date.now(),
            username: username,
            email: email
          };
          
          localStorage.setItem("currentUser", JSON.stringify(mockUser));
          updateUserUI(mockUser);
          authModal.style.display = "none";
          signupForm.reset();
          errorElement.textContent = "";
          showNotification("Account created successfully!");
          
          // Re-enable form button
          submitButton.disabled = false;
          submitButton.textContent = "Sign Up";
        }, 1000);
        
      } catch (error) {
        errorElement.textContent = "Network error. Please try again later."
        console.error("Signup Error:", error)
      }
    })
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Remove current user from local storage
      localStorage.removeItem("currentUser")

      // Update UI
      const loginButton = document.querySelector(".login-button");
      const userWelcome = document.querySelector(".user-welcome");
      
      if (loginButton && userWelcome) {
        loginButton.classList.remove("hidden")
        userWelcome.classList.add("hidden")
      }
      
      showNotification("You have been logged out");
    })
  }
}

// Check if user is logged in
function checkLoginStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (currentUser) {
    updateUserUI(currentUser)
  }
}

// Update UI based on user login status
function updateUserUI(user) {
  const loginButton = document.querySelector(".login-button")
  const userWelcome = document.querySelector(".user-welcome")
  const usernameElement = document.querySelector(".username")
  const avatarInitials = document.querySelector(".avatar-initials")

  if (loginButton && userWelcome && usernameElement) {
    loginButton.classList.add("hidden")
    userWelcome.classList.remove("hidden")
    usernameElement.textContent = user.username
    
    if (avatarInitials) {
      // Set avatar initials based on username
      avatarInitials.textContent = user.username.charAt(0).toUpperCase()
    }
  }
}

// Open auth modal
function openAuthModal() {
  const authModal = document.getElementById("authModal")
  if (authModal) {
    authModal.style.display = "flex"
  }
}

// Add smooth scrolling for a better user experience
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Responsive image loading optimization
window.addEventListener("load", () => {
  const images = document.querySelectorAll("img")

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target
          if (image.dataset.src) {
            image.src = image.dataset.src
            imageObserver.unobserve(image)
          }
        }
      })
    })

    images.forEach((img) => {
      if (img.dataset.src) {
        imageObserver.observe(img)
      }
    })
  }
})

function initializeCart() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent card click
      
      const productId = this.dataset.id
      const productTitle = this.dataset.title
      const productPrice = Number.parseFloat(this.dataset.price)
      const productImage = this.dataset.image
      const productSeller = this.dataset.seller
      const productCondition = this.dataset.condition
      const productSize = this.dataset.size || "N/A"

      const cartItem = {
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        seller: productSeller,
        condition: productCondition,
        size: productSize,
        quantity: 1,
      }

      addToCart(cartItem)
      showNotification("Item added to cart")
    })
  })
}

function addToCart(item) {
  const cart = getCart()
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id)

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1
  } else {
    cart.push(item)
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount(cart.length)
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

function updateCartCount(count) {
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) {
    cartCount.textContent = count
  }
}

function showNotification(message) {
  const notification = document.getElementById("successNotification")
  if (!notification) return;
  
  const messageElement = notification.querySelector(".notification-message")
  if (!messageElement) return;

  messageElement.textContent = message
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Wishlist functionality
function initializeWishlist() {
  // Get all wishlist icons
  const wishlistIcons = document.querySelectorAll(".wishlist-icon")

  // Load wishlist from localStorage
  const wishlistItems = getWishlist()

  // Update wishlist icons based on current wishlist
  updateWishlistIcons(wishlistItems)

  // Add click event listeners to wishlist icons
  wishlistIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation() // Prevent triggering parent element clicks

      const productId = this.dataset.id
      const productTitle = this.dataset.title
      const productPrice = this.dataset.price
      const productImage = this.dataset.image

      const item = {
        id: productId,
        name: productTitle,
        price: "$" + productPrice,
        image: productImage,
      }

      toggleWishlistItem(item, this)
    })
  })
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || []
}

function updateWishlistIcons(wishlistItems) {
  const wishlistIcons = document.querySelectorAll(".wishlist-icon")

  wishlistIcons.forEach((icon) => {
    const productId = icon.dataset.id
    const isInWishlist = wishlistItems.some((item) => item.id === productId)

    if (isInWishlist) {
      icon.classList.add("active")
    } else {
      icon.classList.remove("active")
    }
  })
}

function toggleWishlistItem(item, iconElement) {
  const wishlist = getWishlist()
  const existingItemIndex = wishlist.findIndex((wishlistItem) => wishlistItem.id === item.id)

  if (existingItemIndex !== -1) {
    // Remove from wishlist
    wishlist.splice(existingItemIndex, 1)
    iconElement.classList.remove("active")
    showNotification("Item removed from wishlist")
  } else {
    // Add to wishlist
    wishlist.push(item)
    iconElement.classList.add("active")
    showNotification("Item added to wishlist")
  }

  // Save updated wishlist to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}