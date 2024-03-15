document.addEventListener("DOMContentLoaded", function() {
    // Số hàng và số cột của ma trận
    var rows = 9;
    var columns = 16;
    
    // Đường dẫn đến thư mục img
    var imageDirectory = "img/";

    // Mảng chứa tên của hình ảnh trong thư mục img
    var imageNames = [
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
        "weedle.png"
    ];

    // Mảng mới chứa tên hình ảnh được lặp lại
    var duplicatedImageNames = [];
    for (var i = 0; i < Math.ceil(rows * columns / 2); i++) {
        duplicatedImageNames = duplicatedImageNames.concat(imageNames);
    }

    var gridContainer = document.getElementById("gridContainer");

    // Tạo ma trận các hình ảnh
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var randomIndex = Math.floor(Math.random() * duplicatedImageNames.length);
            var imageName = duplicatedImageNames.splice(randomIndex, 1)[0];
            var imgSrc = imageDirectory + imageName;
            
            var button = document.createElement("div");
            button.classList.add("button");

            // Tạo một container để canh giữa hình ảnh
            var imgContainer = document.createElement("div");
            imgContainer.classList.add("img-container");

            var img = document.createElement("img");
            img.src = imgSrc;
            img.alt = "Pikachu";

            // Thiết lập kích thước cho hình ảnh
            img.style.width = "80px";
            img.style.height = "80px";

            img.style.opacity = "1";
            
            imgContainer.appendChild(img);
            button.appendChild(imgContainer);
            gridContainer.appendChild(button);
        }
    }
});
