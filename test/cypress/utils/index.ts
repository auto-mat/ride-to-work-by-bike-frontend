const whiteColor = 'rgb(255, 255, 255)';
const transparentColor = 'rgba(0, 0, 0, 0)';

const hexToRgb = (hex: string): string | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? 'rgb(' +
        `${parseInt(result[1], 16)},` +
        ` ${parseInt(result[2], 16)},` +
        ` ${parseInt(result[3], 16)})`
    : null;
};

export { hexToRgb, transparentColor, whiteColor };
