document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const listingsGrid = document.getElementById("listingsGrid");
  const emptyListingsMessage = document.getElementById("emptyListingsMessage");
  const productDetailsModal = document.getElementById("productDetailsModal");
  const modalMainImage = document.getElementById("modalMainImage");
  const modalThumbnails = document.getElementById("modalThumbnails");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalCondition = document.getElementById("modalCondition");
  const modalBrand = document.getElementById("modalBrand");
  const modalSize = document.getElementById("modalSize");
  const modalProductDetails = document.getElementById("modalProductDetails");
  const modalDescription = document.getElementById("modalDescription");

  // Load listings from localStorage
  const listings = JSON.parse(localStorage.getItem("listings") || "[]");

  // Display listings or empty state
  if (listings.length === 0) {
    emptyListingsMessage.style.display = "block";
    listingsGrid.style.display = "none";
  } else {
    emptyListingsMessage.style.display = "none";
    listingsGrid.style.display = "grid";
    renderListings();
  }

  // Render listings
  function renderListings() {
    listingsGrid.innerHTML = "";

    listings.forEach((listing) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.dataset.id = listing.id;

      // Get cover image (first image)
      const coverImage = listing.images[0] || "https://via.placeholder.com/300x300?text=No+Image";

      productCard.innerHTML = `
        <img src="${coverImage}" alt="${listing.title}">
        <div class="product-info">
          <h3>${listing.title}</h3>
          <div class="product-price">$${listing.price.toFixed(2)}</div>
          <div class="product-meta">
            <span>${listing.condition}</span>
            <span>${formatDate(listing.dateAdded)}</span>
          </div>
          <div class="product-actions">
            <button class="view-details-btn" data-id="${listing.id}">View Details</button>
            <button class="edit-listing-btn" data-id="${listing.id}">Edit</button>
          </div>
        </div>
      `;

      listingsGrid.appendChild(productCard);

      // Add event listener to view details button
      const viewDetailsBtn = productCard.querySelector(".view-details-btn");
      viewDetailsBtn.addEventListener("click", () => openProductModal(listing));

      // Add event listener to edit button
      const editBtn = productCard.querySelector(".edit-listing-btn");
      editBtn.addEventListener("click", () => {
        window.location.href = `list.html?edit=${listing.id}`;
      });
    });
  }

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Open product modal
  function openProductModal(listing) {
    // Set modal content
    modalTitle.textContent = listing.title;
    modalPrice.textContent = `$${listing.price.toFixed(2)}${listing.shippingIncluded ? ' (Shipping Included)' : ''}`;
    modalCondition.textContent = listing.condition;
    modalBrand.textContent = listing.brand || "Not specified";
    modalSize.textContent = listing.size || "Not specified";
    modalDescription.textContent = listing.description;

    // Set main image
    modalMainImage.src = listing.images[0] || "https://via.placeholder.com/500x500?text=No+Image";
    modalMainImage.alt = listing.title;

    // Clear thumbnails
    modalThumbnails.innerHTML = "";

    // Add image thumbnails
    listing.images.forEach((imageUrl, index) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = `thumbnail${index === 0 ? " active" : ""}`;
      thumbnail.innerHTML = `<img src="${imageUrl}" alt="Thumbnail ${index + 1}">`;
      
      thumbnail.addEventListener("click", () => {
        // Update main image
        modalMainImage.src = imageUrl;
        
        // Update active thumbnail
        document.querySelectorAll(".thumbnail").forEach(thumb => thumb.classList.remove("active"));
        thumbnail.classList.add("active");
      });
      
      modalThumbnails.appendChild(thumbnail);
    });

    // Add video thumbnails
    if (listing.videos && listing.videos.length > 0) {
      listing.videos.forEach((videoUrl, index) => {
        const thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail";
        thumbnail.innerHTML = `
          <video src="${videoUrl}" muted></video>
          <div class="video-badge">Video</div>
        `;
        
        thumbnail.addEventListener("click", () => {
          // Create video element for main display
          const videoElement = document.createElement("video");
          videoElement.src = videoUrl;
          videoElement.controls = true;
          videoElement.autoplay = true;
          videoElement.style.width = "100%";
          videoElement.style.height = "100%";
          videoElement.style.objectFit = "contain";
          
          // Replace main image with video
          modalMainImage.replaceWith(videoElement);
          
          // Store reference to video element
          modalMainImage = videoElement;
          
          // Update active thumbnail
          document.querySelectorAll(".thumbnail").forEach(thumb => thumb.classList.remove("active"));
          thumbnail.classList.add("active");
        });
        
        // Add hover effect for video preview
        thumbnail.addEventListener("mouseover", () => {
          const video = thumbnail.querySelector("video");
          if (video) video.play();
        });
        
        thumbnail.addEventListener("mouseout", () => {
          const video = thumbnail.querySelector("video");
          if (video) video.pause();
        });
        
        modalThumbnails.appendChild(thumbnail);
      });
    }

    // Add product details
    modalProductDetails.innerHTML = "";
    
    if (listing.productDetails && listing.productDetails.length > 0) {
      listing.productDetails.forEach(detail => {
        if (detail.key && detail.value) {
          const detailRow = document.createElement("div");
          detailRow.className = "detail-row";
          detailRow.innerHTML = `
            <span class="detail-label">${detail.key}:</span>
            <span class="detail-value">${detail.value}</span>
          `;
          modalProductDetails.appendChild(detailRow);
        }
      });
    }

    // Add event listeners to modal buttons
    const editListingBtn = productDetailsModal.querySelector(".edit-listing-btn");
    editListingBtn.addEventListener("click", () => {
      window.location.href = `list.html?edit=${listing.id}`;
    });

    const deleteListingBtn = productDetailsModal.querySelector(".delete-listing-btn");
    deleteListingBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this listing?")) {
        deleteListing(listing.id);
      }
    });

    // Show modal
    productDetailsModal.style.display = "flex";

    // Add close button event listener
    const closeModalBtn = productDetailsModal.querySelector(".close-modal");
    closeModalBtn.addEventListener("click", closeProductModal);

    // Close modal when clicking outside
    productDetailsModal.addEventListener("click", (e) => {
      if (e.target === productDetailsModal) {
        closeProductModal();
      }
    });
  }

  // Close product modal
  function closeProductModal() {
    productDetailsModal.style.display = "none";
  }

  // Delete listing
  function deleteListing(id) {
    // Filter out the listing with the given id
    const updatedListings = listings.filter(listing => listing.id !== id);
    
    // Save updated listings to localStorage
    localStorage.setItem("listings", JSON.stringify(updatedListings));
    
    // Close modal
    closeProductModal();
    
    // Refresh page
    window.location.reload();
  }
});