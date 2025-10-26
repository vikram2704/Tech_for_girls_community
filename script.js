let clickCount = 0;
const maxClicks = 5;

function shareOnWhatsApp() {
  if (clickCount >= maxClicks) return;

  const message = "Hey Buddy, Join Tech For Girls Community";
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  clickCount++;
  document.getElementById("shareCount").textContent = `Click count: ${clickCount}/${maxClicks}`;

  if (clickCount === maxClicks) {
    document.getElementById("shareCount").textContent += " — Sharing complete. Please continue.";
  }
}

document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (clickCount < maxClicks) {
    alert("Please complete WhatsApp sharing before submitting.");
    return;
  }

  // Show loading state
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("college", document.getElementById("college").value);
    
    // Only append file if it exists
    const fileInput = document.getElementById("screenshot");
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    // Solution 1: Use a different CORS proxy
    const PROXY_URL = "https://corsproxy.io/?"; // Alternative proxy
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbi0KHfzJFi0wuYfDGPJNL9MLKjseV-eSXZNfYRTK22HwCIrYSSQqpRpCkrHsLKet-gA/exec";
    // const response = await fetch(PROXY_URL + encodeURIComponent(SCRIPT_URL), {
    //   method: "POST",
    //   body: formData,
    //   redirect: "follow"
    // });

   
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
      redirect: "follow"
    });
    
    // Handle the response
    if (response.ok || response.redirected) {
      document.getElementById("message").innerHTML = `
        <div class="success-message">
          🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!
        </div>
      `;
      document.getElementById("registrationForm").reset();
      localStorage.setItem("formSubmitted", "true");
      
      // Disable inputs
      Array.from(document.querySelectorAll("input, button")).forEach(el => {
        el.disabled = true;
      });
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Submission error:", error);
    document.getElementById("message").innerHTML = `
      <div class="error-message">
        ❌ Error: ${error.message || "Please try again later"}
      </div>
    `;
  } finally {
    // Restore button state
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

// Prevent resubmission
window.onload = () => {
  if (localStorage.getItem("formSubmitted") === "true") {
    document.getElementById("message").innerHTML = `
      <div class="success-message">
        🎉 Your submission has already been recorded.
      </div>
    `;
    Array.from(document.querySelectorAll("input, button")).forEach(el => {
      el.disabled = true;
    });
  }
};