# Migration notes

`Wy` ถูกสร้างจาก baseline ที่ตรวจจาก `New140869` โดยคง firmware/dashboard/MQTT contract เดิม และเพิ่ม `relay-profiles.js` กับ UI ตั้งชื่อรีเลย์แบบ local browser storage

การเปลี่ยนชื่อเป็นชื่อแสดงผลเท่านั้น ไม่เปลี่ยน MQTT slug เพราะการเปลี่ยน slug จะกระทบ HiveMQ ACL, automation และ firmware ที่ติดตั้งอยู่
