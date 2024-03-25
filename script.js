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

  // Lấy vị trí của button trên ma trận
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
    return $(".cell")
      .eq(row * 18 + column)
      .find("button");
  }

  // Kiểm tra button theo chiều dọc
  function checkColumn(button1, button2) {
    const position1 = getPositionOfButton(button1);
    const position2 = getPositionOfButton(button2);
    console.log("1", button1.data("imageName"));
    console.log("2", button2.data("imageName"));

    if (
      position1.column === position2.column &&
      button1.data("imageName") === button2.data("imageName")
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

  // Kiểm tra button theo chiều ngang
  function checkRow(button1, button2) {
    const position1 = getPositionOfButton(button1);
    const position2 = getPositionOfButton(button2);
    console.log("1", button1.data("imageName"));
    console.log("2", button2.data("imageName"));

    if (
      position1.row === position2.row &&
      button1.data("imageName") === button2.data("imageName")
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

  let previousButton = null;

  // Xử lý khi click vào button
  function handleButtonClick(button) {
    if (previousButton === null) {
      previousButton = button;
    } else {

      if (button !== previousButton) {
        if (
          checkColumn(previousButton, button) ||
          checkRow(previousButton, button)
        ) {
          // console.log("Hai button nằm kề nhau");
          drawLine(previousButton, button);
          hideTwoButtons(previousButton, button);
        } else {
          // console.log("Hai button không nằm kề nhau");
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

  // Hàm vẽ đường thẳng từ tâm của button1 đến tâm của button2
  function drawLine(button1, button2) {
    /* ví dụ
    button1 ở vị trí 1:3
    button2 ở vị trí 1:4
    deltaX = 1 - 1 = 0
    deltaY = 4 - 3 = 1
    distance = căn bậc 2 (0*0+1*1) = 1

    css: ta có cellHeight = 31px; cellWidth = 31px
    width = 1
    top: 3*31+31/2 = 93 + 15.5 = 108.5px
    left: 1*31+31/2 = 46.5px

    */
    // Lấy tọa độ của tâm của button1 và button2
    const position1 = getPositionOfButton(button1);
    const position2 = getPositionOfButton(button2);
    console.log("cộtB1", position1.column);
    console.log("hàngB1", position1.row);
    console.log("cộtB2", position2.column);
    console.log("hàngB2", position2.row);
    // Tính toán chiều dài và góc nghiêng của đường thẳng
    const deltaX = position2.column - position1.column;
    const deltaY = position2.row - position1.row;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Tạo đường thẳng
    const line = $("<div></div>");
    line.addClass("line");
    // Thiết lập chiều dài và góc nghiêng của đường thẳng

    console.log(cellHeight);
    console.log( cellWidth);
    line.css({
      width: distance + "px",
      // transform: `rotate(${angle}deg)`,
      top: position1.row * cellHeight + cellHeight / 2 +"px",
      left: position1.column * cellWidth + cellWidth / 2 +"px",
      backgroundColor: "red", // Màu đỏ cho đường thẳng
      border: "3px solid red", // Đường thẳng dày 3px
    });

    // Thêm đường thẳng vào grid container
    $("#grid").append(line);
  }

  // // Hàm random một button từ các button còn hiển thị trên ma trận
  // function randomVisibleButton() {
  //   const visibleButtons = [];

  //   // Lặp qua tất cả các ô trên ma trận và kiểm tra xem button có hiển thị không
  //   $("#grid .cell button").each(function () {
  //     const button = $(this);
  //     if (button.css("display") !== "none") {
  //       visibleButtons.push(button);
  //     }
  //   });

  //   // Nếu không có button hiển thị, trả về null
  //   if (visibleButtons.length === 0) {
  //     return null;
  //   }

  //   // Chọn ngẫu nhiên một button từ danh sách các button hiển thị
  //   const randomIndex = Math.floor(Math.random() * visibleButtons.length);
  //   return visibleButtons[randomIndex];
  // }

  // Tạo ma trận button khi trang được tải
  createMatrix();
});
