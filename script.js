// Tạo ma trận với số hàng và số cột được chỉ định
function createMatrix(row, col) {
  const matrix = [];
  for (let i = 0; i < row; i++) {
      matrix[i] = [];
      for (let j = 0; j < col; j++) {
          // Thiết lập giá trị của ma trận
          if (i === 0 || i === row - 1 || j === 0 || j === col - 1) {
              matrix[i][j] = -1; // Nếu ô là biên của ma trận, gán giá trị là -1
          } else {
              matrix[i][j] = randomInt(1, 9); // Ngược lại, gán một giá trị ngẫu nhiên từ 1 đến 10
          }
      }
  }
  return matrix;
}

// Hàm tạo số ngẫu nhiên 
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Vẽ một button tại vị trí và giá trị chỉ định trên canvas
function drawButton(ctx, x, y, value, cellWidth, cellHeight) {
  ctx.fillStyle = "black"; // Chọn màu cho nút
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight); // Vẽ hình chữ nhật
  ctx.fillStyle = "white"; // Chọn màu cho chữ
  ctx.font = "25px Arial"; // Chọn font chữ
  ctx.fillText(value, x * cellWidth + cellWidth / 2.5, y * cellHeight + cellHeight / 1.5); // Vẽ chữ giữa hình chữ nhật
}

// Vẽ ma trận trên canvas, giá trị nhận vào là chiều rộng ô và chiều cao 
function drawMatrix(matrix, ctx, cellWidth, cellHeight) {
  // Lặp qua từng hàng của ma trận
  matrix.forEach((row, rowIndex) => {
      // Lặp qua từng phần tử trong hàng hiện tại
      row.forEach((value, colIndex) => {
          // Vẽ nút tại vị trí (colIndex, rowIndex) với giá trị là 'value'
          drawButton(ctx, colIndex, rowIndex, value, cellWidth, cellHeight);
      });
  });
}

// Vẽ ma trận trên canvas, giá trị nhận vào là số hàng và số cột
function drawMatrixOnCanvas(canvasId, row, col) {
  const canvas = document.getElementById(canvasId); // Lấy đối tượng canvas từ id
  const ctx = canvas.getContext("2d"); // Lấy context để vẽ
  const cellWidth = canvas.width / col; // Tính toán chiều rộng của mỗi ô
  const cellHeight = canvas.height / row; // Tính toán chiều cao của mỗi ô
  const matrix = createMatrix(row, col); // Tạo ma trận
  drawMatrix(matrix, ctx, cellWidth, cellHeight); // Vẽ ma trận lên canvas
}

// Thêm sự kiện cho sự kiện DOMContentLoaded để vẽ ma trận
document.addEventListener("DOMContentLoaded", function () {
  drawMatrixOnCanvas("matrixCanvas", 11, 18); // Gọi hàm vẽ ma trận trên canvas với id của canvas, số hàng và số cột
});
