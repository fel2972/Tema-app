// โหลดคาบของวันนี้ และแสดงการ์ด

loadTodaySchedule();

/* ============================
   ฟังก์ชันโหลดคาบเรียนวันนี้
============================ */
function loadTodaySchedule() {

    const all = loadSchedule();  // อ่านตารางทั้งหมดจาก localStorage
    const box = document.getElementById("todayClasses");
    const noClass = document.getElementById("noClassMsg");

    box.innerHTML = ""; // เคลียร์ก่อน

    // หาวันปัจจุบันเป็นภาษาไทย
    const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
    const today = days[new Date().getDay()];

    // หาเฉพาะคาบของวันนี้
    const todayClasses = all.filter(c => c.day === today);

    if (todayClasses.length === 0) {
        noClass.style.display = "block";
        return;
    }

    noClass.style.display = "none";

    // เรียงตามเวลา
    todayClasses.sort((a, b) => a.timeStart.localeCompare(b.timeStart));

    // สร้างการ์ดของแต่ละคาบ
    todayClasses.forEach(cls => {

        // อ่านสีประจำวิชา
        const colors = JSON.parse(localStorage.getItem("subjectColors") || "{}");
        const color = colors[cls.subject] || "#A7C7FF"; // ถ้าไม่มีใช้ฟ้าพาสเทล

        const card = document.createElement("div");
        card.className = "class-card";
        card.style.borderLeft = `8px solid ${color}`;
        card.style.background = color + "22"; // พาสเทลจาง ๆ

        card.innerHTML = `
            <div class="class-card-title">${cls.subject}</div>
            <div class="class-card-subinfo">
                ${cls.timeStart}–${cls.timeEnd}  
                ${cls.room ? " | ห้อง " + cls.room : ""}
            </div>
        `;

        box.appendChild(card);
    });
}