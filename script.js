// Hàm xáo trộn mảng
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Tạo ma trận
function createMatrix(row, col, pokemons, ctx) {
  const matrix = [];
  let pokemonIndex = 0; // Biến index cho phần tử Pokémon

  for (let i = 0; i < row; i++) {
    matrix[i] = [];
    for (let j = 0; j < col; j++) {
      // Kiểm tra nếu là biên của ma trận
      if (i === 0 || i === row - 1 || j === 0 || j === col - 1) {
        matrix[i][j] = -1;
      } else {
        // Lặp lại các phần tử của mảng pokemons
        matrix[i][j] = pokemons[pokemonIndex % pokemons.length];
        pokemonIndex++;
      }
    }
  }
  return matrix;
}

// Vẽ ma trận lên canvas
function drawMatrix(matrix, ctx, cellWidth, cellHeight) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  matrix.forEach((row, rowIndex) => {
    row.forEach((pokemon, colIndex) => {
      createButton(
        ctx,
        colIndex,
        rowIndex,
        pokemon,
        cellWidth,
        cellHeight,
        matrix
      );
    });
  });
}

// Sự kiện xảy ra khi DOM đã load xong
document.addEventListener("DOMContentLoaded", function () {
  const row = 11;
  const col = 18;
  const pokemons = [
    "bulbasaur.png",
    "caterpie.png",
    "charmander.png",
    "clefairy.png",
    "ekans.png",
    "nidoran-f.png",
    "nidoran-m.png",
    "pidgey.png",
    "pikachu-f.png",
    "rattata-f.png",
    "sandshrew.png",
    "spearow.png",
    "squirtle.png",
    "weedle.png",
  ];
  const canvasId = "matrixCanvas";
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const cellWidth = canvas.width / col;
  const cellHeight = canvas.height / row;

  // Tạo một mảng chứa các cặp Pokémon và xáo trộn nó
  const pokemonPairs = [...pokemons, ...pokemons];
  shuffleArray(pokemonPairs);

  const matrix = createMatrix(row, col, pokemonPairs, ctx);
  drawMatrix(matrix, ctx, cellWidth, cellHeight);
});

// Tạo button cho từng ô trong ma trận
function createButton(ctx, x, y, pokemon, cellWidth, cellHeight, matrix) {
  const button = document.createElement("button");
  button.style.width = cellWidth + "px";
  button.style.height = cellHeight + "px";
  button.style.position = "absolute";
  button.style.left = x * cellWidth + "px";
  button.style.top = y * cellHeight + "px";
  button.style.padding = "0";
  button.style.margin = "0";
  button.style.border = "1px solid black";
  button.style.background = "transparent";
  button.style.cursor = "pointer";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.left = x * (cellWidth + 10) + "px";
  button.style.top = y * (cellHeight + 10) + "px";

  // Thay đổi kích thước của hình ảnh và căn giữa
  const imageSize = Math.min(cellWidth, cellHeight) * 1.5;
  button.innerHTML =
    pokemon === -1
      ? "-1"
      : `<img src="img/${pokemon}" style="max-width: ${imageSize}px; max-height: ${imageSize}px;">`;

  button.addEventListener("click", function (event) {
    handleButtonClick(event, pokemon, ctx, matrix, cellWidth, cellHeight);
  });

  document.body.appendChild(button);
}

// Biến lưu giữ tọa độ của button đầu tiên
let x1, y1;
// Biến lưu giữ tên của Pokémon đầu tiên
let firstClickedPokemon = null;

// Hàm xử lý khi button được nhấn
function handleButtonClick(event, pokemon, ctx, matrix, cellWidth, cellHeight) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect(); // Lấy ra kích thước và vị trí của button
  const x = rect.left + window.scrollX; // Làm tròn xuống để đảm bảo x là số nguyên
  const y = rect.top + window.scrollY; // Làm tròn xuống để đảm bảo y là số nguyên

  console.log(`Giá trị của button tại vị trí (${x}, ${y}):`, pokemon); // In ra giá trị của button tại vị trí x, y
  showBorderRed(event);
  if (firstClickedPokemon === null) {
    // Nếu đây là lần nhấn button đầu tiên
    firstClickedPokemon = pokemon;
    x1 = x;
    y1 = y;
  } else {
    const secondClickedPokemon = pokemon;
    const x2 = x;
    const y2 = y;
    if (secondClickedPokemon === firstClickedPokemon) {
      // xét theo cột
      if (checkColumn(x1, y1, x2, y2, cellWidth, cellHeight)) {
        console.log("cột oke");
        console.log("===================");

        removeButton(x1, y1, x2, y2);
      } else {
        // xét theo hàng
        if (checkRow(x1, y1, x2, y2, cellWidth, cellHeight)) {
          console.log("hang oke");
          console.log("===================");
          removeButton(x1, y1, x2, y2);
        } else {
          console.log("cc j z");
          console.log("===================");
          hideButtonBorderByCoordinates(x1, y1, x2, y2);
        }
      }
    } else {
      console.log("clm m đui à");
      console.log("===================");
      hideButtonBorderByCoordinates(x1, y1, x2, y2);
    }
    // Sau khi so sánh xong, reset lại biến lưu giá trị của button đầu tiên
    firstClickedPokemon = null;
  }
}

// hiện viền màu đỏ khi nhấn vào button
function showBorderRed(event) {
  const button = event.currentTarget;
  button.style.border = "5px solid red";
}

// ẩn đi viền
function hideButtonBorderByCoordinates(x1, y1, x2, y2) {
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    const buttonX = rect.left + window.scrollX;
    const buttonY = rect.top + window.scrollY;

    if (
      (buttonX === x1 && buttonY === y1) ||
      (buttonX === x2 && buttonY === y2)
    ) {
      button.style.border = "1px solid black";
    }
  });
}

// ====================================================================================== THUẬT TOÁN ======================================================================================
function getButtonValueAtCoordinates(x, y) {
  const canvas = document.getElementById("matrixCanvas");
  const rect = canvas.getBoundingClientRect();
  const offsetX = x;
  const offsetY = y;
  const element = document.elementFromPoint(offsetX, offsetY);

  // Kiểm tra xem phần tử có phải là hình ảnh không
  if (element.tagName === "IMG") {
    // Lấy tên của hình ảnh từ thuộc tính src
    return element.getAttribute("src").split("/").pop(); // Lấy phần cuối của đường dẫn, tức là tên của hình ảnh
  } else {
    return null;
  }
}

function checkColumn(x1, y1, x2, y2, cellWidth, cellHeight) {
  // Tìm tọa độ của button trên cùng và dưới cùng
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  if (x1 == x2) {
    // Kiểm tra xem cột từ button1 đến button2 có button nào có giá trị khác -1 không
    if (Math.abs(y1 - y2) <= 60 && Math.abs(y1 - y2) >= 50) {
      return true;
    } else {
      for (let y = minY + cellWidth; y < maxY; y += cellHeight + 10) {
        console.log("y", y);
        const buttonValue = getButtonValueAtCoordinates(x1, y); // Lấy giá trị của button tại tọa độ x1, y
        console.log(buttonValue);
        if (buttonValue !== null) {
          return false; // Nếu có button nằm giữa và có giá trị khác -1, trả về false
        }
      }
    }
  } else {
    return false; // Nếu không có button nào nằm giữa với giá trị khác -1, trả về true
  }
  return true;
}
function checkRow(x1, y1, x2, y2, cellWidth, cellHeight) {
  // Tìm tọa độ của button trên cùng và dưới cùng
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);

  if (y1 === y2) {
    // Kiểm tra xem cột từ button1 đến button2 có button nào có giá trị khác -1 không
    if (Math.abs(x1 - x2) <= 68 && Math.abs(x1 - x2) >= 50) {
      return true;
    } else {
      for (let x = minX + cellHeight; x < maxX; x += cellWidth + 10) {
        console.log("x", x);
        const buttonValue = getButtonValueAtCoordinates(x, y1); // Lấy giá trị của button tại tọa độ x, y1
        console.log(buttonValue);
        if (buttonValue !== null) {
          return false;
        }
      }
    }
  } else {
    return false;
  }
  return true;
}

function removeButton(x1, y1, x2, y2) {
  const button1 = getButtonAtCoordinates(x1, y1);
  const button2 = getButtonAtCoordinates(x2, y2);

  // Loại bỏ hai button đã nhấn khỏi DOM
  button1.remove();
  button2.remove();
}

function getButtonAtCoordinates(x, y) {
  const elements = document.elementsFromPoint(x, y);

  // Tìm button trong danh sách các phần tử tại tọa độ (x, y)
  for (const element of elements) {
    if (element.tagName.toLowerCase() === "button") {
      return element;
    }
  }

  return null;
}
