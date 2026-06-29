"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getThumbUrl, getVideoId, getYouTubeThumbUrl } from "../../config/config";
import { useDrag, useDrop } from "react-dnd";
import { FiSearch } from "react-icons/fi";
import { GrDrag } from "react-icons/gr";

function moveItem(list, dragIndex, hoverIndex) {
  const next = [...list];
  const [removed] = next.splice(dragIndex, 1);
  next.splice(hoverIndex, 0, removed);
  return next;
}

const PlayListCard = ({
  video,
  index,
  moveCard,
  setSelectedVideo,
  selectedVideo,
  isDragEnabled,
}) => {
  const ref = useRef(null);
  const videoId = getVideoId(video);
  const [thumbSrc, setThumbSrc] = useState(() => getThumbUrl(video));

  useEffect(() => {
    setThumbSrc(getThumbUrl(video));
  }, [video]);

  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    canDrop: () => isDragEnabled,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current || !isDragEnabled) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    canDrag: () => isDragEnabled,
    item: () => ({ id: videoId, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (isDragEnabled) {
    drag(drop(ref));
  }

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      onClick={() => setSelectedVideo(video)}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={`p-2 flex gap-4 cursor-pointer border-b-2 last:border-b-0 border-semiwhite/10 hover:opacity-80 ${
        getVideoId(selectedVideo) === videoId ? "bg-black" : "bg-navy/15"
      }`}
    >
      <div
        title={
          isDragEnabled
            ? "Drag and drop to reorder"
            : "Clear search to reorder playlist"
        }
        onClick={(e) => e.stopPropagation()}
        className={`flex-shrink-0 self-center ${
          isDragEnabled ? "hover:cursor-move" : "opacity-30 cursor-not-allowed"
        }`}
      >
        <GrDrag className="w-5 h-5 opacity-50" />
      </div>
      <img
        src={thumbSrc}
        alt={video.title}
        className="w-1/4 aspect-video rounded-md object-cover bg-black/30"
        onError={() => {
          const fallback = getYouTubeThumbUrl(video.youtubeId);
          if (fallback && thumbSrc !== fallback) setThumbSrc(fallback);
        }}
      />
      <div className="flex flex-col gap-1 overflow-hidden pr-2 justify-between py-2 min-w-0 flex-1">
        <div>
          <p className="font-medium text-lg truncate">{video?.title}</p>
          <p className="font-medium text-xs">{video?.subtitle}</p>
        </div>
        <p className="text-xs truncate text-semiwhite/70">{video?.description}</p>
      </div>
    </div>
  );
};

export const VidPlayList = ({ setSelectedVideo, selectedVideo }) => {
  const [orderedVideos, setOrderedVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to load videos");
        const data = await res.json();
        const videos = data?.categories?.[0]?.videos ?? [];
        if (!cancelled) {
          setOrderedVideos(videos);
          if (videos[0]) setSelectedVideo(videos[0]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load videos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [setSelectedVideo]);

  const isDragEnabled = !searchQuery.trim();

  const videoList = searchQuery.trim()
    ? orderedVideos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : orderedVideos;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setOrderedVideos((prev) => moveItem(prev, dragIndex, hoverIndex));
  }, []);

  const renderCard = useCallback(
    (video, index) => (
      <PlayListCard
        video={video}
        key={getVideoId(video)}
        index={index}
        moveCard={moveCard}
        setSelectedVideo={setSelectedVideo}
        selectedVideo={selectedVideo}
        isDragEnabled={isDragEnabled}
      />
    ),
    [moveCard, selectedVideo, setSelectedVideo, isDragEnabled]
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-[100%] lg:w-[30%] text-semiwhite px-2">
        <p className="p-4 text-semiwhite/70">Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-[100%] lg:w-[30%] text-semiwhite px-2">
        <p className="p-4 text-tomato">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-[100%] lg:w-[30%] text-semiwhite h-100 overflow-auto sm:overflow-visible lg:overflow-auto px-2">
      <div className="w-full">
        <section className="flex w-full h-10 px-3 md:px-5 py-3 gap-4 items-center bg-transparent border-2 border-semiwhite/10 rounded">
          <input
            type="search"
            value={searchQuery}
            className="outline-none bg-transparent w-full font-normal text-semiwhite text-sm md:text-md"
            placeholder="Enter keywords to search videos ..."
            onChange={handleSearch}
          />
          <FiSearch className="w-5 h-5 text-semiwhite" />
        </section>
      </div>
      <div className="h-full overflow-auto rounded-md border-2 border-semiwhite/10">
        {videoList.length ? (
          videoList.map((video, i) => renderCard(video, i))
        ) : (
          <p className="p-2">No videos were found for your search.</p>
        )}
      </div>
    </div>
  );
};
