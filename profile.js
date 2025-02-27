// Profile page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserProfile();
    
    // Initialize profile tabs
    initProfileTabs();
    
    // Initialize profile form
    initProfileForm();
  });
  
  // Load user profile data
  function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      // Redirect to home if not logged in
      window.location.href = 'index.html';
      return;
    }
    
    // Set profile header information
    document.querySelector('.profile-name').textContent = currentUser.username;
    document.querySelector('.profile-email').textContent = currentUser.email;
    
    // Set profile avatar initials
    const profileInitials = document.querySelector('.profile-initials');
    profileInitials.textContent = getInitials(currentUser.username);
    
    // Format and set join date
    const joinDate = new Date(currentUser.joinDate || Date.now());
    const formattedDate = joinDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    document.querySelector('.join-date').textContent = formattedDate;
    
    // Set form values
    document.getElementById('profileUsername').value = currentUser.username;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileBio').value = currentUser.bio || '';
    
    // Check if user has listings, orders, or favorites
    updateTabContent(currentUser);
  }
  
  // Initialize profile tabs
  function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show the corresponding content
        const tabName = this.getAttribute('data-tab');
        document.querySelectorAll('.profile-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        document.getElementById(`${tabName}-content`).classList.add('active');
      });
    });
  }
  
  // Initialize profile form
  function initProfileForm() {
    const accountForm = document.getElementById('accountForm');
    
    accountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('profileUsername').value;
      const email = document.getElementById('profileEmail').value;
      const bio = document.getElementById('profileBio').value;
      
      // Validate inputs
      if (!username || !email) {
        showNotification('Please fill in all required fields');
        return;
      }
      
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Check if email is already in use by another user
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const emailExists = users.some(u => u.email === email && u.username !== currentUser.username);
      
      if (emailExists) {
        showNotification('Email is already in use');
        return;
      }
      
      // Update user data
      currentUser.username = username;
      currentUser.email = email;
      currentUser.bio = bio;
      
      // Update in local storage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update users array
      const updatedUsers = users.map(u => {
        if (u.email === currentUser.email) {
          return currentUser;
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update UI
      document.querySelector('.profile-name').textContent = username;
      document.querySelector('.profile-email').textContent = email;
      document.querySelector('.profile-initials').textContent = getInitials(username);
      
      // Update header avatar and username
      document.querySelector('.avatar-initials').textContent = getInitials(username);
      document.querySelector('.username').textContent = username;
      
      // Show success notification
      showNotification('Profile updated successfully');
    });
  }
  
  // Update tab content based on user data
  function updateTabContent(user) {
    // Check if user has listings
    if (user.listings && user.listings.length > 0) {
      // Display listings
      const listingsContent = document.getElementById('listings-content');
      listingsContent.innerHTML = `
        <h3>My Listings</h3>
        <div class="listings-grid">
          ${user.listings.map(listing => `
            <div class="listing-card">
              <img src="${listing.image}" alt="${listing.title}">
              <div class="listing-info">
                <h4>${listing.title}</h4>
                <p class="listing-price">$${listing.price}</p>
                <p class="listing-status">${listing.status}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Check if user has orders
    if (user.orders && user.orders.length > 0) {
      // Display orders
      const ordersContent = document.getElementById('orders-content');
      ordersContent.innerHTML = `
        <h3>My Orders</h3>
        <div class="orders-list">
          ${user.orders.map(order => `
            <div class="order-card">
              <div class="order-header">
                <div>
                  <h4>Order #${order.id}</h4>
                  <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
              </div>
              <div class="order-items">
                ${order.items.map(item => `
                  <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="order-item-info">
                      <h5>${item.title}</h5>
                      <p>$${item.price}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="order-total">
                <p>Total: <span>$${order.total}</span></p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Check if user has favorites
    if (user.favorites && user.favorites.length > 0) {
      // Display favorites
      const favoritesContent = document.getElementById('favorites-content');
      favoritesContent.innerHTML = `
        <h3>Favorites</h3>
        <div class="favorites-grid">
          ${user.favorites.map(favorite => `
            <div class="product-card">
              <img src="${favorite.image}" alt="${favorite.title}">
              <div class="product-info">
                <h3>${favorite.title}</h3>
                <p>$${favorite.price}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  
  // Get initials from username
  function getInitials(name) {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.getElementById('successNotification');
    const messageElement = notification.querySelector('.notification-message');
    
    messageElement.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Button event listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Create listing button
    const createListingBtn = document.querySelector('.create-listing-button');
    if (createListingBtn) {
      createListingBtn.addEventListener('click', function() {
        showNotification('Listing creation coming soon!');
      });
    }
    
    // Shop now button
    const shopNowBtn = document.querySelector('.shop-now-button');
    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
      });
    }
    
    // Explore button
    const exploreBtn = document.querySelector('.explore-button');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
      });
    }
  });