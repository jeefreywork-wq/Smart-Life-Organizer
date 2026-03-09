var SUPABASE_URL = 'https://prfpzurgbtudxazyssnu.supabase.co';
var SUPABASE_KEY = 'sb_publishable_Ts5UJQ9P8oxWfqUf1dJHeA_IjGai9na';
var TABLE_NAME   = 'slo_data';
var SESSION_KEY  = 'slo_session';
var CACHE_KEY    = 'slo_cache';

function storeSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch(e) {} }
function loadSession()   { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; } }
function clearSession()  { try { localStorage.removeItem(SESSION_KEY); } catch(e) {} }

function storeCacheLocal(d) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch(e) {} }
function loadCacheLocal()   { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch(e) { return {}; } }
function clearCacheLocal()  { try { localStorage.removeItem(CACHE_KEY); } catch(e) {} }

var sb = {
  session: null,

  _h: function() {
    var token = sb.session ? sb.session.access_token : SUPABASE_KEY;
    return { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + token };
  },

  signIn: async function(email, password) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ email, password })
    });
    var d = await r.json();
    if (d.access_token) {
      sb.session = { access_token: d.access_token, refresh_token: d.refresh_token, user: { id: d.user.id, email: d.user.email } };
      storeSession(sb.session);
    }
    return d;
  },

  signUp: async function(email, password) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ email, password })
    });
    var d = await r.json();
    if (d.access_token) {
      sb.session = { access_token: d.access_token, refresh_token: d.refresh_token, user: { id: d.user.id, email: d.user.email } };
      storeSession(sb.session);
    }
    return d;
  },

  refresh: async function(refresh_token) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ refresh_token })
    });
    var d = await r.json();
    if (d.access_token) {
      sb.session = { access_token: d.access_token, refresh_token: d.refresh_token, user: { id: d.user.id, email: d.user.email } };
      storeSession(sb.session);
      return true;
    }
    return false;
  },

  restoreSession: async function() {
    var s = loadSession();
    if (!s) return false;
    try {
      var r = await fetch(SUPABASE_URL + '/auth/v1/user', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + s.access_token }
      });
      if (r.ok) {
        var u = await r.json();
        sb.session = { access_token: s.access_token, refresh_token: s.refresh_token, user: { id: u.id, email: u.email } };
        storeSession(sb.session);
        return true;
      }
    } catch(e) {}
    if (s.refresh_token) return await sb.refresh(s.refresh_token);
    clearSession();
    return false;
  },

  signOut: async function() {
    try {
      if (sb.session) await fetch(SUPABASE_URL + '/auth/v1/logout', {
        method: 'POST', headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + sb.session.access_token }
      });
    } catch(e) {}
    sb.session = null;
    clearSession();
    clearCacheLocal();
  },

  fetchData: async function() {
    if (!sb.session) return null;
    var r = await fetch(
      SUPABASE_URL + '/rest/v1/' + TABLE_NAME + '?user_id=eq.' + sb.session.user.id + '&select=data',
      { headers: sb._h() }
    );
    if (!r.ok) { console.error('fetchData failed', r.status, await r.text()); return null; }
    var rows = await r.json();
    return (Array.isArray(rows) && rows.length > 0) ? (rows[0].data || {}) : {};
  },

  writeData: async function(dataObj) {
    if (!sb.session) return false;
    var body = JSON.stringify({ user_id: sb.session.user.id, data: dataObj, updated_at: new Date().toISOString() });
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + TABLE_NAME, {
      method: 'POST',
      headers: Object.assign({}, sb._h(), { 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
      body: body
    });
    if (!r.ok) {
      var txt = await r.text();
      console.error('writeData failed', r.status, txt);
      return false;
    }
    return true;
  }
};

var _mem = {};
var _saveTimer = null;

function getData() {
  return _mem;
}

function saveData(data) {
  _mem = data;

  storeCacheLocal(data);

  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async function() {
    var ok = await sb.writeData(data).catch(function(e) { console.error('writeData error', e); return false; });
    if (!ok) console.warn('Remote save failed — data is safe in localStorage backup.');
  }, 600);
}

function switchTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('form-login').classList.toggle('hidden', !isLogin);
  document.getElementById('form-signup').classList.toggle('hidden', isLogin);
  clearAuthMessages();
}

function clearAuthMessages() {
  ['login-error','signup-error','signup-success'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}

function showAuthError(id, msg) {
  var el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function showAuthSuccess(id, msg) {
  var el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function setLoading(btnId, on) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = on;
  var t = btn.querySelector('.btn-text'), l = btn.querySelector('.btn-loader');
  if (t) t.style.opacity = on ? '0.5' : '1';
  if (l) l.classList.toggle('hidden', !on);
}

function togglePassword(inputId, btn) {
  var el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

async function handleLogin() {
  clearAuthMessages();
  var email = (document.getElementById('login-email').value || '').trim();
  var pw    = document.getElementById('login-password').value || '';
  if (!email || !pw) { showAuthError('login-error', 'Please fill in all fields.'); return; }
  setLoading('login-btn', true);
  try {
    var d = await sb.signIn(email, pw);
    if (!d.access_token) {
      showAuthError('login-error', d.error_description || d.msg || 'Login failed. Check your credentials.');
    } else {
      await enterApp();
    }
  } catch(e) { showAuthError('login-error', 'Network error. Please try again.'); }
  setLoading('login-btn', false);
}

async function handleSignup() {
  clearAuthMessages();
  var email = (document.getElementById('signup-email').value    || '').trim();
  var pw    = document.getElementById('signup-password').value  || '';
  var pw2   = document.getElementById('signup-confirm').value   || '';
  if (!email || !pw || !pw2)  { showAuthError('signup-error', 'Please fill in all fields.'); return; }
  if (pw.length < 6)          { showAuthError('signup-error', 'Password must be at least 6 characters.'); return; }
  if (pw !== pw2)             { showAuthError('signup-error', 'Passwords do not match.'); return; }
  setLoading('signup-btn', true);
  try {
    var d = await sb.signUp(email, pw);
    if (d.error || d.error_description) {
      showAuthError('signup-error', d.error_description || d.msg || 'Sign up failed.');
    } else if (sb.session) {
      await enterApp();
    } else {
      showAuthSuccess('signup-success', '✅ Account created! Check your email to confirm, then sign in.');
      setTimeout(function() { switchTab('login'); }, 3000);
    }
  } catch(e) { showAuthError('signup-error', 'Network error. Please try again.'); }
  setLoading('signup-btn', false);
}

async function handleSignOut() {
  await sb.signOut();
  _mem = {};
  showPage('auth');
}

async function enterApp() {
  showLoadingScreen(true);
  try {
    var remote = await sb.fetchData();

    if (remote !== null && typeof remote === 'object') {
      _mem = remote;
      storeCacheLocal(_mem);
    } else {
      console.warn('Supabase fetch failed, using local cache');
      _mem = loadCacheLocal();
    }

    if (!_mem.customCategories) _mem.customCategories = [];

    var emailEl = document.getElementById('user-email-display');
    if (emailEl && sb.session) emailEl.textContent = sb.session.user.email;

    showPage('home');
    renderHome();
  } catch(e) {
    console.error('enterApp error:', e);
    _mem = loadCacheLocal();
    if (!_mem.customCategories) _mem.customCategories = [];
    showPage('home');
    renderHome();
  }
  showLoadingScreen(false);
}

function showPage(page) {
  ['auth','home','category'].forEach(function(p) {
    var el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('hidden', p !== page);
  });
}

var _loadingEl = null;
function showLoadingScreen(show) {
  if (show && !_loadingEl) {
    _loadingEl = document.createElement('div');
    _loadingEl.className = 'loading-screen';
    _loadingEl.innerHTML = '<div class="logo-mark">\u2726</div><p>Loading your data\u2026</p>';
    document.body.appendChild(_loadingEl);
  } else if (!show && _loadingEl) {
    _loadingEl.remove();
    _loadingEl = null;
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var lf = document.getElementById('form-login');
  var sf = document.getElementById('form-signup');
  if (lf && !lf.classList.contains('hidden')) handleLogin();
  if (sf && !sf.classList.contains('hidden')) handleSignup();
});

window.addEventListener('load', async function() {
  showLoadingScreen(true);
  var ok = await sb.restoreSession();
  if (ok) {
    await enterApp();
  } else {
    showLoadingScreen(false);
    showPage('auth');
  }
});
