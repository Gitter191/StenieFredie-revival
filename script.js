const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const galleryDiv = document.getElementById("gallery");

// 🔹 Upload foto
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Kies eerst een foto!");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    try {
      const res = await fetch("/.netlify/functions/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      console.log("Upload response:", data);

      if (data.secure_url) {
        addImageToGallery(data.secure_url);
      } else {
        console.error("Geen secure_url ontvangen:", data);
      }
    } catch (err) {
      console.error("Upload mislukt:", err);
    }
  };

  reader.readAsDataURL(file);
});

// 🔹 Gallery laden vanaf Cloudinary folder
async function loadGallery() {
  const cloudName = "dypgfbyjz"; // vervang met jouw cloudname
  const folder = "friends_uploads";    // moet overeenkomen met Cloudinary folder

  try {
    const res = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/list/${folder}.json`
    );

    if (!res.ok) throw new Error("Gallery ophalen mislukt");

    const data = await res.json();
    galleryDiv.innerHTML = "";

    data.resources.forEach((item) => {
      addImageToGallery(item.secure_url);
    });
  } catch (err) {
    console.error("Gallery error:", err);
  }
}

function addImageToGallery(url) {
  const img = document.createElement("img");
  img.src = url;
  galleryDiv.appendChild(img);
}

window.onload = loadGallery;
