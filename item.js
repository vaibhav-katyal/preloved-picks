document.addEventListener("DOMContentLoaded", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")
  
    if (!productId) {
      // If no product ID is provided, show error message
      displayErrorMessage("Product not found. Please try again.")
      return
    }
  
    // Try to get the product from localStorage
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"))
  
    // If we have the selected product in localStorage and it matches the ID in the URL
    if (selectedProduct && selectedProduct.id === productId) {
      displayProductDetails(selectedProduct)
    } else {
      // Otherwise, try to find the product in the listings
      const allListings = JSON.parse(localStorage.getItem("listings")) || []
      const product = allListings.find((listing) => listing.id === productId)
  
      if (product) {
        displayProductDetails(product)
      } else {
        displayErrorMessage("Product not found. Please try again.")
      }
    }
  
    // Add event listeners for the buy now and add to cart buttons
    setupEventListeners()
  })
  
  function displayProductDetails(product) {
    // Get elements to update
    const itemTitle = document.querySelector(".item-details h1")
    const itemDescription = document.querySelector(".item-details .description")
    const itemPrice = document.querySelector(".item-details .price")
    const itemImage = document.querySelector(".item-photo img")
  
    // Update elements with product details
    if (itemTitle) itemTitle.textContent = product.title || "Untitled Product"
    if (itemDescription) itemDescription.textContent = product.description || "No description available."
    if (itemPrice) itemPrice.textContent = `$${product.price.toFixed(2)}`
  
    // Update image if available
    if (itemImage) {
      const imageUrl =
        product.images && product.images.length > 0
          ? product.images[0]
          : "https://via.placeholder.com/500x500?text=No+Image"
  
      itemImage.src = imageUrl
      itemImage.alt = product.title || "Product Image"
    }
  
    // Update page title
    document.title = `${product.title || "Product"} - PreLoved Picks`
  
    // Update size options if available
    if (product.sizes && product.sizes.length > 0) {
      const sizeSelect = document.getElementById("size")
      if (sizeSelect) {
        // Clear existing options
        sizeSelect.innerHTML = ""
  
        // Add new options
        product.sizes.forEach((size) => {
          const option = document.createElement("option")
          option.value = size
          option.textContent = size
          sizeSelect.appendChild(option)
        })
      }
    }
  
    // Store the current product in a data attribute for the buttons to use
    const buyNowBtn = document.querySelector(".buy-now")
    const addToCartBtn = document.querySelector(".add-to-cart")
  
    if (buyNowBtn) {
      buyNowBtn.dataset.id = product.id
      buyNowBtn.dataset.title = product.title
      buyNowBtn.dataset.price = product.price
      buyNowBtn.dataset.image = product.images && product.images.length > 0 ? product.images[0] : ""
    }
  
    if (addToCartBtn) {
      addToCartBtn.dataset.id = product.id
      addToCartBtn.dataset.title = product.title
      addToCartBtn.dataset.price = product.price
      addToCartBtn.dataset.image = product.images && product.images.length > 0 ? product.images[0] : ""
    }
  }
  
  function displayErrorMessage(message) {
    // Create an error message element
    const errorContainer = document.createElement("div")
    errorContainer.className = "error-message"
    errorContainer.innerHTML = `
      <h2>Oops!</h2>
      <p>${message}</p>
      <a href="index.html" class="back-button">Back to Home</a>
    `
  
    // Replace the main content with the error message
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.innerHTML = ""
      mainContent.appendChild(errorContainer)
    }
  }
  
  function setupEventListeners() {
    // Buy Now button
    const buyNowBtn = document.querySelector(".buy-now")
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        // Get selected size
        const sizeSelect = document.getElementById("size")
        const selectedSize = sizeSelect ? sizeSelect.value : null
  
        // Create item object
        const item = {
          id: this.dataset.id,
          title: this.dataset.title,
          price: Number.parseFloat(this.dataset.price),
          image: this.dataset.image,
          size: selectedSize,
          quantity: 1,
        }
  
        // Save to localStorage for checkout page
        localStorage.setItem("checkoutItem", JSON.stringify(item))
  
        // Redirect to checkout page (you would need to create this page)
        // window.location.href = "checkout.html";
  
        // For now, just show an alert
        alert("Proceeding to checkout with: " + item.title)
      })
    }
  
    // Add to Cart button
    const addToCartBtn = document.querySelector(".add-to-cart")
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        // Get selected size
        const sizeSelect = document.getElementById("size")
        const selectedSize = sizeSelect ? sizeSelect.value : null
  
        // Create item object
        const item = {
          id: this.dataset.id,
          title: this.dataset.title,
          price: Number.parseFloat(this.dataset.price),
          image: this.dataset.image,
          size: selectedSize,
          quantity: 1,
        }
  
        // Add to cart
        addToCart(item)
  
        // Show notification
        showNotification("Item added to cart")
      })
    }
  }
  
  function addToCart(item) {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem("cart")) || []
  
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id && cartItem.size === item.size)
  
    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      cart[existingItemIndex].quantity += 1
    } else {
      // Otherwise, add new item
      cart.push(item)
    }
  
    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))
  
    // Update cart count in UI
    updateCartCount(cart.length)
  }
  
  function updateCartCount(count) {
    const cartCount = document.querySelector(".cart-count")
    if (cartCount) {
      cartCount.textContent = count
    }
  }
  
  function showNotification(message) {
    // Create notification if it doesn't exist
    let notification = document.getElementById("successNotification")
  
    if (!notification) {
      notification = document.createElement("div")
      notification.id = "successNotification"
      notification.className = "notification"
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✓</div>
          <div class="notification-message"></div>
        </div>
      `
      document.body.appendChild(notification)
    }
  
    // Update message
    const messageElement = notification.querySelector(".notification-message")
    if (messageElement) {
      messageElement.textContent = message
    }
  
    // Show notification
    notification.classList.add("show")
  
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
  
  