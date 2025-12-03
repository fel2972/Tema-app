const TASKS_KEY = "temaTasks";

function loadTasks() {
    try {
        const raw = localStorage.getItem(TASKS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}
