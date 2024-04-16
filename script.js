$(document).ready(function () {
  const ROWS = 11;
  const COLS = 18;
  const GRID_CONTAINER = $("#grid");
  const gridWidth = GRID_CONTAINER.width();
  const gridHeight = GRID_CONTAINER.height();
  const cellWidth = gridWidth / COLS;
  const cellHeight = gridHeight / ROWS;
  let level = 1;
  var $skip = $("#skip-level");
  var $reset = $("#reset");
  var $changePosition = $("#change-position");
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
  function createButton(imageName, level) {
    // tạo ra đối tượng button
    const button = $("<button></button>");
    if (imageName === "-1") {
      // button.text("-1");
      button.css("background-image", `url('img/point.png')`);
      button.data("imageName", "-1");
    } else {
      button.css("background-image", `url('img/${imageName}')`);
      button.data("imageName", imageName);

      // sự kiện click chọn  hình
      button.click(function () {
        logicGamePikachu($(this), level);
        console.log("================================");
      });
    }
    return button;
  }

  // Tạo ma trận button
  function createMatrix(level) {
    if (level !== 4) {
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          // tạo ra mỗi ô trong ma trận
          const cell = $("<div></div>").addClass("cell");
          let imageName;
          // Nếu ở ngoài cùng thì giá trị button là -1, ngược lại là tên của hình ảnh
          if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
            imageName = "-1";
          } else {
            const random = Math.floor(Math.random() * IMAGE_NAMES.length);
            imageName = IMAGE_NAMES[random];
          }
          // tạo ra button
          const button = createButton(imageName, level);
          // thêm button đó vào từng ô của ma trận
          cell.append(button);
          // thêm từng ô đó vào ma trận
          GRID_CONTAINER.append(cell);
        }
      }
    } else if (level === 4) {
      clearMatrix();
      createMatrixWithBoss();
    }
  }

  function clearMatrix() {
    // Chọn tất cả các ô trong ma trận và xóa chúng
    $(".cell").remove();
  }

  // ================================================================ THUẬT TOÁN ================================================================

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
      position1.row !== position2.row
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

  // hàm kiểm tra phía trên cùng
  function checkOutsideTop(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }

    // nếu 2 button nằm cùng cột thì return false
    if (minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // trường hợp 1: buttonMin nằm hàng đầu tiên nhưng buttonMax thì không
    if (minButtonPosition.row === 1 && maxButtonPosition.row !== 1) {
      // kiểm tra buttonMax (xem trước nó có button nào có giá trị không)
      for (let i = maxButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          return false;
        }
      }
    }
    // trường hợp 2: buttonMax nằm hàng đầu tiên nhưng buttonMin thì không
    if (maxButtonPosition.row === 1 && minButtonPosition.row !== 1) {
      // kiểm tra buttonMin (xem trước nó có button nào khác hay không)
      for (let i = minButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          return false;
        }
      }
    }
    // trường hợp 3: cả 2 buttonMin và buttonMax đều không nằm trên hàng đầu tiên
    // Kiểm tra đồng thời cả hai buttonMin và buttonMax
    if (minButtonPosition.row !== 1 && maxButtonPosition.row !== 1) {
      // kiểm tra buttonMin
      let isValid = true; // Giả sử ban đầu là hợp lệ
      for (let i = minButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          isValid = false; // Nếu gặp buttonMin không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.row - 1; i > 0; i--) {
          const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
          if (buttonsAbove.data("imageName") !== "-1") {
            isValid = false; // Nếu gặp buttonMax không hợp lệ, đánh dấu là không hợp lệ
            break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
          }
        }
      }
      if (isValid) {
        // vẽ 3 đường thẳng
        drawOutsideColumn_Top_Bottom(button1, "top");
        drawOutsideRow_Top_Bottom(button1, button2, "top");
        drawOutsideColumn_Top_Bottom(button2, "top");
        setTimeout(function () {
          removeDrawOutsideInColumn_Top_Bottom(button1, "top");
          removeDrawOutsideInRow_Top_Bottom(button1, button2, "top");
          removeDrawOutsideInColumn_Top_Bottom(button2, "top");
        }, 100);
      }
      return isValid; // Trả về kết quả kiểm tra
    }
    // vẽ 3 đường thẳng
    drawOutsideColumn_Top_Bottom(button1, "top");
    drawOutsideRow_Top_Bottom(button1, button2, "top");
    drawOutsideColumn_Top_Bottom(button2, "top");
    setTimeout(function () {
      removeDrawOutsideInColumn_Top_Bottom(button1, "top");
      removeDrawOutsideInRow_Top_Bottom(button1, button2, "top");
      removeDrawOutsideInColumn_Top_Bottom(button2, "top");
    }, 100);
    return true;
  }

  // hàm kiểm tra phía dưới cùng
  function checkOutsideBottom(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }

    // nếu 2 button cùng cột thì trả về false
    if (minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // trường hợp 1: buttonMax nằm hàng đầu tiên(phía dưới ma trận) nhưng buttonMin thì không
    if (maxButtonPosition.row === 9 && minButtonPosition.row !== 9) {
      // kiểm tra buttonMin (xem dưới nó có button nào có giá trị không)
      for (let i = minButtonPosition.row + 1; i <= 9; i++) {
        const buttonBelow = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonBelow.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 2: buttonMin nằm ở hàng đầu tiên(phía dưới ma trận) nhưng buttonMin thì không
    if (minButtonPosition.row === 9 && maxButtonPosition.row !== 9) {
      // kiểm tra buttonMax (xem dưới nó có button nào khác hay không)
      for (let i = maxButtonPosition.row + 1; i <= 9; i++) {
        const buttonBelow = getButtonAtPosition(maxButtonPosition.column, i);
        if (buttonBelow.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 3: cả buttonMin và buttonMax đều không nằm ở hàng dưới cùng
    if (minButtonPosition.row !== 9 && maxButtonPosition.row !== 9) {
      // kiểm tra buttonMin
      let isValid = true; // Giả sử ban đầu là hợp lệ
      for (let i = minButtonPosition.row + 1; i <= 9; i++) {
        const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          isValid = false; // Nếu gặp buttonMin không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.row + 1; i <= 9; i++) {
          const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
          if (buttonsAbove.data("imageName") !== "-1") {
            isValid = false; // Nếu gặp buttonMax không hợp lệ, đánh dấu là không hợp lệ
            break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
          }
        }
      }
      if (isValid) {
        // vẽ 3 đường thẳng
        drawOutsideColumn_Top_Bottom(button1, "bottom");
        drawOutsideRow_Top_Bottom(button1, button2, "bottom");
        drawOutsideColumn_Top_Bottom(button2, "bottom");
        setTimeout(function () {
          removeDrawOutsideInColumn_Top_Bottom(button1, "bottom");
          removeDrawOutsideInRow_Top_Bottom(button1, button2, "bottom");
          removeDrawOutsideInColumn_Top_Bottom(button2, "bottom");
        }, 100);
      }
      return isValid; // Trả về kết quả kiểm tra
    }
    // vẽ 3 đường thẳng
    drawOutsideColumn_Top_Bottom(button1, "bottom");
    drawOutsideRow_Top_Bottom(button1, button2, "bottom");
    drawOutsideColumn_Top_Bottom(button2, "bottom");
    setTimeout(function () {
      removeDrawOutsideInColumn_Top_Bottom(button1, "bottom");
      removeDrawOutsideInRow_Top_Bottom(button1, button2, "bottom");
      removeDrawOutsideInColumn_Top_Bottom(button2, "bottom");
    }, 100);
    return true;
  }

  // hàm kiểm tra ngoài cùng bên phải
  function checkOutsideRight(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // nếu cả 2 button nằm cùng hàng thì trả về false
    if (minButtonPosition.row === maxButtonPosition.row) {
      return false;
    }

    // trường hợp 1: buttonMin nằm ngoài cùng bên phải nhưng buttonMax thì không
    if (minButtonPosition.column === 16 && maxButtonPosition.column !== 16) {
      // kiểm tra buttonMax
      for (let i = maxButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, maxButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 2: buttonMax nằm ngoài cùng bên phải nhưng buttonMin thì không
    if (maxButtonPosition.column === 16 && minButtonPosition.column !== 16) {
      // kiểm tra buttonMin
      for (let i = minButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 3: cả buttonMin và buttonMax đều không nằm ở ngoài cùng bên phải
    if (minButtonPosition.column !== 16 && maxButtonPosition.column !== 16) {
      let isValid = true; // Giả sử ban đầu là hợp lệ
      // kiểm tra buttonMin
      for (let i = minButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          isValid = false; // Nếu gặp buttonMin không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.column + 1; i <= 16; i++) {
          const buttonRight = getButtonAtPosition(i, maxButtonPosition.row);
          if (buttonRight.data("imageName") !== "-1") {
            isValid = false; // Nếu gặp buttonMax không hợp lệ, đánh dấu là không hợp lệ
            break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
          }
        }
      }
      if (isValid) {
        drawOutsideColumn_Right_Left(button1, button2, "right");
        drawOutsideRow_Right_Left(button1, "right");
        drawOutsideRow_Right_Left(button2, "right");
        setTimeout(() => {
          removeDrawOutsideColumn_Right_Left(button1, button2, "right");
          removeDrawOutsideRow_Right_Left(button1, "right");
          removeDrawOutsideRow_Right_Left(button2, "right");
        }, 100);
      }
      return isValid; // Trả về kết quả kiểm tra
    }
    drawOutsideColumn_Right_Left(button1, button2, "right");
    drawOutsideRow_Right_Left(button1, "right");
    drawOutsideRow_Right_Left(button2, "right");
    setTimeout(() => {
      removeDrawOutsideColumn_Right_Left(button1, button2, "right");
      removeDrawOutsideRow_Right_Left(button1, "right");
      removeDrawOutsideRow_Right_Left(button2, "right");
    }, 100);
    return true;
  }

  // hàm kiểm tra ngoài cùng bên trái
  function checkOutsideLeft(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // nếu 2 button cùng hàng thì trả về false
    if (maxButtonPosition.row === minButtonPosition.row) {
      return false;
    }
    // trường hợp 1: buttonMin nằm ngoài cùng bên trái nhưng butonMax thì không
    if (minButtonPosition.column === 1 && maxButtonPosition.column !== 1) {
      // kiểm tra buttonMax
      for (let i = maxButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, maxButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 2: buttonMax nằm ngoài cùng bên trái nhưng buttonMin thì không
    if (maxButtonPosition.column === 1 && minButtonPosition.column !== 1) {
      // kieemr tra buttonMin
      for (let i = minButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          return false;
        }
      }
    }
    // trường hợp 3: cả buttonMin và buttonMax đều không nằm ngoài cùng bên trái
    if (minButtonPosition.column !== 1 && maxButtonPosition.column !== 1) {
      let isValid = true; // Giả sử ban đầu là hợp lệ
      // kiểm tra buttonMin
      for (let i = minButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          isValid = false; // Nếu gặp buttonMin không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      for (let i = maxButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, maxButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          isValid = false; // Nếu gặp buttonMax không hợp lệ, đánh dấu là không hợp lệ
          break; // Thoát khỏi vòng lặp ngay khi gặp điều kiện không hợp lệ
        }
      }
      if (isValid) {
        drawOutsideColumn_Right_Left(button1, button2, "left");
        drawOutsideRow_Right_Left(button1, "left");
        drawOutsideRow_Right_Left(button2, "left");
        setTimeout(() => {
          removeDrawOutsideColumn_Right_Left(button1, button2, "left");
          removeDrawOutsideRow_Right_Left(button1, "left");
          removeDrawOutsideRow_Right_Left(button2, "left");
        }, 100);
      }
      return isValid;
    }
    drawOutsideColumn_Right_Left(button1, button2, "left");
    drawOutsideRow_Right_Left(button1, "left");
    drawOutsideRow_Right_Left(button2, "left");
    setTimeout(() => {
      removeDrawOutsideColumn_Right_Left(button1, button2, "left");
      removeDrawOutsideRow_Right_Left(button1, "left");
      removeDrawOutsideRow_Right_Left(button2, "left");
    }, 100);
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
  function checkLineX(startY, endY, column, reverse) {
    if (reverse === false) {
      for (let y = startY; y < endY; y++) {
        const buttonInBetween = getButtonAtPosition(column, y);
        if (buttonInBetween.data("imageName") !== "-1") {
          return false;
        }
      }
    } else if (reverse === true) {
      for (let y = endY; y > startY; y--) {
        const buttonInBetween = getButtonAtPosition(column, y);
        if (buttonInBetween.data("imageName") !== "-1") {
          return false;
        }
      }
    }
    return true;
  }

  // Kiểm tra dòng theo chiều dọc
  function checkLineY(startX, endX, row, reverse) {
    if (reverse === false) {
      for (let x = startX; x < endX; x++) {
        const buttonInBetween = getButtonAtPosition(x, row);
        // const b = getPositionOfButton(buttonInBetween);
        if (buttonInBetween.data("imageName") !== "-1") {
          return false;
        }
      }
    } else if (reverse === true) {
      for (let x = endX; x > startX; x--) {
        const buttonInBetween = getButtonAtPosition(x, row);
        if (buttonInBetween.data("imageName") !== "-1") {
          return false;
        }
      }
    }
    return true;
  }

  // Hàm kiểm tra xem hai button tạo thành hình chữ Z hay không(THEO CHIỀU DỌC)
  function checkShapeZ_Column(button1, button2) {
    // Tìm điểm có y nhỏ nhất và lớn nhất
    if (button1.data("imageName") === button2.data("imageName")) {
      let minButtonPosition = getPositionOfButton(button1);
      let maxButtonPosition = getPositionOfButton(button2);
      if (minButtonPosition.row > maxButtonPosition.row) {
        minButtonPosition = getPositionOfButton(button2);
        maxButtonPosition = getPositionOfButton(button1);
      }
      if (
        minButtonPosition.row === maxButtonPosition.row ||
        minButtonPosition.column === maxButtonPosition.column
      ) {
        return false;
      }
      for (let y = minButtonPosition.row; y <= maxButtonPosition.row; y++) {
        // Kiểm tra ba dòng
        if (minButtonPosition.column <= maxButtonPosition.column) {
          if (
            checkLineX(
              minButtonPosition.row + 1,
              y,
              minButtonPosition.column,
              false
            ) &&
            checkLineY(
              minButtonPosition.column,
              maxButtonPosition.column + 1,
              y,
              false
            ) &&
            checkLineX(
              y,
              maxButtonPosition.row,
              maxButtonPosition.column,
              false
            )
          ) {
            console.log("eee");
            return true;
          }
        } else if (minButtonPosition.column > maxButtonPosition.column) {
          if (
            checkLineX(
              minButtonPosition.row + 1,
              y,
              minButtonPosition.column,
              false
            ) &&
            checkLineY(
              maxButtonPosition.column,
              minButtonPosition.column + 1,
              y,
              false
            ) &&
            checkLineX(
              y,
              maxButtonPosition.row,
              maxButtonPosition.column,
              false
            )
          ) {
            console.log("eee");
            return true;
          }
        }
      }
    }
    return false;
  }

  // Hàm kiểm tra xem hai button tạo thành hình chữ Z hay không
  function checkShapeZ_Row(button1, button2) {
    // Tìm điểm có y nhỏ nhất và lớn nhất
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      minButtonPosition.row === maxButtonPosition.row ||
      minButtonPosition.column === maxButtonPosition.column
    ) {
      return false;
    }
    for (let y = minButtonPosition.column; y <= maxButtonPosition.column; y++) {
      // Kiểm tra ba dòng
      if (minButtonPosition.row <= maxButtonPosition.row) {
        if (
          checkLineY(
            minButtonPosition.column + 1,
            y,
            minButtonPosition.row,
            false
          ) &&
          checkLineX(minButtonPosition.row, maxButtonPosition.row, y, false) &&
          checkLineY(y, maxButtonPosition.column, maxButtonPosition.row, false)
        ) {
          return true;
        }
      } else if (minButtonPosition.row > maxButtonPosition.row) {
        if (
          checkLineY(
            minButtonPosition.column + 1,
            y,
            minButtonPosition.row,
            false
          ) &&
          checkLineX(maxButtonPosition.row, minButtonPosition.row, y, false) &&
          checkLineY(y, maxButtonPosition.column, maxButtonPosition.row, false)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // kiểm tra đường chéo từ trái sang phải trong hình vuông n
  function checkSquareLeftToRight(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      maxButtonPosition.column - minButtonPosition.column === 1 &&
      maxButtonPosition.row - minButtonPosition.row === 1
    ) {
      const buttonTempRight = getButtonAtPosition(
        minButtonPosition.column + 1,
        minButtonPosition.row
      );
      const buttonTempBottom = getButtonAtPosition(
        minButtonPosition.column,
        minButtonPosition.row + 1
      );
      if (
        buttonTempRight.data("imageName") === "-1" ||
        buttonTempBottom.data("imageName") === "-1"
      ) {
        return true;
      }
    }

    return false;
  }

  // kiểm tra đường chéo từ phải sang trái trong hình vuông
  function checkSquareRightToLeft(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      minButtonPosition.row - maxButtonPosition.row === 1 &&
      maxButtonPosition.column - minButtonPosition.column === 1
    ) {
      const buttonTempTop = getButtonAtPosition(
        minButtonPosition.column,
        minButtonPosition.row - 1
      );
      const buttonTempRight = getButtonAtPosition(
        minButtonPosition.column + 1,
        minButtonPosition.row
      );

      if (
        buttonTempTop.data("imageName") === "-1" ||
        buttonTempRight.data("imageName") === "-1"
      ) {
        return true;
      }
    }

    return false;
  }

  // kiểm tra chữ chữ L
  // getPositionOfButton:=> (row:column)
  // getButtonAtPosition(column, row)
  function checkShapeL(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    let flag = false;
    // KIỂM TRA CHỮ L (XUẤT PHÁT THEO CHIỀU NGANG)
    // kiểm tra từ min->cột của max, nếu trên hàng đó không có vật cản thì xét tiếp
    if (
      checkLineY(
        minButtonPosition.column + 1,
        maxButtonPosition.column + 1,
        minButtonPosition.row,
        false
      )
    ) {
      const buttonTemp = getButtonAtPosition(
        maxButtonPosition.column,
        minButtonPosition.row
      );
      // buttonTempPosition: vị trí mà hàm checkLineX sẽ chạy từ max hoặc đến max
      const buttonTempPosition = getPositionOfButton(buttonTemp);
      // nếu dòng của max < dòng min => chạy từ dòng max tới dòng của temp trên cột max
      if (maxButtonPosition.row < minButtonPosition.row) {
        if (
          checkLineX(
            maxButtonPosition.row + 1,
            buttonTempPosition.row + 1,
            maxButtonPosition.column,
            false
          )
        ) {
          console.log("L SANG PHẢI LÊN TRÊN");
          flag = true;
        } else {
          flag = false;
        }
      } else if (maxButtonPosition.row > minButtonPosition.row) {
        // chạy từ hàng của temp đến max trên cột max
        if (
          checkLineX(
            buttonTempPosition.row,
            maxButtonPosition.row,
            maxButtonPosition.column,
            false
          )
        ) {
          console.log("L SANG PHẢI XUỐNG DƯỚI");
          flag = true;
        } else {
          flag = false;
        }
      }
    }
    // KIỂM TRA CHỮ L (XUẤT PHÁT THEO CHIỀU DỌC)
    // kiểm tra từ hàng min-> max (phía dưới buttonMin)
    else if (maxButtonPosition.row > minButtonPosition.row) {
      if (
        checkLineX(
          minButtonPosition.row + 1,
          maxButtonPosition.row + 1,
          minButtonPosition.column,
          false
        )
      ) {
        const buttonTemp = getButtonAtPosition(
          minButtonPosition.column,
          maxButtonPosition.row
        );
        const buttonTempPosition = getPositionOfButton(buttonTemp);
        if (
          checkLineY(
            buttonTempPosition.column,
            maxButtonPosition.column,
            maxButtonPosition.row,
            false
          )
        ) {
          console.log(
            "L XUỐNG DƯỚI SANG PHẢI",
            buttonTempPosition.row,
            buttonTempPosition.column
          );
          flag = true;
        } else {
          flag = false;
        }
      }
    }
    // kiểm tra từ hàng min->hàng max(phía trên button min)
    else if (maxButtonPosition.row < minButtonPosition.row) {
      if (
        checkLineX(
          maxButtonPosition.row,
          minButtonPosition.row,
          minButtonPosition.column,
          false
        )
      ) {
        const buttonTemp = getButtonAtPosition(
          minButtonPosition.column,
          maxButtonPosition.row
        );
        const buttonTempPosition = getPositionOfButton(buttonTemp);
        console.log("MAX: ", maxButtonPosition.row, maxButtonPosition.column);
        console.log("MIN: ", minButtonPosition.row, minButtonPosition.column);
        if (
          checkLineY(
            buttonTempPosition.column,
            maxButtonPosition.column,
            maxButtonPosition.row,
            false
          )
        ) {
          console.log(
            "L LÊN TRÊN SANG PHẢI: ",
            buttonTempPosition.row,
            buttonTempPosition.column
          );
          flag = true;
        } else {
          flag = false;
        }
      }
    }
    return flag;
  }

  // hàm kiểm tra chữ U (hướng bên phải buttonMax)
  function checkShapeU_Right(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có hàng nhỏ hơn là hàm min
    if (minButtonPosition.row >= maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      minButtonPosition.row === maxButtonPosition.row &&
      minButtonPosition.column === maxButtonPosition.column
    ) {
      return false;
    }

    var buttonMinColumn = null;
    var buttonMinColumnPositionTemp = null; // Khởi tạo biến vị trí của buttonMinColumn
    // hàng: row
    for (let i = maxButtonPosition.row; i >= minButtonPosition.row; i--) {
      // cột: column
      for (let j = 16; j >= 1; j--) {
        var buttonTest = getButtonAtPosition(j, i);
        var buttonTestPosition = getPositionOfButton(buttonTest);
        if (buttonTest.data("imageName") !== "-1") {
          if (
            !buttonMinColumn ||
            buttonTestPosition.column < buttonMinColumnPositionTemp.column
          ) {
            buttonMinColumn = buttonTest;
            buttonMinColumnPositionTemp = buttonTestPosition; // Cập nhật vị trí mới cho buttonMinColumn
          }
        }
        // if (buttonTest.data('imageName') === '-1') {
        //   break;
        // }
        // console.log('min: ', buttonTestPosition.row, buttonTestPosition.column);
        if (
          checkLineY(
            buttonTestPosition.column,
            maxButtonPosition.column,
            maxButtonPosition.row,
            true
          ) &&
          checkLineY(
            buttonTestPosition.column,
            minButtonPosition.column,
            minButtonPosition.row,
            true
          ) &&
          checkLineX(
            minButtonPosition.row,
            maxButtonPosition.row,
            buttonMinColumnPositionTemp.column - 1,
            false
          )
        ) {
          break;
        }
      }
    }
    var buttonMinColumPosition = getPositionOfButton(buttonMinColumn);
    console.log(
      "Min column",
      buttonMinColumPosition.row,
      buttonMinColumPosition.column
    );
    // kiểm tra chữ U bắt đầu từ bên phải buttonMax
    // duyệt từ bên phải buttonMax đến hết dòng đó
    // trên đường đi đó, xét button đầu tiên có giá trị làm buttonTemp1
    // lấy ra giao điểm đầu tiên
    var buttonIntersection;
    for (
      let i = maxButtonPosition.column + 1;
      i <= buttonMinColumPosition.column;
      i++
    ) {
      buttonIntersection = getButtonAtPosition(i - 1, maxButtonPosition.row);
    }
    const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
    if (
      buttonIntersectionPosition.row !== -1 &&
      buttonIntersectionPosition.column !== -1
    ) {
      if (
        checkLineY(
          maxButtonPosition.column + 1,
          buttonIntersection.column + 1,
          maxButtonPosition.row,
          false
        ) &&
        checkLineX(
          minButtonPosition.row,
          buttonIntersectionPosition.row + 1,
          buttonIntersectionPosition.column,
          false
        ) &&
        checkLineY(
          minButtonPosition.column + 1,
          buttonIntersectionPosition.column + 1,
          minButtonPosition.row,
          false
        )
      ) {
        return true;
      }
    }

    return false;
  }

  // hàm kiểm tra chữ U (bên trái button)
  function checkShapeU_Left(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có hàng nhỏ hơn là hàm min
    if (minButtonPosition.row >= maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }

    if (
      minButtonPosition.row === maxButtonPosition.row &&
      minButtonPosition.column === maxButtonPosition.column
    ) {
      return false;
    }

    var buttonMaxColumn = null;
    var buttonMaxColumnPositionTemp = null; // Khởi tạo biến vị trí của buttonMaxColumn
    // hàng: row
    for (let i = maxButtonPosition.row; i >= minButtonPosition.row; i--) {
      // cột: column
      for (let j = 1; j <= 16; j++) {
        var buttonTest = getButtonAtPosition(j, i);
        var buttonTestPosition = getPositionOfButton(buttonTest);
        if (buttonTest.data("imageName") !== "-1") {
          if (
            !buttonMaxColumn ||
            buttonTestPosition.column > buttonMaxColumnPositionTemp.column
          ) {
            buttonMaxColumn = buttonTest;
            buttonMaxColumnPositionTemp = buttonTestPosition; // Cập nhật vị trí mới cho buttonMaxColumn
          }
        }
        // if (buttonTest.data('imageName') === '-1') {
        //   break;
        // }
        // console.log('max: ', buttonMaxColumnPositionTemp.row, buttonMaxColumnPositionTemp.column);
        if (
          checkLineY(
            buttonTestPosition.column,
            maxButtonPosition.column,
            maxButtonPosition.row,
            false
          ) &&
          checkLineY(
            buttonTestPosition.column,
            minButtonPosition.column,
            minButtonPosition.row,
            false
          ) &&
          checkLineX(
            minButtonPosition.row,
            maxButtonPosition.row,
            buttonMaxColumnPositionTemp.column + 1,
            false
          )
        ) {
          break;
        }
      }
    }
    var buttonMinColumPosition = getPositionOfButton(buttonMaxColumn);
    // console.log('maxColumn: ', buttonMinColumPosition.row, buttonMinColumPosition.column);

    var buttonIntersection;
    for (
      let i = maxButtonPosition.column - 1;
      i >= buttonMinColumPosition.column;
      i--
    ) {
      // const buttonBarrier = getButtonAtPosition(i, maxButtonPosition.row);
      // if(buttonBarrier.data('imageName') !== '-1'){
      buttonIntersection = getButtonAtPosition(i + 1, maxButtonPosition.row);
      //   break;
      // }
    }
    const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
    // console.log('mốc: ', buttonIntersectionPosition.row, buttonIntersectionPosition.column);
    if (
      buttonIntersectionPosition.row !== -1 &&
      buttonIntersectionPosition.column !== -1
    ) {
      if (
        checkLineY(
          buttonIntersectionPosition.column,
          maxButtonPosition.column,
          maxButtonPosition.row,
          false
        ) &&
        checkLineX(
          minButtonPosition.row,
          buttonIntersectionPosition.row + 1,
          buttonIntersectionPosition.column,
          false
        ) &&
        checkLineY(
          buttonIntersectionPosition.column,
          minButtonPosition.column,
          minButtonPosition.row,
          false
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // kiểm tra chữ U (phía trên)
  function checkShapeU_Top(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có cột nhỏ hơn là hàm min
    if (minButtonPosition.column >= maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      minButtonPosition.row === maxButtonPosition.row &&
      minButtonPosition.column === maxButtonPosition.column
    ) {
      return false;
    }

    // duyệt từng cột => tìm button có hàng lớn nhất từ trên xuống dưới
    var buttonMaxRow = null;
    var buttonMaxRowPositionTemp = null; // Khởi tạo biến vị trí của buttonMaxRow
    for (let i = maxButtonPosition.column; i >= minButtonPosition.column; i--) {
      for (let j = 1; j <= 9; j++) {
        var buttonTest = getButtonAtPosition(i, j);
        var buttonTestPosition = getPositionOfButton(buttonTest);
        if (buttonTest.data("imageName") !== "-1") {
          // Nếu buttonMaxRow chưa được gán hoặc vị trí hàng của buttonTest lớn hơn vị trí hàng của buttonMaxRow
          if (
            !buttonMaxRow ||
            buttonTestPosition.row > buttonMaxRowPositionTemp.row
          ) {
            buttonMaxRow = buttonTest;
            buttonMaxRowPositionTemp = buttonTestPosition; // Cập nhật vị trí mới cho buttonMaxRow
          }
        }
        // if (buttonTest.data('imageName') === '-1') {
        //     break;
        // }

        if (
          checkLineX(
            buttonTestPosition.row,
            maxButtonPosition.row,
            maxButtonPosition.column,
            false
          ) &&
          checkLineX(
            buttonTestPosition.row,
            minButtonPosition.row,
            minButtonPosition.column,
            false
          ) &&
          checkLineY(
            minButtonPosition.row,
            maxButtonPosition.row,
            buttonMaxRowPositionTemp.row + 1,
            false
          )
        ) {
          console.log("ee");
          break;
        }
      }
    }
    var buttonMaxRowPosition = getPositionOfButton(buttonMaxRow);
    console.log(
      "max row",
      buttonMaxRowPosition.row,
      buttonMaxRowPosition.column
    );
    var buttonIntersection = null;
    for (let i = maxButtonPosition.row - 1; i > buttonMaxRowPosition.row; i--) {
      buttonIntersection = getButtonAtPosition(maxButtonPosition.column, i);
    }
    const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
    if (
      buttonIntersectionPosition.row !== -1 &&
      buttonIntersectionPosition.column !== -1
    ) {
      if (
        checkLineX(
          buttonIntersectionPosition.row,
          maxButtonPosition.row,
          maxButtonPosition.column,
          false
        ) &&
        checkLineY(
          minButtonPosition.column,
          maxButtonPosition.column + 1,
          buttonIntersectionPosition.row,
          false
        ) &&
        checkLineX(
          buttonIntersectionPosition.row,
          minButtonPosition.row,
          minButtonPosition.column,
          false
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // kiểm tra chữ u(phía dưới)
  function checkShapeU_Bottom(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có cột nhỏ hơn là hàm min
    if (minButtonPosition.column >= maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (
      minButtonPosition.row === maxButtonPosition.row &&
      minButtonPosition.column === maxButtonPosition.column
    ) {
      return false;
    }

    var buttonMinRow = null;
    var buttonMinRowPositionTemp = null; // Khởi tạo biến vị trí của buttonMinRow
    for (let i = maxButtonPosition.column; i >= minButtonPosition.column; i--) {
      for (let j = 9; j >= 1; j--) {
        var buttonTest = getButtonAtPosition(i, j);
        var buttonTestPosition = getPositionOfButton(buttonTest);
        if (buttonTest.data("imageName") !== "-1") {
          // Nếu buttonMinRow chưa được gán hoặc vị trí hàng của buttonTest lớn hơn vị trí hàng của buttonMinRow
          if (
            !buttonMinRow ||
            buttonTestPosition.row < buttonMinRowPositionTemp.row
          ) {
            buttonMinRow = buttonTest;
            buttonMinRowPositionTemp = buttonTestPosition; // Cập nhật vị trí mới cho buttonMinRow
          }
        }
        if (buttonTest.data("imageName") === "-1") {
          break;
        }
      }
    }
    var buttonMinRowPosition = getPositionOfButton(buttonMinRow);

    var buttonIntersection;
    for (let i = maxButtonPosition.row + 1; i < buttonMinRowPosition.row; i++) {
      buttonIntersection = getButtonAtPosition(maxButtonPosition.column, i);
    }
    const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
    if (
      buttonIntersectionPosition.row !== -1 &&
      buttonIntersectionPosition.column !== -1
    ) {
      if (
        checkLineX(
          maxButtonPosition.row + 1,
          buttonIntersectionPosition.row + 1,
          maxButtonPosition.column,
          false
        ) &&
        checkLineY(
          minButtonPosition.column,
          maxButtonPosition.column + 1,
          buttonIntersectionPosition.row,
          false
        ) &&
        checkLineX(
          minButtonPosition.row + 1,
          buttonIntersectionPosition.row + 1,
          minButtonPosition.column,
          false
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // Xử lý khi click vào button
  let previousButton = null;
  function logicGamePikachu(button, level) {
    if (previousButton === null) {
      previousButton = button;
      // Thay đổi màu nền của previousButton thành màu xám
      previousButton.css("background-color", "gray");
    } else {
      if (
        button !== previousButton &&
        previousButton.data("imageName") === button.data("imageName")
      ) {
        const previousButtonPosition = getPositionOfButton(previousButton);
        const buttonPosition = getPositionOfButton(button);

        // kiểm tra trên 1 cột =>  hàng tăng dần
        if (checkColumn(previousButton, button)) {
          console.log("kiểm tra cột");
          drawInColumn(
            previousButtonPosition.row,
            buttonPosition.row,
            buttonPosition.column
          );
          setTimeout(function () {
            removeDrawColumn(
              previousButtonPosition.row,
              buttonPosition.row,
              buttonPosition.column
            );
          }, 100);
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          console.log("lv: ", level);
          switch (level) {
            case 1:
              console.log("case 1 nè");
              break;
            case 2:
              console.log("case 2 nè");
              dropButton();
              break;
            case 3:
              console.log("case 3 nè");
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              console.log("case 4 nè");
              showVideo(videoPath);
              break;
            default:
              break;
          }
        }
        // kiểm tra hàng, cột tăng dần
        else if (checkRow(previousButton, button)) {
          console.log("kiểm tra hàng");
          drawInRow(
            previousButtonPosition.column,
            buttonPosition.column,
            buttonPosition.row
          );
          setTimeout(function () {
            removeDrawRow(
              previousButtonPosition.column,
              buttonPosition.column,
              buttonPosition.row
            );
          }, 100);
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              console.log("case 1 nè");
              break;
            case 2:
              console.log("case 2 nè");
              dropButton();
              break;
            case 3:
              console.log("case 3 nè");
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              console.log("case 4 nè");
              showVideo(videoPath);
              break;
            default:
              break;
          }
        }
        // kiểm tra cột hoặc hàng ngoài cùng
        else if (checkOutside(previousButton, button)) {
          console.log("kiểm tra 2 hàng và 2 cột ngoài cùng");
          let type = "";
          if (previousButtonPosition.row === 1 && buttonPosition.row === 1) {
            type = "top";
          } else if (
            previousButtonPosition.row === 9 &&
            buttonPosition.row === 9
          ) {
            type = "bottom";
          } else if (
            previousButtonPosition.column === 1 &&
            buttonPosition.column === 1
          ) {
            type = "left";
          } else if (
            previousButtonPosition.column === 16 &&
            buttonPosition.column === 16
          ) {
            type = "right";
          }
          //vẽ và xóa vùng bên ngoài
          if (type === "top" || type === "bottom") {
            drawOutsideInRow(previousButton, button, type);
            setTimeout(function () {
              removeRowOutside(
                previousButtonPosition.row,
                previousButtonPosition.column,
                buttonPosition.row,
                buttonPosition.column,
                type
              );
            }, 100);
          } else if (type === "left" || type === "right") {
            drawOutsideInColumn(previousButton, button, type);
            setTimeout(function () {
              removeColumnOutside(
                previousButtonPosition.row,
                previousButtonPosition.column,
                buttonPosition.row,
                buttonPosition.column,
                type
              );
            }, 100);
          }
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              console.log("case 1 nè");
              break;
            case 2:
              console.log("case 2 nè");
              dropButton();
              break;
            case 3:
              console.log("case 3 nè");
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              console.log("case 4 nè");
              showVideo(videoPath);
              break;
            default:
              break;
          }
        }
        // kiểm tra hình vuông từ trái sang phải
        else if (checkSquareLeftToRight(previousButton, button)) {
          console.log("HÌNH VUÔNG T->P");

          drawRectLeftToRight(previousButton, button);
          setTimeout(function () {
            removeDrawRectLeftToRight(
              previousButtonPosition.column,
              previousButtonPosition.row,
              buttonPosition.column,
              buttonPosition.row
            );
          }, 100);

          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              console.log("case 1 nè");
              break;
            case 2:
              console.log("case 2 nè");
              dropButton();
              break;
            case 3:
              console.log("case 3 nè");
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              console.log("case 4 nè");
              showVideo(videoPath);
              break;
            default:
              break;
          }
        }
        // kiểm tra hình vuông từ phải sang trái
        else if (checkSquareRightToLeft(previousButton, button)) {
          console.log("HÌNH VUÔNG P->T");
          drawRectRightToLeft(previousButton, button);
          setTimeout(function () {
            removeDrawRectRightToLeft(
              previousButtonPosition.column,
              previousButtonPosition.row,
              buttonPosition.column,
              buttonPosition.row
            );
          }, 100);

          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              console.log("case 1 nè");
              break;
            case 2:
              console.log("case 2 nè");
              dropButton();
              break;
            case 3:
              console.log("case 3 nè");
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              console.log("case 4 nè");
              showVideo(videoPath);
              break;
            default:
              break;
          }
        }
        // kiểm tra outside phía trên
        else if (checkOutsideTop(previousButton, button)) {
          console.log("TOP_OUTSIDE");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        }
        // kiểm tra outside phía dưới
        else if (checkOutsideBottom(previousButton, button)) {
          console.log("BOTTOM_OUTSIDE");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkOutsideRight(previousButton, button)) {
          console.log("RIGHT_OUTSIDE");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkOutsideLeft(previousButton, button)) {
          console.log("LEFT_OUTSIDE");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeL(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("L");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeU_Top(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("U TOP");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeU_Bottom(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("U BOTTOM");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeU_Right(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("U RIGHT");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeU_Left(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("U LEFT");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeZ_Column(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("Z COLUMN");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else if (checkShapeZ_Row(previousButton, button)) {
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          console.log("Z ROW");
          changeImageNameToMinusOne(previousButton);
          changeImageNameToMinusOne(button);
          hideTwoButtons(previousButton, button);
          switch (level) {
            case 1:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            case 2:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              dropButton();
              break;
            case 3:
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              deleteMatrix();
              createMatrixWithPoint();
              break;
            case 4:
              showVideo(videoPath);
              changeImageNameToMinusOne(previousButton);
              changeImageNameToMinusOne(button);
              hideTwoButtons(previousButton, button);
              break;
            default:
              break;
          }
        } else {
          console.log("đéo có cái nào đc");
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          previousButton = null;
        }
        previousButton = null;
      } else {
        previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
        previousButton = null;
      }
    }
  }

  // hàm ẩn 2 button
  function hideTwoButtons(button1, button2) {
    button1.css("background-image", `url('img/point.png')`);
    button2.css("background-image", `url('img/point.png')`);
  }

  // Hàm để thay đổi giá trị của thuộc tính imageName thành -1 cho một button
  function changeImageNameToMinusOne(button) {
    button.data("imageName", "-1");
  }

  // LV2:
  // hàm dồn lên trên khi cột trống => áp dụng cho lv2
  function dropButton() {
    let arrayButtoninColumn = [];
    // Duyệt qua cả ma trận
    for (let column = 1; column <= 16; column++) {
      for (let row = 1; row <= 9; row++) {
        const button = getButtonAtPosition(column, row);
        if (button.data("imageName") === "-1") {
          // Lưu vị trí của các button có giá trị là -1 vào mảng
          arrayButtoninColumn.push({ column, row });
        }
      }
    }

    // Duyệt qua các button có giá trị là -1 và thực hiện di chuyển
    for (let i = 0; i < arrayButtoninColumn.length; i++) {
      const buttonInArrayPosition = arrayButtoninColumn[i];
      const buttonInArray = getButtonAtPosition(
        buttonInArrayPosition.column,
        buttonInArrayPosition.row
      );

      // Lấy button ở dưới
      let buttonBelow = getButtonAtPosition(
        buttonInArrayPosition.column,
        buttonInArrayPosition.row + 1
      );
      if (buttonBelow.data("imageName") === "-1") {
        buttonBelow = getButtonAtPosition(
          buttonInArrayPosition.column,
          buttonInArrayPosition.row + 2
        );
      }

      // Lấy hình ảnh của button ở dưới và gán cho button hiện tại
      const dropName = buttonBelow.data("imageName");
      buttonInArray.data("imageName", dropName);
      buttonInArray.css("background-image", `url('img/${dropName}')`);

      // Cập nhật giá trị của các button ở dưới
      for (let j = buttonInArrayPosition.row + 1; j <= 9; j++) {
        const buttonIndex = getButtonAtPosition(
          buttonInArrayPosition.column,
          j
        );
        const aboveButton = getButtonAtPosition(
          buttonInArrayPosition.column,
          j + 1
        );
        let aboveName = aboveButton.data("imageName");
        console.log("above", aboveName);
        if (
          aboveName === "-1" ||
          aboveName === null ||
          aboveName === "undefined"
        ) {
          // Kiểm tra xem aboveName đã được gán giá trị hay chưa
          aboveName = "point.png"; // Gán giá trị mặc định nếu aboveName không được định nghĩa
        }
        buttonIndex.data("imageName", aboveName);
        buttonIndex.css("background-image", `url('img/${aboveName}')`);
        buttonBelow = buttonIndex;
      }
    }
  }

  // LV3:
  // tạo ra 1 ma trận nhưng trong ma trận này đã có các button bị ăn xong
  function createMatrixWithPoint() {
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 16; col++) {
        let imageName;
        let buttonPoint = getButtonAtPosition(col, row);
        if (buttonPoint.data("imageName") === "-1") {
          continue;
        } else {
          const random = Math.floor(Math.random() * IMAGE_NAMES.length);
          imageName = IMAGE_NAMES[random];
          createButtonWithPoint(imageName, buttonPoint);
        }
      }
    }
  }
  // tạo ra button
  function createButtonWithPoint(imageName, button) {
    if (button.data("imageName") === "empty") {
      button.css("background-image", `url('img/${imageName}')`);
      button.data("imageName", imageName);
    }
    return button;
  }
  // xóa css của button và đặt lại imageName là empty
  function deleteMatrix() {
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 16; col++) {
        let button = getButtonAtPosition(col, row);
        if (button.data("imageName") === "-1") {
          continue;
        } else {
          button.css("background-image", `url('')`);
          button.data("imageName", "empty");
        }
      }
    }
  }

  // lv4: BOSS
  // hàm tạo ra ma trận với 4 button Boss
  function createMatrixWithBoss() {
    var imageBoss = ["solgaleo.png", "dialga.png"];
    var solgaleoCount = 0; // Đếm số lượng Solgaleo đã được tạo
    var dialgaCount = 0; // Đếm số lượng Dialga đã được tạo
    var maxBossCount = 2; // Số lượng button tối đa cho mỗi loại boss
    var bossPositions = getRandomBossPositions(); // Lấy vị trí ngẫu nhiên cho boss
    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLS; j++) {
        var cell = $("<div></div>").addClass("cell");
        var imageName;
        if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
          imageName = "-1";
        } else {
          // Kiểm tra xem cần tạo boss nào, solgaleo hay dialga
          if (
            solgaleoCount < maxBossCount &&
            imageBoss.indexOf("solgaleo.png") !== -1 &&
            bossPositions.some(function (pos) {
              return pos.row === i && pos.col === j;
            })
          ) {
            imageName = "solgaleo.png";
            solgaleoCount++;
          } else if (
            dialgaCount < maxBossCount &&
            imageBoss.indexOf("dialga.png") !== -1 &&
            bossPositions.some(function (pos) {
              return pos.row === i && pos.col === j;
            })
          ) {
            imageName = "dialga.png";
            dialgaCount++;
          } else {
            var random = Math.floor(Math.random() * IMAGE_NAMES.length);
            imageName = IMAGE_NAMES[random];
          }
        }
        var button = createButton(imageName, 4);
        if (imageName === "solgaleo.png" || imageName === "dialga.png") {
          button.addClass("boss-button");
        }
        cell.append(button);
        GRID_CONTAINER.append(cell);
      }
    }
  }
  // hàm random vị trí ngẫu nhiên của boss trong ma trận
  function getRandomBossPositions() {
    var positions = [];
    while (positions.length < 4) {
      var row = Math.floor(Math.random() * (ROWS - 2)) + 1; // Tránh vị trí ở biên
      var col = Math.floor(Math.random() * (COLS - 2)) + 1;
      var pos = { row: row, col: col };
      var duplicate = false;
      for (var i = 0; i < positions.length; i++) {
        if (positions[i].row === row && positions[i].col === col) {
          duplicate = true;
          break;
        }
      }
      if (!duplicate) {
        positions.push(pos);
      }
    }
    return positions;
  }
  // show video
  const videoPath = "video/diaAnimation.mp4";
  function showVideo(videoPath) {
    var videoContainer = document.getElementById("videoContainer");
    var video = document.getElementById("videoPlayer");
    videoContainer.style.display = "block";
    video.src = videoPath;
    video.load();
    video.play();
  }

  // ================================================================ VẼ ================================================================

  // vẽ từng cột trên 1 hàng
  function drawInRow(positionStart, positionEnd, row) {
    if (positionStart < positionEnd) {
      for (let x = positionStart; x <= positionEnd; x++) {
        const buttonInBetween = getButtonAtPosition(x, row);
        buttonInBetween.css("background-color", "red");
      }
    } else if (positionStart >= positionEnd) {
      for (let x = positionStart; x >= positionEnd; x--) {
        const buttonInBetween = getButtonAtPosition(x, row);
        buttonInBetween.css("background-color", "red");
      }
    }
  }
  // vẽ từng hàng trên cùng cột
  function drawInColumn(positionStart, positionEnd, column) {
    if (positionStart < positionEnd) {
      for (let y = positionStart; y <= positionEnd; y++) {
        const buttonInBetween = getButtonAtPosition(column, y);
        buttonInBetween.css("background-color", "red");
      }
    } else if (positionStart >= positionEnd) {
      for (let y = positionStart; y >= positionEnd; y--) {
        const buttonInBetween = getButtonAtPosition(column, y);
        buttonInBetween.css("background-color", "red");
      }
    }
  }
  // đặt lại nền cho hàng
  function removeDrawRow(positionStart, positionEnd, row) {
    if (positionStart < positionEnd) {
      for (let x = positionStart; x <= positionEnd; x++) {
        const buttonInBetween = getButtonAtPosition(x, row);
        buttonInBetween.css("background-color", "");
      }
    } else if (positionStart >= positionEnd) {
      for (let x = positionStart; x >= positionEnd; x--) {
        const buttonInBetween = getButtonAtPosition(x, row);
        buttonInBetween.css("background-color", "");
      }
    }
  }
  // đặt lại nền cho cột
  function removeDrawColumn(positionStart, positionEnd, column) {
    if (positionStart < positionEnd) {
      for (let y = positionStart; y <= positionEnd; y++) {
        const buttonInBetween = getButtonAtPosition(column, y);
        buttonInBetween.css("background-color", "");
      }
    } else if (positionStart >= positionEnd) {
      for (let y = positionStart; y >= positionEnd; y--) {
        const buttonInBetween = getButtonAtPosition(column, y);
        buttonInBetween.css("background-color", "");
      }
    }
  }

  // vẽ outside trên cùng hàng
  function drawOutsideInRow(buttonStart, buttonEnd, type) {
    const buttonStartPosition = getPositionOfButton(buttonStart);
    const buttonEndPosition = getPositionOfButton(buttonEnd);
    buttonStart.css("background-color", "red");
    buttonEnd.css("background-color", "red");
    let buttonInBetween = null;
    if (buttonStartPosition.column < buttonEndPosition.column) {
      for (
        let i = buttonStartPosition.column;
        i <= buttonEndPosition.column;
        i++
      ) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "red");
      }
    }
    if (buttonStartPosition.column > buttonEndPosition.column) {
      for (
        let i = buttonStartPosition.column;
        i >= buttonEndPosition.column;
        i--
      ) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "red");
      }
    }
  }
  // vẽ outside trên cùng cột
  function drawOutsideInColumn(buttonStart, buttonEnd, type) {
    const buttonStartPosition = getPositionOfButton(buttonStart);
    const buttonEndPosition = getPositionOfButton(buttonEnd);
    buttonStart.css("background-color", "red");
    buttonEnd.css("background-color", "red");
    let buttonInBetween = null;
    if (buttonStartPosition.row < buttonEndPosition.row) {
      for (let i = buttonStartPosition.row; i <= buttonEndPosition.row; i++) {
        if (type === "left") {
          buttonInBetween = getButtonAtPosition(0, i);
        } else if (type === "right") {
          buttonInBetween = getButtonAtPosition(17, i);
        }
        buttonInBetween.css("background-color", "red");
      }
    }
    if (buttonStartPosition.row > buttonEndPosition.row) {
      for (let i = buttonStartPosition.row; i >= buttonEndPosition.row; i--) {
        if (type === "left") {
          buttonInBetween = getButtonAtPosition(0, i);
        } else if (type === "right") {
          buttonInBetween = getButtonAtPosition(17, i);
        }
        buttonInBetween.css("background-color", "red");
      }
    }
  }
  // đặt lại outside ROW
  function removeRowOutside(
    previousRow,
    previousColumn,
    buttonRow,
    buttonColumn,
    type
  ) {
    console.log("ê");
    const buttonStart = getButtonAtPosition(previousColumn, previousRow);
    const buttonEnd = getButtonAtPosition(buttonColumn, buttonRow);

    const buttonStartPosition = getPositionOfButton(buttonStart);
    const buttonEndPosition = getPositionOfButton(buttonEnd);

    buttonStart.css("background-color", "");
    buttonEnd.css("background-color", "");

    let buttonInBetween = null;
    if (buttonStartPosition.column < buttonEndPosition.column) {
      for (
        let i = buttonStartPosition.column;
        i <= buttonEndPosition.column;
        i++
      ) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "");
      }
    }
    if (buttonStartPosition.column > buttonEndPosition.column) {
      for (
        let i = buttonStartPosition.column;
        i >= buttonEndPosition.column;
        i--
      ) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "");
      }
    }
  }
  // đặt lại outside COLUMN
  function removeColumnOutside(
    previousRow,
    previousColumn,
    buttonRow,
    buttonColumn,
    type
  ) {
    const buttonStart = getButtonAtPosition(previousColumn, previousRow);
    const buttonEnd = getButtonAtPosition(buttonColumn, buttonRow);

    const buttonStartPosition = getPositionOfButton(buttonStart);
    const buttonEndPosition = getPositionOfButton(buttonEnd);
    buttonStart.css("background-color", "");
    buttonEnd.css("background-color", "");

    let buttonInBetween = null;
    if (buttonStartPosition.row < buttonEndPosition.row) {
      for (let i = buttonStartPosition.row; i <= buttonEndPosition.row; i++) {
        if (type === "left") {
          buttonInBetween = getButtonAtPosition(0, i);
        } else if (type === "right") {
          buttonInBetween = getButtonAtPosition(17, i);
        }
        console.log("<<<<<");
        buttonInBetween.css("background-color", "");
      }
    } else if (buttonStartPosition.row > buttonEndPosition.row) {
      for (let i = buttonStartPosition.row; i >= buttonEndPosition.row; i--) {
        if (type === "left") {
          buttonInBetween = getButtonAtPosition(0, i);
        } else if (type === "right") {
          buttonInBetween = getButtonAtPosition(17, i);
        }
        console.log(">>>>");
        buttonInBetween.css("background-color", "");
      }
    }
  }

  // vẽ đường thẳng chiều dọc outside
  function drawOutsideColumn_Top_Bottom(buttonColumn, type) {
    if (type === "top") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i >= 0; i--) {
        const buttonBetween = getButtonAtPosition(
          buttonColumnPosition.column,
          i
        );
        buttonBetween.css("background-color", "red");
      }
    } else if (type === "bottom") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i <= 10; i++) {
        const buttonBetween = getButtonAtPosition(
          buttonColumnPosition.column,
          i
        );
        buttonBetween.css("background-color", "red");
      }
    }
  }
  // vẽ đường thẳng chiều ngang outside
  function drawOutsideRow_Top_Bottom(button1, button2, type) {
    if (type === "top") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.column < button2Position.column) {
        for (let i = button1Position.column; i <= button2Position.column; i++) {
          const buttonBetween = getButtonAtPosition(i, 0);
          buttonBetween.css("background-color", "red");
        }
      } else if (button1Position.column > button2Position.column) {
        for (let i = button1Position.column; i >= button2Position.column; i--) {
          const buttonBetween = getButtonAtPosition(i, 0);
          buttonBetween.css("background-color", "red");
        }
      }
    } else if (type === "bottom") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.column < button2Position.column) {
        for (let i = button1Position.column; i <= button2Position.column; i++) {
          const buttonBetween = getButtonAtPosition(i, 10);
          buttonBetween.css("background-color", "red");
        }
      } else if (button1Position.column > button2Position.column) {
        for (let i = button1Position.column; i >= button2Position.column; i--) {
          const buttonBetween = getButtonAtPosition(i, 10);
          buttonBetween.css("background-color", "red");
        }
      }
    }
  }
  // đặt lại bg cho chiều dọc outside
  function removeDrawOutsideInColumn_Top_Bottom(buttonColumn, type) {
    if (type === "top") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i >= 0; i--) {
        const buttonBetween = getButtonAtPosition(
          buttonColumnPosition.column,
          i
        );
        buttonBetween.css("background-color", "");
      }
    } else if (type === "bottom") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i <= 10; i++) {
        const buttonBetween = getButtonAtPosition(
          buttonColumnPosition.column,
          i
        );
        buttonBetween.css("background-color", "");
      }
    }
  }
  // đặt lại bg cho chiều ngang outside
  function removeDrawOutsideInRow_Top_Bottom(button1, button2, type) {
    if (type === "top") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.column < button2Position.column) {
        for (let i = button1Position.column; i <= button2Position.column; i++) {
          const buttonBetween = getButtonAtPosition(i, 0);
          buttonBetween.css("background-color", "");
        }
      } else if (button1Position.column > button2Position.column) {
        for (let i = button1Position.column; i >= button2Position.column; i--) {
          const buttonBetween = getButtonAtPosition(i, 0);
          buttonBetween.css("background-color", "");
        }
      }
    } else if (type === "bottom") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.column < button2Position.column) {
        for (let i = button1Position.column; i <= button2Position.column; i++) {
          const buttonBetween = getButtonAtPosition(i, 10);
          buttonBetween.css("background-color", "");
        }
      } else if (button1Position.column > button2Position.column) {
        for (let i = button1Position.column; i >= button2Position.column; i--) {
          const buttonBetween = getButtonAtPosition(i, 10);
          buttonBetween.css("background-color", "");
        }
      }
    }
  }

  // vẽ đường thẳng theo chiều dọc 2 bên trái và phải
  function drawOutsideColumn_Right_Left(button1, button2, type) {
    if (type === "right") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.row < button2Position.row) {
        // từ trên xuống dưới hàng button2
        for (let i = button1Position.row; i <= button2Position.row; i++) {
          const buttonBetween = getButtonAtPosition(17, i);
          buttonBetween.css("background-color", "red");
        }
      } else if (button1Position.row > button2Position.row) {
        for (let i = button2Position.row; i <= button1Position.row; i++) {
          const buttonBetween = getButtonAtPosition(17, i);
          buttonBetween.css("background-color", "red");
        }
      }
    } else if (type === "left") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.row < button2Position.row) {
        // từ trên xuống dưới hàng button2
        for (let i = button1Position.row; i <= button2Position.row; i++) {
          const buttonBetween = getButtonAtPosition(0, i);
          buttonBetween.css("background-color", "red");
        }
      } else if (button1Position.row > button2Position.row) {
        for (let i = button2Position.row; i <= button1Position.row; i++) {
          const buttonBetween = getButtonAtPosition(0, i);
          buttonBetween.css("background-color", "red");
        }
      }
    }
  }
  // vẽ đường thẳng theo chiều ngang bên trái và phải
  function drawOutsideRow_Right_Left(buttonRow, type) {
    if (type === "right") {
      const buttonRowPosition = getPositionOfButton(buttonRow);
      for (let i = buttonRowPosition.column; i <= 17; i++) {
        const buttonBetween = getButtonAtPosition(i, buttonRowPosition.row);
        buttonBetween.css("background-color", "red");
      }
    } else if (type === "left") {
      const buttonRowPosition = getPositionOfButton(buttonRow);
      for (let i = buttonRowPosition.column; i >= 0; i--) {
        const buttonBetween = getButtonAtPosition(i, buttonRowPosition.row);
        buttonBetween.css("background-color", "red");
      }
    }
  }
  // hàm đặt lại bg cho chiều dọc
  function removeDrawOutsideColumn_Right_Left(button1, button2, type) {
    if (type === "right") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.row < button2Position.row) {
        // từ trên xuống dưới hàng button2
        for (let i = button1Position.row; i <= button2Position.row; i++) {
          const buttonBetween = getButtonAtPosition(17, i);
          buttonBetween.css("background-color", "");
        }
      } else if (button1Position.row > button2Position.row) {
        for (let i = button2Position.row; i <= button1Position.row; i++) {
          const buttonBetween = getButtonAtPosition(17, i);
          buttonBetween.css("background-color", "");
        }
      }
    } else if (type === "left") {
      const button1Position = getPositionOfButton(button1);
      const button2Position = getPositionOfButton(button2);
      if (button1Position.row < button2Position.row) {
        // từ trên xuống dưới hàng button2
        for (let i = button1Position.row; i <= button2Position.row; i++) {
          const buttonBetween = getButtonAtPosition(0, i);
          buttonBetween.css("background-color", "");
        }
      } else if (button1Position.row > button2Position.row) {
        for (let i = button2Position.row; i <= button1Position.row; i++) {
          const buttonBetween = getButtonAtPosition(0, i);
          buttonBetween.css("background-color", "");
        }
      }
    }
  }
  // đặt lại bg cho chiều ngang
  function removeDrawOutsideRow_Right_Left(buttonRow, type) {
    if (type === "right") {
      const buttonRowPosition = getPositionOfButton(buttonRow);
      for (let i = buttonRowPosition.column; i <= 17; i++) {
        const buttonBetween = getButtonAtPosition(i, buttonRowPosition.row);
        buttonBetween.css("background-color", "");
      }
    } else if (type === "left") {
      const buttonRowPosition = getPositionOfButton(buttonRow);
      for (let i = buttonRowPosition.column; i >= 0; i--) {
        const buttonBetween = getButtonAtPosition(i, buttonRowPosition.row);
        buttonBetween.css("background-color", "");
      }
    }
  }

  // vẽ hình chữ nhật từ trái sang phải
  function drawRectLeftToRight(button1, button2) {
    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);

    button1.css("background-color", "red");
    button2.css("background-color", "red");
    let buttonCorner;
    // buttonCorner từ trái sang phải xuống dưới
    if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button2Position.column,
        button1Position.row
      );
    } else if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button1Position.column,
        button2Position.row
      );
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "red");
    }
    // buttonCorner từ trên xuống dưới sang phải
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button1Position.column,
          button2Position.row
        );
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button2Position.column,
          button1Position.row
        );
      }
      buttonCorner.css("background-color", "red");
    }
  }
  // vẽ hình chữ nhật từ phải sang trái
  function drawRectRightToLeft(button1, button2) {
    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);

    button1.css("background-color", "red");
    button2.css("background-color", "red");

    let buttonCorner;
    // buttonCorner từ phải sang trái xuống dưới
    if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button2Position.column,
        button1Position.row
      );
    } else if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button1Position.column,
        button2Position.row
      );
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "red");
    }
    // buttonCorner từ trên xuống dưới sang trái
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button2Position.column,
          button1Position.row
        );
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button1Position.column,
          button2Position.row
        );
      }
      buttonCorner.css("background-color", "red");
    }
  }
  // đặt lại bg cho button (hình vuông từ trái sang phải)
  function removeDrawRectLeftToRight(
    button1Colum,
    button1Row,
    button2Column,
    button2Row
  ) {
    const button1 = getButtonAtPosition(button1Colum, button1Row);
    const button2 = getButtonAtPosition(button2Column, button2Row);
    button1.css("background-color", "");
    button2.css("background-color", "");

    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);
    let buttonCorner;
    // buttonCorner từ trái sang phải xuống dưới
    if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button2Position.column,
        button1Position.row
      );
    } else if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button1Position.column,
        button2Position.row
      );
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "");
    }
    // buttonCorner từ trên xuống dưới sang phải
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button1Position.column,
          button2Position.row
        );
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button2Position.column,
          button1Position.row
        );
      }
    }
    buttonCorner.css("background-color", "");
  }
  // đặt lại bg cho button (hình vuông từ phải sang trái)
  function removeDrawRectRightToLeft(
    button1Colum,
    button1Row,
    button2Column,
    button2Row
  ) {
    const button1 = getButtonAtPosition(button1Colum, button1Row);
    const button2 = getButtonAtPosition(button2Column, button2Row);
    button1.css("background-color", "");
    button2.css("background-color", "");

    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);
    let buttonCorner;
    // buttonCorner từ phải sang trái xuống dưới
    if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button2Position.column,
        button1Position.row
      );
    } else if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(
        button1Position.column,
        button2Position.row
      );
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "");
    }
    // buttonCorner từ trên xuống dưới sang trái
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button2Position.column,
          button1Position.row
        );
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(
          button1Position.column,
          button2Position.row
        );
      }
      buttonCorner.css("background-color", "");
    }
  }

  // vẽ chữ Z, U, L: CHƯA HOÀN THÀNH

  //================================================================ LEVEL ================================================================
  // Định nghĩa hàm skipLevel
  function skipLevel() {
    level++;
    // Kiểm tra giá trị của level và thực hiện các hành động tương ứng
    if (level === 2) {
      console.log("lv ", level);
      clearMatrix();
      createMatrix(level);
      console.log("đã create");
    } else if (level === 3) {
      clearMatrix();
      createMatrix(level);
      console.log("lv ", level);
    } else if (level === 4) {
      clearMatrix();
      createMatrixWithBoss();
      console.log("lv ", level);
    } else if (level === 5) {
      clearMatrix();
      createMatrix(level);
      console.log("lv ", level);
    } else if (level === 6) {
      clearMatrix();
      createMatrix(level);
      console.log("lv ", level);
    }
  }

  // reset game
  function reset() {
    clearMatrix();
    createMatrix(level);
    console.log("reset");
  }
  // change position
  function changePosition() {
    deleteMatrix();
    createMatrixWithPoint();
  }

  $skip.click(skipLevel);
  $reset.click(reset);
  $changePosition.click(changePosition);

  createMatrix(level);
});
