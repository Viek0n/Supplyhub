const fileContent = `
/Sach/
sachtruyen/ST01.jpg_5 centimet/s_93.000_0
sachtruyen/ST02.jpg_Đường hầm tới mùa hạ - Lối thoát của biệt ly_120.000_0
sachtruyen/ST03.jpg_Tớ sẽ mãi mãi không quên cậu, người từng sống trong khoảnh khắc_93.000_0
sachtruyen/ST04.jpg_Và rồi, tháng 9 không có cậu đã tới_89.000_0
/But/
but/BV01.jpg_Hộp 10 Cây Bút Lông Dầu 2 Đầu Thiên Long PM09_69.700_0
but/BV02.jpg_Bút Gel Đen Bấm Deli 0.5mm_19.000_0
but/BV03.jpg_Bút bi Morandi mực đen B40 bút viết ngòi 0.5mm tông cổ điển xinh xắn_4.000_0
but/BV04.jpg_Fulgor Nocturnus_8.000.000_0
/Vo&Giay/
giayvo/GV01.jpg_Vở kẻ ngang Crabit 80 trang "Nàm" Biếng Collection_36.000_0
giayvo/GV02.jpg_Vở kẻ ngang B5 120 trang Klong bìa nhựa lò xo kép Lined_26.000_0
giayvo/GV03.jpg_Vở 4 ô ly Hồng Hà 200 trang Good Time_20.000_0
giayvo/GV04.jpg_Tập giấy in a4 Double A_79.900_0
/Dochoi/
dochoi/DC01.jpg_Gấu bông Capybara 6 múi 45cm_300.000_280.000
dochoi/DC02.jpg_Gối Ôm Nhồi Bông Dáng Dài Mềm Mại Hình Chú Mèo Dễ Thương_400.000_0
dochoi/DC03.jpg_Cheems Yasuo trăn trối thông thạo 7 15p GG_232.000_0
dochoi/DC04.jpg_Gấu bông mèo Tom siêu biến dạng_179.400_0
/Khac/
`;

function loadHome(){
    const lines = fileContent.split('\n');
    lines.forEach(line => {
        const [path, name, price, discount] = line.trim().split('_');
        if(path && price && name){
            createContent(path, name, price, discount);
        }
    });
}

function createContent(path,name,price,discount){
    //Tach ID
    let parentID = path.split("/").pop();
    parentID = parentID[0] + parentID[1];

    //Khung chứa content
    const newContainer = document.createElement('button');
    newContainer.className = "image-container";

    //Chứa hình
    const newImg = document.createElement('img');
    newImg.src = "assets/" + path;
    newImg.loading = "lazy";
    newImg.id = parentID;
    newContainer.appendChild(newImg);

    //Khung chứa giá
    const newBold = document.createElement('b');

    //Giá gốc
    const newPrice = document.createElement('p');
    newPrice.textContent = price+"đ";
    newPrice.id = "contentPrice";
    newBold.appendChild(newPrice);

    //Nếu có discount
    if(discount.localeCompare("0") != 0){
        //discount
        const newDiscount = document.createElement('p');
        newDiscount.textContent = discount+"đ";
        newDiscount.id = "contentDiscount";
        newBold.appendChild(newDiscount);

        newDiscount.style.color = "red";
        newPrice.classList.add("small-text");
        newPrice.style.textDecoration = "line-through"
        newDiscount.classList.add("medium-text");
    }else{
        newPrice.style.color = "red";
        newPrice.classList.add("medium-text");
    }
    newContainer.appendChild(newBold);

    //Tên
    const newName = document.createElement('p');
    newName.id = "contentName";
    newName.textContent = name;
    newName.classList.add("medium-text");

    //Cho tên vào khung chứa content
    newContainer.appendChild(newName);
    
    const parentDiv = document.querySelector(`.content#${parentID}`);
    parentDiv.appendChild(newContainer);    
}
loadHome();