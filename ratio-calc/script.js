let ratioWidth = document.getElementById('ratio-width'); 
let ratioHeight = document.getElementById('ratio-height'); 
let width = document.getElementById('width');
let height = document.getElementById('height');

let formatNumber = (num) => {
  let formatted = parseFloat(num).toFixed(2); // Tetap dua desimal
  return formatted.endsWith(".00") ? parseInt(num) : formatted; // Hilangkan .00 jika bulat
};

let calculateWidth = () => {
  let aspectRatio = ratioWidth.value / ratioHeight.value;
  width.value = formatNumber(height.value * aspectRatio);
};

let calculateHeight = () => {
  let aspectRatio = ratioWidth.value / ratioHeight.value;
  height.value = formatNumber(width.value / aspectRatio);
};

height.addEventListener('input', calculateWidth); 
width.addEventListener('input', calculateHeight); 
ratioWidth.addEventListener('input', () => {
    calculateHeight();
    calculateWidth();
});
ratioHeight.addEventListener('input', () => {
    calculateHeight();
    calculateWidth();
});