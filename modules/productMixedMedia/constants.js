import { WIDTH, HEIGHT } from '../../utils/dynamicMediaUtils';

export const MAGNIFIER_CONFIG = {
  smallImage: {
    alt: 'Hover/Click to enlarge',
    isFluidWidth: true,
    src: ''
  },
  largeImage: {
    alt: 'Enlarged Image View',
    src: '',
    width: 1600,
    height: 1600
  },
  enlargedImageContainerDimensions: {
    width: '130%',
    height: '90%'
  },
  lensStyle: {
    cursor:
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCA0OOS6Nji5KAAACgElEQVQ4y42TX2jNYRjHP897fsds05bNLqxjNX+z/Y4lFsoFiZUWkeYcfy4mjEUrJXFBuVLiQlrakMLOaagRu3EhKX9aGNtsxpyyiVjYhJ1/v8eF39kxUXsuv+/n0/v29H2FMbMJB8nRlVSxhKlYDPOSVpqlBycEgPyJB/FIYhGHWMYgT3lDjCn4mcsX6qWRocnU/ylsxivRKj1BjFPSwoCViIPIJBZoLZVcl336Pi8tbCWKqeQcXVL3rqOIS26+k2EkS2s4Qqvs1iFPSijFFNPIoFRrTy6XCWDb9gr/q1gyjD9u2nSE3XwbuG9Sr4+i1UyTw/paaPodruOYFigQQpPSwC12+UpM6oaMqWzgtrljCKUiCwv3PB/9LmfIo8oNFLXxcSMZy+BfcxqBx3Sz2hrN5hDnBSQJ5ms2kCQXD4U4AYMjnzRaPBzpYmNayCMqXyE+WS+wEAclhyxaSCAk9QChPsxHctJCDKNekB9cox3FYTnzCTOEkJAOBZhIIi30k4WP3lCUCwABEGZykrdhd4+W15nO+9Et0ckISx228L9RH2U8cAVBennEBo8v+U94Mwl0Lfk0u4JBf9JAkdaKFUxREZ7wHWALSax57OGu3Har0YEfE9FZbGNQ2m2nExvp5qb3s4cSFJmh9RRQR99oNRRnLjbZetw5SiF4CUXDXzKJYyboKg1Ryn556P6HIAplNFJOG12s5y1XuCfviGsupayhgn4OelrVaUL+wrebbqeCGhaTwQ8cMpjAAFfl/NfIFC4CMgbfwTMQyGS2+pmGl8/0Sod8UE1VUgLIPD1LOW2yQ59Juqv/GUO5NowfB4vz2DySnfp8PDgYDJ3sHS8OvwBiKPe4fyOZegAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wOC0xM1QxNDo1Nzo0Ni0wNDowMBRpaKoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDgtMTNUMTQ6NTc6NDYtMDQ6MDBlNNAWAAAAAElFTkSuQmCC), default',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid #e6e6e6'
  },
  imageStyle: {
    width: '100%'
  },
  enlargedImageContainerStyle: {
    backgroundColor: 'white !important',
    zIndex: 999,
    marginLeft: '4rem'
  },
  shouldUsePositiveSpaceLens: true,
  enlargedImagePosition: 'beside',
  hoverDelayInMs: 300,
  isHintEnabled: false
};
export const SWATCH_MODAL_MAX_DISPLAY = 6;
export const SWATCH_MIN_DISPLAY = 1;
export const SWATCH_SLIDER_MIN = 6;
export const DEVICE_DEFAULT = 768;
export const DEVICE_MOBILE = 767;
export const SLIDER_HEIGHT = 48;
export const SLIDER_WIDTH = 120;
export const SLIDE_INTERVAL = 1;
export const SWATCH_DEFAULT_BOX_SIZE = 50;
export const SWATCH_MODAL_BOX_SIZE = 75;
export const SWATCH_EXIST = 0;
export const SLIDER_GITTER = 2;
export const SCROLL_OFFSET = -100;
export const MOBILE_MIXED_MEDIA_DIMENSION = '410';
export const MOBILE_MIXED_MEDIA_DIMENSION_PRESET = `?${WIDTH}=${MOBILE_MIXED_MEDIA_DIMENSION}&${HEIGHT}=${MOBILE_MIXED_MEDIA_DIMENSION}`;
