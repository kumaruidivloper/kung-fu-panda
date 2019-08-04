export const getMobileDesktopImages = image => {
  if (typeof image === 'string') {
    return { mobile: image, desktop: image };
  }

  // assume object
  const { mobileImage, desktopImage } = image;
  const { mobile = mobileImage, desktop = desktopImage } = image;
  return { mobile, desktop };
};

export const getMobileDesktopColors = color => {
  if (typeof color === 'string') {
    return { mobile: color, desktop: color };
  }

  // assume object
  const { mobileColor, desktopColor } = color;
  const { mobile = mobileColor, desktop = desktopColor } = color;
  return { mobile, desktop };
};

const colorPairs = {
  gray: { color: '#7a7a7a', complement: '#ffffff' },
  white: { color: '#ffffff', complement: '#333333' },
  blue: { color: '#0055a6', complement: '#ffffff' },
  offwhite: { color: '#f4f4f4', complement: '#333333' }
};

export const getColorPairs = (backgroundImage, mobileBgColor = '', textColor = '') => {
  let result = colorPairs.white;
  const colors = colorPairs[mobileBgColor.toLowerCase()];
  if (backgroundImage) {
    result = colorPairs.gray;
  } else if (colors) {
    if (textColor) {
      colors.complement = textColor;
    }
    return colors;
  }
  return result;
};
