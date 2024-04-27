//  21130150_PhamHongQuan_0364537696_DH21DTA 
// tài liệu tham khảo: https://cachhoc.net/2014/03/25/thuat-toan-game-pokemon-pikachu/?lang=en


$(document).ready(function () {
  const ROWS = 11;
  const COLS = 18;
  const GRID_CONTAINER = $("#grid");
  const gridWidth = GRID_CONTAINER.width();
  const gridHeight = GRID_CONTAINER.height();
  const cellWidth = gridWidth / COLS;
  const cellHeight = gridHeight / ROWS;
  let score = 0;
  let level = 1;
  let interval;
  var $skip = $("#skip-level");
  var $reset = $("#reset");
  var $nextButton = $("#next-level");
  const card = document.querySelector(".notification-card");
  var currentScore = parseInt($("#score").text());
  let currentProgressValue = 0;
  var restartButtonClicked = false;
  // var popup = document.getElementById('inf');
  const IMAGE_NAMES = [
    "pikachu.png",
    "scyther.png",
    "magmar.png",
    "umbreon.png",
    "masquerain.png",
    "torkoal.png",
    "mismagius.png",
    "abomasnow.png",
    "mamoswine.png",
    "volcarona.png",
    "drednaw.png",
    "palafin-hero.png",
    "golurk.png",
    "flaaffy.png",
    "magcargo.png",
    "lucario.png"
  ];

  // thanh timelife 
  // các level khác ngoài lv4 thì thời gian giảm 1, còn lv 4 thì thời gian giảm 2
  function startProgressBar(totalTime, isLevel4) {
    const progressBar = document.getElementById("progressBar");
    let currentTime = totalTime;
    const initialTime = totalTime;
    interval = setInterval(() => {
      if (isLevel4) {
        currentTime -= 2;
      } else {
        currentTime--;
      }
      currentProgressValue = currentTime;
      const progressPercentage = (currentTime / initialTime) * 180;
      progressBar.value = progressPercentage;
      if (currentTime <= 0) {
        $('.game-over-card').show();
        clearInterval(interval);
      }
    }, 1000);
  }

  // reset lại thanh progress
  function resetProgressBar() {
    clearInterval(interval);
    const progressBar = document.getElementById("progressBar");
    progressBar.value = 180;
  }


  // Tạo button với hình ảnh
  function createButton(imageName, level) {
    // tạo ra đối tượng button
    const button = $("<button></button>");
    if (imageName === "-1") {
      button.css("background-image", `url('img/point.png')`);
      button.data("imageName", "-1");
    }
    else if (imageName === "lock") {
      button.css("background-image", `url('img/lock.png')`);
      button.data("imageName", "lock");
    }
    else {
      button.css("background-image", `url('img/${imageName}')`);
      button.data("imageName", imageName);

      // sự kiện click chọn hình
      button.click(function () {
        logicGamePikachu($(this), level);
        console.log("================================");
      });
    }
    return button;
  }

  // Tạo ma trận button
  function createMatrix(level) {
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
  }

  // hàm xóa các ô trong ma trận
  function clearMatrix() {
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

  // Hàm này nhận vào cột và hàng, trả về button tại vị trí đó
  function getButtonAtPosition(column, row) {
    const cellIndex = row * COLS + column;
    const cell = $(".cell").eq(cellIndex);
    const button = cell.find("button");
    return button;
  }

  // hàm kiểm tra ở 4 cạnh ngoài cùng (nằm trên cùng hàng hoặc cùng cột)
  // nếu các button nằm ở ngoài cùng (trên, dưới, trái, phải) thì đương nhiên là nó sẽ "ăn" được
  function checkOutside(button1, button2) {
    const position1 = getPositionOfButton(button1);
    const position2 = getPositionOfButton(button2);
    // kiểm tra 2 button cùng hàng có khác nhau không
    // nếu cùng hàng thì phải khác cột
    if (position1.row === position2.row && position1.column !== position2.column) {
      // kiểm tra phía trên cùng (hàng 1)
      // nếu 2 button có tên giống nhau => true
      if (position1.row === 1 && position2.row === 1) {
        if (button1.data("imageName") === button2.data("imageName")) {
          return true;
        }
      }
      // kiểm tra phía dưới (tương tự nhưng nằm ở hàng 9)
      else if (position1.row === 9 && position2.row === 9) {
        if (button1.data("imageName") === button2.data("imageName")) {
          return true;
        }
      }
    }
    // kiểm tra 2 button cùng cột có khác nhau không (tương tự như trên)
    // nếu cùng cột thì phải khác hàng
    else if (position1.column === position2.column && position1.row !== position2.row) {
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

  // hàm kiểm tra phía trên cùng (chữ U nhưng thanh ngang của chữ U nằm ở trên hay còn gọi là U ngược)
  function checkOutsideTop(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định button nào có hàng nhỏ hơn là buttonMin
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }

    // nếu 2 button nằm cùng cột thì return false
    if (minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // trường hợp 1: buttonMin nằm hàng đầu tiên nhưng buttonMax KHÔNG nằm trên hàng đầu tiên
    if (minButtonPosition.row === 1 && maxButtonPosition.row !== 1) {
      // kiểm tra buttonMax (xem trước nó có button nào có giá trị không)
      // kiểm tra từ hàng của buttonMax đến hàng 1
      for (let i = maxButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
        // nếu có bất kì button nào có tên khác -1 (vì khi ăn thì tên sẽ đặt lại là -1) => false
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
        // nếu có button nào nằm từ hàng của buttonMin đến hàng 1 mà có tên khác -1 => false
        if (buttonsAbove.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 3: cả 2 buttonMin và buttonMax đều không nằm trên hàng đầu tiên
    // Kiểm tra đồng thời cả hai buttonMin và buttonMax
    if (minButtonPosition.row !== 1 && maxButtonPosition.row !== 1) {
      // Giả sử ban đầu là hợp lệ
      let isValid = true;
      // kiểm tra buttonMin (từ hàng của buttonMin đến hàng 1)
      for (let i = minButtonPosition.row - 1; i > 0; i--) {
        const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          isValid = false;
          break;
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.row - 1; i > 0; i--) {
          const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
          if (buttonsAbove.data("imageName") !== "-1") {
            isValid = false;
            break;
          }
        }
      }
      // nếu điều kiện của cả buttonMin và buttonMax đều thỏa => vẽ
      if (isValid) {
        // vẽ 3 đường thẳng
        drawOutsideColumn_Top_Bottom(button1, "top");
        drawOutsideRow_Top_Bottom(button1, button2, "top");
        drawOutsideColumn_Top_Bottom(button2, "top");
        // sau 0.1 giây thì xóa vẽ đi
        setTimeout(function () {
          removeDrawOutsideInColumn_Top_Bottom(button1, "top");
          removeDrawOutsideInRow_Top_Bottom(button1, button2, "top");
          removeDrawOutsideInColumn_Top_Bottom(button2, "top");
        }, 100);
      }
      return isValid;
    }
    // vẽ 3 đường thẳng (tương tự)
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
  // tương tự như hàm checkOutsideTop 
  // nhưng kiểm tra từ buttonMin/Max đến hàng 9
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
      let isValid = true;
      for (let i = minButtonPosition.row + 1; i <= 9; i++) {
        const buttonsAbove = getButtonAtPosition(minButtonPosition.column, i);
        if (buttonsAbove.data("imageName") !== "-1") {
          isValid = false;
          break;
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.row + 1; i <= 9; i++) {
          const buttonsAbove = getButtonAtPosition(maxButtonPosition.column, i);
          if (buttonsAbove.data("imageName") !== "-1") {
            isValid = false;
            break;
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
      return isValid;
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
    // mặc định button nào có hàng nhỏ hơn là buttonMin
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
      // duyệt từ cột của buttonMax đến cột thứ 16
      for (let i = maxButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, maxButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 2: buttonMax nằm ngoài cùng bên phải nhưng buttonMin thì không
    if (maxButtonPosition.column === 16 && minButtonPosition.column !== 16) {
      // kiểm tra buttonMin (tương tự như kiểm tra buttonMax bên trên)
      for (let i = minButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          return false;
        }
      }
    }

    // trường hợp 3: cả buttonMin và buttonMax đều không nằm ở ngoài cùng bên phải
    if (minButtonPosition.column !== 16 && maxButtonPosition.column !== 16) {
      let isValid = true;
      // kiểm tra buttonMin
      for (let i = minButtonPosition.column + 1; i <= 16; i++) {
        const buttonRight = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonRight.data("imageName") !== "-1") {
          isValid = false;
          break;
        }
      }
      // kiểm tra buttonMax nếu buttonMin vẫn hợp lệ
      if (isValid) {
        for (let i = maxButtonPosition.column + 1; i <= 16; i++) {
          const buttonRight = getButtonAtPosition(i, maxButtonPosition.row);
          if (buttonRight.data("imageName") !== "-1") {
            isValid = false;
            break;
          }
        }
      }
      // nếu kiểm tra 2 buttonMin/Max hợp lệ thì vẽ 
      if (isValid) {
        // vẽ 3 đường thẳng
        drawOutsideColumn_Right_Left(button1, button2, "right");
        drawOutsideRow_Right_Left(button1, "right");
        drawOutsideRow_Right_Left(button2, "right");
        // xóa việc vẽ sau 0.1 giây
        setTimeout(() => {
          removeDrawOutsideColumn_Right_Left(button1, button2, "right");
          removeDrawOutsideRow_Right_Left(button1, "right");
          removeDrawOutsideRow_Right_Left(button2, "right");
        }, 100);
      }
      return isValid;
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
  // tương tự như checkOutsideRight 
  // nhưng kiểm tra từ buttonMin/Max đến cột thứ 1
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
      let isValid = true;
      for (let i = minButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, minButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          isValid = false;
          break;
        }
      }
      for (let i = maxButtonPosition.column - 1; i > 0; i--) {
        const buttonLeft = getButtonAtPosition(i, maxButtonPosition.row);
        if (buttonLeft.data("imageName") !== "-1") {
          isValid = false;
          break;
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
    // nếu 2 button nằm trên 1 cột, tên giống nhau và không cùng hàng
    if (position1.column === position2.column && button1.data("imageName") === button2.data("imageName") && position1.row !== position2.row) {
      // lấy ra hàng nhỏ nhất giữa 2 button làm điểm xuất phát
      const startRow = Math.min(position1.row, position2.row);
      // lấy ra hàng lớn nhất giữa 2 button làm điểm kết thúc
      const endRow = Math.max(position1.row, position2.row);
      // chạy từ hàng nhỏ nhất đến hàng lớn nhất
      for (let row = startRow + 1; row < endRow; row++) {
        // lấy ra button trên cột của button1(button2 cũng được) và hàng chạy từ thấp lên cao
        const buttonInBetween = getButtonAtPosition(position1.column, row);
        // nếu có bất kì button nào có tên khác -1 thì => false
        if (buttonInBetween.data("imageName") !== "-1") {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  // Kiểm tra button theo chiều ngang
  // tương tự như checkColumn bên trên 
  // nhưng xuất phát từ cột nhỏ tới cột lớn
  function checkRow(button1, button2) {
    const position1 = getPositionOfButton(button1);
    const position2 = getPositionOfButton(button2);

    if (position1.row === position2.row && button1.data("imageName") === button2.data("imageName") && position1.column !== position2.column) {
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

  // Kiểm tra theo chiều ngang xem trên cột đó nó có liên thông không
  // startY: điêm bắt đầu
  // endY: điểm kết thúc 
  // column: cột kiểm tra
  // reverse: đảo ngược chiều duyệt
  //        : nếu false thì duyệt từ start -> end
  //        : nếu true thì duyệt từ end -> start
  function checkEmptyInColumn(startY, endY, column, reverse) {
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

  // tương tự như checkEmptyInColumn nhưng kiểm tra trên hàng thay vì trên cột
  // Kiểm tra theo chiều dọc xem trên hàng đó có liên thông hay không
  function checkEmptyInRow(startX, endX, row, reverse) {
    if (reverse === false) {
      for (let x = startX; x < endX; x++) {
        const buttonInBetween = getButtonAtPosition(x, row);
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

  // Hàm kiểm tra xem hai button tạo thành hình chữ Z hay không
  // kiểm tra theo chiều dọc 
  function checkShapeZ_Column(button1, button2) {
    // nếu 2 button này không giống nhau => false
    if (button1.data("imageName") != button2.data("imageName")) {
      return false;
    }
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định button nào có hàng nhỏ hơn thì đó là buttonMin
    if (minButtonPosition.row > maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // nếu 2 button cùng hàng và cùng cột => false
    if (minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // duyệt từ hàng của buttonMin đến hàng của buttonMax
    for (let i = minButtonPosition.row; i <= maxButtonPosition.row; i++) {
      // Kiểm tra ba dòng
      // buttonMin nằm bên trái buttonMax 
      // Z: xuống dưới -> sang phải -> xuống dưới
      if (minButtonPosition.column <= maxButtonPosition.column) {
        if (checkEmptyInColumn(minButtonPosition.row + 1, i, minButtonPosition.column, false) &&
          checkEmptyInRow(minButtonPosition.column, maxButtonPosition.column + 1, i, false) &&
          checkEmptyInColumn(i, maxButtonPosition.row, maxButtonPosition.column, false)) {
          // vẽ
          drawColumn_template(minButtonPosition.row, i, minButtonPosition.column, false);
          drawColumn_template(i, maxButtonPosition.row, maxButtonPosition.column, false);
          drawRow_template(minButtonPosition.column, maxButtonPosition.column, i, false);
          // bỏ vẽ
          setTimeout(() => {
            drawColumn_template(minButtonPosition.row, i, minButtonPosition.column, true);
            drawColumn_template(i, maxButtonPosition.row, maxButtonPosition.column, true);
            drawRow_template(minButtonPosition.column, maxButtonPosition.column, i, true);
          }, 100);
          return true;
        }
      }
      // buttonMin nằm bên phải buttonMax
      // Z: xuống dưới -> sang trái -> xuống dưới
      else if (minButtonPosition.column > maxButtonPosition.column) {
        if (checkEmptyInColumn(minButtonPosition.row + 1, i, minButtonPosition.column, false) &&
          checkEmptyInRow(maxButtonPosition.column, minButtonPosition.column + 1, i, false) &&
          checkEmptyInColumn(i, maxButtonPosition.row, maxButtonPosition.column, false)) {
          // vẽ
          drawColumn_template(minButtonPosition.row, i, minButtonPosition.column, false);
          drawColumn_template(i, maxButtonPosition.row, maxButtonPosition.column, false);
          drawRow_template(maxButtonPosition.column, minButtonPosition.column, i, false);
          // bỏ vẽ 
          setTimeout(() => {
            drawColumn_template(minButtonPosition.row, i, minButtonPosition.column, true);
            drawColumn_template(i, maxButtonPosition.row, maxButtonPosition.column, true);
            drawRow_template(maxButtonPosition.column, minButtonPosition.column, i, true);
          }, 100);
          return true;
        }
      }
    }
    return false;
  }

  // tương tự như checkShapZ_Column nhưng xuất phát theo chiều ngang
  // Hàm kiểm tra xem hai button tạo thành hình chữ Z hay không
  function checkShapeZ_Row(button1, button2) {
    // Tìm điểm có y nhỏ nhất và lớn nhất
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // button nào có cột nhỏ là buttonMin
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // duyệt từ cột nhỏ đến cột lớn hơn
    for (let i = minButtonPosition.column; i <= maxButtonPosition.column; i++) {
      // Kiểm tra ba dòng
      // buttonMin nằm trên buttonMax
      if (minButtonPosition.row <= maxButtonPosition.row) {
        if (checkEmptyInRow(minButtonPosition.column + 1, i, minButtonPosition.row, false) &&
          checkEmptyInColumn(minButtonPosition.row, maxButtonPosition.row, i, false) &&
          checkEmptyInRow(i, maxButtonPosition.column, maxButtonPosition.row, false)) {
          // vẽ 
          drawRow_template(minButtonPosition.column, i, minButtonPosition.row, false);
          drawRow_template(i, maxButtonPosition.column, maxButtonPosition.row, false);
          drawColumn_template(minButtonPosition.row, maxButtonPosition.row, i, false);
          // bỏ vẽ 
          setTimeout(() => {
            drawRow_template(minButtonPosition.column, i, minButtonPosition.row, true);
            drawRow_template(i, maxButtonPosition.column, maxButtonPosition.row, true);
            drawColumn_template(minButtonPosition.row, maxButtonPosition.row, i, true);
          }, 100);
          return true;
        }
      }
      // buttonMin nằm bên dưới buttonMax
      else if (minButtonPosition.row > maxButtonPosition.row) {
        if (checkEmptyInRow(minButtonPosition.column + 1, i, minButtonPosition.row, false) &&
          checkEmptyInColumn(maxButtonPosition.row, minButtonPosition.row, i, false) &&
          checkEmptyInRow(i, maxButtonPosition.column, maxButtonPosition.row, false)) {
          // vẽ
          drawRow_template(minButtonPosition.column, i, minButtonPosition.row, false);
          drawRow_template(i, maxButtonPosition.column, maxButtonPosition.row, false);
          drawColumn_template(maxButtonPosition.row, minButtonPosition.row, i, false);
          // bỏ vẽ
          setTimeout(() => {
            drawRow_template(minButtonPosition.column, i, minButtonPosition.row, true);
            drawRow_template(i, maxButtonPosition.column, maxButtonPosition.row, true);
            drawColumn_template(maxButtonPosition.row, minButtonPosition.row, i, true);
          }, 100);
          return true;
        }
      }
    }
    return false;
  }

  // kiểm tra trong ma tra 2x2 (1 cục hình vuông)
  function checkSquareLeftToRight(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // button nào có cột nhỏ hơn là button min
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // lấy cột của buttonMax - cột của buttonMin và hàng của buttonMax - hàng của buttonMin
    // nếu cả 2 giá trị đó là 1 = đó là hình vuông 2x2
    // => buttonMax và buttonMin tạo thành 1 đường chéo từ phía trên bên trái xuống phía dưới bên phải
    if (maxButtonPosition.column - minButtonPosition.column === 1 && maxButtonPosition.row - minButtonPosition.row === 1) {
      // lấy ra button ở góc trên bên phải
      const buttonCheckRight = getButtonAtPosition(minButtonPosition.column + 1, minButtonPosition.row);
      // lấy ra button ở góc dưới bên trái
      const buttonCheckBottom = getButtonAtPosition(minButtonPosition.column, minButtonPosition.row + 1);
      // nếu 1 trong 2 button đó có giá trị = -1 thì => true (vì đã tạo thành chữ L có 2 cạnh bằng nhau)
      if (buttonCheckRight.data("imageName") === "-1" || buttonCheckBottom.data("imageName") === "-1") {
        return true;
      }
    }
    return false;
  }

  // tương như như checkSquareLeftToRight nhưng đường chéo từ góc trên bên phải đến góc dưới bên trái
  // kiểm tra đường chéo từ phải sang trái trong hình vuông
  function checkSquareRightToLeft(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // button nào có cột nhỏ hơn là buttonMin
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    
    if (minButtonPosition.row - maxButtonPosition.row === 1 && maxButtonPosition.column - minButtonPosition.column === 1) {
      // lấy ra button ở góc trên bên trái
      const buttonCheckTop = getButtonAtPosition(minButtonPosition.column, minButtonPosition.row - 1);
      // lấy ra button ở góc dưới bên phải
      const buttonCheckRight = getButtonAtPosition(minButtonPosition.column + 1, minButtonPosition.row);
      // nếu 1 trong 2 button nào có tên là -1 => true
      if (buttonCheckTop.data("imageName") === "-1" || buttonCheckRight.data("imageName") === "-1") {
        return true;
      }
    }
    return false;
  }

  // kiểm tra chữ chữ L (xuất phát theo chiều ngang)
  function checkShapeL_Row(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // KIỂM TRA CHỮ L (XUẤT PHÁT THEO CHIỀU NGANG)
    // kiểm tra từ cột min->cột của max, nếu trên hàng đó không có vật cản thì xét tiếp
    if (checkEmptyInRow(minButtonPosition.column + 1, maxButtonPosition.column + 1, minButtonPosition.row, false)) {
      const buttonCheck = getButtonAtPosition(maxButtonPosition.column, minButtonPosition.row);
      // buttonCheckPosition: vị trí mà hàm checkEmptyInColumn sẽ chạy từ max hoặc đến max
      const buttonCheckPosition = getPositionOfButton(buttonCheck);
      // nếu dòng của max < dòng min => chạy từ dòng max tới dòng của check trên cột max
      if (maxButtonPosition.row < minButtonPosition.row) {
        if (checkEmptyInColumn(maxButtonPosition.row + 1, buttonCheckPosition.row + 1, maxButtonPosition.column, false)) {
          // vẽ 
          drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, false);
          drawColumn_template(maxButtonPosition.row, buttonCheckPosition.row, maxButtonPosition.column, false);
          // bỏ vẽ
          setTimeout(() => {
            drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, true);
            drawColumn_template(maxButtonPosition.row, buttonCheckPosition.row, maxButtonPosition.column, true);
          }, 100);
          return true;
        }
      } else if (maxButtonPosition.row > minButtonPosition.row) {
        // chạy từ hàng của check đến max trên cột max
        if (checkEmptyInColumn(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, false)) {
          drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, false);
          drawColumn_template(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, false);
          // bỏ vẽ
          setTimeout(() => {
            drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, true);
            drawColumn_template(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, true);
          }, 100);
          return true;
        }
      }
    }
    return false;
  }

  // kiểm tra L, xuất phát theo chiều dọc
  function checkShapeL_Column(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    if (minButtonPosition.column > maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // KIỂM TRA CHỮ L (XUẤT PHÁT THEO CHIỀU DỌC)
    // kiểm tra từ hàng min-> max (phía dưới buttonMin)
    if (maxButtonPosition.row > minButtonPosition.row) {
      if (checkEmptyInColumn(minButtonPosition.row + 1, maxButtonPosition.row + 1, minButtonPosition.column, false)) {
        const buttonCheck = getButtonAtPosition(minButtonPosition.column, maxButtonPosition.row);
        const buttonCheckPosition = getPositionOfButton(buttonCheck);
        if (checkEmptyInRow(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false)) {
          // vẽ 
          drawColumn_template(minButtonPosition.row, buttonCheckPosition.row, minButtonPosition.column, false);
          drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false);
          // bỏ vẽ 
          setTimeout(() => {
            drawColumn_template(minButtonPosition.row, buttonCheckPosition.row, minButtonPosition.column, true);
            drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, true);
          }, 100);
          return true;
        }
      }
    }
    // kiểm tra từ hàng min->hàng max(phía trên button min)
    else if (maxButtonPosition.row < minButtonPosition.row) {
      if (checkEmptyInColumn(maxButtonPosition.row, minButtonPosition.row, minButtonPosition.column, false)) {
        const buttonCheck = getButtonAtPosition(minButtonPosition.column, maxButtonPosition.row);
        const buttonCheckPosition = getPositionOfButton(buttonCheck);
        if (checkEmptyInRow(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false)) {
          // vẽ 
          drawColumn_template(buttonCheckPosition.row, minButtonPosition.row, minButtonPosition.column, false);
          drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false);
          // bỏ vẽ 
          setTimeout(() => {
            drawColumn_template(buttonCheckPosition.row, minButtonPosition.row, minButtonPosition.column, true);
            drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, true);
          }, 100);
          return true;
        }
      }
    }
    return false;
  }


  // hàm kiểm tra chữ U (xuất phát theo hàng)
  function checkShapeU_Row(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có hàng nhỏ hơn là hàm min
    if (minButtonPosition.row >= maxButtonPosition.row) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    // nếu 2 button đó cùng hàng và cùng cột => false
    if (minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    // tạo ra button ở vị trí góc trên bên trái
    var buttonCheck = getButtonAtPosition(1, 1);
    // lấy vị trí 
    var buttonCheckPosition = getPositionOfButton(buttonCheck);
    let shouldBreak = false;
    // duyệt từ hàng của buttonMax đến hàng của buttonMin
    for (let i = maxButtonPosition.row; i >= minButtonPosition.row && !shouldBreak; i--) {
      // trên mỗi hàng, duyệt từ cột đầu tiên (1) đến cột cuối cùng (16)
      for (let j = 1; j <= 16; j++) {
        var buttonBarrier = getButtonAtPosition(j, i);
        var buttonBarrierPosition = getPositionOfButton(buttonBarrier);
        // kiểm tra từ cột của buttonBarrier đến cột của buttonMax (trên hàng của buttonMax)
        // sau đó kiểm tra từ cột của buttonBarrier đến cột của buttonMin (trên hàng của buttonMin)
        // sau đó kiểm tra từ hàng của buttonMin đến hết hàng của buttonMax (trên cột của buttonBarrier)
        // nếu thỏa mãn hết thì cập nhật lại buttonCheck đồng thời đặt shouldBreak = true để thóat khỏi 2 vòng lặp
        // buttonCheck: coi như là button giao điểm giữa buttonMin/Max với buttonBarrier => buttonCheck này phải là button có giá trị là -1 để dùng để kiểm tra (ở dưới)
        if (checkEmptyInRow(buttonBarrierPosition.column, maxButtonPosition.column, maxButtonPosition.row, false) &&
          checkEmptyInRow(buttonBarrierPosition.column, minButtonPosition.column, minButtonPosition.row, false) &&
          checkEmptyInColumn(minButtonPosition.row, maxButtonPosition.row + 1, buttonBarrierPosition.column, false)) {
          buttonCheck = buttonBarrier;
          buttonCheckPosition = buttonBarrierPosition;
          shouldBreak = true;
          break;
        }
      }
    }
    // sau khi có buttonCheck, kiểm tra xem vị trí của buttonCheck
    // buttonCheck nằm bên trái buttonMin và buttonMax
    if (buttonCheckPosition.column < minButtonPosition.column && buttonCheckPosition.column < maxButtonPosition.column) {
      // kiểm tra trên hàng buttonMin, từ cột buttonCheck đến cột buttonMin
      // kiểm tra trên hàng buttonMax, từ cột của buttonCheck đến cột của buttonMax
      // kiểm tra trên cột buttonCheck, từ hàng buttonMin đến hết hàng của buttonMax
      // nếu thỏa mãn hết thì vẽ và trả về true
      if (checkEmptyInRow(buttonCheckPosition.column, minButtonPosition.column, minButtonPosition.row, false) &&
        checkEmptyInRow(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false) &&
        checkEmptyInColumn(minButtonPosition.row, maxButtonPosition.row + 1, buttonCheckPosition.column, false)) {
        // vẽ
        drawColumn_template(minButtonPosition.row, maxButtonPosition.row, buttonCheckPosition.column, false);
        drawRow_template(buttonCheckPosition.column, minButtonPosition.column, minButtonPosition.row, false);
        drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, false);
        // bỏ vẽ
        setTimeout(() => {
          drawColumn_template(minButtonPosition.row, maxButtonPosition.row, buttonCheckPosition.column, true);
          drawRow_template(buttonCheckPosition.column, minButtonPosition.column, minButtonPosition.row, true);
          drawRow_template(buttonCheckPosition.column, maxButtonPosition.column, maxButtonPosition.row, true);
        }, 100);
        return true;
      }
      // tương tự nhưng buttonCheck nằm bên phải
    } else if (buttonCheckPosition.column > minButtonPosition.column && buttonCheckPosition.column > maxButtonPosition.column) {
      if (checkEmptyInRow(minButtonPosition.column + 1, buttonCheckPosition.column + 1, minButtonPosition.row, false) &&
        checkEmptyInRow(maxButtonPosition.column + 1, buttonCheckPosition.column + 1, maxButtonPosition.row, false) &&
        checkEmptyInColumn(minButtonPosition.row, maxButtonPosition.row + 1, buttonCheckPosition.column, false)) {
        console.log('U nằm bên phai');
        // vẽ
        drawColumn_template(minButtonPosition.row, maxButtonPosition.row, buttonCheckPosition.column, false);
        drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, false);
        drawRow_template(maxButtonPosition.column, buttonCheckPosition.column, maxButtonPosition.row, false);
        // bỏ vẽ
        setTimeout(() => {
          drawColumn_template(minButtonPosition.row, maxButtonPosition.row, buttonCheckPosition.column, true);
          drawRow_template(minButtonPosition.column, buttonCheckPosition.column, minButtonPosition.row, true);
          drawRow_template(maxButtonPosition.column, buttonCheckPosition.column, maxButtonPosition.row, true);
        }, 100);
        return true;
      }
    }
    return false;
  }


  // kiểm tra chữ U (xuất phát theo chiều dọc)
  // cách thức tương tự như checkShapeU_Row 
  function checkShapeU_Column(button1, button2) {
    let minButtonPosition = getPositionOfButton(button1);
    let maxButtonPosition = getPositionOfButton(button2);
    // mặc định hàm nào có cột nhỏ hơn là hàm min
    if (minButtonPosition.column >= maxButtonPosition.column) {
      minButtonPosition = getPositionOfButton(button2);
      maxButtonPosition = getPositionOfButton(button1);
    }
    if (minButtonPosition.row === maxButtonPosition.row && minButtonPosition.column === maxButtonPosition.column) {
      return false;
    }
    var buttonCheck = getButtonAtPosition(1, 1);
    var buttonCheckPosition = getPositionOfButton(buttonCheck);
    let shouldBreak = false;
    for (let i = maxButtonPosition.column; i >= minButtonPosition.column && !shouldBreak; i--) {
      for (let j = 1; j <= 9; j++) {
        var buttonBarrier = getButtonAtPosition(i, j);
        var buttonBarrierPosition = getPositionOfButton(buttonBarrier);
        if (checkEmptyInColumn(buttonBarrierPosition.row, maxButtonPosition.row, maxButtonPosition.column, false) &&
          checkEmptyInColumn(buttonBarrierPosition.row, minButtonPosition.row, minButtonPosition.column, false) &&
          checkEmptyInRow(minButtonPosition.column, maxButtonPosition.column + 1, buttonBarrierPosition.row, false)) {
          buttonCheck = buttonBarrier;
          buttonCheckPosition = buttonBarrierPosition;
          shouldBreak = true;
          break;
        }
      }
    }
    // buttonCheck nằm bên trên
    if (buttonCheckPosition.row < minButtonPosition.row && buttonCheckPosition.row < maxButtonPosition.row) {
      if (checkEmptyInColumn(buttonCheckPosition.row, minButtonPosition.row, minButtonPosition.column, false) &&
        checkEmptyInColumn(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, false) &&
        checkEmptyInRow(minButtonPosition.column, maxButtonPosition.column + 1, buttonCheckPosition.row, false)) {
        // vẽ
        drawColumn_template(buttonCheckPosition.row, minButtonPosition.row, minButtonPosition.column, false);
        drawColumn_template(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, false);
        drawRow_template(minButtonPosition.column, maxButtonPosition.column, buttonCheckPosition.row, false);
        // bỏ vẽ 
        setTimeout(() => {
          drawColumn_template(buttonCheckPosition.row, minButtonPosition.row, minButtonPosition.column, true);
          drawColumn_template(buttonCheckPosition.row, maxButtonPosition.row, maxButtonPosition.column, true);
          drawRow_template(minButtonPosition.column, maxButtonPosition.column, buttonCheckPosition.row, true);
        }, 100);
        return true;
      }

    }
    // buttonCheck nằm bên dưới
    else {
      if (buttonCheckPosition.row > minButtonPosition.row && buttonCheckPosition.row > maxButtonPosition.row) {
        if (checkEmptyInColumn(minButtonPosition.row + 1, buttonCheckPosition.row + 1, minButtonPosition.column, false) &&
          checkEmptyInColumn(maxButtonPosition.row + 1, buttonCheckPosition.row + 1, maxButtonPosition.column, false) &&
          checkEmptyInRow(minButtonPosition.column, maxButtonPosition.column + 1, buttonCheckPosition.row, false)) {
          // vẽ
          drawColumn_template(minButtonPosition.row, buttonCheckPosition.row, minButtonPosition.column, false);
          drawColumn_template(maxButtonPosition.row, buttonCheckPosition.row, maxButtonPosition.column, false);
          drawRow_template(minButtonPosition.column, maxButtonPosition.column, buttonCheckPosition.row, false);
          // bỏ vẽ 
          setTimeout(() => {
            drawColumn_template(minButtonPosition.row, buttonCheckPosition.row, minButtonPosition.column, true);
            drawColumn_template(maxButtonPosition.row, buttonCheckPosition.row, maxButtonPosition.column, true);
            drawRow_template(minButtonPosition.column, maxButtonPosition.column, buttonCheckPosition.row, true);
          }, 100);
          return true;
        }
      }
    }
    return false;
  }


  // ====================================================== XỬ LÍ ======================================================
  // Xử lý khi click vào button
  let previousButton = null;
  function logicGamePikachu(button, level) {
    if (previousButton === null) {
      previousButton = button;
      // Thay đổi màu nền của previousButton thành màu xám
      previousButton.css("background-color", "gray");
    } else {
      if (button !== previousButton && previousButton.data("imageName") === button.data("imageName")) {
        const previousButtonPosition = getPositionOfButton(previousButton);
        const buttonPosition = getPositionOfButton(button);

        // kiểm tra trên 1 cột =>  hàng tăng dần
        if (checkColumn(previousButton, button)) {
          console.log("kiểm tra cột");
          drawInColumn(previousButtonPosition.row, buttonPosition.row, buttonPosition.column, false);
          setTimeout(function () {
            drawInColumn(previousButtonPosition.row, buttonPosition.row, buttonPosition.column, true);
          }, 100);
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra hàng, cột tăng dần
        else if (checkRow(previousButton, button)) {
          console.log("kiểm tra hàng");
          drawInRow(previousButtonPosition.column, buttonPosition.column, buttonPosition.row, false);
          setTimeout(function () {
            drawInRow(previousButtonPosition.column, buttonPosition.column, buttonPosition.row, true);
          }, 100);
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra cột hoặc hàng ngoài cùng
        else if (checkOutside(previousButton, button)) {
          console.log("kiểm tra 2 hàng và 2 cột ngoài cùng");
          let type = "";
          if (previousButtonPosition.row === 1 && buttonPosition.row === 1) {
            type = "top";
          } else if (previousButtonPosition.row === 9 && buttonPosition.row === 9) {
            type = "bottom";
          } else if (previousButtonPosition.column === 1 && buttonPosition.column === 1) {
            type = "left";
          } else if (previousButtonPosition.column === 16 && buttonPosition.column === 16) {
            type = "right";
          }
          //vẽ và xóa vùng bên ngoài
          if (type === "top" || type === "bottom") {
            drawOutsideInRow(previousButton, button, type);
            setTimeout(function () {
              removeRowOutside(previousButtonPosition.row, previousButtonPosition.column, buttonPosition.row, buttonPosition.column, type);
            }, 100);
          } else if (type === "left" || type === "right") {
            drawOutsideInColumn(previousButton, button, type);
            setTimeout(function () {
              removeColumnOutside(previousButtonPosition.row, previousButtonPosition.column, buttonPosition.row, buttonPosition.column, type);
            }, 100);
          }
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra hình vuông từ trái sang phải
        else if (checkSquareLeftToRight(previousButton, button)) {
          console.log("HÌNH VUÔNG T->P");
          drawRectLeftToRight(previousButton, button);
          setTimeout(function () {
            removeDrawRectLeftToRight(previousButtonPosition.column, previousButtonPosition.row, buttonPosition.column, buttonPosition.row);
          }, 100);
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra hình vuông từ phải sang trái
        else if (checkSquareRightToLeft(previousButton, button)) {
          console.log("HÌNH VUÔNG P->T");
          drawRectRightToLeft(previousButton, button);
          setTimeout(function () {
            removeDrawRectRightToLeft(previousButtonPosition.column, previousButtonPosition.row, buttonPosition.column, buttonPosition.row);
          }, 100);
          handleWithLevel(level, previousButton, button);
        }
        else if (checkShapeL_Row(previousButton, button)) {
          console.log("L Row");
          handleWithLevel(level, previousButton, button);
        }
        else if (checkShapeL_Column(previousButton, button)) {
          console.log("L Column");
          handleWithLevel(level, previousButton, button);
        }
        else if (checkShapeZ_Column(previousButton, button)) {
          console.log("Z COLUMN");
          handleWithLevel(level, previousButton, button);
        } else if (checkShapeZ_Row(previousButton, button)) {
          console.log("Z ROW");
          handleWithLevel(level, previousButton, button);
        }
        // kiếm tra chữ U theo chiều dọc
        else if (checkShapeU_Column(previousButton, button)) {
          console.log("U Column");
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra chữ U theo chiều ngang
        else if (checkShapeU_Row(previousButton, button)) {
          console.log("U Row");
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra outside phía trên
        else if (checkOutsideTop(previousButton, button)) {
          console.log("TOP_OUTSIDE");
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra outside phía dưới
        else if (checkOutsideBottom(previousButton, button)) {
          console.log("BOTTOM_OUTSIDE");
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra outside bên phải
        else if (checkOutsideRight(previousButton, button)) {
          console.log("RIGHT_OUTSIDE");
          handleWithLevel(level, previousButton, button);
        }
        // kiểm tra outside bên trái
        else if (checkOutsideLeft(previousButton, button)) {
          console.log("LEFT_OUTSIDE");
          handleWithLevel(level, previousButton, button);
        }
        else {
          // changeImageNameToMinusOne(previousButton);
          // changeImageNameToMinusOne(button);
          // hideTwoButtons(previousButton, button);
          loadSound("sound/uncorrect.mp3", 0.1);
          console.log("không có thuật toàn nào đúng");
          previousButton.css("background-color", ""); // Đặt lại màu nền của previousButton
          previousButton = null;
        }
        previousButton = null;
      } else {
        loadSound("sound/uncorrect.mp3", 0.1);
        previousButton.css("background-color", ""); 
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

  // hàm âm thanh khi ăn đúng
  function loadSound(url, volume = 0.1, autoplay = true) {
    var audio = new Audio();
    audio.src = url;
    if (autoplay) {
      audio.autoplay = true;
    }
    return audio;
  }



  // LV2: DROP BUTTON
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
      const buttonInArray = getButtonAtPosition(buttonInArrayPosition.column, buttonInArrayPosition.row);

      // Lấy button ở dưới
      let buttonBelow = getButtonAtPosition(buttonInArrayPosition.column, buttonInArrayPosition.row + 1);
      if (buttonBelow.data("imageName") === "-1") {
        buttonBelow = getButtonAtPosition(buttonInArrayPosition.column, buttonInArrayPosition.row + 2);
      }

      // Lấy hình ảnh của button ở dưới và gán cho button hiện tại
      const dropName = buttonBelow.data("imageName");
      buttonInArray.data("imageName", dropName);
      buttonInArray.css("background-image", `url('img/${dropName}')`);

      // Cập nhật giá trị của các button ở dưới
      for (let j = buttonInArrayPosition.row + 1; j <= 9; j++) {
        const buttonIndex = getButtonAtPosition(buttonInArrayPosition.column, j);
        const aboveButton = getButtonAtPosition(buttonInArrayPosition.column, j + 1);
        let aboveName = aboveButton.data("imageName");
        console.log("above", aboveName);
        buttonIndex.data("imageName", aboveName);
        if (aboveName === "-1") {
          aboveName = "point.png";
        }
        buttonIndex.css("background-image", `url('img/${aboveName}')`);
        buttonBelow = buttonIndex;
      }
    }
  }

  // LV3: AUTO CHANGE BUTTON
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
  // hàm tạo ra ma trận với 4 button Boss (2 dialga và 2 solgaleo)
  function createMatrixWithBoss() {
    var imageBoss = ["solgaleo.png", "dialga.png"];
    var solgaleoCount = 0;
    var dialgaCount = 0;
    var maxBossCount = 2;
    var bossPositions = getRandomBossPositions();
    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLS; j++) {
        var cell = $("<div></div>").addClass("cell");
        var imageName;
        if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
          imageName = "-1";
        } else {
          // Kiểm tra xem cần tạo boss nào, solgaleo hay dialga
          if (solgaleoCount < maxBossCount && imageBoss.indexOf("solgaleo.png") !== -1 &&
            bossPositions.some(function (pos) {
              return pos.row === i && pos.col === j;
            })) {
            imageName = "solgaleo.png";
            solgaleoCount++;
          } else if (dialgaCount < maxBossCount && imageBoss.indexOf("dialga.png") !== -1 &&
            bossPositions.some(function (pos) {
              return pos.row === i && pos.col === j;
            })) {
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
  // hiện lên hình ảnh bắt đầu khi buttonBoss được "ăn"
  function showStartImage(imagePath) {
    var imgStart = document.getElementById("imgStart");
    imgStart.style.display = "block";
    imgStart.style.backgroundImage = "url('" + imagePath + "')";
  }
  // hiện lên video của boss
  function showVideo(videoPath, imagePath) {
    var videoContainer = document.getElementById("videoContainer");
    var video = document.getElementById("videoPlayer");
    showStartImage(imagePath);
    setTimeout(() => {
      var imgStart = document.getElementById("imgStart");
      imgStart.style.display = "none";
      videoContainer.style.display = "block";
      video.src = videoPath;
      video.controls = false;
      video.onended = function () {
        video.pause();
        videoContainer.style.display = "none";
      };
      video.load();
      video.play();
    }, 1000);
  }
  
  // hành động của boss SOl
  function actionOfSol(button) {
    let buttonPosition = getPositionOfButton(button);
    // lấy các button hình dấu +
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 16; col++) {
        let buttonBossInRow = getButtonAtPosition(col, buttonPosition.row);
        if (buttonBossInRow.data('imageName') !== 'dialga.png') {
          buttonBossInRow.addClass("explode-button");
          buttonBossInRow.css("background-image", `url('img/point.png')`);
          buttonBossInRow.data("imageName", "-1");
          buttonBossInRow.removeClass("boss-button");
        }
      }
      let buttonBossInCol = getButtonAtPosition(buttonPosition.column, row);
      if (buttonBossInCol.data('imageName') !== 'dialga.png') {
        buttonBossInCol.addClass("explode-button");
        buttonBossInCol.css("background-image", `url('img/point.png')`);
        buttonBossInCol.data("imageName", "-1");
        buttonBossInCol.removeClass("boss-button");
      }
    }
    score += 5;
  }

  // hành động của boss Dia
  function actionOfDia() {
    pauseProgressBar();
  }
  // Hàm bắt đầu lại progress
  function pauseProgressBar() {
    clearInterval(interval);
    setTimeout(() => {
      setTimeout(() => {
        loadSound("sound/increase.mp3", 0.1);
        increaseProgressBar(currentProgressValue);
      }, 1000);
    }, 9000);
  }



  // LV5: TẠO RA MA TRẬN CÓ XÍCH, ĂN NHỮNG BUTTON GẦN XÍCH THÌ XÍCH MỞ
  // hàm tạo ra ma trận có xích
  function createMatrixWithLock() {
    // console.log('lv 5 nè');
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = $("<div></div>").addClass("cell");
        let imageName;
        const random = Math.floor(Math.random() * IMAGE_NAMES.length);
        imageName = IMAGE_NAMES[random];
        if (j >= 8 && j < 10 || i === 5) {
          imageName = "lock";
        }
        if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
          imageName = "-1";
        }
        const button = createButton(imageName, level);
        cell.append(button);
        GRID_CONTAINER.append(cell);
      }
    }
  }

  // hàm unclock 
  function unclock(button) {
    let buttonPosition = getPositionOfButton(button);
    let buttonAroundTop = getButtonAtPosition(buttonPosition.column, buttonPosition.row - 1);
    let buttonAroundBottom = getButtonAtPosition(buttonPosition.column, buttonPosition.row + 1);
    let buttonAroundLeft = getButtonAtPosition(buttonPosition.column - 1, buttonPosition.row);
    let buttonAroundRight = getButtonAtPosition(buttonPosition.column + 1, buttonPosition.row);
    changeImageFormLock(buttonAroundTop);
    changeImageFormLock(buttonAroundBottom);
    changeImageFormLock(buttonAroundLeft);
    changeImageFormLock(buttonAroundRight);
  }

  // hàm đổi hình ảnh từ lock sang pokemon
  function changeImageFormLock(buttonAround) {
    if (buttonAround.data('imageName') === 'lock') {
      let imageName;
      const random = Math.floor(Math.random() * IMAGE_NAMES.length);
      imageName = IMAGE_NAMES[random];
      buttonAround.data('imageName', imageName);
      buttonAround.css("background-image", `url('img/${imageName}')`);
      console.log('imagenme nè', imageName);
      buttonAround.click(function () {
        logicGamePikachu($(this), level);
      });
    }
  }

  // LV 6: HALF MATRIX => 5s TẠO RA 1 BUTTON
  // hàm tạo ra ma trận rỗng giữa
  function createHalfMatrix() {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cell = $("<div></div>").addClass("cell");
        let imageName;
        if (i >= 3 && i <= 7 && j >= 5 && j <= 12) {
          imageName = "-1";
        } else {
          const random = Math.floor(Math.random() * IMAGE_NAMES.length);
          imageName = IMAGE_NAMES[random];
        }
        if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
          imageName = "-1";
        }
        const button = createButton(imageName, level);
        cell.append(button);
        GRID_CONTAINER.append(cell);
      }
    }
  }
  // hàm tự động tạo ra button sau mỗi 5 giây
  function autoCreateButton() {
    let interval = setInterval(() => {
      let randomRow = Math.floor(Math.random() * (7 - 3 + 1)) + 3; // Random hàng từ 3 đến 7
      let randomCol = Math.floor(Math.random() * (12 - 5 + 1)) + 5; // Random cột từ 5 đến 12

      let buttonBetween = getButtonAtPosition(randomCol, randomRow);
      let name = buttonBetween.data('imageName');

      if (name === '-1') {
        let randomIndex = Math.floor(Math.random() * IMAGE_NAMES.length);
        let imageName = IMAGE_NAMES[randomIndex];

        buttonBetween.css("background-image", `url('img/${imageName}')`);
        buttonBetween.data("imageName", imageName);
        buttonBetween.click(function () {
          logicGamePikachu($(this), level);
        });
      }
    }, 5000);
  }




  // ================================================================ VẼ ================================================================

  // vẽ từng cột trên 1 hàng
  function drawInRow(positionStart, positionEnd, row, isRemove) {
    if (positionStart < positionEnd) {
      for (let x = positionStart; x <= positionEnd; x++) {
        const buttonInBetween = getButtonAtPosition(x, row);
        if (isRemove) {
          buttonInBetween.css("background-color", "");
        } else {
          buttonInBetween.css("background-color", "red");
        }
      }
    } else if (positionStart >= positionEnd) {
      for (let x = positionStart; x >= positionEnd; x--) {
        const buttonInBetween = getButtonAtPosition(x, row);
        if (isRemove) {
          buttonInBetween.css("background-color", "");
        } else {
          buttonInBetween.css("background-color", "red");
        }
      }
    }
  }
  // vẽ từng hàng trên cùng cột
  function drawInColumn(positionStart, positionEnd, column, isRemove) {
    if (positionStart < positionEnd) {
      for (let y = positionStart; y <= positionEnd; y++) {
        const buttonInBetween = getButtonAtPosition(column, y);
        if (isRemove) {
          buttonInBetween.css("background-color", "");
        } else {
          buttonInBetween.css("background-color", "red");
        }
      }
    } else if (positionStart >= positionEnd) {
      for (let y = positionStart; y >= positionEnd; y--) {
        const buttonInBetween = getButtonAtPosition(column, y);
        if (isRemove) {
          buttonInBetween.css("background-color", "");
        } else {
          buttonInBetween.css("background-color", "red");
        }
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
      for (let i = buttonStartPosition.column; i <= buttonEndPosition.column; i++) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "red");
      }
    }
    if (buttonStartPosition.column > buttonEndPosition.column) {
      for (let i = buttonStartPosition.column; i >= buttonEndPosition.column; i--) {
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
    previousRow, previousColumn, buttonRow, buttonColumn, type) {
    const buttonStart = getButtonAtPosition(previousColumn, previousRow);
    const buttonEnd = getButtonAtPosition(buttonColumn, buttonRow);

    const buttonStartPosition = getPositionOfButton(buttonStart);
    const buttonEndPosition = getPositionOfButton(buttonEnd);

    buttonStart.css("background-color", "");
    buttonEnd.css("background-color", "");

    let buttonInBetween = null;
    if (buttonStartPosition.column < buttonEndPosition.column) {
      for (let i = buttonStartPosition.column; i <= buttonEndPosition.column; i++) {
        if (type === "top") {
          buttonInBetween = getButtonAtPosition(i, 0);
        } else if (type === "bottom") {
          buttonInBetween = getButtonAtPosition(i, 10);
        }
        buttonInBetween.css("background-color", "");
      }
    }
    if (buttonStartPosition.column > buttonEndPosition.column) {
      for (let i = buttonStartPosition.column; i >= buttonEndPosition.column; i--) {
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
  function removeColumnOutside(previousRow, previousColumn, buttonRow, buttonColumn, type) {
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
        buttonInBetween.css("background-color", "");
      }
    } else if (buttonStartPosition.row > buttonEndPosition.row) {
      for (let i = buttonStartPosition.row; i >= buttonEndPosition.row; i--) {
        if (type === "left") {
          buttonInBetween = getButtonAtPosition(0, i);
        } else if (type === "right") {
          buttonInBetween = getButtonAtPosition(17, i);
        }
        buttonInBetween.css("background-color", "");
      }
    }
  }

  // vẽ đường thẳng chiều dọc outside
  function drawOutsideColumn_Top_Bottom(buttonColumn, type) {
    if (type === "top") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i >= 0; i--) {
        const buttonBetween = getButtonAtPosition(buttonColumnPosition.column, i);
        buttonBetween.css("background-color", "red");
      }
    } else if (type === "bottom") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i <= 10; i++) {
        const buttonBetween = getButtonAtPosition(buttonColumnPosition.column, i);
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
        const buttonBetween = getButtonAtPosition(buttonColumnPosition.column, i);
        buttonBetween.css("background-color", "");
      }
    } else if (type === "bottom") {
      const buttonColumnPosition = getPositionOfButton(buttonColumn);
      for (let i = buttonColumnPosition.row; i <= 10; i++) {
        const buttonBetween = getButtonAtPosition(buttonColumnPosition.column, i);
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
      buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "red");
    }
    // buttonCorner từ trên xuống dưới sang phải
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
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
      buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
    } else if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "red");
    }
    // buttonCorner từ trên xuống dưới sang trái
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
      }
      buttonCorner.css("background-color", "red");
    }
  }
  // đặt lại bg cho button (hình vuông từ trái sang phải)
  function removeDrawRectLeftToRight(button1Colum, button1Row, button2Column, button2Row) {
    const button1 = getButtonAtPosition(button1Colum, button1Row);
    const button2 = getButtonAtPosition(button2Column, button2Row);
    button1.css("background-color", "");
    button2.css("background-color", "");

    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);
    let buttonCorner;
    // buttonCorner từ trái sang phải xuống dưới
    if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
    } else if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "");
    }
    // buttonCorner từ trên xuống dưới sang phải
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
      }
    }
    buttonCorner.css("background-color", "");
  }
  // đặt lại bg cho button (hình vuông từ phải sang trái)
  function removeDrawRectRightToLeft(button1Colum, button1Row, button2Column, button2Row) {
    const button1 = getButtonAtPosition(button1Colum, button1Row);
    const button2 = getButtonAtPosition(button2Column, button2Row);
    button1.css("background-color", "");
    button2.css("background-color", "");

    const button1Position = getPositionOfButton(button1);
    const button2Position = getPositionOfButton(button2);
    let buttonCorner;
    // buttonCorner từ phải sang trái xuống dưới
    if (button1Position.column > button2Position.column) {
      buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
    } else if (button1Position.column < button2Position.column) {
      buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
    }
    if (buttonCorner.data("imageName") === "-1") {
      buttonCorner.css("background-color", "");
    }
    // buttonCorner từ trên xuống dưới sang trái
    else {
      if (button1Position.column < button2Position.column) {
        buttonCorner = getButtonAtPosition(button2Position.column, button1Position.row);
      } else if (button1Position.column > button2Position.column) {
        buttonCorner = getButtonAtPosition(button1Position.column, button2Position.row);
      }
      buttonCorner.css("background-color", "");
    }
  }

  // hàm vẽ hình chữ U (vẽ chiều dọc)
  function drawColumn_template(startButtonPosition, endButtonPosition, column, isRemove) {
    for (let i = startButtonPosition; i <= endButtonPosition; i++) {
      let buttonBetween = getButtonAtPosition(column, i);
      if (isRemove) {
        buttonBetween.css("background-color", "");
      } else {
        buttonBetween.css("background-color", "red");
      }
    }
  }
  // vẽ chữ U (vẽ chiều ngang)
  function drawRow_template(startButtonPosition, endButtonPosition, row, isRemove) {
    for (let i = startButtonPosition; i <= endButtonPosition; i++) {
      let buttonBetween = getButtonAtPosition(i, row);
      if (isRemove) {
        buttonBetween.css("background-color", "");
      } else {
        buttonBetween.css("background-color", "red");
      }
    }
  }

  //================================================================ LEVEL ================================================================

  // hàm chuyển sang level khác
  function skipLevel() {
    level++;
    if (level === 2) {
      updateLevel(level);
      resetScore();
      updateScoreInView();
      resetProgressBar(180);
      startProgressBar(180, false);
      clearMatrix();
      createMatrix(level);
    } else if (level === 3) {
      updateLevel(level);
      resetScore();
      updateScoreInView();
      resetProgressBar(180);
      startProgressBar(180, false);
      clearMatrix();
      createMatrix(level);
    }
    else if (level === 4) {
      // ẩn nút reset
      document.getElementById("reset").style.display = "none";
      updateLevel(level);
      resetScore();
      updateScoreInView();
      $reset.click(clearMatrix);
      $reset.click(createMatrixWithBoss);
      resetProgressBar(180);
      startProgressBar(180, true);
      clearMatrix();
      createMatrixWithBoss();
    } else if (level === 5) {
      // hiện nút reset
      document.getElementById("reset").style.display = "block";
      updateLevel(level);
      resetScore();
      updateScoreInView();
      $reset.click(resetWithLock);
      resetProgressBar(180);
      startProgressBar(180, false);
      clearMatrix();
      createMatrixWithLock();
    }
    else if (level === 6) {
      updateLevel(level);
      resetScore();
      updateScoreInView();
      // ẩn đi button skip
      document.getElementById("skip-level").style.display = "none";
      $reset.click(resetWithPointEmpty);
      resetProgressBar(180);
      startProgressBar(180, false);
      clearMatrix();
      createHalfMatrix();
      autoCreateButton();
    }
  }

  // reset game
  function reset() {
    clearMatrix();
    createMatrix(level);
    resetProgressBar();
    startProgressBar(180, false);
    resetScore();
    updateScoreInView()
  }
  // reset game with lock (for lv 6)
  function resetWithLock() {
    clearMatrix();
    createMatrixWithLock();
    resetProgressBar();
    startProgressBar(180, false);
    resetScore();
    updateScoreInView()
  }

  // reset game với các ô trống ở giữa
  function resetWithPointEmpty() {
    clearMatrix();
    createHalfMatrix();
    resetProgressBar();
    startProgressBar(180, false);
    resetScore();
    updateScoreInView()
  }

  // hàm tăng điểm người chơi 
  function increaseScore() {
    score++;
    if (score >= 50) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.display = "none";
        skipLevel();
      }, 2000);
    }
  }


  // reset lại điểm
  function resetScore() {
    score = 0;
  }

  // cập nhật lại điểm ở view
  function updateScoreInView() {
    $("#score").text(score);
    $("#finalScore").text(score);
    console.log(score);
  }

  // cập nhật level ở view 
  function updateLevel(level) {
    $("#level").text(level);
  }

  // hàm tạo hiệu ứng tăng dần trong progress bar (áp dụng cho boss Dialga)
  function increaseProgressBar(currentProgressValue) {
    var progressBar = document.getElementById('progressBar');
    var value = currentProgressValue;
    var increment = 1;

    var interval = setInterval(function () {
      value += increment;
      progressBar.value = value;
      if (value >= 180) {
        clearInterval(interval);
        let currentTime = 180;
        const initialTime = 180;
        interval = setInterval(() => {
          currentTime -= 3;
          const progressPercentage = (currentTime / initialTime) * 180;
          progressBar.value = progressPercentage;
          if (level === 5) {
            clearInterval(interval);
          }
        }, 1000);
      }
    }, 10);
  }

  // hàm hiện ra thông tin giới thiệu
  function showInf() {
    $("#intro").click(function (event) {
      event.preventDefault();
      $("#inf").show();
    });

    $("#close-popup, #inf").click(function (event) {
      if (event.target.id === "close-popup" || !$(event.target).closest("#inf").length) {
        $("#inf").hide();
      }
    });
  }

  // hàm show hướng dẫn chơi
  function showManual() {
    $("#instruction").click(function (event) {
      event.preventDefault();
      $("#manual").show();
    });

    $("#close-popup, #manual").click(function (event) {
      if (event.target.id === "close-popup" || !$(event.target).closest("#manual").length) {
        $("#manual").hide();
      }
    })
  }

  // hàm xử lý sao khi ăn xong 
  function handleAfter(previousButton, button) {
    changeImageNameToMinusOne(previousButton);
    changeImageNameToMinusOne(button);
    hideTwoButtons(previousButton, button);
    loadSound("sound/correct.mp3", 0.1);
    increaseScore();
    updateScoreInView();
  }

  // hàm xử lí sau khi ăn xong (dành cho lv4)
  function handleAfterForLevel4(previousButton, button) {
    let videoPath = "";
    let imagePath = "";
    if (previousButton.data('imageName') === 'dialga.png' && button.data('imageName') === 'dialga.png') {
      videoPath = "video/diaAnimation.mp4";
      imagePath = "img/diaStart.png";
      showVideo(videoPath, imagePath);
      actionOfDia();
      changeImageNameToMinusOne(previousButton);
      changeImageNameToMinusOne(button);
      previousButton.removeClass("boss-button");
      button.removeClass("boss-button");
      hideTwoButtons(previousButton, button);
      loadSound("sound/correct.mp3")
      increaseScore();
      updateScoreInView();
    } else if (previousButton.data('imageName') === 'solgaleo.png' && button.data('imageName') === 'solgaleo.png') {
      videoPath = "video/solAnimation.mp4";
      imagePath = "img/solStart.png";
      loadSound("sound/correct.mp3", 0.1);
      increaseScore();
      updateScoreInView();
      showVideo(videoPath, imagePath);
      const buttonCheck = previousButton;
      setTimeout(() => {
        actionOfSol(buttonCheck);
        actionOfSol(button);
        loadSound("sound/boom.mp3", 0.1);
        increaseScore();
        updateScoreInView();
      }, 12000);
    } else {
      changeImageNameToMinusOne(previousButton);
      changeImageNameToMinusOne(button);
      hideTwoButtons(previousButton, button);
      loadSound("sound/correct.mp3", 0.1);
      increaseScore();
      updateScoreInView();
      // console.log("case 4 nè");
    }
  }

  // hàm kiểm tra level 
  function handleWithLevel(level, previousButton, button) {
    switch (level) {
      case 1:
        handleAfter(previousButton, button);
        break;
      case 2:
        handleAfter(previousButton, button);
        setTimeout(() => {
          dropButton();
        }, 200);
        break;
      case 3:
        handleAfter(previousButton, button);
        deleteMatrix();
        createMatrixWithPoint();
        break;
      case 4:
        handleAfterForLevel4(previousButton, button);
        break;
      case 5:
        unclock(previousButton);
        unclock(button);
        handleAfter(previousButton, button);
        break;
      case 6:
        handleAfter(previousButton, button);
        break;
      default:
        break;
    }
  }

  // tải lại trang khi nhấn nút restart
  $('#restartButton').click(function () {
    location.reload();
  });

  // các sự kiện click trên giao diện
  $("#intro").click(showInf());
  $("#instruction").click(showManual());
  $skip.click(skipLevel);
  $nextButton.click(skipLevel);


  // bắt đầu chạy ở level 1
  if (level === 1) {
    $reset.click(reset);
    createMatrix(level);
    startProgressBar(180, false);
  }

});
