document.addEventListener("DOMContentLoaded", () => {
    const wishlistGrid = document.querySelector(".wishlist-grid")
    const searchInput = document.querySelector(".search-box input")
  
    // Load wishlist items from localStorage
    loadWishlistItems()
  
    // Function to load wishlist items from localStorage
    function loadWishlistItems() {
      const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || []
  
      // Clear existing items
      wishlistGrid.innerHTML = ""
  
      if (wishlistItems.length === 0) {
        wishlistGrid.innerHTML = "<p>Your wishlist is empty. Add items from the main page.</p>"
        return
      }
  
      // Add each item to the wishlist grid
      wishlistItems.forEach((item) => {
        const wishlistItem = document.createElement("div")
        wishlistItem.classList.add("wishlist-item")
        wishlistItem.innerHTML = `
                  <img src="${item.image}" alt="${item.name}">
                  <div class="wishlist-info">
                      <h3>${item.name}</h3>
                      <p>${item.price}</p>
                      <button class="add-to-cart-button" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to Cart</button>
                      <br><br>
                      <button class="remove-button" data-id="${item.id}">Remove</button>
                  </div>
              `
        wishlistGrid.appendChild(wishlistItem)
      })
  
      // Add event listeners to buttons
      addButtonEventListeners()
    }
  
    // Function to add event listeners to buttons
    function addButtonEventListeners() {
      // Add to cart button event listeners
      document.querySelectorAll(".add-to-cart-button").forEach((button) => {
        button.addEventListener("click", function () {
          const item = {
            id: this.dataset.id,
            title: this.dataset.name,
            price: Number.parseFloat(this.dataset.price.replace("$", "")),
            image: this.dataset.image,
            quantity: 1,
          }
  
          // Add to cart
          addToCart(item)
          showNotification("Item added to cart!")
        })
      })
  
      // Remove button event listeners
      document.querySelectorAll(".remove-button").forEach((button) => {
        button.addEventListener("click", function () {
          const itemId = this.dataset.id
          removeFromWishlist(itemId)
        })
      })
    }
  
    // Function to remove an item from the wishlist
    function removeFromWishlist(itemId) {
      let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || []
  
      // Filter out the item to remove
      wishlistItems = wishlistItems.filter((item) => item.id !== itemId)
  
      // Save updated wishlist to localStorage
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  
      // Reload wishlist items
      loadWishlistItems()
  
      showNotification("Item removed from wishlist")
    }
  
    // Function to add an item to the cart
    function addToCart(item) {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || []
  
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id)
  
      if (existingItemIndex !== -1) {
        // Increase quantity if item already exists
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Add new item to cart
        cartItems.push(item)
      }
  
      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems))
  
      // Update cart count
      updateCartCount(cartItems.length)
    }
  
    // Function to update cart count
    function updateCartCount(count) {
      const cartCount = document.querySelector(".cart-count")
      if (cartCount) {
        cartCount.textContent = count
      }
    }
  
    // Function to show notification
    function showNotification(message) {
      alert(message)
    }
  
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase()
  
        document.querySelectorAll(".wishlist-item").forEach((item) => {
          const itemName = item.querySelector("h3").textContent.toLowerCase()
  
          if (itemName.includes(query)) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        })
      })
    }
  })
  
  