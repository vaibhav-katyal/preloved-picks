document.addEventListener("DOMContentLoaded", () => {
    // Initialize EmailJS with your public key
    emailjs.init("-uWyDGVQii17tRIeP") // Replace with your actual public key

    const feedbackForm = document.getElementById("feedbackForm")
    const ratingInputs = document.querySelectorAll('input[name="rating"]')
    const ratingText = document.querySelector(".rating-text")

    // Update rating text when a star is selected
    ratingInputs.forEach((input) => {
        input.addEventListener("change", function () {
            const rating = this.value
            const ratingMessages = {
                1: "Poor - Very Dissatisfied",
                2: "Fair - Somewhat Dissatisfied",
                3: "Average - Neutral",
                4: "Good - Satisfied",
                5: "Excellent - Very Satisfied",
            }
            ratingText.textContent = ratingMessages[rating] || "Select your rating"
        })
    })

    // Handle form submission
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault()

            // Get form values
            const name = document.getElementById("name").value
            const email = document.getElementById("email").value
            const subject = document.getElementById("subject").value
            const message = document.getElementById("message").value

            // Get selected rating
            let rating = "Not rated"
            const selectedRating = document.querySelector('input[name="rating"]:checked')
            if (selectedRating) {
                rating = selectedRating.value + " stars"
            }

            // Show loading state
            const submitButton = feedbackForm.querySelector(".submit-button")
            submitButton.classList.add("loading")

            // Prepare template parameters
            const templateParams = {
                to_email: "vaibhavkatyal12@gmail.com",  // Your receiving email
                from_name: name,  // User's name
                from_email: email, // User's email (must match template)
                subject: subject,
                message: message,
                rating: rating
            };

            // Send email using EmailJS
            emailjs.send("service_j4cuk5x", "template_x92gwsh", templateParams).then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text)

                    // Reset form
                    feedbackForm.reset()
                    ratingText.textContent = "Select your rating"

                    // Show success notification
                    showNotification("Thank you! Your feedback has been submitted successfully.", "success")

                    // Remove loading state
                    submitButton.classList.remove("loading")
                },
                (error) => {
                    console.log("FAILED...", error)

                    // Show error notification
                    showNotification("Sorry, there was an error submitting your feedback. Please try again.", "error")

                    // Remove loading state
                    submitButton.classList.remove("loading")
                }
            )
        })
    }

    // Function to show notification
    function showNotification(message, type = "success") {
        const notification = document.getElementById(type === "success" ? "successNotification" : "errorNotification")
        if (!notification) return

        const messageElement = notification.querySelector(".notification-message")
        if (!messageElement) return

        messageElement.textContent = message
        notification.classList.add("show")

        setTimeout(() => {
            notification.classList.remove("show")
        }, 5000)
    }

    // Initialize cart count
    updateCartCount()

    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.querySelector(".cart-count")
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem("cart")) || []
            cartCount.textContent = cart.length
        }
    }
})
