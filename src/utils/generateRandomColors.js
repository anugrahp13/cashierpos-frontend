// Function to generate random colors
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate random colors
const generateRandomColors = (count) => {
  return Array.from({ length: count }, () => getRandomColor());
};

export default generateRandomColors;
