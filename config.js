window.SMARTFARM = Object.freeze({
  broker: 'wss://25305924f68c41f2a1e089a1836d3287.s1.eu.hivemq.cloud:8884/mqtt',
  base: 'smartfarm',
  relays: ['pump', 'zone1', 'lighthome', 'lightsala'],
  defaults: { pump: 'ปั๊มน้ำ', zone1: 'โซน 1', lighthome: 'ไฟบ้าน', lightsala: 'ไฟศาลา' }
});
