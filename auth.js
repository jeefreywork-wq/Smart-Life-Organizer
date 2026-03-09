var SUPABASE_URL = 'https://prfpzurgbtudxazyssnu.supabase.co';
var SUPABASE_KEY = 'sb_publishable_Ts5UJQ9P8oxWfqUf1dJHeA_IjGai9na';
var TABLE_NAME   = 'slo_data';
var SESSION_KEY  = 'slo_session';
function storeSession(data) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
}

var sb = {
  session: null,

  _headers: function() {
    var token = (sb.session && sb.session.access_token) ? sb.session.access_token : SUPABASE_KEY;
    return {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + token
    };
  },

  signUp: async function(email, password) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ email: email, password: password })
    });
    var data = await r.json();
    if (data.access_token && data.user) {
      sb.session = { access_token: data.access_token, refresh_token: data.refresh_token, user: { id: data.user.id, email: data.user.email } };
      storeSession(sb.session);
    }
    return data;
  },

  signIn: async function(email, password) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ email: email, password: password })
    });
    var data = await r.json();
    if (data.access_token && data.user) {
      sb.session = { access_token: data.access_token, refresh_token: data.refresh_token, user: { id: data.user.id, email: data.user.email } };
      storeSession(sb.session);
    }
    return data;
  },

  refreshSession: async function(refreshToken) {
    var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    var data = await r.json();
    if (data.access_token && data.user) {
      sb.session = { access_token: data.access_token, refresh_token: data.refresh_token, user: { id: data.user.id, email: data.user.email } };
      storeSession(sb.session);
      return sb.session;
    }
    return null;
  },

  restoreSession: async function() {
    var stored = loadSession();
    if (!stored || !stored.access_token) return null;
    try {
      var r = await fetch(SUPABASE_URL + '/auth/v1/user', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + stored.access_token }
      });
      if (r.ok) {
        var user = await r.json();
        sb.session = { access_token: stored.access_token, refresh_token: stored.refresh_token, user: { id: user.id, email: user.email } };
        storeSession(sb.session);
        return sb.session;
      }
    } catch(e) {}
    if (stored.refresh_token) {
      return await sb.refreshSession(stored.refresh_token);
    }
    clearSession();
    return null;
  },

  signOut: async function() {
    if (sb.session && sb.session.access_token) {
      try {
        await fetch(SUPABASE_URL + '/auth/v1/logout', {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + sb.session.access_token }
        });
      } catch(e) {}
    }
    sb.session = null;
    clearSession();
  },

  fetchData: async function() {
    if (!sb.session) return {};
    var r = await fetch(
      SUPABASE_URL + '/rest/v1/' + TABLE_NAME + '?user_id=eq.' + sb.session.user.id + '&select=data',
      { headers: sb._headers() }
    );
    if (!r.ok) return {};
    var rows = await r.json();
    if (Array.isArray(rows) && rows.length > 0) return rows[0].data || {};
    return {};
  },

  saveData: async function(dataObj) {
    if (!sb.session) return;
    var body = { user_id: sb.session.user.id, data: dataObj, updated_at: new Date().toISOString() };
    await fetch(SUPABASE_URL + '/rest/v1/' + TABLE_NAME, {
      method: 'POST',
      headers: Object.assign({}, sb._headers(), { 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(body)
    });
  }
};

var _memCache = {};
var _saveTimer = null;

function getData() {
  return _memCache;
}

function saveData(data) {
  _memCache = data;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(function() {
    sb.saveData(data).catch(function(e) { console.error('Sync error:', e); });
  }, 800);
}

function switchTab(tab) {
  var isLogin = (tab === 'login');
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('form-login').classList.toggle('hidden', !isLogin);
  document.getElementById('form-signup').classList.toggle('hidden', isLogin);
  clearAuthMessages();
}

function clearAuthMessages() {
  ['login-error', 'signup-error', 'signup-success'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}

function showAuthError(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function showAuthSuccess(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function setLoading(btnId, loading) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  var text = btn.querySelector('.btn-text');
  var ldr  = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (text) text.style.opacity = loading ? '0.5' : '1';
  if (ldr)  ldr.classList.toggle('hidden', !loading);
}

function togglePassword(inputId, btn) {
  var input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') { input.type = 'text';     btn.textContent = '🙈'; }
  else                           { input.type = 'password'; btn.textContent = '👁'; }
}

async function handleLogin() {
  clearAuthMessages();
  var email    = (document.getElementById('login-email').value    || '').trim();
  var password = (document.getElementById('login-password').value || '');
  if (!email || !password) { showAuthError('login-error', 'Please fill in all fields.'); return; }

  setLoading('login-btn', true);
  try {
    var data = await sb.signIn(email, password);
    if (data.error_description || data.error || (!data.access_token && data.msg)) {
      showAuthError('login-error', data.error_description || data.msg || 'Login failed. Check your credentials.');
    } else {
      await enterApp();
    }
  } catch(e) {
    showAuthError('login-error', 'Network error. Please try again.');
  }
  setLoading('login-btn', false);
}

async function handleSignup() {
  clearAuthMessages();
  var email    = (document.getElementById('signup-email').value    || '').trim();
  var password = (document.getElementById('signup-password').value || '');
  var confirm  = (document.getElementById('signup-confirm').value  || '');
  if (!email || !password || !confirm) { showAuthError('signup-error', 'Please fill in all fields.'); return; }
  if (password.length < 6)             { showAuthError('signup-error', 'Password must be at least 6 characters.'); return; }
  if (password !== confirm)            { showAuthError('signup-error', 'Passwords do not match.'); return; }

  setLoading('signup-btn', true);
  try {
    var data = await sb.signUp(email, password);
    if (data.error_description || data.error) {
      showAuthError('signup-error', data.error_description || data.msg || 'Sign up failed.');
    } else if (sb.session) {
      await enterApp();
    } else {
      showAuthSuccess('signup-success', '✅ Account created! Check your email to confirm, then sign in.');
      setTimeout(function() { switchTab('login'); }, 3000);
    }
  } catch(e) {
    showAuthError('signup-error', 'Network error. Please try again.');
  }
  setLoading('signup-btn', false);
}

async function handleSignOut() {
  await sb.signOut();
  _memCache = {};
  showPage('auth');
}

async function enterApp() {
  showLoadingScreen(true);
  try {
    var remoteData = await sb.fetchData();
    _memCache = (remoteData && typeof remoteData === 'object') ? remoteData : {};
    if (!_memCache.customCategories) _memCache.customCategories = [];

    var emailEl = document.getElementById('user-email-display');
    if (emailEl && sb.session) emailEl.textContent = sb.session.user.email;

    showPage('home');
    renderHome();
  } catch(e) {
    console.error('Error loading app data:', e);
    _memCache = { customCategories: [] };
    showPage('home');
    renderHome();
  }
  showLoadingScreen(false);
}

function showPage(page) {
  ['auth', 'home', 'category'].forEach(function(p) {
    var el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('hidden', p !== page);
  });
}

var _loadingEl = null;
function showLoadingScreen(show) {
  if (show && !_loadingEl) {
    _loadingEl = document.createElement('div');
    _loadingEl.className = 'loading-screen';
    _loadingEl.innerHTML = '<div class="logo-mark">✦</div><p>Loading your data\u2026</p>';
    document.body.appendChild(_loadingEl);
  } else if (!show && _loadingEl) {
    _loadingEl.remove();
    _loadingEl = null;
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var loginForm  = document.getElementById('form-login');
  var signupForm = document.getElementById('form-signup');
  if (loginForm  && !loginForm.classList.contains('hidden'))  handleLogin();
  if (signupForm && !signupForm.classList.contains('hidden')) handleSignup();
});

(async function() {
  showLoadingScreen(true);
  var session = await sb.restoreSession();
  if (session) {
    await enterApp();
  } else {
    showLoadingScreen(false);
    showPage('auth');
  }
})();
