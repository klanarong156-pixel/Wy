// ใส่ค่าจาก Firebase Console > Project settings > Your apps
// ห้าม commit service-account key หรือ private key ใน repository
window.FIREBASE_CONFIG = Object.freeze({
  apiKey: 'REPLACE_WITH_FIREBASE_WEB_API_KEY',
  authDomain: 'REPLACE_WITH_FIREBASE_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
  appId: 'REPLACE_WITH_FIREBASE_WEB_APP_ID'
});
window.FIREBASE_AUTH_ENABLED = !Object.values(window.FIREBASE_CONFIG).some(value => String(value).startsWith('REPLACE_'));
