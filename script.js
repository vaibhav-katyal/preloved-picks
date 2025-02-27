// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any interactive elements
    initializeUI();
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize auth functionality
    initializeAuth();

    // Initialize cart functionality
    initializeCart();

    // Update cart count on page load
    updateCartCount(getCart().length);
  });
  
  function initializeUI() {
    // Add event listeners for buttons
    const sellButton = document.querySelector('.sell-button');
    const loginButton = document.querySelector('.login-button');
    const getStartedButton = document.querySelector('.get-started-button');
    const menuButton = document.querySelector('.menu-button');
    
    sellButton.addEventListener('click', function() {
      console.log('Sell button clicked');
      // Add sell functionality here
    });
    
    loginButton.addEventListener('click', function() {
      openAuthModal();
    });
    
    getStartedButton.addEventListener('click', function() {
      console.log('Get started button clicked');
      // Add get started functionality here
    });
    
    menuButton.addEventListener('click', function() {
      console.log('Menu button clicked');
      // Add menu toggle functionality here
    });
    
    // Add hover effects for cards
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
      });
    });
    
    productCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
      });
    });
    
    // Add search functionality
    const searchInput = document.querySelector('.search-box input');
    
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        console.log('Search for:', this.value);
        // Add search functionality here
      }
    });
  }
  
  // Authentication functionality
  function initializeAuth() {
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.querySelector('.logout-button');
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
      authModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) {
        authModal.style.display = 'none';
      }
    });
    
    // Tab switching functionality
    authTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        authTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show the corresponding form
        const tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.auth-form').forEach(form => {
          form.classList.remove('active');
        });
        
        if (tabName === 'login') {
          loginForm.classList.add('active');
        } else {
          signupForm.classList.add('active');
        }
      });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorElement = document.getElementById('loginError');
      
      // Validate inputs
      if (!email || !password) {
        errorElement.textContent = 'Please fill in all fields';
        return;
      }
      
      // Check if user exists in local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Set current user in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateUserUI(user);
        
        // Close modal
        authModal.style.display = 'none';
        
        // Reset form
        loginForm.reset();
        errorElement.textContent = '';
      } else {
        errorElement.textContent = 'Invalid email or password';
      }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      const errorElement = document.getElementById('signupError');
      
      // Validate inputs
      if (!username || !email || !password || !confirmPassword) {
        errorElement.textContent = 'Please fill in all fields';
        return;
      }
      
      if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        return;
      }
      
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.some(u => u.email === email)) {
        errorElement.textContent = 'Email already in use';
        return;
      }
      
      // Create new user
      const newUser = {
        username,
        email,
        password
      };
      
      // Add user to local storage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Update UI
      updateUserUI(newUser);
      
      // Close modal
      authModal.style.display = 'none';
      
      // Reset form
      signupForm.reset();
      errorElement.textContent = '';
      
      // Show success message
      alert('Account created successfully!');
    });
    
    // Logout functionality
    logoutButton.addEventListener('click', function() {
      // Remove current user from local storage
      localStorage.removeItem('currentUser');
      
      // Update UI
      document.querySelector('.login-button').classList.remove('hidden');
      document.querySelector('.user-welcome').classList.add('hidden');
    });
  }
  
  // Check if user is logged in
  function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
      updateUserUI(currentUser);
    }
  }
  
  // Update UI based on user login status
  function updateUserUI(user) {
    const loginButton = document.querySelector('.login-button');
    const userWelcome = document.querySelector('.user-welcome');
    const usernameElement = document.querySelector('.username');
    
    loginButton.classList.add('hidden');
    userWelcome.classList.remove('hidden');
    usernameElement.textContent = user.username;
  }
  
  // Open auth modal
  function openAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.style.display = 'flex';
  }
  
  // Add smooth scrolling for a better user experience
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Responsive image loading optimization
  window.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            imageObserver.unobserve(image);
          }
        });
      });
      
      images.forEach(img => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    }
  });

  function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.dataset.id;
        const productTitle = this.dataset.title;
        const productPrice = parseFloat(this.dataset.price);
        const productImage = this.dataset.image;
        const productSeller = this.dataset.seller;
        const productCondition = this.dataset.condition;
        const productSize = this.dataset.size || 'N/A';
        
        const cartItem = {
          id: productId,
          title: productTitle,
          price: productPrice,
          image: productImage,
          seller: productSeller,
          condition: productCondition,
          size: productSize,
          quantity: 1
        };
        
        addToCart(cartItem);
        showNotification('Item added to cart');
      });
    });
  }
  
  function addToCart(item) {
    let cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart.length);
  }
  
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = count;
    }
  }
  
  function showNotification(message) {
    const notification = document.getElementById('successNotification');
    const messageElement = notification.querySelector('.notification-message');
    
    messageElement.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }