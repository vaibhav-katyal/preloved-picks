document.addEventListener("DOMContentLoaded", () => {
    // Load orders from localStorage
    loadOrders()
  
    // Check login status
    checkLoginStatus()
  
    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      const modal = document.getElementById("orderDetailsModal")
      if (event.target === modal) {
        closeOrderModal()
      }
    })
  })
  
  // Load orders from localStorage
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    const orderList = document.querySelector(".order-list")
  
    // Clear existing orders
    orderList.innerHTML = ""
  
    if (orders.length === 0) {
      orderList.innerHTML = '<p class="no-orders">You have no orders yet. Start shopping!</p>'
      return
    }
  
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date))
  
    // Add each order to the list
    orders.forEach((order) => {
      // Get the first item image to display as the order thumbnail
      const firstItemImage = order.items[0]?.image || "/placeholder.svg"
  
      // Format date
      const orderDate = new Date(order.date)
      const formattedDate = orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
  
      // Create order card
      const orderCard = document.createElement("div")
      orderCard.className = "order-card"
      orderCard.innerHTML = `
              <img src="${firstItemImage}" alt="Order Thumbnail">
              <div class="order-info">
                  <h3>Order #${order.id}</h3>
                  <p>Order Date: ${formattedDate}</p>
                  <p>Status: ${order.status}</p>
                  <p>Total: $${order.total.toFixed(2)}</p>
                  <button class="view-details-btn" data-order-id="${order.id}">View Details</button>
                  <button class="track-order" data-order-id="${order.id}">Track Order</button>
                  ${order.status === "Processing" ? `<button class="cancel-order-btn" data-order-id="${order.id}">Cancel Order</button>` : ""}
              </div>
          `
  
      orderList.appendChild(orderCard)
    })
  
    // Add event listeners to buttons
    document.querySelectorAll(".view-details-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id")
        showOrderDetails(orderId)
      })
    })
  
    document.querySelectorAll(".track-order").forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id")
        trackOrder(orderId)
      })
    })
  
    document.querySelectorAll(".cancel-order-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-order-id")
        cancelOrder(orderId)
      })
    })
  }
  
  // Show order details in modal
  function showOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    const order = orders.find((o) => o.id === orderId)
  
    if (!order) return
  
    // Format date
    const orderDate = new Date(order.date)
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  
    // Create items HTML
    let itemsHtml = ""
    order.items.forEach((item) => {
      itemsHtml += `
              <div class="order-detail-item">
                  <div class="order-item-image">
                      <img src="${item.image}" alt="${item.title}">
                  </div>
                  <div class="order-item-info">
                      <h4>${item.title}</h4>
                      <p>Quantity: ${item.quantity}</p>
                      <p>Price: $${item.price.toFixed(2)}</p>
                      <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
              </div>
          `
    })
  
    // Create modal HTML
    const modalHtml = `
          <div class="order-details-content">
              <span class="close-modal">&times;</span>
              <h2>Order Details</h2>
              <div class="order-details-header">
                  <div class="order-header-info">
                      <p><strong>Order ID:</strong> ${order.id}</p>
                      <p><strong>Date:</strong> ${formattedDate}</p>
                      <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
                  </div>
              </div>
              
              <div class="order-items-container">
                  <h3>Items</h3>
                  ${itemsHtml}
              </div>
              
              <div class="order-summary">
                  <h3>Order Summary</h3>
                  <div class="summary-row">
                      <span>Subtotal</span>
                      <span>$${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                      <span>Shipping</span>
                      <span>$${order.shipping.toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                      <span>Tax</span>
                      <span>$${order.tax.toFixed(2)}</span>
                  </div>
                  <div class="summary-divider"></div>
                  <div class="summary-row total">
                      <span>Total</span>
                      <span>$${order.total.toFixed(2)}</span>
                  </div>
              </div>
          </div>
      `
  
    // Get or create modal
    let modal = document.getElementById("orderDetailsModal")
  
    if (!modal) {
      modal = document.createElement("div")
      modal.id = "orderDetailsModal"
      modal.className = "modal"
      document.body.appendChild(modal)
    }
  
    // Set modal content
    modal.innerHTML = modalHtml
  
    // Show modal
    modal.style.display = "block"
  
    // Add close button event listener
    document.querySelector(".close-modal").addEventListener("click", closeOrderModal)
  }
  
  // Close order details modal
  function closeOrderModal() {
    const modal = document.getElementById("orderDetailsModal")
    if (modal) {
      modal.style.display = "none"
    }
  }
  
  // Track order
  function trackOrder(orderId) {
    // In a real application, this would connect to a tracking system
    // For now, we'll just show a notification
    alert(`Tracking information for order ${orderId} is not available yet.`)
  }
  
  // Cancel order
  function cancelOrder(orderId) {
    if (confirm("Are you sure you want to cancel this order?")) {
      const orders = JSON.parse(localStorage.getItem("orders")) || []
      const orderIndex = orders.findIndex((o) => o.id === orderId)
  
      if (orderIndex !== -1) {
        // Update order status
        orders[orderIndex].status = "Cancelled"
        localStorage.setItem("orders", JSON.stringify(orders))
  
        // Reload orders
        loadOrders()
  
        // Show notification
        alert("Order has been cancelled successfully.")
      }
    }
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
  
    if (loginButton && userWelcome) {
      loginButton.classList.add("hidden")
      userWelcome.classList.remove("hidden")
      usernameElement.textContent = user.username
  
      // Set avatar initials
      if (user.username && avatarInitials) {
        const initials = getInitials(user.username)
        avatarInitials.textContent = initials
      }
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
  
  