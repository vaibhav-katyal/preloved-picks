// Search functionality for PreLoved Picks

document.addEventListener("DOMContentLoaded", () => {
    // Get search form and input elements
    const searchForm = document.querySelector("#searchForm")
    const searchInput = document.querySelector("#searchInput")
  
    // Add event listener for search form submission
    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const searchQuery = searchInput.value.trim()
        if (searchQuery) {
          // Redirect to search.html with the search query
          window.location.href = `search.html?q=${encodeURIComponent(searchQuery)}`
        }
      })
    }
  
    // If we're on the search results page, handle the search results display
    if (window.location.pathname.includes("search.html")) {
      displaySearchResults()
    }
  
    function displaySearchResults() {
      const searchTitle = document.getElementById("searchTitle")
      const searchResultsContainer = document.getElementById("searchResultsContainer")
  
      // Get search query from URL
      const urlParams = new URLSearchParams(window.location.search)
      const searchQuery = urlParams.get("q")
  
      if (!searchQuery) {
        searchTitle.textContent = "No search query provided"
        searchResultsContainer.innerHTML = "<p class='no-results'>Please enter a search term to find items.</p>"
        return
      }
  
      // Update the search input with the current query
      if (searchInput) {
        searchInput.value = searchQuery
      }
  
      // Update the search title
      searchTitle.textContent = `Search Results for "${searchQuery}"`
  
      // Get all listings from localStorage
      const allListings = JSON.parse(localStorage.getItem("listings")) || []
  
      // Filter listings based on search query (case insensitive)
      const filteredListings = allListings.filter((listing) => {
        const title = listing.title ? listing.title.toLowerCase() : ""
        const description = listing.description ? listing.description.toLowerCase() : ""
        const brand = listing.brand ? listing.brand.toLowerCase() : ""
        const condition = listing.condition ? listing.condition.toLowerCase() : ""
        const query = searchQuery.toLowerCase()
  
        return title.includes(query) || description.includes(query) || brand.includes(query) || condition.includes(query)
      })
  
      // Display results or no results message
      if (filteredListings.length === 0) {
        searchResultsContainer.innerHTML = `
          <div class="no-results">
            <p>No results found for "${searchQuery}"</p>
            <p>Try checking your spelling or using more general terms</p>
          </div>
        `
      } else {
        // Create results grid
        searchResultsContainer.innerHTML = `
          <div class="search-filters">
            <div class="filter-group">
              <label>Sort by:</label>
              <select id="sortFilter">
                <option value="relevance">Relevance</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          <div class="search-results-grid"></div>
        `
  
        const resultsGrid = searchResultsContainer.querySelector(".search-results-grid")
        const sortFilter = document.getElementById("sortFilter")
  
        // Function to sort and display listings
        function sortAndDisplayListings(sortType) {
          const sortedListings = [...filteredListings]
  
          // Sort based on selected filter
          switch (sortType) {
            case "priceLow":
              sortedListings.sort((a, b) => a.price - b.price)
              break
            case "priceHigh":
              sortedListings.sort((a, b) => b.price - a.price)
              break
            case "newest":
              sortedListings.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
              break
            default:
              // Default is relevance, no additional sorting needed
              break
          }
  
          // Clear the grid
          resultsGrid.innerHTML = ""
  
          // Add each listing to the grid
          sortedListings.forEach((listing) => {
            const listingCard = createListingCard(listing)
            resultsGrid.appendChild(listingCard)
          })
        }
  
        // Add event listener for sort filter
        if (sortFilter) {
          sortFilter.addEventListener("change", () => {
            sortAndDisplayListings(sortFilter.value)
          })
        }
  
        // Initial display with default sorting
        sortAndDisplayListings("relevance")
      }
    }
  
    // Function to create a listing card
    function createListingCard(listing) {
      const card = document.createElement("div")
      card.className = "product-card"
      card.dataset.id = listing.id
  
      // Get the first image or use a placeholder
      const imageUrl =
        listing.images && listing.images.length > 0
          ? listing.images[0]
          : "https://via.placeholder.com/300x300?text=No+Image"
  
      // Format the date
      const dateAdded = listing.dateAdded
        ? new Date(listing.dateAdded).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown date"
  
      card.innerHTML = `
        <div class="wishlist-icon" data-id="${listing.id}" data-title="${listing.title}" data-price="${listing.price}" data-image="${imageUrl}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <img src="${imageUrl}" alt="${listing.title}" />
        <div class="product-info">
          <h3>${listing.title}</h3>
          <p class="product-price">$${listing.price.toFixed(2)}</p>
          <div class="product-meta">
            <span>${listing.condition || "Not specified"}</span>
            <span>${listing.brand || ""}</span>
          </div>
          <button class="add-to-cart-btn" 
            data-id="${listing.id}" 
            data-title="${listing.title}" 
            data-price="${listing.price}"
            data-image="${imageUrl}"
            data-seller="${listing.sellerName || "Unknown"}" 
            data-condition="${listing.condition || "Not specified"}">
            Add to Cart
          </button>
        </div>
      `
  
      // Add event listener for add to cart button
      const addToCartBtn = card.querySelector(".add-to-cart-btn")
      addToCartBtn.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent card click
  
        const cartItem = {
          id: this.dataset.id,
          title: this.dataset.title,
          price: Number.parseFloat(this.dataset.price),
          image: this.dataset.image,
          seller: this.dataset.seller,
          condition: this.dataset.condition,
          quantity: 1,
        }
  
        addToCart(cartItem)
        showNotification("Item added to cart")
      })
  
      // Add event listener for wishlist icon
      const wishlistIcon = card.querySelector(".wishlist-icon")
      wishlistIcon.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent card click
  
        const item = {
          id: this.dataset.id,
          name: this.dataset.title,
          price: "$" + this.dataset.price,
          image: this.dataset.image,
        }
  
        toggleWishlistItem(item, this)
      })
  
      // Add event listener for card click to view details
      card.addEventListener("click", () => {
        // Save the selected product to localStorage for the item page to use
        localStorage.setItem("selectedProduct", JSON.stringify(listing))
  
        // Redirect to the item page
        window.location.href = `item.html?id=${listing.id}`
      })
  
      return card
    }
  
    // Function to add item to cart
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
  
    // Function to get cart from localStorage
    function getCart() {
      return JSON.parse(localStorage.getItem("cart")) || []
    }
  
    // Function to update cart count in UI
    function updateCartCount(count) {
      const cartCount = document.querySelector(".cart-count")
      if (cartCount) {
        cartCount.textContent = count
      }
    }
  
    // Function to show notification
    function showNotification(message) {
      const notification = document.getElementById("successNotification")
      if (!notification) return
  
      const messageElement = notification.querySelector(".notification-message")
      if (!messageElement) return
  
      messageElement.textContent = message
      notification.classList.add("show")
  
      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    }
  
    // Function to toggle wishlist item
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
  
    // Function to get wishlist from localStorage
    function getWishlist() {
      return JSON.parse(localStorage.getItem("wishlist")) || []
    }
  
    // Initialize wishlist icons on page load
    function initializeWishlistIcons() {
      const wishlistItems = getWishlist()
      const wishlistIcons = document.querySelectorAll(".wishlist-icon")
  
      wishlistIcons.forEach((icon) => {
        const productId = icon.dataset.id
        const isInWishlist = wishlistItems.some((item) => item.id === productId)
  
        if (isInWishlist) {
          icon.classList.add("active")
        }
      })
    }
  
    // Call initialization functions
    initializeWishlistIcons()
    updateCartCount(getCart().length)
  })
  
  