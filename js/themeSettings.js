// js/themeSettings.js

/* key สำหรับเก็บ custom theme */
const THEME_COLORS_KEY = "temaCustomColors";

document.addEventListener("DOMContentLoaded", () => {

    const primaryInput   = document.getElementById("primaryColorInput");
    const accentInput    = document.getElementById("accentColorInput");
    const cardBgInput    = document.getElementById("cardBgColorInput");

    const primaryCode    = document.getElementById("primaryColorCode");
    const accentCode     = document.getElementById("accentColorCode");
    const cardBgCode     = document.getElementById("cardBgColorCode");

    const saveBtn        = document.getElementById("saveThemeBtn");
    const resetBtn       = document.getElementById("resetThemeBtn");

    // ค่าดีฟอลต์ (ต้องตรงกับใน styles.css)
    const defaultColors = {
        primary:  "#6a7cff",
        accent:   "#A7C7FF",
        cardBg:   "#ffffff"
    };

    // โหลดสีที่เคยบันทึก
    const saved = loadCustomColors();
    const current = {
        primary: saved.primary || defaultColors.primary,
        accent:  saved.accent  || defaultColors.accent,
        cardBg:  saved.cardBg  || defaultColors.cardBg
    };

    // ใส่ค่าเริ่มต้นใน input
    primaryInput.value = current.primary;
    accentInput.value  = current.accent;
    cardBgInput.value  = current.cardBg;

    // แสดง hex code
    primaryCode.textContent = current.primary;
    accentCode.textContent  = current.accent;
    cardBgCode.textContent  = current.cardBg;

    // ใช้สีเหล่านี้กับ theme ตอนเปิดหน้า settings
    applyThemeColors(current);

    // เวลาเปลี่ยนสีแบบ real-time
    primaryInput.addEventListener("input", () => {
        current.primary = primaryInput.value;
        primaryCode.textContent = current.primary;
        applyThemeColors(current);
    });

    accentInput.addEventListener("input", () => {
        current.accent = accentInput.value;
        accentCode.textContent = current.accent;
        applyThemeColors(current);
    });

    cardBgInput.addEventListener("input", () => {
        current.cardBg = cardBgInput.value;
        cardBgCode.textContent = current.cardBg;
        applyThemeColors(current);
    });

    // กดบันทึก
    saveBtn.addEventListener("click", () => {
        saveCustomColors(current);
        alert("บันทึกธีมสีเรียบร้อยแล้ว 🎨");
    });

    // กดรีเซ็ต
    resetBtn.addEventListener("click", () => {
        primaryInput.value = defaultColors.primary;
        accentInput.value  = defaultColors.accent;
        cardBgInput.value  = defaultColors.cardBg;

        primaryCode.textContent = defaultColors.primary;
        accentCode.textContent  = defaultColors.accent;
        cardBgCode.textContent  = defaultColors.cardBg;

        applyThemeColors(defaultColors);
        saveCustomColors(defaultColors);
    });
});

/* เซ็ต CSS variables ให้ทั้งเว็บ */
function applyThemeColors(colors) {
    const root = document.documentElement;
    root.style.setProperty("--tema-primary",    colors.primary);
    root.style.setProperty("--tema-accent",     colors.accent);
    root.style.setProperty("--tema-card-bg",    colors.cardBg);
}

/* โหลดสีจาก localStorage */
function loadCustomColors() {
    try {
        const raw = localStorage.getItem(THEME_COLORS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

/* เซฟสีลง localStorage */
function saveCustomColors(colors) {
    localStorage.setItem(THEME_COLORS_KEY, JSON.stringify(colors));
}
/* ======================================
   ส่วนจัดการ บัญชีผู้ใช้ + ข้อมูลในแอป
====================================== */
document.addEventListener("DOMContentLoaded", () => {
    const DISPLAY_KEY  = "temaUser";
    const SCHEDULE_KEY = "temaSchedule";
    const TASKS_KEY    = "temaTasks";

    const displayNameText = document.getElementById("displayNameText");
    const loginStatusText = document.getElementById("loginStatusText");
    const scheduleCountEl = document.getElementById("scheduleCount");
    const tasksCountEl    = document.getElementById("tasksCount");

    const changeNameBtn   = document.getElementById("changeNameBtn");
    const logoutBtn       = document.getElementById("logoutBtn");
    const clearScheduleBtn= document.getElementById("clearScheduleBtn");
    const clearTasksBtn   = document.getElementById("clearTasksBtn");
    const clearAllBtn     = document.getElementById("clearAllBtn");

    // ถ้า element พวกนี้ไม่มี (เช่นหน้าอื่น) ให้หยุด
    if (!displayNameText) return;

    // อ่านชื่อผู้ใช้ปัจจุบัน
    const currentUser = localStorage.getItem(DISPLAY_KEY);
    displayNameText.textContent = currentUser || "-";
    loginStatusText.textContent = currentUser ? "กำลังเข้าสู่ระบบ" : "ยังไม่ได้เข้าสู่ระบบ";

    // อัปเดตจำนวนข้อมูล
    function updateCounts() {
        let scheduleCount = 0;
        let tasksCount = 0;

        try {
            const sRaw = localStorage.getItem(SCHEDULE_KEY);
            const tRaw = localStorage.getItem(TASKS_KEY);
            const sArr = sRaw ? JSON.parse(sRaw) : [];
            const tArr = tRaw ? JSON.parse(tRaw) : [];
            scheduleCount = sArr.length;
            tasksCount = tArr.length;
        } catch (e) {
            // do nothing
        }

        scheduleCountEl.textContent = scheduleCount;
        tasksCountEl.textContent = tasksCount;
    }

    updateCounts();

    // เปลี่ยนชื่อผู้ใช้
    changeNameBtn.addEventListener("click", () => {
        const newName = prompt("กรอกชื่อที่ต้องการใช้แสดงในแอป", displayNameText.textContent || "");
        if (!newName) return;
        localStorage.setItem(DISPLAY_KEY, newName.trim());
        displayNameText.textContent = newName.trim();
        loginStatusText.textContent = "กำลังเข้าสู่ระบบ";
    });

    // ออกจากระบบ
    logoutBtn.addEventListener("click", () => {
        if (!confirm("คุณต้องการออกจากระบบหรือไม่?")) return;
        localStorage.removeItem(DISPLAY_KEY);
        window.location.href = "index.html";
    });

    // ลบตารางเรียน
    clearScheduleBtn.addEventListener("click", () => {
        if (!confirm("แน่ใจหรือไม่ว่าต้องการลบตารางเรียนทั้งหมด?")) return;
        localStorage.removeItem(SCHEDULE_KEY);
        updateCounts();
        alert("ลบตารางเรียนทั้งหมดเรียบร้อย");
    });

    // ลบงานทั้งหมด
    clearTasksBtn.addEventListener("click", () => {
        if (!confirm("แน่ใจหรือไม่ว่าต้องการลบงานทั้งหมด?")) return;
        localStorage.removeItem(TASKS_KEY);
        updateCounts();
        alert("ลบงานทั้งหมดเรียบร้อย");
    });

    // ลบข้อมูลทั้งหมดในแอปนี้
    clearAllBtn.addEventListener("click", () => {
        if (!confirm("ลบข้อมูลทั้งหมด (ตารางเรียน งาน ธีม ฯลฯ) ในแอปนี้หรือไม่?")) return;
        localStorage.removeItem(SCHEDULE_KEY);
        localStorage.removeItem(TASKS_KEY);
        localStorage.removeItem("temaCustomColors");
        // ไม่ลบ temaUser เผื่ออยากให้ชื่ออยู่ แต่จะลบก็ได้ถ้าคุณต้องการ
        updateCounts();
        alert("ลบข้อมูลทั้งหมดเรียบร้อย");
    });
});
