import { WIDTH, HEIGHT } from '../../utils/dynamicMediaUtils';
export const NODE_TO_MOUNT = 'baitThumbnail';
export const DATA_COMP_ID = 'data-compid';
export const THUMBNAIL_DIMENSION = '200';
export const THUMBNAIL_PRESET = `?${WIDTH}=${THUMBNAIL_DIMENSION}&${HEIGHT}=${THUMBNAIL_DIMENSION}`;
export const DEVICE_DEFAULT = 768;
export const DEVICE_MOBILE = 767;
export const MAGNIFIER_CONFIG_DESKTOP = {
  smallImage: {
    alt: 'Hover/Click to enlarge',
    isFluidWidth: true,
    src: ''
  },
  largeImage: {
    alt: 'Enlarged Image View',
    src: '',
    width: 1500,
    height: 1500
  },
  enlargedImageContainerDimensions: {
    width: 400,
    height: 300
  },
  lensStyle: {
    cursor: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiCA0OOS6Nji5KAAACgElEQVQ4y42TX2jNYRjHP897fsds05bNLqxjNX+z/Y4lFsoFiZUWkeYcfy4mjEUrJXFBuVLiQlrakMLOaagRu3EhKX9aGNtsxpyyiVjYhJ1/v8eF39kxUXsuv+/n0/v29H2FMbMJB8nRlVSxhKlYDPOSVpqlBycEgPyJB/FIYhGHWMYgT3lDjCn4mcsX6qWRocnU/ylsxivRKj1BjFPSwoCViIPIJBZoLZVcl336Pi8tbCWKqeQcXVL3rqOIS26+k2EkS2s4Qqvs1iFPSijFFNPIoFRrTy6XCWDb9gr/q1gyjD9u2nSE3XwbuG9Sr4+i1UyTw/paaPodruOYFigQQpPSwC12+UpM6oaMqWzgtrljCKUiCwv3PB/9LmfIo8oNFLXxcSMZy+BfcxqBx3Sz2hrN5hDnBSQJ5ms2kCQXD4U4AYMjnzRaPBzpYmNayCMqXyE+WS+wEAclhyxaSCAk9QChPsxHctJCDKNekB9cox3FYTnzCTOEkJAOBZhIIi30k4WP3lCUCwABEGZykrdhd4+W15nO+9Et0ckISx228L9RH2U8cAVBennEBo8v+U94Mwl0Lfk0u4JBf9JAkdaKFUxREZ7wHWALSax57OGu3Har0YEfE9FZbGNQ2m2nExvp5qb3s4cSFJmh9RRQR99oNRRnLjbZetw5SiF4CUXDXzKJYyboKg1Ryn556P6HIAplNFJOG12s5y1XuCfviGsupayhgn4OelrVaUL+wrebbqeCGhaTwQ8cMpjAAFfl/NfIFC4CMgbfwTMQyGS2+pmGl8/0Sod8UE1VUgLIPD1LOW2yQ59Juqv/GUO5NowfB4vz2DySnfp8PDgYDJ3sHS8OvwBiKPe4fyOZegAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wOC0xM1QxNDo1Nzo0Ni0wNDowMBRpaKoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDgtMTNUMTQ6NTc6NDYtMDQ6MDBlNNAWAAAAAElFTkSuQmCC), default',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid #e6e6e6'
  },
  imageStyle: {
    width: '100%'
  },
  enlargedImageContainerStyle: {
    backgroundColor: 'white !important',
    zIndex: 999,
    marginLeft: '2rem'
  },
  shouldUsePositiveSpaceLens: true,
  enlargedImagePosition: 'beside',
  hoverDelayInMs: 300,
  isHintEnabled: false
};
export const MAGNIFIER_CONFIG_MOBILE = {
    msmallImage: {
      alt: 'Hover/Click to enlarge',
      isFluidWidth: true,
      src: ''
    },
    mlargeImage: {
      alt: 'Enlarged Image View',
      src: '',
      width: 1000,
      height: 1000
    },
    enlargedImagePosition: 'over'
};
