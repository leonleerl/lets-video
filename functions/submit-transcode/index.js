exports.handler = async (event) => {
  const records = event.Records || [];

  for (const record of records) {
    let body = record.body;
    try {
      body = JSON.parse(record.body);
    } catch {
      // keep raw body
    }

    console.log(
      JSON.stringify({
        operation: "submit-transcode",
        status: "received",
        messageId: record.messageId,
        body,
        enable4k: process.env.ENABLE_4K_TRANSCODING,
        keepOriginal: process.env.KEEP_ORIGINAL_UPLOADS,
        mediaBucket: process.env.MEDIA_BUCKET_NAME,
        mediaConvertRoleArn: process.env.MEDIACONVERT_ROLE_ARN,
      }),
    );
  }

  // Phase 5 will create MediaConvert jobs here.
  return { ok: true, received: records.length };
};
