/* scheduleUtils.js */
/* ฟังก์ชันอ่านข้อมูลตารางและสีวิชาจาก localStorage */

function loadSchedule() {
    try {
        const raw = localStorage.getItem("temaSchedule");
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function loadSubjectColors() {
    try {
        const raw = localStorage.getItem("subjectColors");
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}
