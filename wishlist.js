document.addEventListener("DOMContentLoaded", function () {
    const wishlistGrid = document.querySelector(".wishlist-grid");
    const searchInput = document.querySelector(".search-box input");
    
    // Function to remove an item from the wishlist
    function removeItem(event) {
        const item = event.target.closest(".wishlist-item");
        if (item) {
            item.remove();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const wishlist = document.querySelector(".wishlist-grid");
        let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    
        function updateLocalStorage() {
            const currentItems = Array.from(document.querySelectorAll(".wishlist-item")).map(item => ({
                name: item.querySelector("h3").textContent,
                price: item.querySelector("p").textContent,
                image: item.querySelector("img").src
            }));
            localStorage.setItem("wishlist", JSON.stringify(currentItems));
        }
    
        function removeFromWishlist(itemElement) {
            const itemName = itemElement.querySelector("h3").textContent;
        
            // Filter out the removed item from localStorage data
            wishlistItems = wishlistItems.filter(item => item.name !== itemName);
        
            // Update localStorage
            localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        
            // Remove the item from the DOM
            itemElement.remove();
        }

        document.addEventListener("DOMContentLoaded", () => {
            const wishlist = document.querySelector(".wishlist-grid");
            let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
            let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        
            function updateLocalStorage() {
                const currentItems = Array.from(document.querySelectorAll(".wishlist-item")).map(item => ({
                    name: item.querySelector("h3").textContent,
                    price: item.querySelector("p").textContent,
                    image: item.querySelector("img").src
                }));
                localStorage.setItem("wishlist", JSON.stringify(currentItems));
            }
        
            function removeFromWishlist(itemElement) {
                itemElement.remove();
                updateLocalStorage();
            }
        
            function addToCart(item) {
                cartItems.push(item);
                localStorage.setItem("cart", JSON.stringify(cartItems));
            }
        
            wishlist.addEventListener("click", (event) => {
                const itemElement = event.target.closest(".wishlist-item");
        
                if (event.target.classList.contains("remove-button")) {
                    removeFromWishlist(itemElement);
                } else if (event.target.classList.contains("add-to-cart-button")) {
                    const item = {
                        name: itemElement.querySelector("h3").textContent,
                        price: itemElement.querySelector("p").textContent,
                        image: itemElement.querySelector("img").src
                    };
                    addToCart(item);
                    alert("Item added to cart!");
                }
            });
        
            function loadWishlist() {
                wishlist.innerHTML = "";
                wishlistItems.forEach(item => {
                    const itemElement = document.createElement("div");
                    itemElement.classList.add("wishlist-item");
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                        <button class="add-to-cart-button">Add to Cart</button>
                        <button class="remove-button">Remove</button>
                    `;
                    wishlist.appendChild(itemElement);
                });
            }
        
            loadWishlist();
        });
        
    
        function loadWishlist() {
            wishlist.innerHTML = "";
            wishlistItems.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("wishlist-item");
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                    <button class="add-to-cart-button">Add to Cart</button>
                    <button class="remove-button">Remove</button>
                `;
                wishlist.appendChild(itemElement);
            });
        }
    
        loadWishlist();
    });
    
    
    

    // Attach event listeners to existing remove buttons
    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", removeItem);
    });

    // Function to add a new item to the wishlist (for demo purposes)
    function addItem(name, price, imageUrl) {
        const item = document.createElement("div");
        item.classList.add("wishlist-item");
        item.innerHTML = `
            <img src="${imageUrl}" alt="${name}">
            <div class="wishlist-info">
                <h3>${name}</h3>
                <p>$${price}</p>
                <button class="remove-button">Remove</button>
            </div>
        `;
        wishlistGrid.appendChild(item);
        item.querySelector(".remove-button").addEventListener("click", removeItem);
    }

    // Example: Add a new item dynamically
    // addItem("New Item", "120", "https://via.placeholder.com/180");

    // Search functionality
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll(".wishlist-item").forEach(item => {
            const itemName = item.querySelector("h3").textContent.toLowerCase();
            if (itemName.includes(query)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});
