const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuToggleBtn");

// เปิด/ปิด Sidebar
menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// คลิกนอก Sidebar → ปิด
document.addEventListener("click", (e) => {
    if (window.innerWidth > 900) return; // ใช้เฉพาะมือถือ

    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove("open");
    }
});