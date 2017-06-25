let videoOptions = {
  fps: 25,
  loop: .5, // seconds
  transition: false,
  transitionDuration: .1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
};

exports.videoOptions = videoOptions;
