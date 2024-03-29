$(document).ready(function () {
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
        if (buttonInBetween.css("display") !== "none") {
          console.log("CÓ BUTTON Ở GIỮA");
          return false;
        }
      }
      console.log("KHÔNG CÓ BUTTON Ở GIỮA");
      return true;
    } else {
      console.log("KHÔNG CỘT");
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
        if (buttonInBetween.css("display") !== "none") {
          console.log("CÓ BUTTON Ở GIỮA");
          return false;
        }
      }

      console.log("KHÔNG CÓ BUTTON Ở GIỮA");

      return true;
    } else {
      console.log("KHÔNG HÀNG");
      return false;
    }
  }

  // Kiểm tra dòng theo chiều ngang
  function checkLineX(startY, endY, column) {
    for (let y = startY + 1; y < endY; y++) {
      const buttonInBetween = getButtonAtPosition(column, y);
      if (buttonInBetween.css("display") !== "none") {
        console.log("X CHECKKK CÓ BUTTON Ở GIỮA");
        return false;
      }
    }
    console.log("CHECKKK KHÔNG CÓ BUTTON Ở GIỮA");
    return true;
  }

  // Kiểm tra dòng theo chiều dọc
  function checkLineY(startX, endX, row) {
    for (let x = startX + 1; x < endX; x++) {
      const buttonInBetween = getButtonAtPosition(x, row);
      if (buttonInBetween.css("display") !== "none") {
        console.log("Y CHECKKK CÓ BUTTON Ở GIỮA");
        return false;
      }
    }
    console.log("CHECKKK KHÔNG CÓ BUTTON Ở GIỮA");
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
    if (button1.data("imageName") === button2.data("imageName")) {
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
    } else {
      return false;
    }
  }
  // Xử lý khi click vào button
  let previousButton = null;
  function handleButtonClick(button) {
    if (previousButton === null) {
      previousButton = button;
    } else {
      if (button !== previousButton) {
        if (
          checkColumn(previousButton, button) ||
          checkRow(previousButton, button)
        ) {
          console.log("hai button kề nhau");
          hideTwoButtons(previousButton, button);
        } else if (
          checkRectX(previousButton, button) ||
          checkRectY(previousButton, button)
        ) {
          console.log("2 button là hình chữ nhật");
          hideTwoButtons(previousButton, button);
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
  }

  createMatrix();
});
