export function getThumbUrl(video) {
  if (!video?.thumb) return getYouTubeThumbUrl(video?.youtubeId);
  if (video.thumb.startsWith("http")) return video.thumb;
  return video.thumb;
}

export function getYouTubeThumbUrl(youtubeId) {
  if (!youtubeId) return "";
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getVideoId(video) {
  return video?.id ?? video?.thumb ?? video?.sources?.[0];
}

export function isYouTubeVideo(video) {
  return video?.type === "youtube" || Boolean(video?.youtubeId);
}

export function getYouTubeEmbedUrl(video) {
  const id =
    video?.youtubeId ??
    video?.sources?.[0]?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    )?.[1];
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}
