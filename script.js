const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("gallery");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) return;

  // Converteer naar Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const base64 = reader.result;

    const res = await fetch("/.netlify/functions/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: base64 })
    });

    const data = await res.json();

    // Toon nieuwe foto in de galerij
    const img = document.createElement("img");
    img.src = data.secure_url;
    img.width = 200;
    gallery.appendChild(img);
  };
});
