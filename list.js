document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#listingForm"); // Replace with actual form ID
  const titleInput = document.querySelector("#title");
  const categoryInput = document.querySelector("#category");
  const priceInput = document.querySelector("#price");
  const descriptionInput = document.querySelector("#description");

  form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission to handle validation

      let isValid = true;

      // Validate Title
      if (titleInput.value.trim() === "") {
          showError(titleInput, "Title is required.");
          isValid = false;
      } else {
          removeError(titleInput);
      }

      // Validate Category
      if (categoryInput.value === "") {
          showError(categoryInput, "Please select a category.");
          isValid = false;
      } else {
          removeError(categoryInput);
      }

      // Validate Price (Ensure it's a positive number)
      if (priceInput.value.trim() === "" || isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) {
          showError(priceInput, "Enter a valid price.");
          isValid = false;
      } else {
          removeError(priceInput);
      }

      // Validate Description
      if (descriptionInput.value.trim().length < 10) {
          showError(descriptionInput, "Description must be at least 10 characters long.");
          isValid = false;
      } else {
          removeError(descriptionInput);
      }

      // If all validations pass, submit the form or process the data
      if (isValid) {
          alert("Form submitted successfully!");
          form.submit();
      }
  });

  function showError(input, message) {
      const errorMessage = input.nextElementSibling;
      if (errorMessage) {
          errorMessage.textContent = message;
          errorMessage.style.color = "red";
      } else {
          const errorElement = document.createElement("span");
          errorElement.textContent = message;
          errorElement.style.color = "red";
          errorElement.style.fontSize = "12px";
          input.parentNode.appendChild(errorElement);
      }
  }

  function removeError(input) {
      const errorMessage = input.nextElementSibling;
      if (errorMessage) {
          errorMessage.remove();
      }
  }
});
