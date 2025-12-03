/* ============================================
   colorPicker.js
   - Hybrid: Hue + Saturation/Brightness
   - ให้ schedule.js เรียกใช้ผ่าน window.ColorPicker
============================================ */

const ColorPicker = (function(){
    const hueCanvas = document.getElementById("hueWheel");
    const sbCanvas  = document.getElementById("sbSquare");
    const hexInput  = document.getElementById("hexInput");
    const previewBox= document.getElementById("colorPreviewBox");

    if (!hueCanvas || !sbCanvas) {
        return null;
    }

    const hueCtx = hueCanvas.getContext("2d");
    const sbCtx  = sbCanvas.getContext("2d");

    // สีในรูปแบบ H, S, B (0-1 หรือ 0-360)
    let hue = 210; // เริ่มต้นฟ้าพาสเทล
    let sat = 0.5;
    let bri = 0.9;

    let onColorChangeCallback = null;

    // =============================
    // init: เริ่มต้นระบบ
    // =============================
    function init(options = {}) {
        onColorChangeCallback = options.onColorChange || null;

        drawHueWheel();
        drawSBSquare();
        updateOutputs();

        // Event - คลิกที่วงล้อ hue
        hueCanvas.addEventListener("click", hueClick);
        sbCanvas.addEventListener("click", sbClick);

        // หากเปลี่ยนค่าใน hex -> update HSB
        hexInput.addEventListener("input", onHexInputChange);
    }

    // =============================
    // วาดวงล้อ HUE
    // =============================
    function drawHueWheel() {
        const w = hueCanvas.width;
        const h = hueCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(cx, cy) - 4;

        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;
            hueCtx.beginPath();
            hueCtx.arc(cx, cy, radius, startAngle, endAngle);
            hueCtx.strokeStyle = `hsl(${angle}, 100%, 50%)`;
            hueCtx.lineWidth = 10;
            hueCtx.stroke();
        }
    }

    // =============================
    // วาด SB square ของ hue ปัจจุบัน
    // =============================
    function drawSBSquare() {
        const w = sbCanvas.width;
        const h = sbCanvas.height;

        const imageData = sbCtx.createImageData(w, h);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const s = x / (w - 1); // 0 → 1
                const b = 1 - y / (h - 1); // 1 → 0 (บนสว่าง ล่างมืด)

                const [r, g, b2] = hsbToRgb(hue, s, b);

                const index = (y * w + x) * 4;
                imageData.data[index]     = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b2;
                imageData.data[index + 3] = 255;
            }
        }

        sbCtx.putImageData(imageData, 0, 0);
    }

    // =============================
    // คลิกเลือก HUE จากวงล้อ
    // =============================
    function hueClick(e) {
        const rect = hueCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cx = hueCanvas.width / 2;
        const cy = hueCanvas.height / 2;

        const dx = x - cx;
        const dy = y - cy;

        const angle = Math.atan2(dy, dx); // -PI ถึง PI
        let deg = angle * 180 / Math.PI;
        deg = (deg + 360) % 360;

        hue = deg;
        drawSBSquare();
        updateOutputs();
    }

    // =============================
    // คลิกเลือก Sat/Bri จาก square
    // =============================
    function sbClick(e) {
        const rect = sbCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const w = sbCanvas.width;
        const h = sbCanvas.height;

        sat = Math.min(Math.max(x / (w - 1), 0), 1);
        bri = 1 - Math.min(Math.max(y / (h - 1), 0), 1);

        updateOutputs();
    }

    // =============================
    // อัปเดต Preview + HEX + callback
    // =============================
    function updateOutputs() {
        const [r, g, b] = hsbToRgb(hue, sat, bri);
        const hex = rgbToHex(r, g, b);

        previewBox.style.background = hex;
        hexInput.value = hex;

        if (onColorChangeCallback) {
            onColorChangeCallback(hex);
        }
    }

    // เมื่อผู้ใช้แก้ HEX ด้วยตัวเอง
    function onHexInputChange() {
        const val = hexInput.value.trim();
        if (!/^#([0-9a-fA-F]{6})$/.test(val)) return;

        const [r, g, b] = hexToRgb(val);
        const [h, s, br] = rgbToHsb(r, g, b);

        hue = h;
        sat = s;
        bri = br;

        drawSBSquare();
        updateOutputs();
    }

    // =============================
    // ฟังก์ชันให้ schedule.js เข้ามาใช้งาน
    // =============================
    function getColor() {
        return hexInput.value.trim();
    }

    function setColor(hex) {
        if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;

        const [r, g, b] = hexToRgb(hex);
        const [h, s, br] = rgbToHsb(r, g, b);

        hue = h;
        sat = s;
        bri = br;

        drawSBSquare();
        updateOutputs();
    }

    // =============================
    // helper: แปลงสี
    // =============================
    function hsbToRgb(h, s, v) {
        h = h / 60;
        const i = Math.floor(h);
        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));

        let r, g, b;
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    }

    function rgbToHex(r, g, b) {
        return "#" + [r,g,b].map(x => {
            const hex = x.toString(16).padStart(2, "0");
            return hex;
        }).join("");
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        return [r,g,b];
    }

    // อันนี้เป็นเวอร์ชันง่าย ๆ ของ rgb → hsb
    function rgbToHsb(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        const d = max - min;

        let h = 0;
        if (d === 0) h = 0;
        else if (max === r) h = 60 * (((g - b) / d) % 6);
        else if (max === g) h = 60 * (((b - r) / d) + 2);
        else if (max === b) h = 60 * (((r - g) / d) + 4);

        if (h < 0) h += 360;

        const s = max === 0 ? 0 : d / max;
        const v = max;

        return [h, s, v];
    }

    // ให้ object ที่ schedule.js เรียกได้
    return {
        init,
        getColor,
        setColor
    };
})();

// ให้ schedule.js ใช้งานผ่าน window.ColorPicker
window.ColorPicker = ColorPicker;
