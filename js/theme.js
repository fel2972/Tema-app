/* ============================================
   PNG Icon Dark Mode Toggle (no auto)
============================================ */

const body = document.body;
const btn = document.getElementById("themeToggleBtn");
const icon = document.getElementById("themeIcon");

// โหลดธีมที่เคยตั้งค่าไว้
let savedTheme = localStorage.getItem("temaTheme") || "light";
applyTheme(savedTheme);

// เวลา user กดปุ่มสลับโหมด
btn.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("temaTheme", newTheme);
    applyTheme(newTheme);
});

// ฟังก์ชันเปลี่ยนโหมด
function applyTheme(mode) {
    if (mode === "dark") {
        body.classList.add("dark");
        icon.src = "images/moon.png"; // ไอคอนโหมดมืด
    } else {
        body.classList.remove("dark");
        icon.src = "images/sun.png"; // ไอคอนโหมดสว่าง
    }
}
// theme.js (เพิ่มส่วนนี้เข้าไปด้านล่างได้เลย)

/* โหลด custom theme สีจาก localStorage ให้ทุกหน้า */
(function applySavedCustomColors() {
    const THEME_COLORS_KEY = "temaCustomColors";
    try {
        const raw = localStorage.getItem(THEME_COLORS_KEY);
        if (!raw) return;
        const colors = JSON.parse(raw);
        const root = document.documentElement;

        if (colors.primary) root.style.setProperty("--tema-primary", colors.primary);
        if (colors.accent)  root.style.setProperty("--tema-accent",  colors.accent);
        if (colors.cardBg)  root.style.setProperty("--tema-card-bg", colors.cardBg);
    } catch (e) {
        // ถ้ามี error ไม่ต้องทำอะไร ปล่อยใช้ค่า default
    }
})();
