import styled from 'react-emotion';
import media from '../../utils/media';

export const VideoWrapper = styled.div`
  display: flex;
      justify-content: center;
  }

  .s7videoplayer {
    position: relative !important;

    video {
      top: 0 !important;
      left: 0px !important;
      bottom: 0 !important;
      object-fit: inherit;
    }
  }
  .s7iconeffect[state='play'],
  .s7waiticon {
    background: url(/assets/images/video_play.svg) !important;
    background-size: 112px !important;
    width: 7rem !important;
    height: 7rem !important;
  }

  object {
    top: 0 !important;
    left: 0px !important;
    bottom: 0 !important;
    object-fit: inherit;
  }

  .s7container, .s7videoplayer, object,
  video, iframe {
    width: 58.75rem !important;
    height: 33rem !important;
  }

  ${media.lg`
  .s7container, .s7videoplayer, object, video, iframe {
      width: 45rem !important;
      height: 25.3125rem !important;
    }
  `};

  ${media.sm`
  .s7container, .s7videoplayer, object, video, iframe {
      width: 100% !important;
      height: 20.25rem !important;
    }
  `};

  .s7container[mode='fullscreen'] {
    width: 100% !important;
    height: 100% !important;
    
    .s7videoplayer, object, video {
      width: 100% !important;
      height: 100% !important;
      position: absolute !important;
    }
  }
`;
