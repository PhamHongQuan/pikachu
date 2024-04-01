const ROWS = 11;
const COLS = 18;
const GRID_CONTAINER = $("#grid");
const gridWidth = GRID_CONTAINER.width();
const gridHeight = GRID_CONTAINER.height();
const cellWidth = gridWidth / COLS;
const cellHeight = gridHeight / ROWS;
const IMAGE_NAMES = [
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

// Tạo button với hình ảnh
function createButton(imageName) {
  const button = $("<button></button>");

  if (imageName === "-1") {
    button.text("-1");
  } else {
    button.css("background-image", `url('img/${imageName}')`);
    button.data("imageName", imageName);

    button.mouseenter(function () {
      // Loại bỏ lớp CSS trước nếu đã tồn tại
      // Thêm lớp CSS để thực hiện hiệu ứng
      $(this).addClass("button-clicked");

      button.mouseleave(function () {
        // Loại bỏ lớp CSS để kết thúc hiệu ứng
        $(this).removeClass("button-clicked");
      });
    });

    // sự kiện click chọn  hình
    button.click(function () {
      handleButtonClick($(this));
      console.log("================================");
    });
  }

  return button;
}

// Tạo ma trận button
function createMatrix() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const cell = $("<div></div>").addClass("cell");
      let imageName;

      // Nếu ở ngoài cùng thì giá trị button là -1, ngược lại là tên của hình ảnh
      if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
        imageName = "-1";
      } else {
        const random = Math.floor(Math.random() * IMAGE_NAMES.length);
        imageName = IMAGE_NAMES[random];
      }

      const button = createButton(imageName);
      cell.append(button);
      GRID_CONTAINER.append(cell);
    }
  }
}

// Lấy vị trí(row, col) của button trên ma trận
function getPositionOfButton(button) {
  const cells = $("#grid .cell");
  let position = { row: -1, column: -1 };

  cells.each(function (index) {
    const currentButton = $(this).find("button");
    if (currentButton.is(button)) {
      position.row = Math.floor(index / COLS);
      position.column = index % COLS;
      return false;
    }
  });

  return position;
}
// Hàm lấy button tại vị trí hàng và cột chỉ định
function getButtonAtPosition(column, row) {
  const cellIndex = row * COLS + column; // Tính chỉ số của ô trong mảng các ô
  const cell = $(".cell").eq(cellIndex); // Lấy ô tại chỉ số đã tính toán
  const button = cell.find("button"); // Tìm button trong ô đó
  return button;
}

// hàm kiểm tra ở 4 cạnh ngoài cùng (nằm trên cùng hàng hoặc cùng cột)
function checkOutside(button1, button2) {
  const position1 = getPositionOfButton(button1);
  const position2 = getPositionOfButton(button2);

  // kiểm tra 2 button cùng hàng có khác nhau không
  if (
    position1.row === position2.row &&
    position1.column !== position2.column
  ) {
    // kiểm tra phía trên cùng
    if (position1.row === 1 && position2.row === 1) {
      if (button1.data("imageName") === button2.data("imageName")) {
        return true;
      }
    }
    // kiểm tra phía dưới
    else if (position1.row === 9 && position2.row === 9) {
      if (button1.data("imageName") === button2.data("imageName")) {
        return true;
      }
    }
  }
  // kiểm tra 2 button cùng cột có khác nhau không
  else if (
    position1.column === position2.column &&
    position1.row !== position2.column
  ) {
    // kiểm tra bên trái
    if (position1.column === 1 && position2.column === 1) {
      if (button1.data("imageName") === button2.data("imageName")) {
        return true;
      }
    }
    // kiểm tra bên phải
    else if (position1.column === 16 && position2.column === 16) {
      if (button1.data("imageName") === button2.data("imageName")) {
        return true;
      }
    }
  }
  return false;
}

// hàm kiểm tra phía ngoài cùng của 4 hướng nhưng button1 và button2 không cùng nằm trên 1 hàng hoặc 1 cột
function checkOutsideWithoutSame(button1, button2) {
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  if (minButtonPosition.row > maxButtonPosition.row) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  // kiểm tra 2 button có khác cột hay không
  // trường hợp 1: buttonMin nằm hàng đầu tiên nhưng buttonMax thì không
  if (minButtonPosition.row === 1 && maxButtonPosition.row !== 1) {
    // kiểm tra buttonMax (xem trước nó có button nào có giá trị không)
    for (let i = maxButtonPosition.row - 1; i > 0; i--) {
      const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
      console.log("1");
      console.log("i = ", i);
      console.log("above", buttonsAbove.data("imageName"));
      var positionOfAbove = getPositionOfButton(buttonsAbove);
      console.log("cột, dòng", positionOfAbove.column, positionOfAbove.row);
      if (buttonsAbove.data("imageName") !== "-1") {
        console.log("max", maxButtonPosition.row, maxButtonPosition.column);
        return false;
      }
    }
  }
  // trường hợp 2: buttonMax nằm hàng đầu tiên nhưng buttonMin thì không
  if (maxButtonPosition.row === 1 && minButtonPosition.row !== 1) {
    // kiểm tra buttonMin (xem trước nó có button nào khác hay không)
    for (let i = minButtonPosition.row - 1; i > 0; i--) {
      const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
      console.log("2");
      console.log("i = ", i);
      console.log("above", buttonsAbove.data("imageName"));
      var positionOfAbove = getPositionOfButton(buttonsAbove);
      console.log("cột, dòng", positionOfAbove.column, positionOfAbove.row);
      if (buttonsAbove.data("imageName") !== "-1") {
        console.log("min", minButtonPosition.row, minButtonPosition.column);
        return false;
      }
    }
  }
  // trường hợp 3: cả 2 buttonMin và buttonMax đều không nằm trên hàng đầu tiên
  // Kiểm tra đồng thời cả hai buttonMin và buttonMax
  if (minButtonPosition.row !== 1 && maxButtonPosition.row !== 1) {
    // kiểm tra buttonMin
    for (let i = minButtonPosition.row - 1; i > 0; i--) {
      const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
      console.log("3");
      console.log("i = ", i);
      console.log("above", buttonsAbove.data("imageName"));
      var positionOfAbove = getPositionOfButton(buttonsAbove);
      console.log("cột, dòng", positionOfAbove.column, positionOfAbove.row);
      if (buttonsAbove.data("imageName") !== "-1") {
        console.log("min", minButtonPosition.row, minButtonPosition.column);
        isValid = false; // Nếu gặp buttonMin không hợp lệ, đánh dấu là không hợp lệ
        break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
      }
    }
    let isValid = true; // Giả sử ban đầu là hợp lệ
    // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
    if (isValid) {
      for (let i = maxButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
        console.log("4");
        console.log("i = ", i);
        console.log("above", buttonsAbove.data("imageName"));
        var positionOfAbove = getPositionOfButton(buttonsAbove);
        console.log("cột, dòng", positionOfAbove.column, positionOfAbove.row);
        if (buttonsAbove.data("imageName") !== "-1") {
          console.log("max", maxButtonPosition.row, maxButtonPosition.column);
          isValid = false; // Nếu gặp buttonMax không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
    }

    return isValid; // Trả về kết quả kiểm tra
  }

  // nếu 2 button nằm cùng cột thì return false
  if (minButtonPosition.column === maxButtonPosition.column) {
    console.log("5");
    return false;
  }
  return true;
}

// Kiểm tra button theo chiều dọc
function checkColumn(button1, button2) {
  const position1 = getPositionOfButton(button1);
  const position2 = getPositionOfButton(button2);
  // nếu 2 button nằm trên 1 cột, tên giống nhau và không phải là 1
  if (
    position1.column === position2.column &&
    button1.data("imageName") === button2.data("imageName") &&
    position1.row !== position2.row
  ) {
    const startRow = Math.min(position1.row, position2.row);
    const endRow = Math.max(position1.row, position2.row);

    for (let row = startRow + 1; row < endRow; row++) {
      const buttonInBetween = getButtonAtPosition(position1.column, row);
      if (buttonInBetween.data("imageName") !== "-1") {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

// // Kiểm tra button theo chiều ngang
function checkRow(button1, button2) {
  const position1 = getPositionOfButton(button1);
  const position2 = getPositionOfButton(button2);

  if (
    position1.row === position2.row &&
    button1.data("imageName") === button2.data("imageName") &&
    position1.column !== position2.column
  ) {
    const startColumn = Math.min(position1.column, position2.column);
    const endColumn = Math.max(position1.column, position2.column);

    for (let column = startColumn + 1; column < endColumn; column++) {
      const buttonInBetween = getButtonAtPosition(column, position1.row);
      if (buttonInBetween.data("imageName") !== "-1") {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

// Kiểm tra dòng theo chiều ngang
function checkLineX(startY, endY, column) {
  for (let y = startY + 1; y < endY; y++) {
    const buttonInBetween = getButtonAtPosition(column, y);
    if (buttonInBetween.data("imageName") !== "-1") {
      return false;
    }
  }
  return true;
}

// Kiểm tra dòng theo chiều dọc
function checkLineY(startX, endX, row) {
  for (let x = startX + 1; x < endX; x++) {
    const buttonInBetween = getButtonAtPosition(x, row);
    if (buttonInBetween.data("imageName") !== "-1") {
      return false;
    }
  }
  return true;
}

// Hàm kiểm tra xem hai button tạo thành hình chữ nhật hay không
function checkRectX(button1, button2) {
  // Tìm điểm có y nhỏ nhất và lớn nhất
  if (button1.data("imageName") === button2.data("imageName")) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    for (let y = minButtonPosition.row + 1; y < maxButtonPosition.row; y++) {
      // Kiểm tra ba dòng
      if (
        checkLineX(minButtonPosition.row, y, minButtonPosition.column) &&
        checkLineY(minButtonPosition.column, maxButtonPosition.column, y) &&
        checkLineX(y, maxButtonPosition.row, maxButtonPosition.column)
      ) {
        return true;
      }
    }
  } else {
    return false;
  }
}

// Hàm kiểm tra xem hai button tạo thành hình chữ nhật hay không
function checkRectY(button1, button2) {
  // Tìm điểm có y nhỏ nhất và lớn nhất
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  if (minButtonPosition.column > maxButtonPosition.column) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  for (
    let y = minButtonPosition.column + 1;
    y < maxButtonPosition.column;
    y++
  ) {
    // Kiểm tra ba dòng
    if (
      checkLineY(minButtonPosition.column, y, minButtonPosition.row) &&
      checkLineX(minButtonPosition.row, maxButtonPosition.row, y) &&
      checkLineY(y, maxButtonPosition.column, maxButtonPosition.row)
    ) {
      return true;
    }
  }
  return false;
}
// Xử lý khi click vào button
let previousButton = null;
function handleButtonClick(button) {
  if (previousButton === null) {
    previousButton = button;
  } else {
    if (
      button !== previousButton &&
      previousButton.data("imageName") === button.data("imageName")
    ) {
      console.log("previous: ", previousButton.data("imageName"));
      console.log("current: ", button.data("imageName"));

      if (
        checkColumn(previousButton, button) ||
        checkRow(previousButton, button)
      ) {
        console.log("kiểm tra hàng hoặc cột");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } else if (checkOutside(previousButton, button)) {
        console.log("kiểm tra 2 hàng và 2 cột ngoài cùng");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } else if (checkOutsideWithoutSame(previousButton, button)) {
        console.log("kiểm tra 2 hàng và 2 cột NHƯNG KHÔNG CÓ vật cản");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } else {
        console.log("đéo có cái nào đc");
      }
      previousButton = null;
    } else {
      previousButton = null;
    }
  }
}

// hàm ẩn 2 button
function hideTwoButtons(button1, button2) {
  button1.hide(); // Ẩn button 1
  button2.hide(); // Ẩn button 2
  //   button1.css('background-color', 'red');
  // button2.css('background-color', 'red');
}
// Hàm để thay đổi giá trị của thuộc tính imageName thành -1 cho một button
function changeImageNameToMinusOne(button) {
  button.data("imageName", "-1");
}

createMatrix();
