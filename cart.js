// Cart page specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart
    loadCart()
  
    // Add event listeners
    document.getElementById("continue-shopping").addEventListener("click", () => {
      window.location.href = "index.html"
    })
  
    document.getElementById("start-shopping").addEventListener("click", () => {
      window.location.href = "index.html"
    })
  
    document.getElementById("checkout-button").addEventListener("click", () => {
      if (!isLoggedIn()) {
        showNotification("Please log in to checkout")
        openAuthModal()
        return
      }
  
      processCheckout()
    })
  
    // Check login status
    checkLoginStatus()
  })
  
  // Load cart items from local storage
  function loadCart() {
    const cart = getCart()
    updateCartCount(cart.length)
  
    if (cart.length === 0) {
      // Show empty cart message
      document.getElementById("cart-items").classList.add("hidden")
      document.getElementById("empty-cart").classList.remove("hidden")
      document.querySelector(".cart-content").classList.add("hidden")
      return
    }
  
    // Show cart items
    document.getElementById("cart-items").classList.remove("hidden")
    document.getElementById("empty-cart").classList.add("hidden")
    document.querySelector(".cart-content").classList.remove("hidden")
  
    // Render cart items
    renderCartItems(cart)
  
    // Calculate and update totals
    updateCartTotals(cart)
  }
  
  // Render cart items
  function renderCartItems(cart) {
    const cartItemsContainer = document.getElementById("cart-items")
    cartItemsContainer.innerHTML = ""
  
    cart.forEach((item) => {
      // Check if item is valid
      if (!item || !item.id || !item.title || !item.price) {
        return; // Skip invalid items
      }

      const cartItemElement = document.createElement("div")
      cartItemElement.className = "cart-item"
      cartItemElement.dataset.id = item.id
  
      cartItemElement.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-details">
            <h3 class="cart-item-title">${item.title}</h3>
            <p class="cart-item-seller">Seller: ${item.seller || "Unknown"}</p>
            <p class="cart-item-size">Size: ${item.size || "N/A"}</p>
            <p class="cart-item-condition">Condition: ${item.condition || "N/A"}</p>
            <div class="cart-item-actions">
              <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
              </div>
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        `
  
      cartItemsContainer.appendChild(cartItemElement)
    })
  
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        updateItemQuantity(this.dataset.id, -1)
      })
    })
  
    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        updateItemQuantity(this.dataset.id, 1)
      })
    })
  
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        removeCartItem(this.dataset.id)
      })
    })
  }
  
  // Update item quantity
  function updateItemQuantity(itemId, change) {
    const cart = getCart()
    const itemIndex = cart.findIndex((item) => item.id === itemId)
  
    if (itemIndex === -1) return
  
    cart[itemIndex].quantity += change
  
    // Remove item if quantity is 0 or less
    if (cart[itemIndex].quantity <= 0) {
      removeCartItem(itemId)
      return
    }
  
    // Update local storage
    localStorage.setItem("cart", JSON.stringify(cart))
  
    // Update UI
    const quantityElement = document.querySelector(`.cart-item[data-id="${itemId}"] .quantity-value`)
    const priceElement = document.querySelector(`.cart-item[data-id="${itemId}"] .cart-item-price`)
  
    if (quantityElement && priceElement) {
      quantityElement.textContent = cart[itemIndex].quantity
      priceElement.textContent = `$${(cart[itemIndex].price * cart[itemIndex].quantity).toFixed(2)}`
    }
  
    // Update totals
    updateCartTotals(cart)
    updateCartCount(cart.length)
  }
  
  // Remove item from cart
  function removeCartItem(itemId) {
    let cart = getCart()
    cart = cart.filter((item) => item.id !== itemId)
  
    // Update local storage
    localStorage.setItem("cart", JSON.stringify(cart))
  
    // Remove item from DOM
    const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`)
    if (itemElement) {
      itemElement.classList.add("fade-out")
      setTimeout(() => {
        itemElement.remove()
  
        // Check if cart is empty
        if (cart.length === 0) {
          document.getElementById("cart-items").classList.add("hidden")
          document.getElementById("empty-cart").classList.remove("hidden")
          document.querySelector(".cart-content").classList.add("hidden")
        }
  
        // Update totals
        updateCartTotals(cart)
        updateCartCount(cart.length)
      }, 300)
    }
  
    showNotification("Item removed from cart")
  }
  
  // Update cart totals
  function updateCartTotals(cart) {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 5.99 : 0
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax
  
    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`
    document.getElementById("cart-shipping").textContent = `$${shipping.toFixed(2)}`
    document.getElementById("cart-tax").textContent = `$${tax.toFixed(2)}`
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`
  }
  
  // Process checkout
  function processCheckout() {
    const cart = getCart()
  
    if (cart.length === 0) {
      showNotification("Your cart is empty")
      return
    }
  
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax
  
    // Create order
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: cart,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: "Processing",
    }
  
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    orders.push(order)
    localStorage.setItem("orders", JSON.stringify(orders))
  
    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]))
  
    // Show success notification
    showNotification("Order placed successfully!")
  
    // Redirect to orders page
    setTimeout(() => {
      window.location.href = "yoursorder.html"
    }, 1500)
  }
  
  // Generate order ID
  function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }
  
  // Get cart from local storage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || []
  }
  
  // Update cart count in header
  function updateCartCount(count) {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      cartCount.textContent = count
    }
  }
  
  // Check if user is logged in
  function isLoggedIn() {
    return localStorage.getItem("currentUser") !== null
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
  
  // Open auth modal
  function openAuthModal() {
    const authModal = document.getElementById("authModal")
    authModal.style.display = "flex"
  }
  
  // Check login status
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
  
    loginButton.classList.add("hidden")
    userWelcome.classList.remove("hidden")
    usernameElement.textContent = user.username
  
    // Set avatar initials
    if (user.username) {
      const initials = getInitials(user.username)
      avatarInitials.textContent = initials
    }
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

