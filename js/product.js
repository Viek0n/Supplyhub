const numPage = document.querySelectorAll("#num-page");
const anchorElement = document.getElementById("thanh-tien-ich");
var displayNum = 4;
var maxPage = 3;
var productArrays = [[1],[1],[1],[1],[1]];//Mảng product
var productAll = [];
var expaned = false;
var containerNum = 1;
var productOrigin = [];
var productFilter = [];

//Nạp sản phẩm vào mảng
function loadProduct(){
    const StoredProducts = JSON.parse(localStorage.getItem("products"));
    StoredProducts.forEach(product => {
        productArrays[product.type-1].push(product);
        productAll.push(product);
    });
}

//Scale Quảng cáo với khung chứa sản phẩm(.content)
function scaleAd(){
    const AdHolder = document.querySelector(".Ad");
    const Ad1 = document.querySelector(".BigAd");
    const Ad2 = document.querySelector(".SmallAd");
    const scaler = document.querySelector(".content");

    AdHolder.style.height = `${scaler.offsetHeight}px`;
    Ad1.style.width = `${AdHolder.offsetWidth -  scaler.offsetHeight*1.15}px`;
    Ad2.style.width = `${scaler.offsetHeight}px`;
}

//Xóa toàn bộ sản phẩm đang hiện ở div có {id}
function clearByID(id){
    const element = document.querySelector(`#${id}`);
    element.innerHTML = "";
}

//Lấy id của loại truyền vào(type)
function getPDivID(type){
    switch(type){
        case 1:
            return "ST";
        case 2:
            return "BV";
        case 3:
            return "GV";
        case 4:
            return "DC";
        case 5:
            return "KH";
        default:
            return "expand-content";
    }
}

//Lấy loại của {id} truyền vào
function getType(id){
    switch(id){
        case "ST":
            return 1;
        case "BV":
            return 2;
        case "GV":
            return 3;
        case "DC":
            return 4;
        case "KH":
            return 5;
    }
}

//Reset toàn bộ trang của mảng sản phẩm
function pageReset(){
    productArrays.forEach(productArrays => {
        productArrays[0] = 1;
    })
}

//Hiện sản phẩm theo loại
function display(type){
    clearByID(getPDivID(type));
    const page = productArrays[type-1][0];
    numPage[type-1].innerHTML = page;
    var start = displayNum*(page-1)+1;
    for (let index = start; index <= productArrays[type-1].length-1 && index < start + displayNum; index++)
        createContent(productArrays[type-1][index]);
}

//Hiện hết
function displayAll(){
    for (let i = 1; i <= productArrays.length; i++)
        display(i);
}

//Gắn content theo mảng thường
function createContent(product){
    //Tach ID
    const parentID = getPDivID(product.type);

    //Khung chứa content
    const newContainer = document.createElement('button');
    newContainer.className = "image-container";

    //Chứa hình
    const newImg = document.createElement('img');
    newImg.src = "assets/P_image/" + product.image;
    newImg.loading = "lazy";
    newImg.id = parentID;
    newContainer.appendChild(newImg);

    //Khung chứa giá
    const newBold = document.createElement('b');

    //Giá gốc
    const newPrice = document.createElement('p');
    newPrice.textContent = product.price.toLocaleString('de-DE')+"đ";
    newPrice.id = "contentPrice";
    newBold.appendChild(newPrice);

    //Nếu có discount
    if(product.discount != 0){
        //discount
        const newDiscount = document.createElement('p');
        newDiscount.textContent = product.discount.toLocaleString('de-DE')+"đ";
        newDiscount.id = "contentDiscount";
        newBold.appendChild(newDiscount);

        newDiscount.style.color = "red";
        newPrice.classList.add("chu-nho");
        newPrice.style.textDecoration = "line-through";
        newDiscount.classList.add("chu-binh-thuong");
    }else{
        newPrice.style.color = "red";
        newPrice.classList.add("chu-binh-thuong");
    }
    newContainer.appendChild(newBold);

    //Tên
    const newName = document.createElement('p');
    newName.id = "contentName";
    newName.textContent = product.name;
    newName.classList.add("chu-binh-thuong");

    //Cho tên vào khung chứa content
    newContainer.appendChild(newName);
    newContainer.style.animation = "0.5s ease-in-out fade-in";
    const parentDiv = document.querySelector(`.content#${parentID}`);
    parentDiv.appendChild(newContainer);
}

//Trang kế theo loại sản phẩm
function next(type){
    const pageTrack = productArrays[type-1][0]++;
    const productPages = Math.floor((productArrays[type-1].length-1)/displayNum);
    if(productArrays[type-1][0] > productPages || productArrays[type-1][0] > maxPage){
        productArrays[type-1][0] = 1;
    }
    if(pageTrack != productArrays[type-1][0])
        display(type);
}

//Trang trước theo loại sản phẩm
function prev(type){
    const pageTrack = productArrays[type-1][0]--;
    const productPages = Math.floor((productArrays[type-1].length-1)/displayNum);
    if(productArrays[type-1][0] < 1){
        if(productPages < maxPage){
            if(productPages == 0)
                productArrays[type-1][0] = 1;
            else
            productArrays[type-1][0] = productPages;
        }
        else
            productArrays[type-1][0] = maxPage;
    }
    if(pageTrack != productArrays[type-1][0])
        display(type);
}

//Chuyển sang hiển thị trang lọc
function expand(type){
    const allContent = document.querySelectorAll(".content");
    const filter = document.getElementById("bo-loc");
    const expander = document.getElementById("expand-container");
    var Ad = document.querySelector(".Ad");
    var Menu = document.getElementById("menu");

    pageReset();
    var keep = getPDivID(type);
    Ad.style.display = "none";
    Menu.style.display = "none";
    filter.style.display = "block";
    displayNum = 12;
    maxPage = 999;

    allContent.forEach(content => {
        if(content.id.localeCompare(keep) != 0)
            content.parentElement.style.display = "none";
        else{
            productFilter = productArrays[type-1];
            productOrigin = productArrays[type-1];
            content.parentElement.style.display = "none";
        }
     });

    expaned = true;
    expander.style.display ="block";
    filterClear();
}

/*------------------------------------------------------------------------------------------
Chuyển sang trang lọc
------------------------------------------------------------------------------------------*/

//Trở về hiển thị trang thường
function expandBack(){
    const allContent = document.querySelectorAll(".khung-content");
    const filter = document.getElementById("bo-loc");
    const expander = document.getElementById("expand-container");
    var Ad = document.querySelector(".Ad");
    var Menu = document.getElementById("menu");

    displayNum = 4;
    maxPage = 3;
    allContent.forEach(content => {
        content.style.display = "block";
     });
    
    expander.style.display = "none";
    expaned = false;
    Ad.style.display = "block";
    filter.style.display = "none";
    Menu.style.display = "block";
    productOrigin = [];
    productFilter = [];
    
    displayAll();
    anchorElement.scrollIntoView();
}

//Hiện sản phẩm của mảng filter(lọc sản phẩm)
function displayFilter(){
    clearByID(getPDivID(99));
    const page = productFilter[0];
    numPage[numPage.length-1].innerHTML = page;
    var start = displayNum*(page-1)+1;
    for(let index = start; index <= productFilter.length-1 && index < start + displayNum; index++)
        createFilterContent(productFilter[index]);
}

//Trang kế mảng lọc
function expandNext(){
    const pageTrack = productFilter[0]++;
    const productPages = Math.ceil((productFilter.length-1)/displayNum);
    if(productFilter[0] > productPages || productFilter[0] > maxPage){
        productFilter[0] = 1;
    }
    if(pageTrack != productFilter[0]){
        displayFilter();
        anchorElement.scrollIntoView();
    }
}

//Trang trước mảng lọc
function expandPrev(){
    const pageTrack = productFilter[0]--;
    const productPages = Math.ceil((productFilter.length-1)/displayNum);
    if(productFilter[0] < 1){
        if(productPages < maxPage){
            if(productPages == 0)
                productFilter[0] = 1;
            else
                productFilter[0] = productPages;
        }
        else
            productFilter[0] = maxPage;
    }
    if(pageTrack != productFilter[0]){
        displayFilter();
        anchorElement.scrollIntoView();
    }
}

//Gắn content theo mảng lọc
function createFilterContent(product){
    //Tach ID
    const parentID = "expand-content";

    //Khung chứa content
    const newContainer = document.createElement('button');
    newContainer.className = "image-container";

    //Chứa hình
    const newImg = document.createElement('img');
    newImg.src = "assets/P_image/" + product.image;
    newImg.loading = "lazy";
    newImg.id = parentID;
    newContainer.appendChild(newImg);

    //Khung chứa giá
    const newBold = document.createElement('b');

    //Giá gốc
    const newPrice = document.createElement('p');
    newPrice.textContent = product.price.toLocaleString('de-DE')+"đ";
    newPrice.id = "contentPrice";
    newBold.appendChild(newPrice);

    //Nếu có discount
    if(product.discount != 0){
        //discount
        const newDiscount = document.createElement('p');
        newDiscount.textContent = product.discount.toLocaleString('de-DE')+"đ";
        newDiscount.id = "contentDiscount";
        newBold.appendChild(newDiscount);

        newDiscount.style.color = "red";
        newPrice.classList.add("chu-nho");
        newPrice.style.textDecoration = "line-through";
        newDiscount.classList.add("chu-binh-thuong");
    }else{
        newPrice.style.color = "red";
        newPrice.classList.add("chu-binh-thuong");
    }
    newContainer.appendChild(newBold);

    //Tên
    const newName = document.createElement('p');
    newName.id = "contentName";
    newName.textContent = product.name;
    newName.classList.add("chu-binh-thuong");

    //Cho tên vào khung chứa content
    newContainer.appendChild(newName);
    newContainer.style.animation = "0.5s ease-in-out fade-in";
    const parentDiv = document.querySelector(`.content#${parentID}`);
    parentDiv.appendChild(newContainer);
}

function filterClear(){
    const formFilter = document.getElementById("form-filter");
    const filterAlert = document.getElementById("filter-alert");
    filterAlert.innerHTML = "Sản phẩm";
    productFilter = productOrigin;
    formFilter.reset();
    displayFilter();
    anchorElement.scrollIntoView();
}

function isNumAndNotNull(val){
    return val.trim() != "" && !isNaN(val);
}

function discounted(product){
    return typeof product === 'object' && product.discount != 0;
}

function priceRange(product, min, max){
    var price;
    if(product.discount != 0)
        price = product.discount;
    else
        price = product.price;
    return typeof product === 'object' && min <= price && price <= max;
}

function filterProduct(){
    var fil = false;
    const filterAlert = document.getElementById("filter-alert");
    const minValue = document.getElementById("gia-min").value;
    const maxValue = document.getElementById("gia-max").value;
    const discount = document.getElementById("giam-gia");
    productFilter = productOrigin;

    if(isNumAndNotNull(minValue) && isNumAndNotNull(maxValue)){
        productFilter = productFilter.filter(product => priceRange(product,minValue,maxValue));
        fil = true;
    }

    if(discount.checked){
        productFilter = productFilter.filter(discounted);
        fil = true;
    }

    if(fil){
        filterAlert.innerHTML = `Đã tìm thấy ${productFilter.length} sản phẩm`;
        productFilter.unshift(1);
    }else{
        productFilter[0]=1;
        filterAlert.innerHTML = "Sản phẩm";
    }
    displayFilter();
    anchorElement.scrollIntoView();
}
/*------------------------------------------------------------------------------------------
Chuyển sang trang tìm kiếm
------------------------------------------------------------------------------------------*/
function nameSearch(product, name){
    const productName = product.name.toLowerCase();
    const compare = name.toLowerCase();
    console.log(productName + " " + compare + " " + productName.includes(compare));
    return productName.includes(compare);
}

function search(){
    const input = document.getElementById("tim-kiem-input");
    input.value = "";
    input.addEventListener("keydown", function(event){
        if(event.key == "Enter"){
            const filterAlert = document.getElementById("filter-alert");
            expand(1);
            productFilter = productAll.filter(product => nameSearch(product,input.value));
            filterAlert.innerHTML = `Tìm thấy ${productFilter.length} sản phẩm có chứa từ khóa "${input.value}"!`;
            productOrigin = productFilter;
            productFilter.unshift(1);
            displayFilter();
            input.value = "";
        }
    })
}
/*------------------------------------------------------------------------------------------
Dùng khi mở trang
------------------------------------------------------------------------------------------*/
const products = [
    {ProductId: 1, image: "01.jpg", name: "5 Centimet Trên Giây", price: 93000, discount: 0, nxb: "NXB Tiếng Việt IPM", tacgia: "Makoto Shinkai", type: 1},
    {ProductId: 2, image: "02.jpg", name: "Đường hầm tới mùa hạ - Lối thoát của biệt ly", price: 120000, discount: 0, nxb: "NXB Tiếng Việt IPM", tacgia: "Mokune Hachi", type: 1},
    {ProductId: 3, image: "03.jpg", name: "Tớ sẽ mãi mãi không quên cậu, người từng sống trong khoảnh khắc", price: 93000, discount: 0, nxb: "NXB Tiếng Việt IPM", tacgia: "Yoru Sumino", type: 1},
    {ProductId: 4, image: "04.jpg", name: "Và rồi, tháng 9 không có cậu đã tới", price: 89000, discount: 0, nxb: "NXB Tiếng Việt Nhã Nam", tacgia: "Haruki Murakami", type: 1},
    {ProductId: 5, image: "05.jpg", name: "Hộp 10 Cây Bút Lông Dầu 2 Đầu Thiên Long PM09", price: 69700, discount: 0, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 6, image: "06.jpg", name: "Bút Gel Đen Bấm Deli 0.5mm", price: 19000, discount: 0, thuonghieu: "Deli", type: 2},
    {ProductId: 7, image: "07.jpg", name: "Bút bi Morandi mực đen B40 bút viết ngòi 0.5mm tông cổ điển xinh xắn", price: 4000, discount: 0, thuonghieu: "Morandi", type: 2},
    {ProductId: 8, image: "08.jpg", name: "Fulgor Nocturnus", price: 8000000, discount: 0, thuonghieu: "Fulgor Nocturnus", type: 2},
    {ProductId: 9, image: "09.jpg", name: "Vở kẻ ngang Crabit 80 trang \"Nàm\" Biếng Collection", price: 36000, discount: 0, thuonghieu: "Crabit", loai: "Vo", loai: "Vo", type: 3},
    {ProductId: 10, image: "10.jpg", name: "Vở kẻ ngang B5 120 trang Klong bìa nhựa lò xo kép Lined", price: 26000, discount: 0, thuonghieu: "Klong", loai: "Vo", loai: "Vo", type: 3},
    {ProductId: 11, image: "11.jpg", name: "Vở 4 ô ly Hồng Hà 200 trang Good Time", price: 20000, discount: 0, thuonghieu: "Hồng Hà", loai: "Vo", loai: "Vo", type: 3},
    {ProductId: 12, image: "12.jpg", name: "Tập giấy in a4 Double A", price: 79900, discount: 0, thuonghieu: "Double A", loai: "Giay", loai: "Vo", type: 3},
    {ProductId: 13, image: "13.jpg", name: "Gấu bông Capybara 6 múi 45cm", price: 300000, discount: 280000 , dangdochoi: "Gấu bông", type: 4},
    {ProductId: 14, image: "14.jpg", name: "Gối Ôm Nhồi Bông Dáng Dài Mềm Mại Hình Chú Mèo Dễ Thương", price: 400000, discount: 0 , dangdochoi: "Gấu bông", type: 4},
    {ProductId: 15, image: "15.jpg", name: "Cheems Yasuo trăn trối thông thạo 7 15p GG", price: 232000, discount: 0, dangdochoi: "Gấu bông", type: 4},
    {ProductId: 16, image: "16.jpg", name: "Gấu bông mèo Tom siêu biến dạng", price: 179400, discount: 0, dangdochoi: "Gấu bông", type: 4},
    {ProductId: 17, image: "17.jpg", name: "SPY ROOM - Lớp Học Điệp Viên Tập 1", price: 119000, discount: 99000, nxb: "NXB Tiếng Việt Kim Đồng", tacgia: "Takemachi", type: 1},
    {ProductId: 18, image: "18.jpg", name: "Kẻ Dị Biệt Tại Trường Học Phép Thuật - Tập 1", price: 96000, discount: 67000, nxb: "NXB Tiếng Việt IPM", tacgia: "Tsutomu Satou", type: 1},
    {ProductId: 19, image: "19.jpg", name: "5 Centimet Trên Giây - One More Side", price: 98000, discount: 0, nxb: "NXB Tiếng Việt IPM", tacgia: "Arata Kanoh", type: 1},
    {ProductId: 20, image: "20.jpg", name: "Thiên Sứ Nhà Bên - Tập 3", price: 95000, discount: 0, nxb: "NXB Tiếng Việt IPM", tacgia: "Saekisan", type: 1},
    {ProductId: 21, image: "21.jpg", name: "Mắt Biếc (Tái Bản 2019)", price: 110000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Nhật Ánh", type: 1},
    {ProductId: 22, image: "22.jpg", name: "Cho Tôi Xin Một Vé Đi Tuổi Thơ (Tái Bản 2023)", price: 90000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Nhật Ánh", type: 1},
    {ProductId: 23, image: "23.jpg", name: "Bàn Có Năm Chỗ Ngồi (Tái Bản 2022)", price: 95000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Nhật Ánh", type: 1},
    {ProductId: 24, image: "24.jpg", name: "Đảo Mộng Mơ (Tái Bản Lần Thứ 34)", price: 75000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Nhật Ánh", type: 1},
    {ProductId: 25, image: "25.jpg", name: "Dế mèn phiêu lưu ký", price: 75000, discount: 67000, nxb: "Nhà xuất bản Kim Đồng", tacgia: "Tô Hoài", type: 1},
    {ProductId: 26, image: "26.jpg", name: "Bu sa men miêu ký", price: 60000, discount: 45000, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Quang Sáng", type: 1},
    {ProductId: 27, image: "27.jpg", name: "Bút bi B-RT", price: 25000, discount: 0, thuonghieu: "B-RT", type: 2},
    {ProductId: 28, image: "28.jpg", name: "Bút bi thiên long đủ màu", price: 16500, discount: 0, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 29, image: "29.jpg", name: "Vở viết thư pháp", price: 45000, discount: 0, thuonghieu: "NHT Books", loai: "Vo", type: 3},
    {ProductId: 30, image: "30.jpg", name: "Giấy bọc vở", price: 70000, discount: 0, thuonghieu: "Deli", loai: "Giay", loai: "Vo", type: 3},
    {ProductId: 31, image: "31.jpg", name: "Đồ chơi rau củ dao mini", price: 15000, discount: 0, dangdochoi: "figure", type: 4},
    {ProductId: 32, image: "32.jpg", name: "Mô hình tàu chiến hiện đại", price: 75000, discount: 0, dangdochoi: "figure", type: 4},
    {ProductId: 33, image: "33.jpg", name: "Bóng đá cao cấp chính hãng", price: 123000, discount: 110000, type: 5},
    {ProductId: 34, image: "34.jpg", name: "Gấu bông Capybara dễ thương giáng sinh", price: 36500, discount: 30000, type: 5},
    {ProductId: 35, image: "35.jpg", name: "Nếu biết trăm năm là hữu hạn", price: 108000, discount: 0, nxb: "Nhã Nam", tacgia: "Lê Vĩnh Tài", type: 1},
    {ProductId: 36, image: "36.jpg", name: "Tư duy ngược", price: 135000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Michael Michalko", type: 1},
    {ProductId: 37, image: "37.jpg", name: "Cây cam ngọt của tôi", price: 97000, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "José Mauro de Vasconcelos", type: 1},
    {ProductId: 38, image: "38.jpg", name: "Trốn lên mái nhà để khóc", price: 49000, discount: 0, nxb: "Nhã Nam", tacgia: "Savić Slavko", type: 1},
    {ProductId: 39, image: "39.jpg", name: "Lén nhặt chuyện đời", price: 32300, discount: 0, nxb: "Nhà xuất bản Trẻ", tacgia: "Nguyễn Ngọc Tư", type: 1},
    {ProductId: 40, image: "40.jpg", name: "Thiên tài bên trái kẻ điên bên phải", price: 96000, discount: 0, nxb: "Nhà xuất bản Tổng hợp TP.HCM", tacgia: "Lê Minh Quốc", type: 1},
    {ProductId: 41, image: "41.jpg", name: "Gieo trồng hạnh phúc", price: 129000, discount: 0, nxb: "Nhà xuất bản Tổng hợp TP.HCM", tacgia: "Thích Nhất Hạnh", type: 1},
    {ProductId: 42, image: "42.jpg", name: "Cuộc đời kì lạ của Nikola Tesla", price: 51000, discount: 0, nxb: "Nhã Nam", tacgia: "Mark Serrels", type: 1},
    {ProductId: 43, image: "43.jpg", name: "Giận", price: 59000, discount: 0, nxb: "Nhà xuất bản Tổng hợp TP.HCM", tacgia: "Thích Nhất Hạnh", type: 1},
    {ProductId: 44, image: "44.jpg", name: "Thần số học thấu hiểu nhân tâm", price: 63000, discount: 0, nxb: "Nhà xuất bản Hồng Đức", tacgia: " Lê Đình Bảng", type: 1},
    {ProductId: 45, image: "45.jpg", name: "Bút Bi Nước Deli Viết Gel Bấm A575 Ngòi 0.5mm", price: 4500, discount: 3000, thuonghieu: "Deli", type: 2},
    {ProductId: 46, image: "46.jpg", name: "Bút Gel Kaco Pure, Rocket Bấm Ngòi 0.5", price: 30000, discount: 13000, thuonghieu: "Labo", type: 2},
    {ProductId: 47, image: "47.jpg", name: "Bút doremon, hộp bút doremon đủ màu Xanh, Tím , Đen", price: 38000, discount: 19000, thuonghieu: "Doraemon", type: 2},
    {ProductId: 48, image: "48.jpg", name: "Bút bi nước mực gel bấm nhiều màu 0.5mm", price: 4500, discount: 2500, thuonghieu: "Deli", type: 2},
    {ProductId: 49, image: "49.jpg", name: "Bút Bi Nước Bút Gel Mực Bấm Deli Đệm Xốp Nhiều Màu", price: 6000, discount: 3000, thuonghieu: "Deli", type: 2},
    {ProductId: 50, image: "50.jpg", name: "Bút Gel Bấm Bút Bi Nước Deli Phù Hợp Viết Sổ", price: 5400, discount: 2800, thuonghieu: "Deli", type: 2},
    {ProductId: 51, image: "51.jpg", name: "Bút gel bi Minimalist Thiên Long", price: 11000, discount: 8900, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 52, image: "52.jpg", name: "Combo 5/10/20 Bút bi Thiên Long Pro027 TL-105 - 3 màu mực", price: 40000, discount: 30000, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 53, image: "53.jpg", name: "Bút gel Quick Dry Thiên Long GEL-033 - Mực Xanh - Mực khô siêu nhanh-KM", price: 12000, discount: 9300, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 54, image: "54.jpg", name: "Vở luyện viết thể hành thư NHT Books bộ 7 cuốn", price: 280000, discount: 179000, thuonghieu: "NHT Books", loai: "Vo", type: 3},
    {ProductId: 55, image: "55.jpg", name: "Decal bọc vở trong suốt Deli 10 chiếc chống nước chống bụi", price: 27000, discount: 12000, thuonghieu: "Deli", loai: "Giay", type: 3},
    {ProductId: 56, image: "56.jpg", name: "Tập Vở Ghi Chép Dán Gáy Nusign Pastel A5/B5 Deli - Kẻ Ngang 80 trang Chống Lóa", price: 16200, discount: 8700, thuonghieu: "Deli", loai: "Vo", type: 3},
    {ProductId: 57, image: "57.jpg", name: "Sổ Vở Kẻ Ngang Dán Gáy Chính Hãng Deli, Kích Cỡ A5/B5", price: 17000, discount: 9000, thuonghieu: "Deli", loai: "Vo", type: 3},
    {ProductId: 58, image: "58.jpg", name: "Giấy in 70 gsm 500 tờ A3, A4, A5", price: 70500, discount: 34000, thuonghieu: "Thiên Long", loai: "Giay", type: 3},
    {ProductId: 59, image: "59.jpg", name: "Giấy ghi chú màu Pastel Thiên Long SN-001 - Sticky Notes 100 tờ, giấy bền mịn, keo dính lâu", price: 12000, discount: 0, thuonghieu: "Thiên Long", loai: "Giay", type: 3},
    {ProductId: 60, image: "60.jpg", name: "Combo 5 Ream giấy A3 70 gsm IK Copy (500 tờ) - Hàng nhập khẩu Indonesia", price: 285000, discount: 0, thuonghieu: "Thiên Long", loai: "Giay", type: 3},
    {ProductId: 61, image: "61.jpg", name: "Giấy kiểm tra Thiên Long Điểm 10 TP-GKT01 4 ô ly vuông", price: 19800, discount: 16400, thuonghieu: "Thiên Long", loai: "Giay", type: 3},
    {ProductId: 62, image: "62.jpg", name: "Giấy gói quà Thiên Long 70x50cm phủ mờ GGQ-004", price: 31000, discount: 27990, thuonghieu: "Thiên Long", loai: "Giay", type: 3},
    {ProductId: 63, image: "63.jpg", name: "Vở vẽ Sketch Book for Art Thiên Long Colokit nhiều kích cỡ", price: 35000, discount: 33000, thuonghieu: "Thiên Long", loai: "Vo", type: 3},
    {ProductId: 64, image: "64.jpg", name: "Đồ Chơi Ảo Thuật cho bé Mideer My First Magic Show", price: 770000, discount: 554000, dangdochoi: "figure", type: 4},
    {ProductId: 65, image: "65.jpg", name: "Đồ chơi lật đật mini Sankid nhiều phân loại siêu dễ thương ", price: 2000, discount: 1000, dangdochoi: "figure", type: 4},
    {ProductId: 66, image: "66.jpg", name: "Đồ Chơi Ghép Hình", price: 295000, discount: 170000, dangdochoi: "figure", type: 4},
    {ProductId: 67, image: "67.jpg", name: "Đồ chơi nấu ăn gỗ cao cấp có đèn và âm thanh MSN22006, bếp đôi hiện đại,chất liệu an toàn", price: 1800000, discount: 1354000, dangdochoi: "figure", type: 4},
    {ProductId: 68, image: "68.jpg", name: "Đồ Chơi Tàu Săn Cá Mập DICKIE TOYS Shark Attack", price: 1099000, discount: 989100, dangdochoi: "figure", type: 4},
    {ProductId: 69, image: "69.jpg", name: "Đồ Chơi Xe Ô Tô Tải 6in1 VINATOYS Có Đầy Đủ Mẫu Mã", price: 250000, discount: 175000, dangdochoi: "figure", type: 4},
    {ProductId: 70, image: "70.jpg", name: "Bảng vẽ tự xóa FORBABY điện tử đa sắc đồ họa", price: 79000, discount: 58000, dangdochoi: "figure", type: 4},
    {ProductId: 71, image: "71.jpg", name: "Joyncleon Đồ chơi nước trẻ em mới áp lực lớn kéo sức chứa lớn nước chống nước đồ chơi nước", price: 240000, discount: 178000, dangdochoi: "figure", type: 4},
    {ProductId: 72, image: "72.jpg", name: "Thú Bông Doraemon Khổng Lồ (size L)", price: 549000, discount: 0, dangdochoi: "Gấu bông", type: 4},
    {ProductId: 73, image: "73.jpg", name: "Thú Nhồi Bông Mèo Hoàng Thượng Ngồi Dễ Thương Nhập Khẩu, Gấu Bông Mèo Vua Mặt Quạo", price: 490000, discount: 370000, dangdochoi: "Gấu bông", type: 4},
    {ProductId: 74, image: "74.jpg", name: "Bảng Từ Trắng Viết Bút Lông", price: 230000, discount: 0, type: 5},
    {ProductId: 75, image: "75.jpg", name: "Ghim bấm", price: 30000, discount: 0, type: 5},
    {ProductId: 76, image: "76.jpg", name: "Keo dán giấy", price: 3000, discount: 0, type: 5},
    {ProductId: 77, image: "77.jpg", name: "Kẹp giấy", price: 3500, discount: 0, type: 5},
    {ProductId: 78, image: "78.jpg", name: "Cục tẩy", price: 8000, discount: 0, type: 5},
    {ProductId: 79, image: "79.jpg", name: "Bút lông dầu", price: 12000, discount: 0, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 80, image: "80.jpg", name: "Bảng đen", price: 15500, discount: 13000, type: 5},
    {ProductId: 81, image: "81.jpg", name: "Mực in", price: 20000, discount: 0, type: 5},
    {ProductId: 82, image: "82.jpg", name: "Hộp bút", price: 30000, discount: 19500, type: 5},
    {ProductId: 83, image: "83.jpg", name: "Kéo", price: 15000, discount: 13500, type: 5},
    {ProductId: 84, image: "84.jpg", name: "Thước kẻ", price: 3000, discount: 0, type: 5},
    {ProductId: 85, image: "85.jpg", name: "Bút xoá", price: 10000, discount: 0, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 86, image: "86.jpg", name: "Xoá bảng", price: 7000, discount: 0, type: 5},
    {ProductId: 87, image: "87.jpg", name: "Dây đeo thẻ", price: 29000, discount: 0, type: 5},
    {ProductId: 88, image: "88.jpg", name: "Cặp xách", price: 329000, discount: 340000, type: 5},
    {ProductId: 89, image: "89.jpg", name: "Bàn xếp", price: 95000, discount: 0, type: 5},
    {ProductId: 90, image: "90.jpg", name: "Cầu đá", price: 10000, discount: 0, type: 5},
    {ProductId: 91, image: "91.jpg", name: "Bóng chuyền da chính hãng", price: 125000, discount: 0, type: 5},
    {ProductId: 92, image: "92.jpg", name: "Bóng rổ", price: 175000, discount: 0, type: 5},
    {ProductId: 93, image: "93.jpg", name: "Bóng tennis chuyên dụng", price: 13000, discount: 0, type: 5},
    {ProductId: 94, image: "94.jpg", name: "Cầu lông Hải Yến", price: 115000, discount: 0, type: 5},
    {ProductId: 95, image: "95.jpg", name: "Đèn học để bàn Pixar có chân", price: 149000, discount: 0, type: 5},
    {ProductId: 96, image: "96.jpg", name: "Bút chì màu 110W", price: 360000, discount: 324000, thuonghieu: "Thiên Long", type: 2},
    {ProductId: 97, image: "97.jpg", name: "Ngòi bút chì kim 0.5", price: 11000, discount: 9350, type: 5},
    {ProductId: 98, image: "98.jpg", name: "Dây nhảy thể dục", price: 35000, discount: 29000, type: 5},
    {ProductId: 99, image: "99.jpg", name: "Đồng hồ cát", price: 80000, discount: 0, type: 5},
    {ProductId: 100, image: "100.jpg", name: "Rubik(3x3)", price: 35000, discount: 0, type: 5}
    ];
    
localStorage.setItem("products", JSON.stringify(products));

loadProduct();
displayAll();
scaleAd();
search();
window.onresize = function(){
    scaleAd();
}