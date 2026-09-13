(function () {
  'use strict';
  const storageKey = 'smartfarm.relay.display-names.v1';
  const relays = Array.isArray(window.RELAYS) ? window.RELAYS : ['pump', 'zone1', 'lighthome', 'lightsala'];
  const defaults = Object.assign({}, window.RELAY_NAMES || {});

  function readNames() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return Object.fromEntries(relays.map(relay => {
        const value = typeof saved[relay] === 'string' ? saved[relay].trim() : '';
        return [relay, (value || defaults[relay] || relay).slice(0, 40)];
      }));
    } catch (_) {
      return Object.fromEntries(relays.map(relay => [relay, defaults[relay] || relay]));
    }
  }

  function applyNames() {
    window.RELAY_NAMES = readNames();
    relays.forEach(relay => {
      const name = window.RELAY_NAMES[relay];
      document.querySelectorAll(`[data-relay-card="${relay}"] .control-name strong`).forEach(node => { node.textContent = name; });
      document.querySelectorAll(`[data-relay-toggle="${relay}"]`).forEach(node => { node.setAttribute('aria-label', `เปิดหรือปิด${name}`); });
      document.querySelectorAll(`[data-relay-action="${relay}"]`).forEach(node => { node.setAttribute('aria-label', `เปิด${name}`); });
    });
    window.dispatchEvent(new CustomEvent('smartfarm:relay-names-changed', { detail: window.RELAY_NAMES }));
  }

  function saveNames(names) {
    const clean = Object.fromEntries(relays.map(relay => [relay, String(names[relay] || defaults[relay] || relay).trim().slice(0, 40)]));
    localStorage.setItem(storageKey, JSON.stringify(clean));
    applyNames();
  }

  function mountEditor() {
    const host = document.querySelector('[data-relay-profile-editor]');
    if (!host) return;
    const names = readNames();
    host.replaceChildren();
    relays.forEach((relay, index) => {
      const row = document.createElement('label');
      row.className = 'relay-profile-row';
      row.innerHTML = `<span>รีเลย์ ${index + 1}<small>MQTT: smartfarm/relay/${relay}</small></span>`;
      const input = document.createElement('input');
      input.type = 'text'; input.maxLength = 40; input.value = names[relay]; input.dataset.relayName = relay;
      input.setAttribute('aria-label', `ชื่อรีเลย์ ${index + 1}`);
      row.appendChild(input); host.appendChild(row);
    });
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'btn primary'; button.textContent = 'บันทึกชื่อรีเลย์';
    button.addEventListener('click', () => {
      const next = Object.fromEntries(relays.map(relay => [relay, host.querySelector(`[data-relay-name="${relay}"]`)?.value || '']));
      saveNames(next);
      button.textContent = 'บันทึกแล้ว';
      window.setTimeout(() => { button.textContent = 'บันทึกชื่อรีเลย์'; }, 1800);
    });
    host.appendChild(button);
  }

  applyNames();
  window.addEventListener('DOMContentLoaded', mountEditor);
  window.SmartFarmRelayProfiles = { readNames, saveNames, applyNames };
})();
