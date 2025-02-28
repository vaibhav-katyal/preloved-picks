document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.querySelector("#listingForm");
  const photoUpload = document.querySelector("#photoUpload");
  const videoUpload = document.querySelector("#videoUpload");
  const mediaPreview = document.querySelector("#mediaPreview");
  const takePhotoBtn = document.querySelector("#takePhotoBtn");
  const titleInput = document.querySelector("#title");
  const categoryInput = document.querySelector("#category");
  const brandInput = document.querySelector("#brand");
  const sizeInput = document.querySelector("#size");
  const conditionInputs = document.querySelectorAll('input[name="condition"]');
  const descriptionInput = document.querySelector("#description");
  const priceInput = document.querySelector("#price");
  const shippingBtn = document.querySelector("#shippingBtn");
  const cancelBtn = document.querySelector("#cancelBtn");
  const addDetailBtn = document.querySelector("#addDetailBtn");
  const productDetailsContainer = document.querySelector("#productDetailsContainer");

  // State
  let mediaFiles = {
    images: [],
    videos: []
  };
  let shippingIncluded = false;
  let cameraStream = null;

  // Initialize
  setupEventListeners();

  // Setup event listeners
  function setupEventListeners() {
    // Photo upload
    photoUpload.addEventListener("change", handlePhotoUpload);
    
    // Video upload
    videoUpload.addEventListener("change", handleVideoUpload);
    
    // Take photo button
    takePhotoBtn.addEventListener("click", openCamera);
    
    // Shipping button toggle
    shippingBtn.addEventListener("click", toggleShipping);
    
    // Add product detail
    addDetailBtn.addEventListener("click", addProductDetail);
    
    // Remove product detail (delegated event)
    productDetailsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-detail-btn")) {
        e.target.closest(".product-detail-row").remove();
      }
    });
    
    // Cancel button
    cancelBtn.addEventListener("click", handleCancel);
    
    // Form submission
    form.addEventListener("submit", handleSubmit);
  }

  // Handle photo upload
  function handlePhotoUpload(e) {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Filter for images only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Check if adding these would exceed the limit
    if (mediaFiles.images.length + imageFiles.length > 10) {
      alert('You can only upload up to 10 images');
      return;
    }
    
    // Process each file
    imageFiles.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        if (!event.target) return;
        
        const imageUrl = event.target.result;
        
        // Add to media files array
        mediaFiles.images.push({
          file: file,
          url: imageUrl
        });
        
        // Update preview
        updateMediaPreview();
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Handle video upload
  function handleVideoUpload(e) {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    // Filter for videos only
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    // Check if adding these would exceed the limit
    if (mediaFiles.videos.length + videoFiles.length > 2) {
      alert('You can only upload up to 2 videos');
      return;
    }
    
    // Process each file
    videoFiles.forEach(file => {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        if (!event.target) return;
        
        const videoUrl = event.target.result;
        
        // Add to media files array
        mediaFiles.videos.push({
          file: file,
          url: videoUrl
        });
        
        // Update preview
        updateMediaPreview();
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Update media preview
  function updateMediaPreview() {
    // Clear preview
    mediaPreview.innerHTML = '';
    
    // Add images
    mediaFiles.images.forEach((image, index) => {
      const mediaItem = document.createElement('div');
      mediaItem.className = 'media-item';
      
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = `Image ${index + 1}`;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', () => removeMedia('image', index));
      
      mediaItem.appendChild(img);
      mediaItem.appendChild(removeBtn);
      
      // Add cover badge to first image
      if (index === 0) {
        const coverBadge = document.createElement('div');
        coverBadge.className = 'cover-badge';
        coverBadge.textContent = 'Cover Photo';
        mediaItem.appendChild(coverBadge);
      }
      
      mediaPreview.appendChild(mediaItem);
    });
    
    // Add videos
    mediaFiles.videos.forEach((video, index) => {
      const mediaItem = document.createElement('div');
      mediaItem.className = 'media-item';
      
      const videoElement = document.createElement('video');
      videoElement.src = video.url;
      videoElement.muted = true;
      videoElement.addEventListener('mouseover', () => videoElement.play());
      videoElement.addEventListener('mouseout', () => videoElement.pause());
      
    //   const removeBtn = document.createElement(' ```
    //   )
      videoElement.addEventListener('mouseout', () => videoElement.pause());
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.addEventListener('click', () => removeMedia('video', index));
      
      const videoBadge = document.createElement('div');
      videoBadge.className = 'video-badge';
      videoBadge.textContent = 'Video';
      
      mediaItem.appendChild(videoElement);
      mediaItem.appendChild(removeBtn);
      mediaItem.appendChild(videoBadge);
      
      mediaPreview.appendChild(mediaItem);
    });
  }

  // Remove media
  function removeMedia(type, index) {
    if (type === 'image') {
      mediaFiles.images.splice(index, 1);
    } else {
      mediaFiles.videos.splice(index, 1);
    }
    
    updateMediaPreview();
  }

  // Open camera
  function openCamera() {
    // Create camera UI
    const cameraContainer = document.createElement('div');
    cameraContainer.className = 'camera-container';
    
    const cameraView = document.createElement('div');
    cameraView.className = 'camera-view';
    
    const video = document.createElement('video');
    video.autoplay = true;
    
    const cameraControls = document.createElement('div');
    cameraControls.className = 'camera-controls';
    
    const captureBtn = document.createElement('button');
    captureBtn.className = 'camera-btn capture';
    captureBtn.innerHTML = '📸';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'camera-btn close';
    closeBtn.innerHTML = '✕';
    
    cameraView.appendChild(video);
    cameraControls.appendChild(captureBtn);
    cameraControls.appendChild(closeBtn);
    
    cameraContainer.appendChild(cameraView);
    cameraContainer.appendChild(cameraControls);
    
    document.body.appendChild(cameraContainer);
    
    // Access camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        cameraStream = stream;
        
        // Capture photo
        captureBtn.addEventListener('click', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageUrl = canvas.toDataURL('image/jpeg');
          
          // Create a file from the data URL
          fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
              
              // Check if adding this would exceed the limit
              if (mediaFiles.images.length >= 10) {
                alert('You can only upload up to 10 images');
                return;
              }
              
              // Add to media files array
              mediaFiles.images.push({
                file: file,
                url: imageUrl
              });
              
              // Update preview
              updateMediaPreview();
              
              // Close camera
              closeCamera();
            });
        });
        
        // Close camera
        closeBtn.addEventListener('click', closeCamera);
      })
      .catch(error => {
        alert('Error accessing camera: ' + error.message);
        cameraContainer.remove();
      });
  }

  // Close camera
  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    
    const cameraContainer = document.querySelector('.camera-container');
    if (cameraContainer) {
      cameraContainer.remove();
    }
  }

  // Toggle shipping
  function toggleShipping() {
    shippingIncluded = !shippingIncluded;
    
    if (shippingIncluded) {
      shippingBtn.classList.add('active');
      shippingBtn.textContent = 'Shipping included ✓';
    } else {
      shippingBtn.classList.remove('active');
      shippingBtn.textContent = 'Shipping included in price';
    }
    
    shippingBtn.dataset.included = shippingIncluded.toString();
  }

  // Add product detail
  function addProductDetail() {
    const detailRow = document.createElement('div');
    detailRow.className = 'product-detail-row';
    
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'detail-key';
    keyInput.placeholder = 'Detail name (e.g. Color)';
    
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'detail-value';
    valueInput.placeholder = 'Detail value (e.g. Black)';
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-detail-btn';
    removeBtn.innerHTML = '×';
    
    detailRow.appendChild(keyInput);
    detailRow.appendChild(valueInput);
    detailRow.appendChild(removeBtn);
    
    productDetailsContainer.appendChild(detailRow);
  }

  // Handle cancel
  function handleCancel() {
    if (confirm('Are you sure you want to cancel? All your data will be lost.')) {
      resetForm();
    }
  }

  // Reset form
  function resetForm() {
    form.reset();
    mediaFiles = { images: [], videos: [] };
    updateMediaPreview();
    
    // Reset shipping
    shippingIncluded = false;
    shippingBtn.classList.remove('active');
    shippingBtn.textContent = 'Shipping included in price';
    shippingBtn.dataset.included = 'false';
    
    // Reset product details
    productDetailsContainer.innerHTML = '';
    addProductDetail();
    
    // Clear any error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
  }

  // Validate form
  function validateForm() {
    let isValid = true;
    
    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
    
    // Validate title
    if (!titleInput.value.trim()) {
      showError(titleInput, 'Title is required');
      isValid = false;
    }
    
    // Validate category
    if (categoryInput.value === '') {
      showError(categoryInput, 'Please select a category');
      isValid = false;
    }
    
    // Validate price
    if (!priceInput.value.trim()) {
      showError(priceInput, 'Price is required');
      isValid = false;
    } else if (isNaN(parseFloat(priceInput.value)) || parseFloat(priceInput.value) <= 0) {
      showError(priceInput, 'Please enter a valid price');
      isValid = false;
    }
    
    // Validate description
    if (!descriptionInput.value.trim()) {
      showError(descriptionInput, 'Description is required');
      isValid = false;
    } else if (descriptionInput.value.trim().length < 10) {
      showError(descriptionInput, 'Description must be at least 10 characters');
      isValid = false;
    }
    
    // Validate media
    if (mediaFiles.images.length === 0) {
      showError(document.querySelector('.photo-buttons'), 'At least one image is required');
      isValid = false;
    }
    
    return isValid;
  }

  // Show error message
  function showError(element, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    element.parentNode.insertBefore(errorMessage, element.nextSibling);
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Get selected condition
    let selectedCondition = '';
    conditionInputs.forEach(input => {
      if (input.checked) {
        selectedCondition = input.value;
      }
    });
    
    // Get product details
    const productDetails = [];
    const detailRows = productDetailsContainer.querySelectorAll('.product-detail-row');
    
    detailRows.forEach(row => {
      const key = row.querySelector('.detail-key').value.trim();
      const value = row.querySelector('.detail-value').value.trim();
      
      if (key && value) {
        productDetails.push({ key, value });
      }
    });
    
    // Create listing object
    const listing = {
      id: Date.now().toString(),
      title: titleInput.value.trim(),
      category: categoryInput.value,
      brand: brandInput.value.trim(),
      size: sizeInput.value.trim(),
      condition: selectedCondition,
      description: descriptionInput.value.trim(),
      price: parseFloat(priceInput.value),
      shippingIncluded: shippingIncluded,
      productDetails: productDetails,
      images: mediaFiles.images.map(image => image.url),
      videos: mediaFiles.videos.map(video => video.url),
      dateAdded: new Date().toISOString()
    };
    
    // Save to localStorage
    saveListingToLocalStorage(listing);
    
    // Show success message
    alert('Item listed successfully!');
    
    // Reset form
    resetForm();
    
    // Redirect to listings page
    window.location.href = 'yourlisting.html';
  }

  // Save listing to localStorage
  function saveListingToLocalStorage(listing) {
    // Get existing listings
    let listings = JSON.parse(localStorage.getItem('listings') || '[]');
    
    // Add new listing
    listings.push(listing);
    
    // Save back to localStorage
    localStorage.setItem('listings', JSON.stringify(listings));
  }
});