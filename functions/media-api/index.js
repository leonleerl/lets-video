exports.handler = async (event) => {
  const method = event.requestContext?.http?.method || "GET";
  const path = event.rawPath || "/";

  const body = {
    service: "letsvideo-media-api",
    status: "ok",
    phase: 3,
    message:
      "Media API infrastructure is deployed. Upload and playback endpoints arrive in later phases.",
    method,
    path,
    buckets: {
      source: process.env.SOURCE_BUCKET_NAME || null,
      media: process.env.MEDIA_BUCKET_NAME || null,
    },
  };

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "http://localhost:3000",
    },
    body: JSON.stringify(body),
  };
};
