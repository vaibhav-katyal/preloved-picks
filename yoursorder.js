document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-box input");
    const orderCards = document.querySelectorAll(".order-card");
    
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        
        orderCards.forEach(card => {
            const productName = card.querySelector(".order-info h3").textContent.toLowerCase();
            
            if (productName.includes(searchText)) {
                card.style.display = "flex"; // Show matching order
            } else {
                card.style.display = "none"; // Hide non-matching order
            }
        });
    });
});
