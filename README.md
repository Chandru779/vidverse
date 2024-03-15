## Instructions

1. git clone [https://github.com/Chandru779/vidverse.git](https://github.com/Chandru779/vidverse.git) 
2. npm install
3. npm run dev
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Overview

1. `Video player` with controls like `play, pause, seek, timer, autoplay, speedselector, fullscreen, miniplayer`
2. `Playlist`, with `search` functionality and also user can `shuffle` the videos, video list with title, subtitle and description info
3. Implemented  `responsive` design, for various screen size
4. Click on playlist, `highlighted the selected` video and `autoplaying`
5. On load, `shows first video`
6. `Next js` and `Tailwind CSS` used for project

------------------------------------------------

1. No external library is used for video player but used , default video Player
2. Used react-dnd library for reordering or shuffling the videos in playlist

## Project Structure

1. `app` root directory
2. `components` for components ,added in app directory
3. `utils` added debounce for search in utils folder , but not used for now
4. `config` for dummy videos and base url
