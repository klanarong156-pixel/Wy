# Smart Farm สำหรับ `Wy`

ระบบนี้ต่อยอดจาก `klanarong156-pixel/New140869` สำหรับ NodeMCU ESP8266 โดยมีรีเลย์ 4 ช่อง, RTC DS3231, DHT11 และ MQTT ผ่าน HiveMQ Cloud WebSocket/TLS

## ความสามารถ

- ควบคุมรีเลย์ 4 ช่องแบบ manual และตั้งเวลาอัตโนมัติได้สูงสุด 4 ช่วงต่อช่อง
- เปลี่ยนชื่อรีเลย์จากหน้า **ตั้งค่า → ตั้งชื่อรีเลย์ 4 ช่อง** ชื่อที่เปลี่ยนจะเก็บใน browser และแสดงบน Dashboard
- MQTT slug ยังคงเป็น `pump`, `zone1`, `lighthome`, `lightsala` เพื่อไม่ทำให้ ACL/topic เดิมเสีย
- DHT11 ส่งอุณหภูมิ/ความชื้นที่ `smartfarm/sensor/dht11`
- RTC DS3231 เป็นแหล่งเวลาหลัก; NTP เป็นตัว sync/fallback และระบบจะไม่รันตารางเมื่อเวลาไม่ valid
- Emergency Stop, heartbeat, OTA safe state และการบันทึกตารางลง LittleFS

## ฮาร์ดแวร์และการต่อสาย

| อุปกรณ์ | NodeMCU | GPIO |
|---|---:|---:|
| DHT11 DATA | D2 | GPIO4 |
| DS3231 SDA | D3 | GPIO0 |
| DS3231 SCL | D4 | GPIO2 |
| Relay 1 | D5 | GPIO14 |
| Relay 2 | D6 | GPIO12 |
| Relay 3 | D7 | GPIO13 |
| Relay 4 | D8 | GPIO15 |

รีเลย์เป็น **active-low**: `LOW = ON`, `HIGH = OFF` และทุกช่องจะเริ่มต้นที่ OFF ตอนบูต ควรใช้ power supply/contactor/ฟิวส์/อุปกรณ์ป้องกันที่เหมาะสมกับโหลดไฟฟ้าจริง

## MQTT topics

- คำสั่งรีเลย์: `smartfarm/relay/{slug}/set` payload `ON` หรือ `OFF`
- สถานะรีเลย์: `smartfarm/relay/{slug}/status`
- เซ็นเซอร์: `smartfarm/sensor/dht11`
- สถานะอุปกรณ์: `smartfarm/status/device` และ `smartfarm/status/online`
- ตารางเวลา: `smartfarm/schedule/{slug}/set`
- Emergency: `smartfarm/emergency/set`

ดูรายละเอียด payload และข้อจำกัดใน `MQTT_CONTRACT_V6.md`

## การใช้งาน

1. เปิด `index.html` ผ่าน static hosting หรือ Firebase Hosting
2. เชื่อมต่อ MQTT จากหน้า Settings โดยกรอก username/password ใน browser เท่านั้น
3. อัปโหลด `SmartFarm_V6_PRODUCTION1.ino` ไปยัง NodeMCU ESP8266 พร้อมไลบรารีตาม workflow ใน `.github/workflows/validate.yml`
4. เมื่อเปิดใช้งานครั้งแรก ให้เชื่อม Wi-Fi ผ่าน AP `SmartFarm_Setup` และกรอก MQTT credentials
5. ตั้งชื่อรีเลย์และตั้งตารางจาก Dashboard

ห้าม commit MQTT password, Telegram token, OTA password หรือ Firebase secret
