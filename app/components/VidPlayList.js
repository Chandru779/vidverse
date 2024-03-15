"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { baseUrl, mediaJSON } from "../../config/config";
import update from "immutability-helper";
import { useDrag, useDrop } from "react-dnd";
import { FiSearch } from "react-icons/fi";
import { GrDrag } from "react-icons/gr";
import Image from "next/image";
import { debounce } from "../../utils";

const PlayListCard = ({
  video,
  index,
  id,
  moveCard,
  setSelectedVideo,
  selectedVideo,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      key={video.thumb}
      data-handler-id={handlerId}
      onClick={() => setSelectedVideo(video)}
      className={`p-2 flex gap-4 cursor-pointer border-b-2 last:border-b-0 border-semiwhite/10  hover:opacity-80  ${
        selectedVideo?.thumb == video?.thumb ? "bg-black" : "bg-navy/15"
      }`}
    >
      <div
        title="Drag and drop on any element you want swap"
        className="hover:cursor-move flex-shrink-0 self-center"
      >
        <GrDrag className="w-5 h-5 opacity-50" />
      </div>
      {/* <div className="w-1/4 h-auto rounded-lg relative bg-red-200">
      <Image
        src={baseUrl + video.thumb}
        fill
        className="h-full w-full bg-blue-100"
      />
      </div> */}
      <img src={baseUrl + video.thumb} className="w-1/4 h-auto rounded-md" />
      <div className="flex flex-col gap-1 overflow-hidden pr-2 justify-between py-2">
        <div>
          <p className=" font-medium text-lg  truncate">{video?.title}</p>
          <p className=" font-medium text-xs ">{video?.subtitle}</p>
        </div>
        <p className=" text-xs truncate text-semiwhite/70">
          {video?.description}
        </p>
      </div>
    </div>
  );
};

export const VidPlayList = ({ setSelectedVideo, selectedVideo }) => {
  let videos = mediaJSON.categories[0].videos;
  const [videoList, setVideoList] = useState(videos);

  const filterVideosBySearchTerm = (val, videos) => {
    console.log(val,videos)
    return videos.filter((video) =>
      video?.title?.toLowerCase().includes(val.toLowerCase())
    );
  };

  // let debounceResult = debounce(filterVideosBySearchTerm, 500);

  const handleSearch = (e) => {
    let val = e.target.value;
    if (val) {
      let filteredvideos = filterVideosBySearchTerm(val, videos);
      // let filteredvideos = debounceResult(val, videos);
      console.log("filteredvideos", filteredvideos);
      setVideoList(filteredvideos);
    } else {
      setVideoList(videos);
    }
  };

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setVideoList((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderCard = useCallback(
    (video, index) => {
      return (
        <PlayListCard
          video={video}
          key={video.thumb}
          index={index}
          id={video.thumb}
          moveCard={moveCard}
          setSelectedVideo={setSelectedVideo}
          selectedVideo={selectedVideo}
        />
      );
    },
    [selectedVideo]
  );

  useEffect(() => {
    setSelectedVideo(videoList[0]);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-[100%] lg:w-[30%] text-semiwhite h-100 overflow-auto sm:overflow-visible lg:overflow-auto px-2">
      <div className="w-full">
        <section className="flex w-full h-10 px-3 md:px-5 py-3 gap-4 items-center bg-transparent border-2 border-semiwhite/10 rounded">
          <input
            type="search"
            className="outline-none bg-transparent w-full font-normal text-semiwhite text-sm md:text-md "
            placeholder="Enter keywords to search videos ..."
            onChange={handleSearch}
          />
          <FiSearch className="w-5 h-5 text-semiwhite" />
        </section>
      </div>
      <div className="h-full overflow-auto rounded-md border-2 border-semiwhite/10">
        {videoList?.length ? (
          videoList.map((video, i) => renderCard(video, i))
        ) : (
          <p className="p-2">No videos were found for your search.</p>
        )}
      </div>
    </div>
  );
};
