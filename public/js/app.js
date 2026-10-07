const form = document.querySelector("#preview-form");
const input = document.querySelector("#url-input");
const button = document.querySelector("#generate-button");
const status = document.querySelector("#status");
const result = document.querySelector("#result");


form.addEventListener("submit", async (event) => {

  // Stop the browser from refreshing the page
  event.preventDefault();


  const url = input.value.trim();


  if (!url) {
    showStatus("Please enter a URL.", "error");
    return;
  }


  // Show loading state

  button.disabled = true;

  button.textContent = "Loading...";

  showStatus(
    "Sending URL to the backend...",
    "loading"
  );


  try {

    const response = await fetch("/api/preview", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url: url
      })

    });


    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        data.error || "Something went wrong."
      );
    }


    console.log("Response from backend:", data);


    renderPreview(data.data);


    showStatus(
      "Preview generated successfully.",
      "success"
    );


  } catch (error) {

    console.error(error);

    showStatus(
      error.message,
      "error"
    );

    renderError(error.message);


  } finally {

    button.disabled = false;

    button.textContent = "Generate";

  }

});

function showStatus(message, type) {

  status.textContent = message;

  status.className = `status ${type}`;

}

function renderPreview(data) {

  const image = data.image
    ? `
      <img
        src="${data.image}"
        alt=""
        class="preview-image"
      >
    `
    : `
      <div class="image-placeholder">
        No preview image
      </div>
    `;


  result.innerHTML = `

    <article class="preview-card">

      ${image}

      <div class="preview-content">

        <p class="preview-domain">
          ${data.domain}
        </p>

        <h2>
          ${data.title}
        </h2>

        <p class="preview-description">
          ${data.description}
        </p>

        <a
          class="preview-link"
          href="${data.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit website ↗
        </a>

      </div>

    </article>

  `;

}

function renderError(message) {

  result.innerHTML = `

    <div class="error-state">

      <div class="error-icon">
        !
      </div>

      <h2>
        Couldn't generate preview
      </h2>

      <p>
        ${message}
      </p>

    </div>

  `;

}