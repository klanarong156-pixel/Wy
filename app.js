(() => {
  const cfg = window.SMARTFARM;
  const namesKey = 'smartfarm.relay.names.v1';
  let client;
  const names = (() => { try { return {...cfg.defaults, ...JSON.parse(localStorage.getItem(namesKey) || '{}')}; } catch (_) { return {...cfg.defaults}; } })();
  const $ = id => document.getElementById(id);
  const topic = path => `${cfg.base}/${path}`;
  const log = text => { $('log').textContent = `${new Date().toLocaleTimeString('th-TH')}  ${text}`; };
  function renderRelays() {
    $('relays').innerHTML = cfg.relays.map((relay, i) => `<article class="relay"><div><b>รีเลย์ ${i + 1}</b><input data-name="${relay}" value="${names[relay] || relay}" maxlength="40"><small>MQTT: ${relay}</small></div><button data-relay="${relay}" class="off">ปิด</button></article>`).join('');
    document.querySelectorAll('[data-relay]').forEach(btn => btn.onclick = () => publish(topic(`relay/${btn.dataset.relay}/set`), btn.classList.contains('on') ? 'OFF' : 'ON'));
  }
  function setRelay(relay, on) { const btn = document.querySelector(`[data-relay="${relay}"]`); if (!btn) return; btn.className = on ? 'on' : 'off'; btn.textContent = on ? 'เปิดอยู่' : 'ปิด'; const active = document.querySelectorAll('[data-relay].on').length; if ($('activeCount')) $('activeCount').textContent = `${active} / ${cfg.relays.length}`; }
  function publish(t, payload) { if (window.FIREBASE_AUTH_ENABLED && !window.SmartFarmAccess?.can("operator")) return log("ไม่มีสิทธิ์ควบคุมรีเลย์"); if (!client?.connected) return log('ยังไม่ได้เชื่อมต่อ MQTT'); client.publish(t, payload, {qos: 1, retain: false}); log(`ส่ง ${payload} → ${t}`); }
  function connect() {
    const user = $('mqttUser').value.trim(), pass = $('mqttPass').value;
    if (!user || !pass) return log('กรุณากรอก MQTT username และ password');
    client?.end(true); client = mqtt.connect(cfg.broker, { username: user, password: pass, clientId: `SmartFarmWeb-${Math.random().toString(16).slice(2)}`, clean: true, reconnectPeriod: 3000 });
    client.on('connect', () => { $('mqttStatus').textContent = 'MQTT เชื่อมต่อแล้ว'; client.subscribe(`${cfg.base}/#`); log('เชื่อมต่อ MQTT สำเร็จ'); });
    client.on('close', () => { $('mqttStatus').textContent = 'MQTT หลุดการเชื่อมต่อ'; });
    client.on('error', e => log(`MQTT error: ${e.message}`));
    client.on('message', (t, raw) => {
      const p = raw.toString();
      const m = t.match(/^smartfarm\/relay\/([^/]+)\/status$/); if (m) setRelay(m[1], p.toUpperCase() === 'ON');
      if (t === topic('sensor/dht11')) { try { const d = JSON.parse(p); $('temperature').textContent = `${Number(d.temperature).toFixed(1)} °C`; $('humidity').textContent = `${Number(d.humidity).toFixed(0)} %`; } catch (_) {} }
      if (t === topic('status/online')) { const on = p.toLowerCase() === 'true'; $('deviceStatus').textContent = `ESP8266 ${on ? 'ออนไลน์' : 'ออฟไลน์'}`; $('deviceStatus').className = `pill ${on ? 'on' : 'off'}`; }
      if (t === topic('time')) $('deviceTime').textContent = p;
    });
  }
  $('connectBtn').onclick = connect;
  $('saveNames').onclick = () => { document.querySelectorAll('[data-name]').forEach(input => { names[input.dataset.name] = input.value.trim() || cfg.defaults[input.dataset.name]; }); localStorage.setItem(namesKey, JSON.stringify(names)); log('บันทึกชื่อรีเลย์แล้ว'); };
  renderRelays();
})();
