function getActiveVideo(){
    const videos = document.getElementsByTagName('video');
    if(!videos.length)
        return null;

// prefer the currently playing video
    for(const video of videos){
        if(!video.paused)
            return video;
    }    

// fallback to first video
    return videos[0];
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const video = getActiveVideo();
  if (!video) return;

  switch (message.action) {
    case "PLAY":
      video.play();
      break;

    case "PAUSE":
      video.pause();
      break;

    case "VOLUME_UP":
      video.volume = Math.min(video.volume + 0.1, 1);
      break;

    case "VOLUME_DOWN":
      video.volume = Math.max(video.volume - 0.1, 0);
      break;
  }
});