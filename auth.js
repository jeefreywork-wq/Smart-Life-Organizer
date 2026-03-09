var SUPABASE_URL = 'https://prfpzurgbtudxazyssnu.supabase.co';
var SUPABASE_KEY = 'sb_publishable_Ts5UJQ9P8oxWfqUf1dJHeA_IjGai9na';
var TABLE        = 'slo_data';
var SESSION_KEY  = 'slo_session';
var CACHE_KEY    = 'slo_cache';

var _session = null; 
var _mem     = {}; 
var _dirty   = false;
var _writeTimer = null;

function _saveSession(s){ try{ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }catch(e){} }
function _loadSession() { try{ return JSON.parse(localStorage.getItem(SESSION_KEY)); }catch(e){ return null; } }
function _dropSession() { try{ localStorage.removeItem(SESSION_KEY); }catch(e){} }

function _saveCache(d) { try{ localStorage.setItem(CACHE_KEY, JSON.stringify(d)); }catch(e){} }
function _loadCache()  { try{ return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }catch(e){ return {}; } }
function _dropCache()  { try{ localStorage.removeItem(CACHE_KEY); }catch(e){} }

function _authHdr(token){
  return {
    'Content-Type':  'application/json',
    'apikey':        SUPABASE_KEY,
    'Authorization': 'Bearer ' + (token || ((_session && _session.access_token) || SUPABASE_KEY))
  };
}

async function _signIn(email, password) {
  var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ email: email, password: password })
  });
  return r.json();
}

async function _signUp(email, password) {
  var r = await fetch(SUPABASE_URL + '/auth/v1/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ email: email, password: password })
  });
  return r.json();
}

async function _refreshToken(rt) {
  var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ refresh_token: rt })
  });
  return r.json();
}

async function _getUser(token) {
  var r = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + token }
  });
  if (!r.ok) return null;
  return r.json();
}

function _applySession(d) {
  _session = {
    access_token:  d.access_token,
    refresh_token: d.refresh_token,
    user: { id: d.user.id, email: d.user.email }
  };
  _saveSession(_session);
}

async function _fetchRemote() {
  if (!_session) { console.warn('[SLO] fetchRemote: no session'); return null; }
  try {
    var r = await fetch(
      SUPABASE_URL + '/rest/v1/' + TABLE +
      '?user_id=eq.' + _session.user.id + '&select=data',
      { headers: _authHdr() }
    );
    if (!r.ok) {
      var txt = await r.text();
      console.error('[SLO] fetchRemote HTTP', r.status, txt);
      return null;
    }
    var rows = await r.json();
    console.log('[SLO] fetchRemote rows:', JSON.stringify(rows));
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0].data || {};
    }
    console.log('[SLO] fetchRemote: no row in DB yet');
    return null;
  } catch(e) {
    console.error('[SLO] fetchRemote exception:', e);
    return null;
  }
}

async function _writeRemote(dataObj) {
  if (!_session) { console.warn('[SLO] writeRemote: no session'); return false; }
  try {
    var body = JSON.stringify({
      user_id:    _session.user.id,
      data:       dataObj,
      updated_at: new Date().toISOString()
    });
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + TABLE, {
      method:  'POST',
      headers: Object.assign({}, _authHdr(), {
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      }),
      body: body
    });
    if (!r.ok) {
      var txt = await r.text();
      console.error('[SLO] writeRemote HTTP', r.status, txt);
      return false;
    }
    console.log('[SLO] writeRemote OK');
    return true;
  } catch(e) {
    console.error('[SLO] writeRemote error', e);
    return false;
  }
}

function getData() {
  return _mem;
}

function saveData(data) {
  _mem = data;
  _saveCache(data);
  _dirty = true;

  clearTimeout(_writeTimer);
  _writeTimer = setTimeout(function() {
    _writeRemote(_mem).then(function(ok) {
      if (ok) _dirty = false;
    });
  }, 500);
}

async function _restoreSession() {
  var stored = _loadSession();
  if (!stored || !stored.access_token) {
    console.log('[SLO] no stored session');
    return false;
  }

  var user = await _getUser(stored.access_token);
  if (user && user.id) {
    console.log('[SLO] access_token still valid for', user.email);
    _session = { access_token: stored.access_token, refresh_token: stored.refresh_token, user: { id: user.id, email: user.email } };
    _saveSession(_session);
    return true;
  }

  console.log('[SLO] access_token expired, trying refresh_token');
  if (!stored.refresh_token) { _dropSession(); return false; }
  var rd = await _refreshToken(stored.refresh_token);
  if (rd && rd.access_token && rd.user) {
    console.log('[SLO] refresh_token worked for', rd.user.email);
    _applySession(rd);
    return true;
  }

  console.log('[SLO] refresh_token also failed, session gone');
  _dropSession();
  return false;
}

async function enterApp() {
  showLoadingScreen(true);

  var local  = _loadCache();
  var remote = await _fetchRemote();

  console.log('[SLO] local cache keys:', Object.keys(local));
  console.log('[SLO] remote data keys:', remote !== null ? Object.keys(remote) : 'null (fetch failed)');

  var localHasData  = local  && Object.keys(local).length  > 0;
  var remoteHasData = remote && Object.keys(remote).length > 0;

  if (remoteHasData) {
    console.log('[SLO] using remote data');
    _mem = remote;
    _saveCache(_mem);
  } else if (localHasData) {
    console.log('[SLO] remote empty/failed, using local cache and re-uploading');
    _mem = local;
    _writeRemote(_mem);
  } else {
    console.log('[SLO] both empty, fresh start');
    _mem = {};
  }

  if (!_mem.customCategories) _mem.customCategories = [];

  var el = document.getElementById('user-email-display');
  if (el && _session) el.textContent = _session.user.email;

  showPage('home');
  renderHome();
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
    _loadingEl.innerHTML = '<div class="logo-mark">✦</div><p>Loading your data…</p>';
    document.body.appendChild(_loadingEl);
  } else if (!show && _loadingEl) {
    _loadingEl.remove();
    _loadingEl = null;
  }
}

function switchTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('form-login').classList.toggle('hidden', !isLogin);
  document.getElementById('form-signup').classList.toggle('hidden', isLogin);
  _clearMsgs();
}

function _clearMsgs() {
  ['login-error','signup-error','signup-success'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}
function _err(id, msg) { var el = document.getElementById(id); if(el){ el.textContent = msg; el.classList.remove('hidden'); } }
function _ok(id, msg)  { var el = document.getElementById(id); if(el){ el.textContent = msg; el.classList.remove('hidden'); } }

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
  _clearMsgs();
  var email = (document.getElementById('login-email').value || '').trim();
  var pw    =  document.getElementById('login-password').value || '';
  if (!email || !pw) { _err('login-error', 'Please fill in all fields.'); return; }

  setLoading('login-btn', true);
  try {
    var d = await _signIn(email, pw);
    if (!d.access_token) {
      _err('login-error', d.error_description || d.msg || 'Login failed. Check your credentials.');
    } else {
      _applySession(d);
      await enterApp();
    }
  } catch(e) {
    _err('login-error', 'Network error. Please try again.');
  }
  setLoading('login-btn', false);
}

async function handleSignup() {
  _clearMsgs();
  var email = (document.getElementById('signup-email').value    || '').trim();
  var pw    =  document.getElementById('signup-password').value || '';
  var pw2   =  document.getElementById('signup-confirm').value  || '';
  if (!email || !pw || !pw2) { _err('signup-error','Please fill in all fields.'); return; }
  if (pw.length < 6)         { _err('signup-error','Password must be at least 6 characters.'); return; }
  if (pw !== pw2)            { _err('signup-error','Passwords do not match.'); return; }

  setLoading('signup-btn', true);
  try {
    var d = await _signUp(email, pw);
    if (d.error || d.error_description) {
      _err('signup-error', d.error_description || d.msg || 'Sign up failed.');
    } else if (d.access_token && d.user) {
      _applySession(d);
      await enterApp();
    } else {
      _ok('signup-success', '✅ Account created! Check your email to confirm, then sign in.');
      setTimeout(function() { switchTab('login'); }, 3000);
    }
  } catch(e) {
    _err('signup-error', 'Network error. Please try again.');
  }
  setLoading('signup-btn', false);
}

async function handleSignOut() {
  if (_session) {
    try {
      await fetch(SUPABASE_URL + '/auth/v1/logout', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + _session.access_token }
      });
    } catch(e) {}
  }
  _session = null;
  _mem = {};
  _dropSession();
  _dropCache();
  showPage('auth');
}

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var lf = document.getElementById('form-login');
  var sf = document.getElementById('form-signup');
  if (lf && !lf.classList.contains('hidden')) handleLogin();
  if (sf && !sf.classList.contains('hidden')) handleSignup();
});

window.addEventListener('load', async function() {
  console.log('[SLO] bootstrap start');
  showLoadingScreen(true);

  var ok = await _restoreSession();
  console.log('[SLO] restoreSession =', ok);

  if (ok) {
    await enterApp();
  } else {
    showLoadingScreen(false);
    showPage('auth');
  }
  console.log('[SLO] bootstrap done');
});
