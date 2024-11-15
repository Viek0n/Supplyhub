let daDangNhap = false;
const formDN = document.getElementById("formDN");
const formDki = document.getElementById("formDki");
const formQMk = document.getElementById("formQMk");
let USERNAME = null;

init();
function init(){
    const text = document.getElementById("welcome");

    if(USERNAME == null){
        text.textContent = "Xin chào!";
    }else{
        text.textContent = "Xin chào! " + USERNAME;
    }
}

function batdau(){
    if(!daDangNhap){
        formDN.reset();
        document.getElementById("form-container").style.display="flex";
        document.querySelector(".mainDnhap").style.display="block";
        document.body.style.overflow = 'hidden';
    }else
        alert("Xin chào " + USERNAME + "!");
}

function kiemTraRongKhiDnhap(){
    const tenDangNhap=document.getElementById("tendangnhap");
    const matKhau=document.getElementById("matkhau");
    if(tenDangNhap.value.trim()==""){
        alert("Vui lòng nhập vào tên đăng nhập!");
        tenDangNhap.focus();
        return false;
    }
    if(matKhau.value.trim()==""){
        alert("Vui lòng nhập mật khẩu!");
        matKhau.focus();
        return false;
    }
    return kiemtraDN(tenDangNhap.value, matKhau.value);
}

function kiemtraDN(username, password){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username == username && user.password == password);
    if(user){
        alert("Đăng nhập thành công!");
        document.getElementById("form-container").style.display="none";
        USERNAME = user.name;
        daDangNhap = true;
        init();
        document.body.style.overflow = 'auto';
        return true;
    } else {
        formDN.reset();
        alert("Sai tên đăng nhập hoặc mật khẩu!");
        return false;
    }
}

function kiemTraRongKhiDKi(){
    const hoTen=document.getElementById("hoten");
    const nam=document.getElementById("nam");
    const nu=document.getElementById("nu");
    const email = document.getElementById("email");
    const diaChi=document.getElementById("diachi");
    const soDienThoai=document.getElementById("sodienthoai");
    const tenDangNhap=document.getElementById("tendangnhapkhidki");
    const matKhau1=document.getElementById("nhapmk");
    const matKhau2=document.getElementById("nhaplaimk");

    var gioiTinh;
    if(hoTen.value.trim()==""){
        alert("Vui lòng nhập vào họ tên!");
        hoTen.focus();
        return false;
    }
    if(!nam.checked &&!nu.checked){
        alert("Vui lòng chọn giới tính!");
        return false;
    }
    if(email.value.trim()==""){
        alert("Vui lòng nhập vào email!");
        email.focus();
        return false;
    }
    if(diaChi.value.trim()==""){
        alert("Vui lòng nhập vào địa chỉ!");
        diaChi.focus();
        return false;
    }
    if(soDienThoai.value.trim()==""){
        alert("Vui lòng nhập vào số điện thoại!");
        soDienThoai.focus();
        return false;
    }
    if(tenDangNhap.value.trim()==""){
        alert("Vui lòng nhập vào tên đăng nhập!");
        tenDangNhap.focus();
        return false;
    }
    if(matKhau1.value.trim()==""){
        alert("Vui lòng nhập vào mật khẩu!");
        matKhau1.focus();
        return false;
    }
    if(matKhau2.value.trim()==""){
        alert("Vui lòng xác nhận lại mật khẩu!");
        matKhau2.focus();
        return false;
    }
    if (matKhau1.value!== matKhau2.value) {
        alert("Mật khẩu bạn nhập lại không khớp!");
        matKhau2.focus();
        return false;
    }

    if(nam.checked)
        gioiTinh = 0;
    else 
        gioiTinh = 1;

        
    addUser({name: hoTen.value, gender: gioiTinh, email: email, address: diaChi.value, phone: soDienThoai.value, username: tenDangNhap.value, password: matKhau1.value});
    document.querySelector(".mainDkiThCong").style.display="block";
    document.querySelector(".mainQuenMK").style.display="none";
    document.querySelector(".mainDkiTk").style.display="none";
    return true;
}

function addUser(newUser){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    newUser.id = getNextId();
    users.push(newUser); // Add new user to the array
    localStorage.setItem("users", JSON.stringify(users));
}   

function getNextId() {
    let currentId = parseInt(localStorage.getItem("idCounter")) || 0; // Default to 0 if not found
    currentId++;
    localStorage.setItem("idCounter", currentId); // Update the counter in localStorage
    return currentId;
}

function kiemTraRongKhiLayLaiMK(){
    const tenDangNhap=document.getElementById("tendangnhaplaymk");
    const soDienThoai=document.getElementById("sodienthoailaymk");
    if(tenDangNhap.value.trim()==""){
        alert("Vui lòng nhập vào tên đăng nhập!");
        tenDangNhap.focus();
        return false;
    }
    if(soDienThoai.value.trim()==""){
        alert("Vui lòng nhập vào số điện thoại của bạn!")
        soDienThoai.focus();
        return false;
    }
    alert("Chúng tôi đã gửi tài khoản và mật khẩu mới về số điện thoại của bạn!"); 
    document.querySelector(".mainDnhap").style.display="block";
    document.querySelector(".mainDkiThCong").style.display="none";
    document.querySelector(".mainQuenMK").style.display="none";
    document.querySelector(".mainDkiTk").style.display="none";
    return true;
}

function chuyentrangdangki(){
    formDki.reset();
    document.querySelector(".mainDnhap").style.display="none";
    document.querySelector(".mainDkiTk").style.display="block";
}

function chuyentrangquenmk(){
    formQMk.reset();
    document.querySelector(".mainQuenMK").style.display="block";
    document.querySelector(".mainDnhap").style.display="none";
}

function chuyentrangdangnhap(){
    formDN.reset();
    document.querySelector(".mainDnhap").style.display="block";
    document.querySelector(".mainQuenMK").style.display="none";
    document.querySelector(".mainDkiThCong").style.display="none";
}

function closeWindowDkiThCong(){
    document.querySelector(".mainDkiThCong").style.display="none";
    document.getElementById("page-container").style.display = "none";
    document.body.style.overflow = 'auto';
}

function closeWindowDangKi(){
    document.querySelector(".mainDkiTk").style.display="none";
    document.getElementById("page-container").style.display = "block";
    document.getElementById("form-container").style.display = "none";
    document.body.style.overflow = 'auto';
}

function closeWindowQuenMK(){
    document.querySelector(".mainQuenMK").style.display="none";
    document.getElementById("page-container").style.display = "block";
    document.getElementById("form-container").style.display = "none";
    document.body.style.overflow = 'auto';
}

function closeWindowDangnhap(){
    document.querySelector(".mainDnhap").style.display="none";
    document.getElementById("form-container").style.display="none";
    document.getElementById("page-container").style.display = "block";
    document.body.style.overflow = 'auto';
}

