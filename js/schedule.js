/* ============================================
   schedule.js
   - จัดการตารางเรียน
   - ใช้ร่วมกับ colorPicker.js
   - เก็บข้อมูลใน localStorage
============================================ */

// ชื่อ key สำหรับเก็บตารางเรียนและสีวิชา
const SCHEDULE_KEY = "temaSchedule";
const SUBJECT_COLOR_KEY = "subjectColors";

// element ต่าง ๆ ในหน้า schedule.html
const addClassForm = document.getElementById("addClassForm");
const classListBox = document.getElementById("classList");
const openPickerBtn = document.getElementById("openPickerBtn");
const previewColorDiv = document.getElementById("previewColor");

// เก็บค่าสีปัจจุบันที่เลือกจาก Color Picker
let currentColor = "#A7C7FF"; // ฟ้าพาสเทลค่าเริ่มต้น

// -------------------------------
// 1) ถ้ายังไม่ login → เด้งกลับหน้า index
// -------------------------------
const currentUser = localStorage.getItem("temaUser");
if (!currentUser) {
    window.location.href = "index.html";
}

// -------------------------------
// 2) โหลดข้อมูลตอนเริ่มหน้า
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // โหลดสีวิชาเดิม (ถ้ามี)
    const colors = loadSubjectColors();

    // ตั้งสี preview เริ่มต้น
    previewColorDiv.style.background = currentColor;

    // โหลดและแสดงตาราง
    renderSchedule();

    // ถ้ามี ColorPicker (มาจาก colorPicker.js) ให้ส่ง callback
    if (window.ColorPicker) {
        ColorPicker.init({
            onColorChange: (hex) => {
                // เวลาเลือกสีจาก picker ให้เอามาใส่ในตัวแปร + preview
                currentColor = hex;
                previewColorDiv.style.background = hex;
            }
        });
    }
});

// -------------------------------
// ฟังก์ชันโหลด-บันทึกตาราง (ใช้ร่วมกับ dashboard)
// -------------------------------
function loadSchedule() {
    try {
        const raw = localStorage.getItem(SCHEDULE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveSchedule(list) {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(list));
}

// โหลด/บันทึกสีวิชา
function loadSubjectColors() {
    try {
        const raw = localStorage.getItem(SUBJECT_COLOR_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveSubjectColors(map) {
    localStorage.setItem(SUBJECT_COLOR_KEY, JSON.stringify(map));
}

// -------------------------------
// 3) เปิด / ปิด Color Picker Modal
// -------------------------------
const colorModal = document.getElementById("colorPickerModal");

openPickerBtn.addEventListener("click", () => {
    // เปิด popup
    colorModal.classList.add("open");

    // ตั้งสีเริ่มต้นให้ ColorPicker ด้วย (ถ้าอยาก)
    if (window.ColorPicker) {
        ColorPicker.setColor(currentColor);
    }
});

const closePickerBtn = document.getElementById("closePickerBtn");
closePickerBtn.addEventListener("click", () => {
    colorModal.classList.remove("open");
});

// ปุ่ม "บันทึกสีนี้" ใน Color Picker
const saveColorBtn = document.getElementById("saveColorBtn");
saveColorBtn.addEventListener("click", () => {
    if (!window.ColorPicker) return;
    const hex = ColorPicker.getColor(); // รับค่าสีปัจจุบันจาก picker

    if (hex) {
        currentColor = hex;
        previewColorDiv.style.background = hex;
    }
    colorModal.classList.remove("open");
});

// ถ้าคลิกนอกกล่อง modal ให้ปิด
colorModal.addEventListener("click", (e) => {
    if (e.target === colorModal) {
        colorModal.classList.remove("open");
    }
});

// -------------------------------
// 4) เมื่อกรอกชื่อวิชา → ถ้ามีสีเก่าอยู่แล้ว ให้ดึงมาใช้
// -------------------------------
const subjectInput = document.getElementById("subject");
subjectInput.addEventListener("blur", () => {
    const name = subjectInput.value.trim();
    if (!name) return;

    const colors = loadSubjectColors();
    if (colors[name]) {
        currentColor = colors[name];
        previewColorDiv.style.background = currentColor;
    }
});

// -------------------------------
// 5) การเพิ่มคาบเรียนใหม่
// -------------------------------
addClassForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const day = document.getElementById("day").value;
    const subject = document.getElementById("subject").value.trim();
    const timeStart = document.getElementById("timeStart").value;
    const timeEnd = document.getElementById("timeEnd").value;
    const room = document.getElementById("room").value.trim();

    if (!day || !subject || !timeStart || !timeEnd) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    const schedule = loadSchedule();

    // เพิ่มข้อมูลใหม่
    schedule.push({
        day,
        subject,
        timeStart,
        timeEnd,
        room
    });

    // บันทึกสีของวิชานี้
    const colors = loadSubjectColors();
    colors[subject] = currentColor;
    saveSubjectColors(colors);

    // เซฟตาราง
    saveSchedule(schedule);

    // เคลียร์ฟอร์มบางส่วน (เก็บสีไว้เหมือนเดิม)
    // addClassForm.reset(); // ถ้าอยากให้เคลียร์หมด
    document.getElementById("subject").value = "";
    document.getElementById("timeStart").value = "";
    document.getElementById("timeEnd").value = "";
    document.getElementById("room").value = "";

    renderSchedule();
});

// -------------------------------
// 6) แสดงตารางเรียนทั้งหมด
// -------------------------------
function renderSchedule() {
    const list = loadSchedule();
    const colors = loadSubjectColors();
    classListBox.innerHTML = "";

    if (list.length === 0) {
        classListBox.innerHTML = `<p class="empty-note">ยังไม่มีคาบเรียนในตาราง</p>`;
        return;
    }

    // เรียงตาม วัน + เวลา
    const dayOrder = ["จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์","อาทิตย์"];

    const sorted = [...list].sort((a, b) => {
        const da = dayOrder.indexOf(a.day);
        const db = dayOrder.indexOf(b.day);
        if (da !== db) return da - db;
        return a.timeStart.localeCompare(b.timeStart);
    });

    sorted.forEach((cls, index) => {
        const color = colors[cls.subject] || "#A7C7FF";

        // การ์ดแต่ละคาบ
        const card = document.createElement("div");
        card.className = "class-card";

        card.style.borderLeft = `8px solid ${color}`;
        card.style.background = color + "22";

        card.innerHTML = `
            <div class="class-card-day">${cls.day}</div>
            <div class="class-card-title">${cls.subject}</div>
            <div class="class-card-subinfo">
                ${cls.timeStart}–${cls.timeEnd}
                ${cls.room ? " | ห้อง " + cls.room : ""}
            </div>
            <button class="class-card-delete">ลบ</button>
        `;

        // ปุ่มลบ
        const deleteBtn = card.querySelector(".class-card-delete");
        deleteBtn.addEventListener("click", () => {
            deleteClass(cls);
        });

        classListBox.appendChild(card);
    });
}

// -------------------------------
// 7) ลบคาบเรียน
// -------------------------------
function deleteClass(cls) {
    const list = loadSchedule();
    const idx = list.findIndex(item =>
        item.day === cls.day &&
        item.subject === cls.subject &&
        item.timeStart === cls.timeStart &&
        item.timeEnd === cls.timeEnd &&
        item.room === cls.room
    );

    if (idx > -1) {
        list.splice(idx, 1);
        saveSchedule(list);
        renderSchedule();
    }
}
