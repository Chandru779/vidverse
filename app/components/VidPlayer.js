"use client";
import React, { useEffect, useRef } from "react";

export const VidPlayer = ({ selectedVideo }) => {
  const ref = useRef()

  // useEffect(()=>{
  //     setTimeout(()=>{
  //       ref.current.muted = false
  //     },500)
  // },[selectedVideo])

  return (
    <div className="w-[100%] lg:w-[70%] flex flex-col gap-2 text-semiwhite">
      <video
        key={selectedVideo?.sources[0]}
        className="flex-grow-1 w-full h-[85%] object-cover lg:rounded-lg focus:outline-none"
        controls
        playsInline
        autoPlay
        // muted
        ref={ref}
      >
        <source src={selectedVideo?.sources[0]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-row justify-between items-center gap-1 px-3 ">
        <p className="text-lg lg:text-2xl font-semibold text-semiwhite/80">
          {selectedVideo?.title}
        </p>
        <p className="text-xs lg:text-md  ">{selectedVideo?.subtitle}</p>
      </div>
      <p className="text-xs md:text-sm lg:text-md text-semiwhite/70 px-3 line-clamp-2 h-full md:h-auto">{selectedVideo?.description}</p>
    </div>
  );
};
