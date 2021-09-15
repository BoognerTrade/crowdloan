import React from 'react';
import ReactPlayer from 'react-player';

const videoPlayerStyle = {
  border: '0.5px solid #70e6da',
  marginLeft: '0px',
};

const EmbedVideo = () => (
  <ReactPlayer
    className='react-player fixed-bottom'
    url='./video/Video.mp4'
    width='100%'
    height='100%'
    // controls={true}
    // playing
    controls
    // style={videoPlayerStyle}
    // light = {true}
    // light="./Images/element_.png"
  />
);

export default EmbedVideo;
