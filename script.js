const fileInput = document.getElementById("fileInput");
const uploadArea = document.querySelector(".upload-area");
const progressBar = document.getElementById("progressBar");
const sliderInput = document.getElementById("sliderInput");
const originalImage = document.getElementById("originalImage");
const processedImage = document.getElementById("processedImage");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");

let processedBlob = null;

// =========================
// THEME TOGGLE
// =========================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// =========================
// DRAG & DROP
// =========================
uploadArea.addEventListener("click", () => fileInput.click());

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = "var(--primary-hover)";
});
uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.borderColor = "var(--primary)";
});
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) handleUpload(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) handleUpload(file);
});

// =========================
// HANDLE UPLOAD + API CALL
// =========================
async function handleUpload(file) {
  originalImage.src = URL.createObjectURL(file);
  processedImage.src = "";
  downloadBtn.disabled = true;
  processedBlob = null;

  progressBar.value = 20;

  const formData = new FormData();
  formData.append("image_file", file);

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": "pHxepkDgY7VtVEhKVcWz5wbD" },
      body: formData,
    });

    if (!response.ok) throw new Error("❌ API request failed");

    progressBar.value = 60;
    processedBlob = await response.blob();

    processedImage.src = URL.createObjectURL(processedBlob);
    progressBar.value = 100;

    downloadBtn.disabled = false; // ✅ Enable download
  } catch (err) {
    alert("Background removal failed. Check console.");
    console.error(err);
  }
}

// =========================
// SLIDER CONTROL
// =========================
sliderInput.addEventListener("input", (e) => {
  const slider = document.querySelector(".slider");
  slider.style.width = `${e.target.value}%`;
});

// =========================
// DOWNLOAD BUTTON
// =========================
downloadBtn.addEventListener("click", () => {
  if (!processedBlob) {
    alert("No processed image to download yet!");
    return;
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(processedBlob);
  link.download = "background-removed.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

