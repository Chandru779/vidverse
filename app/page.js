"use client"
import { VidPlayer } from "@/components/VidPlayer";
import { VidPlayList } from "@/components/VidPlayList";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  const [selectedVideo,setSelectedVideo] = useState()
  return (
    <main className="h-screen flex flex-col lg:flex-row md:px-8 md:py-8 gap-4 bg-gradient-to-tr from-navy to-semigrey">
      <VidPlayer selectedVideo={selectedVideo} />
      <DndProvider backend={HTML5Backend}>
        <VidPlayList setSelectedVideo = {setSelectedVideo} selectedVideo={selectedVideo}/>
      </DndProvider>
    </main>
  );
}
