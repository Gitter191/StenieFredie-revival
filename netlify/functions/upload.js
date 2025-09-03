export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const { file } = body;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file,
          upload_preset: uploadPreset
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
