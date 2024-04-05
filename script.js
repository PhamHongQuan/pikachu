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
    return isValid; // Trả về kết quả kiểm tra
  }
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
    return isValid; // Trả về kết quả kiểm tra
  }
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
    return isValid; // Trả về kết quả kiểm tra
  }

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
    for (let i = maxButtonPosition.column - 1; i > 0; i--) {
      const buttonLeft = getButtonAtPosition(i, maxButtonPosition.row);
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
      const buttonLeft = getButtonAtPosition(i, maxButtonPosition.row);
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
    return isValid; // Trả về kết quả kiểm tra
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
  for (let y = startY; y < endY; y++) {
    const buttonInBetween = getButtonAtPosition(column, y);
    const b = getPositionOfButton(buttonInBetween);
    if (buttonInBetween.data("imageName") !== "-1") {
      return false;
    }
  }
  return true;
}

// Kiểm tra dòng theo chiều dọc
function checkLineY(startX, endX, row) {
  for (let x = startX; x < endX; x++) {
    const buttonInBetween = getButtonAtPosition(x, row);
    const b = getPositionOfButton(buttonInBetween);
    if (buttonInBetween.data("imageName") !== "-1") {
      return false;
    }
  }
  return true;
}

// Hàm kiểm tra xem hai button tạo thành hình chữ nhật hay không(THEO CHIỀU DỌC)
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
        checkLineX(
          minButtonPosition.row + 1,
          y - 1,
          minButtonPosition.column
        ) &&
        checkLineY(minButtonPosition.column, maxButtonPosition.column, y) &&
        checkLineX(y, maxButtonPosition.row, maxButtonPosition.column)
      ) {
        console.log("eee");
        return true;
      }
    }
  }
  return false;
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
      checkLineY(minButtonPosition.column + 1, y - 1, minButtonPosition.row) &&
      checkLineX(minButtonPosition.row, maxButtonPosition.row, y) &&
      checkLineY(y, maxButtonPosition.column, maxButtonPosition.row)
    ) {
      return true;
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
function checkShapeL(button1, button2){
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  if (minButtonPosition.column > maxButtonPosition.column) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  let flag = false;
  // kiểm tra từ min->cột của max, nếu trên hàng đó không có vật cản thì xét tiếp
  if(checkLineY(minButtonPosition.column+1, maxButtonPosition.column+1, minButtonPosition.row)){
    const buttonTemp = getButtonAtPosition(maxButtonPosition.column, minButtonPosition.row);
    // buttonTempPosition: vị trí mà hàm checkLineX sẽ chạy từ max hoặc đến max
    const buttonTempPosition = getPositionOfButton(buttonTemp);
    // nếu dòng của max < dòng min => chạy từ dòng max tới dòng của temp trên cột max
    if(maxButtonPosition.row < minButtonPosition.row){
      if(checkLineX(maxButtonPosition.row+1, buttonTempPosition.row+1, maxButtonPosition.column)){
        flag = true;
      }else {
        flag = false;
      }
    }else if(maxButtonPosition.row > minButtonPosition.row){
      // chạy từ hàng của temp đến max trên cột max
      if(checkLineX(buttonTempPosition.row, maxButtonPosition.row, maxButtonPosition.column)){
        flag = true
      }else {
        flag = false;
      }
    }
  }
  // kiểm tra từ hàng min->hàng max(phía trên button min)
  else if(checkLineX(maxButtonPosition.row, minButtonPosition.row, minButtonPosition.column)){
    const buttonTemp = getButtonAtPosition(minButtonPosition.column, maxButtonPosition.row);
    const buttonTempPosition = getPositionOfButton(buttonTemp);
    if(checkLineY(buttonTempPosition.column, maxButtonPosition.column, maxButtonPosition.row)){
      flag =true;
    }else {
      flag = false;
    }
  } 
  // kiểm tra từ hàng min-> max (phía dưới buttonMin)
  else if(checkLineX(minButtonPosition.row+1, maxButtonPosition.row+1, minButtonPosition.column)){
    const buttonTemp = getButtonAtPosition(minButtonPosition.column, maxButtonPosition.row);
    const buttonTempPosition = getPositionOfButton(buttonTemp);
    if(checkLineY(buttonTempPosition.column, maxButtonPosition.column, maxButtonPosition.row)){
      flag = true;
    }else{
      flag = false;
    }
  }
  return flag;
}



// hàm kiểm tra chữ U (hướng bên phải buttonMax)
function checkShapeU_Right(button1, button2) {
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  // mặc định hàm nào có hàng nhỏ hơn là hàm min
  if (minButtonPosition.row > maxButtonPosition.row) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  if(minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column){
    return false;
  }
  // kiểm tra chữ U bắt đầu từ bên phải buttonMax
  // duyệt từ bên phải buttonMax đến hết dòng đó
  // trên đường đi đó, xét button đầu tiên có giá trị làm buttonTemp1
  // lấy ra giao điểm đầu tiên
    var buttonIntersection;
    for(let i = maxButtonPosition.column+1; i <= 16;i++){
      const buttonBarrier = getButtonAtPosition(i, maxButtonPosition.row);
      if(buttonBarrier.data('imageName') !== '-1'){
        buttonIntersection = getButtonAtPosition(i-1, maxButtonPosition.row);
        break;
      }
    }
    const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
    if(checkLineY(maxButtonPosition.column+1, buttonIntersection.column+1, maxButtonPosition.row)&&
      checkLineX(minButtonPosition.row, buttonIntersectionPosition.row+1, buttonIntersectionPosition.column) &&
      checkLineY(minButtonPosition.column+1, buttonIntersectionPosition.column+1, minButtonPosition.row)){
      return true;
    }
    
  return false;
}



// hàm kiểm tra chữ U (bên trái button)
function checkShapeU_Left(button1, button2) { 
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  // mặc định hàm nào có hàng nhỏ hơn là hàm min
  if (minButtonPosition.row > maxButtonPosition.row) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }

  if(minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column){
    return false;
  }

  var buttonIntersection;
  for(let i = maxButtonPosition.column-1; i >= 0; i--){
    const buttonBarrier = getButtonAtPosition(i, maxButtonPosition.row);
    if(buttonBarrier.data('imageName') !== '-1'){
      buttonIntersection = getButtonAtPosition(i+1, maxButtonPosition.row);
      break;
    }
  }
  const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
  if(checkLineY(buttonIntersectionPosition.column, maxButtonPosition.column, maxButtonPosition.row) &&
    checkLineX(minButtonPosition.row, buttonIntersectionPosition.row+1, buttonIntersectionPosition.column) &&
    checkLineY(buttonIntersectionPosition.column, minButtonPosition.column, minButtonPosition.row)){
      return true;
    }

  return false;
}




// kiểm tra chữ U (phía trên)
function checkShapeU_Top(button1, button2){
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  // mặc định hàm nào có cột nhỏ hơn là hàm min
  if (minButtonPosition.column > maxButtonPosition.column) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  if(minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column){
    return false;
  }

  var buttonIntersection;
  for(let i = maxButtonPosition.row-1; i >= 0; i--){
    const buttonBarrier = getButtonAtPosition(maxButtonPosition.column, i);
    if(buttonBarrier.data('imageName') !== '-1'){
      buttonIntersection = getButtonAtPosition(maxButtonPosition.column, i+1)
      break;
    }
  }
  const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
  if(checkLineX(buttonIntersectionPosition.row, maxButtonPosition.row, maxButtonPosition.column) &&
    checkLineY(minButtonPosition.column, maxButtonPosition.column+1, buttonIntersectionPosition.row) && 
    checkLineX(buttonIntersectionPosition.row, minButtonPosition.row, minButtonPosition.column)){
      return true;
    }

  return false;
}


// kiểm tra chữ u(phía dưới)
function checkShapeU_Bottom(button1, button2){
  let minButtonPosition = getPositionOfButton(button1);
  let maxButtonPosition = getPositionOfButton(button2);
  // mặc định hàm nào có cột nhỏ hơn là hàm min
  if (minButtonPosition.column > maxButtonPosition.column) {
    minButtonPosition = getPositionOfButton(button2);
    maxButtonPosition = getPositionOfButton(button1);
  }
  if(minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column){
    return false;
  }

  var buttonIntersection;
  for(let i = maxButtonPosition.row+1; i <= 9;i++){
    const buttonBarrier = getButtonAtPosition(maxButtonPosition.column, i);
    if(buttonBarrier.data('imageName') !== '-1'){
      buttonIntersection = getButtonAtPosition(maxButtonPosition.column, i-1);
      break;
    }
  }
  const buttonIntersectionPosition = getPositionOfButton(buttonIntersection);
  if(checkLineX(maxButtonPosition.row+1, buttonIntersectionPosition.row+1, maxButtonPosition.column) && 
    checkLineY(minButtonPosition.column, maxButtonPosition.column+1, buttonIntersectionPosition.row) && 
    checkLineX(minButtonPosition.row, buttonIntersectionPosition.row+1, minButtonPosition.column)){
      return true;
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

      if (checkColumn(previousButton, button) ||checkRow(previousButton, button)) {
        console.log("kiểm tra hàng hoặc cột");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkOutside(previousButton, button)) {
        console.log("kiểm tra 2 hàng và 2 cột ngoài cùng");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkOutsideTop(previousButton, button)) {
        console.log("TOP_OUTSIDE");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkOutsideBottom(previousButton, button)) {
        console.log("BOTTOM_OUTSIDE");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkOutsideRight(previousButton, button)) {
        console.log("RIGHT_OUTSIDE");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkOutsideLeft(previousButton, button)) {
        console.log("LEFT_OUTSIDE");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkSquareLeftToRight(previousButton, button)) {
        console.log("HÌNH VUÔNG T->P");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkSquareRightToLeft(previousButton, button)) {
        console.log("HÌNH VUÔNG P->T");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkShapeL(previousButton, button)) {
        console.log("SHAPE LLLLL");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkShapeU_Top(previousButton, button)){
        console.log("TOP");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      }
      else if(checkShapeU_Bottom(previousButton, button)){
        console.log("BOTTOM");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      }
      else if(checkShapeU_Right(previousButton, button) ){
        console.log("RIGHT");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      }
      else if (checkShapeU_Left(previousButton, button)){
        console.log("LEFT");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      }
      else if (checkRectX(previousButton, button)) {
        console.log("HCN XXXX");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else if (checkRectY(previousButton, button)) {
        console.log("HCN YYYY");
        changeImageNameToMinusOne(previousButton);
        changeImageNameToMinusOne(button);
        hideTwoButtons(previousButton, button);
      } 
      else {
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
