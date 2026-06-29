"use client";
import React, { useRef } from "react";
import {
  getThumbUrl,
  getYouTubeEmbedUrl,
  isYouTubeVideo,
} from "../../config/config";

export const VidPlayer = ({ selectedVideo }) => {
  const ref = useRef();

  const embedUrl = selectedVideo ? getYouTubeEmbedUrl(selectedVideo) : null;
  const isYoutube = selectedVideo ? isYouTubeVideo(selectedVideo) : false;

  return (
    <div className="w-[100%] lg:w-[70%] flex flex-col gap-2 text-semiwhite">
      {selectedVideo ? (
        isYoutube && embedUrl ? (
          <iframe
            key={embedUrl}
            title={selectedVideo.title}
            src={embedUrl}
            className="flex-grow-1 w-full h-[85%] lg:rounded-lg bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={selectedVideo.sources[0]}
            className="flex-grow-1 w-full h-[85%] object-cover lg:rounded-lg focus:outline-none bg-black"
            controls
            playsInline
            autoPlay
            preload="metadata"
            poster={getThumbUrl(selectedVideo)}
            ref={ref}
          >
            <source src={selectedVideo.sources[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        <div className="flex-grow-1 w-full h-[85%] flex items-center justify-center rounded-lg bg-black/40">
          <p className="text-semiwhite/70">Select a video from the playlist</p>
        </div>
      )}
      <div className="flex flex-row justify-between items-center gap-1 px-3">
        <p className="text-lg lg:text-2xl font-semibold text-semiwhite/80">
          {selectedVideo?.title}
        </p>
        <p className="text-xs lg:text-md">{selectedVideo?.subtitle}</p>
      </div>
      <p className="text-xs md:text-sm lg:text-md text-semiwhite/70 px-3 line-clamp-2 h-full md:h-auto">
        {selectedVideo?.description}
      </p>
    </div>
  );
};
