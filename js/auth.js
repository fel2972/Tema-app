/* =======================================
   ระบบ Login แบบง่าย—ใช้ localStorage
======================================= */

// ถ้ามีการ login อยู่แล้วให้ส่งไป Dashboard ทันที
// ถ้าไม่ได้ login → เด้งไป index
if (!localStorage.getItem("temaUser")) {
    window.location.href = "index.html";
}

const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    // อ่านค่าจากฟอร์ม
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // ตรวจแบบง่าย
    if (user.length < 3 || pass.length < 3) {
        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง");
        return;
    }

    // บันทึกใน localStorage
    localStorage.setItem("temaUser", user);

    // ไปหน้า Dashboard
    window.location.href = "dashboard.html";
});
