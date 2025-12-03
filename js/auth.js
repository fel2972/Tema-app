// js/auth.js

(function() {
    const user = localStorage.getItem("temaUser");

    // ชื่อไฟล์ปัจจุบัน เช่น "dashboard.html"
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const protectedPages = [
        "dashboard.html",
        "schedule.html",
        "tasks.html",
        "settings.html"
    ];

    // ถ้าอยู่ในหน้าที่ต้องล็อกอิน แต่ยังไม่มี user -> เด้งไปหน้า index
    if (protectedPages.includes(currentPage) && !user) {
        window.location.href = "index.html";
        return;
    }

    // (ถ้าอยากให้คนที่ล็อกอินแล้ว เปิด index.html แล้วเด้งไป dashboard ให้เพิ่มส่วนนี้ก็ได้)
    if ((currentPage === "" || currentPage === "index.html") && user) {
        // window.location.href = "dashboard.html";
        // ถ้ายังไม่อยากเด้งอัตโนมัติ สามารถคอมเมนต์บรรทัดนี้ไว้แบบนี้ก่อน
    }
})();
