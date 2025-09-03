// netlify/functions/gallery.js
export async function handler() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const tag = "friends_uploads";

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?tags=${tag}&max_results=50`,
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data.resources) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
