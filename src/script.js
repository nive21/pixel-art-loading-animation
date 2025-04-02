function biasedRandomAlpha(targetAlpha, variance = 0.3) {
  let deviation = (Math.random() - 0.5) * 4 * variance;
  return Math.min(1, Math.max(0, targetAlpha + deviation));
}

function drawPixelGrid(finalAlphaValues) {
  const canvas = document.getElementById("pixelGridCanvas");
  const ctx = canvas.getContext("2d");
  const pixelSize = 8;
  const rows = 20;
  const cols = 20;

  canvas.width = cols * pixelSize;
  canvas.height = rows * pixelSize;

  function easeOut(t) {
    return t * (2 - t);
  }

  // Draw the grid with initial alpha values
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const alpha = biasedRandomAlpha(finalAlphaValues[row][col], 0.4);
      ctx.fillStyle = `rgba(255, 152, 253, ${alpha})`;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    }
  }

  // Animate the transition to final alpha values
  const duration = 4000; // Time for the transition
  let startTime = null;

  function animateGrid(timestamp) {
    if (!startTime) startTime = timestamp; // Initialize the start time
    const rawProgress = Math.min((timestamp - startTime) / duration, 1);
    const progress = easeOut(rawProgress);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const startAlpha = biasedRandomAlpha(finalAlphaValues[row][col], 0.4);
        const endAlpha = finalAlphaValues[row][col];
        const alpha = startAlpha + (endAlpha - startAlpha) * progress;

        ctx.fillStyle = `rgba(255, 152, 253, ${alpha})`;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    if (progress < 1) {
      requestAnimationFrame(animateGrid); // Continue the animation
    }
  }

  requestAnimationFrame(animateGrid); // Start the animation
}

function startViewportFlicker() {
  const canvas = document.getElementById("viewportCanvas");
  const ctx = canvas.getContext("2d");
  const pixelSize = 8;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cols = Math.ceil(canvas.width / pixelSize);
  const rows = Math.ceil(canvas.height / pixelSize);

  let elapsedTime = 0; // Track elapsed time
  const duration = 1000; // Total duration of the flicker effect in milliseconds

  function drawFlicker() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the minimum alpha based on elapsed time
    const progress = Math.min(elapsedTime / duration, 1); // Progress from 0 to 1
    const minAlpha = progress; // Start at 0 and increase to 0.5

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const alpha = Math.random() * (0.5 - minAlpha) + minAlpha; // Alpha increases over time
        ctx.fillStyle = `rgba(255, 152, 253, ${alpha})`;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    elapsedTime += 100; // Increment elapsed time by the interval duration
  }

  const flickerInterval = setInterval(drawFlicker, 100);

  setTimeout(() => {
    clearInterval(flickerInterval);
    document.body.style.background = "rgba(255, 152, 253, 1)";

    // Remove the pixel grid and canvas
    const pixelGridCanvas = document.getElementById("pixelGridCanvas");
    if (pixelGridCanvas) pixelGridCanvas.remove();
    canvas.remove();
  }, duration);
}

fetch(
  "https://raw.githubusercontent.com/nive21/pixel-art-loading-animation/main/full_opacity_values.json"
)
  .then((response) => response.json())
  .then((finalAlphaValues) => {
    drawPixelGrid(finalAlphaValues); // Start pixel grid animation
    setTimeout(startViewportFlicker, 3600); // Start viewport flicker after pixel grid animation
  })
  .catch((error) => console.error("Error loading opacity values:", error));
