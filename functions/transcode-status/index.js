exports.handler = async (event) => {
  const detail = event.detail || {};

  console.log(
    JSON.stringify({
      operation: "transcode-status",
      status: detail.status || "unknown",
      jobId: detail.jobId || null,
      familyId: detail.userMetadata?.familyId || null,
      videoId: detail.userMetadata?.videoId || null,
      outputGroupDetails: detail.outputGroupDetails || null,
    }),
  );

  // Phase 5 will update Supabase video status / renditions here.
  return { ok: true };
};
