/* ============================================
   tasks.js
   - จัดการงาน / การบ้าน
   - เก็บข้อมูลใน localStorage
============================================ */

const TASKS_KEY = "temaTasks";

// element ต่าง ๆ ในหน้า tasks.html
const taskForm  = document.getElementById("taskForm");
const taskList  = document.getElementById("taskList");

// ถ้าไม่มีผู้ใช้ → เด้งกลับหน้า login (index)
const currentUser = localStorage.getItem("temaUser");
if (!currentUser) {
    window.location.href = "index.html";
}

// โหลดรายการงานครั้งแรก
document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
});

// -----------------------
// ฟังก์ชัน load/save
// -----------------------
function loadTasks() {
    try {
        const raw = localStorage.getItem(TASKS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveTasks(list) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(list));
}

// -----------------------
// เมื่อกดเพิ่มงาน
// -----------------------
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title   = document.getElementById("taskTitle").value.trim();
    const subject = document.getElementById("taskSubject").value.trim();
    const date    = document.getElementById("taskDate").value;
    const time    = document.getElementById("taskTime").value;
    const note    = document.getElementById("taskNote").value.trim();

    if (!title) {
        alert("กรุณากรอกชื่องานก่อน");
        return;
    }

    const tasks = loadTasks();

    tasks.push({
        id: Date.now(),  // ใช้เวลาเป็น id
        title,
        subject,
        date,
        time,
        note,
        done: false
    });

    saveTasks(tasks);

    // เคลียร์ฟอร์ม
    taskForm.reset();

    renderTasks();
});

// -----------------------
// แสดงรายการงานทั้งหมด
// -----------------------
function renderTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `<p class="empty-note">ยังไม่มีงานในระบบ</p>`;
        return;
    }

    // เรียงงาน: ทำยังไม่เสร็จมาก่อน → ตามวัน/เวลา
    const sorted = [...tasks].sort((a, b) => {
        // งานที่ยังไม่เสร็จมาก่อน
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }

        // ต่อด้วยวันที่
        const ad = a.date || "";
        const bd = b.date || "";
        if (ad !== bd) return ad.localeCompare(bd);

        // ต่อด้วยเวลา
        const at = a.time || "";
        const bt = b.time || "";
        return at.localeCompare(bt);
    });

    sorted.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";
        if (task.done) card.classList.add("done");

        // แปลงวันที่ให้อ่านง่าย
        let dateText = "";
        if (task.date) {
            const d = new Date(task.date);
            if (!isNaN(d.getTime())) {
                const day   = d.getDate().toString().padStart(2,"0");
                const month = (d.getMonth()+1).toString().padStart(2,"0");
                const year  = d.getFullYear();
                dateText = `${day}/${month}/${year}`;
            } else {
                dateText = task.date;
            }
        }

        const dateLine = (task.date || task.time)
            ? `ส่ง: ${dateText}${task.time ? " เวลา " + task.time : ""}`
            : "ยังไม่กำหนดวันส่ง";

        card.innerHTML = `
            <div class="task-main-row">
                <div>
                    <div class="task-title">${task.title}</div>
                    ${task.subject ? `<div class="task-subject">วิชา: ${task.subject}</div>` : ""}
                    <div class="task-date">${dateLine}</div>
                    ${task.note ? `<div class="task-note">โน้ต: ${task.note}</div>` : ""}
                </div>
                <div class="task-actions">
                    <button class="task-toggle-btn">
                        ${task.done ? "✅ เสร็จแล้ว" : "☐ ยังไม่เสร็จ"}
                    </button>
                    <button class="task-delete-btn">ลบ</button>
                </div>
            </div>
        `;

        // ปุ่ม toggle เสร็จ / ยัง
        const toggleBtn = card.querySelector(".task-toggle-btn");
        toggleBtn.addEventListener("click", () => {
            toggleTaskDone(task.id);
        });

        // ปุ่มลบ
        const deleteBtn = card.querySelector(".task-delete-btn");
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(card);
    });
}

// -----------------------
// เปลี่ยนสถานะงาน (done <-> not)
// -----------------------
function toggleTaskDone(id) {
    const tasks = loadTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;

    tasks[idx].done = !tasks[idx].done;
    saveTasks(tasks);
    renderTasks();
}

// -----------------------
// ลบงาน
// -----------------------
function deleteTask(id) {
    const tasks = loadTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
}
