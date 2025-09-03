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


function addImageToGallery(url) {
  const img = document.createElement("img");
  img.src = url;
  galleryDiv.appendChild(img);
}

async function loadGallery() {
  const cloudName = "JOUW_CLOUD_NAME"; // vervang met jouw cloud name
  const tag = "friends_uploads";       // dezelfde tag als bij upload

  try {
    const res = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`
    );

    if (!res.ok) throw new Error(`Gallery ophalen mislukt: ${res.status}`);

    const data = await res.json();
    galleryDiv.innerHTML = "";

    if (!data.resources || data.resources.length === 0) {
      galleryDiv.innerHTML = "<p>Nog geen foto's geüpload.</p>";
      return;
    }

    data.resources.forEach(item => addImageToGallery(item.secure_url));

  } catch (err) {
    console.error("Gallery error:", err);
    galleryDiv.innerHTML = "<p>Kon gallery niet laden.</p>";
  }
}



window.onload = loadGallery;
