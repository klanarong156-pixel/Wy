(() => {
  const roles = { viewer: 1, operator: 2, admin: 3, owner: 4 };
  const state = { user: null, role: null, ready: false };
  function configured() { return Boolean(window.FIREBASE_AUTH_ENABLED && window.firebase); }
  async function start() {
    if (!configured()) { state.ready = true; return; }
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    const auth = firebase.auth();
    await new Promise(resolve => auth.onAuthStateChanged(async user => { state.user = user; state.role = null; if (user) { const snap = await firebase.firestore().collection('users').doc(user.uid).get(); state.role = snap.exists ? (snap.data().role || 'viewer') : 'viewer'; } state.ready = true; window.dispatchEvent(new CustomEvent('smartfarm:auth', { detail: {...state} })); resolve(); }));
  }
  function can(minRole = 'viewer') { return Boolean(state.user && roles[state.role] >= roles[minRole]); }
  function requireAuth(target = 'auth.html') { if (configured() && !state.user) location.href = target; }
  window.SmartFarmAccess = { state, configured, start, can, requireAuth, signOut: () => firebase.auth().signOut() };
  start();
})();
