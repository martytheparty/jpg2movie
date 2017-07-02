# jpg2movie

## I use this to take my pictures and turn them into movies.  All you need to do is:
### assuming you have node and nvm installed...


### from the command line:
* git clone https://github.com/martytheparty/jpg2movie.git
* npm install
* nvm use
* node all

### then a movie will be made into a movie with the following attributes:
* images src "./raw_photos/tempfs" - defined in all.js
* song src "./mp3s/insanity.mp3" - defined in all.js
* config ("./config/movie.js")
{
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
}

### tweak those to your needs.

#### I am assuming that no one will actually try this... if you do and it doesn't
work let me know. 
