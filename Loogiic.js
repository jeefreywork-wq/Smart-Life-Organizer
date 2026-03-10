var firebaseConfig = {
  apiKey: "AIzaSyC5gkCjHI0kRkilUSSPaW1VbqREiFYiZAU",
  authDomain: "todolist-315e6.firebaseapp.com",
  projectId: "todolist-315e6",
  storageBucket: "todolist-315e6.firebasestorage.app",
  messagingSenderId: "1063693394482",
  appId: "1:1063693394482:web:a5a8c98667cac5dcb8922b",
  measurementId: "G-QJR2BV5DVW"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db   = firebase.firestore();

function switchAuthTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('form-login').classList.toggle('hidden', !isLogin);
  document.getElementById('form-signup').classList.toggle('hidden', isLogin);
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  clearAuthErrors();
}

function clearAuthErrors() {
  ['login-error','signup-error'].forEach(function(id) {
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

function setAuthLoading(btnId, loading) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading
    ? (btnId === 'login-btn' ? 'Signing in…' : 'Creating account…')
    : (btnId === 'login-btn' ? 'Sign In' : 'Create Account');
}

function handleLogin() {
  var email    = (document.getElementById('login-email').value || '').trim();
  var password = document.getElementById('login-password').value || '';
  if (!email || !password) { showAuthError('login-error', 'Please fill in all fields.'); return; }
  clearAuthErrors();
  setAuthLoading('login-btn', true);
  auth.signInWithEmailAndPassword(email, password)
    .catch(function(err) {
      setAuthLoading('login-btn', false);
      showAuthError('login-error', friendlyAuthError(err.code));
    });
}

function handleSignup() {
  var name     = (document.getElementById('signup-name').value || '').trim();
  var email    = (document.getElementById('signup-email').value || '').trim();
  var password = document.getElementById('signup-password').value || '';
  if (!name || !email || !password) { showAuthError('signup-error', 'Please fill in all fields.'); return; }
  if (password.length < 6) { showAuthError('signup-error', 'Password must be at least 6 characters.'); return; }
  clearAuthErrors();
  setAuthLoading('signup-btn', true);
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(cred) {
      return cred.user.updateProfile({ displayName: name });
    })
    .catch(function(err) {
      setAuthLoading('signup-btn', false);
      showAuthError('signup-error', friendlyAuthError(err.code));
    });
}

function handleGoogleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(function(err) {
    showAuthError('login-error', friendlyAuthError(err.code));
    showAuthError('signup-error', friendlyAuthError(err.code));
  });
}

function handleSignOut() {
  auth.signOut();
}

function friendlyAuthError(code) {
  var map = {
    'auth/user-not-found':      'No account found with this email.',
    'auth/wrong-password':      'Incorrect password.',
    'auth/invalid-email':       'Invalid email address.',
    'auth/email-already-in-use':'This email is already registered.',
    'auth/weak-password':       'Password is too weak.',
    'auth/too-many-requests':   'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user':'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':  'Incorrect email or password.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

auth.onAuthStateChanged(function(user) {
  document.getElementById('loading-overlay').style.display = 'none';

  if (user) {
    document.getElementById('page-auth').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    var displayName = user.displayName || user.email.split('@')[0];
    document.getElementById('user-name').textContent = displayName;
    var avatarEl = document.getElementById('user-avatar');
    if (user.photoURL) {
      avatarEl.innerHTML = '<img src="' + user.photoURL + '" alt="avatar">';
      avatarEl.style.padding = '0';
    } else {
      avatarEl.textContent = displayName.charAt(0).toUpperCase();
    }

    currentUserId = user.uid;
    initApp();
  } else {
    document.getElementById('page-auth').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    currentUserId = null;
  }
});

var currentUserId = null;

var BUILT_IN_CATEGORIES = [
  { id: 'school',   name: 'School',        icon: '🎓', builtIn: true },
  { id: 'shopping', name: 'Shopping',      icon: '🛍️', builtIn: true },
  { id: 'food',     name: 'Food',          icon: '🍽️', builtIn: true },
  { id: 'gym',      name: 'Gym',           icon: '💪', builtIn: true },
  { id: 'travel',   name: 'Travel',        icon: '✈️', builtIn: true },
  { id: 'wishlist', name: 'Wishlist',      icon: '⭐', builtIn: true },
  { id: 'health',   name: 'Health',        icon: '🏥', builtIn: true },
  { id: 'movies',   name: 'Movies/Series', icon: '🎬', builtIn: true },
  { id: 'events',   name: 'Events',        icon: '🎉', builtIn: true },
  { id: 'work',     name: 'Work',          icon: '💼', builtIn: true },
];

var INGREDIENT_TYPES = ['Vegetables','Fruits','Dairy','Meat','Grains','Spices','Drinks','Other'];
var INGREDIENT_ICONS = {
  Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', Meat: '🥩',
  Grains: '🌾', Spices: '🌶️', Drinks: '🥤', Other: '🛒'
};

var SHOPPING_CATS = ['Makeup','Skincare','Food','Clothes','Electronics','Books','Pharmacy','Other'];

var SCHEMAS = {
  school: {
    addLabel: 'Add Entry',
    columns: [
      { key: 'subject',   label: 'Subject' },
      { key: 'studyTime', label: 'Study Time' },
      { key: 'topics',    label: 'Topics' },
    ],
    fields: [
      { key: 'subject',   label: 'Subject',    type: 'text',   required: true, placeholder: 'e.g. Math' },
      { key: 'studyTime', label: 'Study Time', type: 'select', required: true,
        options: ['< 1 hour','1h – 2h','2h – 3h','3h+','Custom...'] },
      { key: 'topics',    label: 'Topics (one per line)', type: 'textarea', placeholder: 'e.g. Chapter 3\nSolve exercises\nRevise notes' },
    ],
    isSchool: true,
  },

  shopping: {
    addLabel: 'Add Item',
    columns: [
      { key: 'image',    label: '',        type: 'image' },
      { key: 'itemName', label: 'Item Name' },
      { key: 'category', label: 'Category' },
      { key: 'price',    label: 'Price (MAD)', type: 'price' },
    ],
    fields: [
      { key: 'itemName', label: 'Item Name', type: 'text',   required: true,  placeholder: 'e.g. Lipstick' },
      { key: 'category', label: 'Category',  type: 'select', required: true,  options: SHOPPING_CATS },
      { key: 'price',    label: 'Price (MAD)', type: 'number', placeholder: '0.00' },
      { key: 'image',    label: 'Photo (optional)', type: 'file' },
    ],
    hasTotals: true,
    hasFilter: true,
    filterKey: 'category',
    filterOptions: SHOPPING_CATS,
  },

  food: {
    addLabel: 'Add Ingredient',
    columns: [
      { key: 'recipeName',     label: 'Recipe Name' },
      { key: 'ingredient',     label: 'Ingredient' },
      { key: 'ingredientType', label: 'Type',  type: 'badge' },
      { key: 'price',          label: 'Price', type: 'price' },
    ],
    fields: [
      { key: 'recipeName',     label: 'Recipe Name',     type: 'text',   required: true, placeholder: 'e.g. Pizza' },
      { key: 'ingredient',     label: 'Ingredient',      type: 'text',   required: true, placeholder: 'e.g. Tomato' },
      { key: 'ingredientType', label: 'Ingredient Type', type: 'select', required: true, options: INGREDIENT_TYPES },
      { key: 'price',          label: 'Price (optional)', type: 'number', placeholder: '0.00' },
    ],
    hasGrocery: true,
    hasFilter: true,
    filterKey: 'recipeName',
    filterType: 'search_filter',
  },

  gym: {
    addLabel: 'Add Exercise',
    columns: [
      { key: 'exercise',    label: 'Exercise' },
      { key: 'muscleGroup', label: 'Muscle Group', type: 'badge' },
      { key: 'sets',        label: 'Sets' },
      { key: 'reps',        label: 'Reps' },
      { key: 'duration',    label: 'Duration' },
    ],
    fields: [
      { key: 'exercise',    label: 'Exercise Name', type: 'text',   required: true, placeholder: 'e.g. Bench Press' },
      { key: 'muscleGroup', label: 'Muscle Group',  type: 'select', required: true,
        options: ['Chest','Back','Legs','Shoulders','Arms','Cardio','Core','Full Body','Glutes'] },
      { key: 'sets',     label: 'Sets',     type: 'number', placeholder: '3' },
      { key: 'reps',     label: 'Reps',     type: 'number', placeholder: '10' },
      { key: 'duration', label: 'Duration', type: 'text',   placeholder: 'e.g. 45 min' },
    ],
  },

  travel: {
    addLabel: 'Add Destination',
    columns: [
      { key: 'destination', label: 'Destination' },
      { key: 'date',        label: 'Date' },
      { key: 'duration',    label: 'Duration' },
      { key: 'budget',      label: 'Budget (MAD)', type: 'price' },
      { key: 'status',      label: 'Status', type: 'status' },
      { key: 'notes',       label: 'Notes' },
    ],
    fields: [
      { key: 'destination', label: 'Destination', type: 'text', required: true, placeholder: 'e.g. Paris' },
      { key: 'date',        label: 'Travel Date',  type: 'date' },
      { key: 'duration',    label: 'Duration',     type: 'text', placeholder: 'e.g. 1 week' },
      { key: 'budget',      label: 'Budget (MAD)', type: 'number', placeholder: '5000' },
      { key: 'status',      label: 'Status',       type: 'select',
        options: ['Planning','Booked','In Progress','Completed','Cancelled'] },
      { key: 'notes',       label: 'Notes',        type: 'textarea', placeholder: 'Optional notes...' },
    ],
  },

  wishlist: {
    addLabel: 'Add Item',
    columns: [
      { key: 'itemName',  label: 'Item Name' },
      { key: 'category',  label: 'Category', type: 'badge' },
      { key: 'price',     label: 'Est. Price (MAD)', type: 'price' },
      { key: 'priority',  label: 'Priority', type: 'status' },
      { key: 'link',      label: 'Link', type: 'link' },
    ],
    fields: [
      { key: 'itemName',  label: 'Item Name', type: 'text', required: true, placeholder: 'e.g. AirPods Pro' },
      { key: 'category',  label: 'Category',  type: 'select', required: true,
        options: ['Electronics','Clothes','Books','Shoes','Beauty','Home','Sports','Other'] },
      { key: 'price',     label: 'Est. Price (MAD)', type: 'number', placeholder: '0.00' },
      { key: 'priority',  label: 'Priority',  type: 'select', options: ['High','Medium','Low'] },
      { key: 'link',      label: 'Link (optional)',  type: 'text', placeholder: 'https://...' },
    ],
    hasTotals: true,
    totalsKey: 'category',
    totalsLabel: 'Wishlist',
  },

  health: {
    addLabel: 'Add Entry',
    columns: [
      { key: 'type',        label: 'Type', type: 'status' },
      { key: 'name',        label: 'Name / Doctor / Medication' },
      { key: 'date',        label: 'Date' },
      { key: 'time',        label: 'Time' },
      { key: 'dosage',      label: 'Dosage / Location' },
      { key: 'status',      label: 'Status', type: 'status' },
    ],
    fields: [
      { key: 'type', label: 'Type', type: 'select', required: true,
        options: ['Appointment','Medication','Test / Analysis','Surgery','Other'] },
      { key: 'name', label: 'Name / Doctor / Medication', type: 'text', required: true,
        placeholder: 'e.g. Dr. Ahmed – Dentist' },
      { key: 'date',   label: 'Date',             type: 'date' },
      { key: 'time',   label: 'Time',             type: 'text', placeholder: 'e.g. 10:30 AM' },
      { key: 'dosage', label: 'Dosage / Location',type: 'text', placeholder: 'e.g. 500mg twice/day' },
      { key: 'status', label: 'Status',           type: 'select',
        options: ['Upcoming','Completed','Cancelled','Recurring'] },
    ],
  },

  movies: {
    addLabel: 'Add Title',
    columns: [
      { key: 'title',  label: 'Title' },
      { key: 'type',   label: 'Type', type: 'badge' },
      { key: 'genre',  label: 'Genre', type: 'badge' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'rating', label: 'Rating' },
    ],
    fields: [
      { key: 'title',  label: 'Title',  type: 'text', required: true, placeholder: 'e.g. Inception' },
      { key: 'type',   label: 'Type',   type: 'select', required: true,
        options: ['Movie','Series','Documentary','Anime','Short Film'] },
      { key: 'genre',  label: 'Genre',  type: 'select',
        options: ['Action','Comedy','Drama','Horror','Sci-Fi','Romance','Thriller','Fantasy','Animation','Other'] },
      { key: 'status', label: 'Status', type: 'select',
        options: ['Want to Watch','Watching','Watched','Dropped'] },
      { key: 'rating', label: 'Rating (1-10)', type: 'text', placeholder: 'e.g. 9/10' },
    ],
    hasFilter: true,
    filterKey: 'status',
    filterType: 'select_filter',
    filterOptions: ['Want to Watch','Watching','Watched','Dropped'],
    noDone: true,
  },

  events: {
    addLabel: 'Add Event',
    columns: [
      { key: 'eventName', label: 'Event Name' },
      { key: 'type',      label: 'Type', type: 'badge' },
      { key: 'date',      label: 'Date' },
      { key: 'time',      label: 'Time' },
      { key: 'location',  label: 'Location' },
      { key: 'status',    label: 'Status', type: 'status' },
      { key: 'notes',     label: 'Notes' },
    ],
    fields: [
      { key: 'eventName', label: 'Event Name', type: 'text', required: true, placeholder: "e.g. Sara's Birthday" },
      { key: 'type',      label: 'Type',       type: 'select', required: true,
        options: ['Birthday','Concert','Show','Wedding','Sports','Trip','Party','Meeting','Other'] },
      { key: 'date',      label: 'Date',       type: 'date' },
      { key: 'time',      label: 'Time',       type: 'text', placeholder: 'e.g. 7:00 PM' },
      { key: 'location',  label: 'Location',   type: 'text', placeholder: 'e.g. Casablanca' },
      { key: 'status',    label: 'Status',     type: 'select',
        options: ['Upcoming','Confirmed','Attended','Missed','Cancelled'] },
      { key: 'notes',     label: 'Notes',      type: 'textarea', placeholder: 'Gift ideas, notes...' },
    ],
  },

  work: {
    addLabel: 'Log Work Day',
    columns: [
      { key: 'date',    label: 'Date' },
      { key: 'day',     label: 'Day' },
      { key: 'hours',   label: 'Hours Worked', type: 'workhours' },
      { key: 'notes',   label: 'Notes' },
    ],
    fields: [
      { key: 'date',    label: 'Date',           type: 'date',   required: true },
      { key: 'day',     label: 'Day of Week',    type: 'select', required: true,
        options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
      { key: 'hours',   label: 'Hours',          type: 'number', required: true, placeholder: 'e.g. 8' },
      { key: 'minutes', label: 'Minutes',        type: 'number', required: false, placeholder: '0' },
      { key: 'notes',   label: 'Notes',          type: 'textarea', placeholder: 'Optional notes...' },
    ],
    hasWorkSummary: true,
    noDone: true,
  },

  custom: {
    addLabel: 'Add Item',
    columns: [
      { key: 'name',   label: 'Name' },
      { key: 'detail', label: 'Detail' },
      { key: 'notes',  label: 'Notes' },
    ],
    fields: [
      { key: 'name',   label: 'Name',   type: 'text',     required: true, placeholder: 'Item name' },
      { key: 'detail', label: 'Detail', type: 'text',     placeholder: 'Details...' },
      { key: 'notes',  label: 'Notes',  type: 'textarea', placeholder: 'Notes...' },
    ],
  },
};

var appCache = {
  customCategories: [],
  items: {}
};

var state = {
  selectedCategoryId: null,
  currentCategoryId: null,
  editingItemId: null,
  pendingImageData: null,
  loaded: false,
};

function userDoc() {
  return db.collection('users').doc(currentUserId);
}

function loadUserData() {
  return Promise.all([
    userDoc().collection('meta').doc('config').get(),
    userDoc().collection('items').get()
  ]).then(function(results) {
    var configSnap = results[0];
    var itemsSnap  = results[1];

    appCache.customCategories = configSnap.exists
      ? (configSnap.data().customCategories || [])
      : [];

    appCache.items = {};
    itemsSnap.forEach(function(doc) {
      appCache.items[doc.id] = doc.data().items || [];
    });

    state.loaded = true;
  });
}

function saveCustomCategories() {
  return userDoc().collection('meta').doc('config').set({
    customCategories: appCache.customCategories
  });
}

function saveCategoryItems(categoryId) {
  return userDoc().collection('items').doc(categoryId).set({
    items: appCache.items[categoryId] || []
  });
}

function getCategories() {
  return BUILT_IN_CATEGORIES.concat(appCache.customCategories);
}

function getItems(categoryId) {
  return appCache.items[categoryId] || [];
}

function saveItems(categoryId, items) {
  appCache.items[categoryId] = items;
  return saveCategoryItems(categoryId);
}

function getSchema(category) {
  return SCHEMAS[category.id] || SCHEMAS.custom;
}

function showHome() {
  state.currentCategoryId = null;
  document.getElementById('page-home').classList.remove('hidden');
  document.getElementById('page-category').classList.add('hidden');
  renderHome();
}

function showCategory(categoryId) {
  state.currentCategoryId = categoryId;
  document.getElementById('page-home').classList.add('hidden');
  document.getElementById('page-category').classList.remove('hidden');
  renderCategory(categoryId);
}

function openSelectedCategory() {
  if (state.selectedCategoryId) showCategory(state.selectedCategoryId);
}

function renderHome() {
  var categories = getCategories();
  var grid    = document.getElementById('category-grid');
  var openBtn = document.getElementById('open-btn');

  grid.innerHTML = categories.map(function(cat) {
    var count = getItems(cat.id).length;
    var isSelected = state.selectedCategoryId === cat.id;
    return '<div class="category-card' + (isSelected ? ' selected' : '') + '" ' +
      'onclick="selectCategory(\'' + cat.id + '\')" ' +
      'ondblclick="showCategory(\'' + cat.id + '\')">' +
      (cat.builtIn ? '' : '<button class="card-delete-btn" onclick="deleteCategoryCard(event,\'' + cat.id + '\')">✕</button>') +
      '<div class="card-icon">' + cat.icon + '</div>' +
      '<div class="card-name">' + escapeHtml(cat.name) + '</div>' +
      '<div class="card-count">' + count + ' item' + (count !== 1 ? 's' : '') + '</div>' +
      '</div>';
  }).join('');

  if (openBtn) openBtn.disabled = !state.selectedCategoryId;
}

function selectCategory(id) {
  state.selectedCategoryId = (state.selectedCategoryId === id) ? null : id;
  if (state.selectedCategoryId === id) {
    showCategory(id);
  } else {
    renderHome();
  }
}

function deleteCategoryCard(event, id) {
  event.stopPropagation();
  if (!confirm('Delete this category and all its data?')) return;
  appCache.customCategories = appCache.customCategories.filter(function(c) { return c.id !== id; });
  delete appCache.items[id];
  Promise.all([
    saveCustomCategories(),
    userDoc().collection('items').doc(id).delete()
  ]).catch(function(e) { console.error('Delete category error:', e); });
  if (state.selectedCategoryId === id) state.selectedCategoryId = null;
  renderHome();
}

function showAddCategoryModal() {
  showModal(
    '<div class="modal-title">Add Category</div>' +
    '<div class="form-group">' +
      '<label class="form-label">Category Name</label>' +
      '<input class="form-input" id="new-cat-name" type="text" placeholder="e.g. Finance, Health..." autofocus>' +
    '</div>' +
    '<div class="form-group">' +
      '<label class="form-label">Icon (emoji)</label>' +
      '<input class="form-input" id="new-cat-icon" type="text" placeholder="e.g. 💰" maxlength="4">' +
    '</div>' +
    '<div class="form-actions">' +
      '<button class="btn-outline" onclick="closeModal()">Cancel</button>' +
      '<button class="btn-primary" onclick="submitNewCategory()">Add Category</button>' +
    '</div>'
  );
  setTimeout(function() {
    var el = document.getElementById('new-cat-name');
    if (el) el.focus();
  }, 100);
}

function submitNewCategory() {
  var name = (document.getElementById('new-cat-name').value || '').trim();
  var icon = (document.getElementById('new-cat-icon').value || '').trim() || '📋';
  if (!name) { alert('Please enter a category name.'); return; }

  var id = 'custom_' + Date.now();
  appCache.customCategories.push({ id: id, name: name, icon: icon, builtIn: false });
  saveCustomCategories().catch(function(e) { console.error('Save categories error:', e); });
  closeModal();
  renderHome();
}

function renderCategory(categoryId) {
  var cat = getCategories().find(function(c) { return c.id === categoryId; });
  if (!cat) { showHome(); return; }
  var schema = getSchema(cat);
  var items  = getItems(categoryId);

  var topbarExtra = '';
  if (schema.hasGrocery) {
    topbarExtra += '<button class="btn-outline btn-small" onclick="showGroceryList()">🛒 Grocery List</button>';
  }

  var html = '<div class="cat-page">' +
    '<div class="cat-topbar">' +
      '<button class="back-btn" onclick="showHome()">← Back</button>' +
      '<div class="cat-title">' + cat.icon + ' ' + escapeHtml(cat.name) + '</div>' +
      topbarExtra +
      '<button class="btn-primary btn-small" onclick="showAddItemModal()">' + schema.addLabel + '</button>' +
    '</div>' +
    '<div class="cat-body">' +
      buildTableControls(schema, items) +
      '<div class="table-wrapper"><div class="table-scroll">' +
        buildTable(schema, items) +
      '</div></div>' +
      (schema.hasTotals ? buildPriceTotals(schema, items, '') : '') +
      (schema.hasWorkSummary ? buildWorkSummary(items) : '') +
    '</div>' +
  '</div>';

  document.getElementById('category-content').innerHTML = html;
}

function buildTableControls(schema, items) {
  var html = '<div class="table-controls">';
  html += '<input class="search-box" type="text" placeholder="Search…" oninput="filterTable(this)">';

  if (schema.hasFilter && schema.filterType === 'select_filter') {
    html += '<select class="filter-select" onchange="filterTable(this)">' +
      '<option value="">All</option>' +
      (schema.filterOptions || []).map(function(o) {
        return '<option value="' + escapeAttr(o) + '">' + escapeHtml(o) + '</option>';
      }).join('') +
    '</select>';
  }
  html += '</div>';
  return html;
}

var _filterSearch = '';
var _filterSelect = '';

function filterTable(el) {
  if (el.tagName === 'INPUT') _filterSearch = el.value.toLowerCase();
  else _filterSelect = el.value;

  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  var schema = getSchema(cat);
  var items  = getItems(state.currentCategoryId);
  var wrapper = document.querySelector('.table-scroll');
  if (wrapper) wrapper.innerHTML = buildTable(schema, items);
}

function buildTable(schema, items) {
  var search = _filterSearch;
  var filter = _filterSelect;
  var filterKey = schema.filterKey || 'category';

  var filtered = items.filter(function(item) {
    var matchSearch = !search || Object.values(item).some(function(v) {
      return String(v || '').toLowerCase().includes(search);
    });
    var matchFilter = !filter || String(item[filterKey] || '') === filter ||
      item.category === filter || item.ingredientType === filter || item.status === filter;
    return matchSearch && matchFilter;
  });

  var thead = '<thead><tr>' +
    schema.columns.map(function(col) { return '<th>' + col.label + '</th>'; }).join('') +
    '<th>Actions</th>' +
    '</tr></thead>';

  var tbody;
  if (filtered.length === 0) {
    tbody = '<tbody><tr class="empty-row"><td colspan="' + (schema.columns.length + 1) + '">' +
      (search || filter ? 'No matching items.' : 'No items yet. Click "' + schema.addLabel + '" to get started.') +
      '</td></tr></tbody>';
  } else {
    tbody = '<tbody>' + filtered.map(function(item) {
      var isDone = !!item._done;
      var rowClass = isDone ? ' class="row-done"' : '';
      return '<tr' + rowClass + '>' +
        schema.columns.map(function(col) {
          return '<td>' + renderCell(col, item, schema) + '</td>';
        }).join('') +
        '<td class="actions">' +
          (schema.noDone ? '' : '<button class="btn-done btn-small' + (isDone ? ' active' : '') + '" onclick="toggleItemDone(\'' + item.id + '\')">' + (isDone ? 'Undo' : 'Done') + '</button>') +
          '<button class="btn-edit btn-small" onclick="showEditItemModal(\'' + item.id + '\')">Edit</button>' +
          '<button class="btn-danger btn-small" onclick="deleteItem(\'' + item.id + '\')">Delete</button>' +
        '</td>' +
      '</tr>';
    }).join('') + '</tbody>';
  }

  return '<table>' + thead + tbody + '</table>';
}

function renderCell(col, item, schema) {
  var val = item[col.key];
  var isDone = !!item._done;

  if (schema && schema.isSchool && col.key === 'topics') {
    var topicsRaw = String(val || '');
    if (!topicsRaw.trim()) return '<span style="color:#666">—</span>';
    var topicLines = topicsRaw.split('\n').map(function(t) { return t.trim(); }).filter(Boolean);
    var completedMap = item._topicsDone || {};
    return '<div class="topic-list">' + topicLines.map(function(topic, idx) {
      var key = 'topic_' + idx;
      var done = !!completedMap[key];
      return '<div class="topic-item' + (done ? ' topic-done' : '') + '">' +
        '<button class="topic-check' + (done ? ' checked' : '') + '" ' +
          'onclick="toggleTopicDone(\'' + item.id + '\',' + idx + ',' + topicLines.length + ')" ' +
          'title="' + (done ? 'Mark incomplete' : 'Mark complete') + '">' +
          (done ? '✓' : '○') +
        '</button>' +
        '<span>' + escapeHtml(topic) + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  if (col.type === 'workhours') {
    var wh = parseInt(item.hours || 0);
    var wm = parseInt(item.minutes || 0);
    if (wh > 0 && wm > 0) return wh + 'h ' + wm + 'm';
    if (wh > 0) return wh + 'h';
    if (wm > 0) return wm + 'm';
    return '—';
  }
  if (col.type === 'image') return val ? '<img class="row-image" src="' + val + '" alt="photo">' : '';
  if (col.type === 'price') return val ? '<span class="price-cell">' + parseFloat(val||0).toFixed(2) + ' MAD</span>' : '—';
  if (col.type === 'badge') {
    var tc = 'type-' + String(val||'').toLowerCase().replace(/\s+/g,'-');
    return val ? '<span class="type-badge ' + tc + '">' + escapeHtml(val) + '</span>' : '—';
  }
  if (col.type === 'status') {
    var sc = 'status-' + String(val||'').toLowerCase().replace(/\s+/g,'-');
    return val ? '<span class="status-badge ' + sc + '">' + escapeHtml(val) + '</span>' : '—';
  }
  if (col.type === 'link') {
    if (!val) return '—';
    var href = val.startsWith('http') ? val : 'https://' + val;
    return '<a href="' + escapeAttr(href) + '" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:none;font-size:0.8rem;">🔗 Open</a>';
  }
  return escapeHtml(String(val || '—'));
}

function buildPriceTotals(schema, items, filterVal) {
  if (!items || items.length === 0) return '';
  var groupKey = schema.totalsKey || 'category';
  var label    = schema.totalsLabel || 'Shopping';
  var activeItems = items.filter(function(item) { return !item._done; });
  var byGroup  = {};
  activeItems.forEach(function(item) {
    var grp = item[groupKey] || 'Other';
    if (!byGroup[grp]) byGroup[grp] = 0;
    byGroup[grp] += parseFloat(item.price || 0);
  });
  var filteredItems = filterVal ? activeItems.filter(function(i) { return i[groupKey] === filterVal; }) : activeItems;
  var grandTotal = filteredItems.reduce(function(s, i) { return s + parseFloat(i.price || 0); }, 0);
  var chipsHtml = Object.keys(byGroup).map(function(grp) {
    return '<div class="total-chip"><div class="total-chip-label">' + escapeHtml(grp) + '</div>' +
      '<div class="total-chip-value">' + byGroup[grp].toFixed(2) + ' MAD</div></div>';
  }).join('');
  return '<div class="summary-panel"><div class="summary-title">💰 Totals by Category</div>' +
    '<div class="totals-grid">' + chipsHtml + '</div>' +
    '<div class="grand-total"><span>Total' + (filterVal ? ' (' + filterVal + ')' : ' ' + label) + '</span>' +
    '<span class="grand-total-value">' + grandTotal.toFixed(2) + ' MAD</span></div></div>';
}

function formatHoursMinutes(decimalHours) {
  var h = Math.floor(decimalHours);
  var m = Math.round((decimalHours - h) * 60);
  if (m === 60) { h += 1; m = 0; }
  if (h > 0 && m > 0) return h + 'h ' + m + 'm';
  if (h > 0) return h + 'h';
  if (m > 0) return m + 'm';
  return '0h';
}

function buildWorkSummary(items) {
  if (!items || items.length === 0) return '';
  var totalMinutes = items.reduce(function(s, i) {
    return s + (parseInt(i.hours || 0) * 60) + parseInt(i.minutes || 0);
  }, 0);
  var totalDays  = items.length;
  var avgMinutes = totalDays > 0 ? totalMinutes / totalDays : 0;
  var byDay = {};
  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].forEach(function(d) { byDay[d] = 0; });
  items.forEach(function(item) {
    var d = item.day || 'Other';
    if (!byDay[d]) byDay[d] = 0;
    byDay[d] += (parseInt(item.hours || 0) * 60) + parseInt(item.minutes || 0);
  });
  var dayChips = Object.keys(byDay).filter(function(d) { return byDay[d] > 0; }).map(function(d) {
    return '<div class="total-chip"><div class="total-chip-label">' + d + '</div>' +
      '<div class="total-chip-value">' + formatHoursMinutes(byDay[d] / 60) + '</div></div>';
  }).join('');
  return '<div class="summary-panel"><div class="summary-title">💼 Work Summary</div><div class="totals-grid">' +
    '<div class="total-chip"><div class="total-chip-label">Total Hours</div><div class="total-chip-value">' + formatHoursMinutes(totalMinutes / 60) + '</div></div>' +
    '<div class="total-chip"><div class="total-chip-label">Days Logged</div><div class="total-chip-value">' + totalDays + '</div></div>' +
    '<div class="total-chip"><div class="total-chip-label">Avg per Day</div><div class="total-chip-value">' + formatHoursMinutes(avgMinutes / 60) + '</div></div>' +
    '</div>' + (dayChips ? '<div class="summary-title" style="margin-top:1rem">Hours by Day</div><div class="totals-grid">' + dayChips + '</div>' : '') + '</div>';
}

function showGroceryList() {
  var items = getItems('food');
  if (items.length === 0) {
    showModal('<div class="modal-title">🛒 Grocery List</div><p style="color:#b07bb3;text-align:center;padding:2rem 0">No ingredients added yet.</p>');
    return;
  }
  var activeItems = items.filter(function(item) { return !item._done; });
  var grouped = {};
  INGREDIENT_TYPES.forEach(function(t) { grouped[t] = []; });
  activeItems.forEach(function(item) {
    var type = item.ingredientType || 'Other';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(item);
  });
  var grandTotal = 0;
  var sectionsHtml = INGREDIENT_TYPES.map(function(type) {
    var group = grouped[type];
    if (!group || group.length === 0) return '';
    var typeTotal = group.reduce(function(s, i) { return s + parseFloat(i.price || 0); }, 0);
    grandTotal += typeTotal;
    var typeClass = 'type-' + type.toLowerCase();
    return '<div class="grocery-section">' +
      '<div class="grocery-type-header">' +
        '<div class="grocery-type-name"><span class="type-badge ' + typeClass + '">' + INGREDIENT_ICONS[type] + ' ' + type + '</span></div>' +
        (typeTotal > 0 ? '<div class="grocery-type-total">' + typeTotal.toFixed(2) + ' MAD</div>' : '') +
      '</div>' +
      '<div class="grocery-items">' +
        group.map(function(i) {
          return '<div class="grocery-item">' + escapeHtml(i.ingredient) +
            (i.recipeName ? ' <span style="color:#a184af;font-size:0.78rem;">(' + escapeHtml(i.recipeName) + ')</span>' : '') +
            (i.price ? ' — <span style="color:#10b981">' + parseFloat(i.price).toFixed(2) + ' MAD</span>' : '') + '</div>';
        }).join('') +
      '</div></div>';
  }).join('');
  var doneCount = items.length - activeItems.length;
  var doneNote = doneCount > 0 ? '<p style="color:#b07bb3;text-align:center;font-size:0.82rem;margin-bottom:1rem">(' + doneCount + ' completed item' + (doneCount > 1 ? 's' : '') + ' excluded)</p>' : '';
  showModal('<div class="modal-title">🛒 Grocery List</div>' + doneNote + sectionsHtml +
    (grandTotal > 0 ? '<div class="grocery-grand-total"><span>Total Cost</span><span style="color:#f59e0b">' + grandTotal.toFixed(2) + ' MAD</span></div>' : ''));
}

function showAddItemModal() {
  state.editingItemId  = null;
  state.pendingImageData = null;
  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  showModal(buildItemForm(getSchema(cat), null, cat));
}

function showEditItemModal(itemId) {
  state.editingItemId = itemId;
  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  var item = getItems(state.currentCategoryId).find(function(i) { return i.id === itemId; });
  if (!item) return;
  state.pendingImageData = item.image || null;
  showModal(buildItemForm(getSchema(cat), item, cat));
}

function buildItemForm(schema, item, cat) {
  var isEdit = !!item;
  var html = '<div class="modal-title">' + (isEdit ? 'Edit' : schema.addLabel) + '</div>';

  schema.fields.forEach(function(field) {
    html += '<div class="form-group"><label class="form-label">' + field.label + (field.required ? ' *' : '') + '</label>';
    var currentVal = item ? (item[field.key] || '') : '';

    if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
      html += '<input class="form-input" id="field-' + field.key + '" type="' + field.type + '" ' +
        (field.placeholder ? 'placeholder="' + field.placeholder + '" ' : '') +
        'value="' + escapeAttr(String(currentVal)) + '">';
    } else if (field.type === 'textarea') {
      html += '<textarea class="form-textarea" id="field-' + field.key + '" ' +
        (field.placeholder ? 'placeholder="' + field.placeholder + '" ' : '') +
        '>' + escapeHtml(String(currentVal)) + '</textarea>';
    } else if (field.type === 'select') {
      var hasCustom = field.options[field.options.length - 1] === 'Custom...';
      var isCurrentCustom = currentVal && !field.options.includes(currentVal);
      html += '<select class="form-select" id="field-' + field.key + '" onchange="handleSelectChange(this)">';
      field.options.forEach(function(opt) {
        var selected = (opt === currentVal) || (isCurrentCustom && opt === 'Custom...');
        html += '<option value="' + escapeAttr(opt) + '"' + (selected ? ' selected' : '') + '>' + opt + '</option>';
      });
      html += '</select>';
      if (hasCustom) {
        html += '<div class="custom-input-wrapper" id="custom-wrapper-' + field.key + '" style="display:' + (isCurrentCustom ? 'block' : 'none') + '">' +
          '<input class="form-input" id="custom-field-' + field.key + '" type="text" placeholder="Type custom value..." value="' + (isCurrentCustom ? escapeAttr(currentVal) : '') + '"></div>';
      }
    } else if (field.type === 'file') {
      html += '<label class="form-file-label" for="field-' + field.key + '">📷 ' +
        (currentVal || state.pendingImageData ? 'Change photo' : 'Choose photo') + '</label>' +
        '<input class="form-file-input" id="field-' + field.key + '" type="file" accept="image/*" onchange="handleImageChange(this)">';
      if (state.pendingImageData) {
        html += '<img id="image-preview" class="form-image-preview" src="' + state.pendingImageData + '" style="display:block">';
      } else {
        html += '<img id="image-preview" class="form-image-preview">';
      }
    }
    html += '</div>';
  });

  html += '<div class="form-actions">' +
    '<button class="btn-outline" onclick="closeModal()">Cancel</button>' +
    '<button class="btn-primary" onclick="submitItemForm()">Save</button></div>';
  return html;
}

function handleSelectChange(selectEl) {
  var key = selectEl.id.replace('field-', '');
  var wrapper = document.getElementById('custom-wrapper-' + key);
  if (wrapper) wrapper.style.display = selectEl.value === 'Custom...' ? 'block' : 'none';
}

function handleImageChange(input) {
  var file = input.files[0];
  if (!file) return;
  compressImage(file, 800, 0.7, function(compressed) {
    state.pendingImageData = compressed;
    var preview = document.getElementById('image-preview');
    if (preview) { preview.src = compressed; preview.style.display = 'block'; }
  });
}

function submitItemForm() {
  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  var schema = getSchema(cat);
  var item   = {};
  var valid  = true;

  schema.fields.forEach(function(field) {
    if (field.type === 'file') { item[field.key] = state.pendingImageData || null; return; }
    var el = document.getElementById('field-' + field.key);
    if (!el) return;
    var val = el.value;
    if (val === 'Custom...') {
      var customEl = document.getElementById('custom-field-' + field.key);
      val = customEl ? customEl.value.trim() : '';
    }
    if (field.required && !val.trim()) { el.style.borderColor = '#ef4444'; valid = false; }
    else el.style.borderColor = '';
    item[field.key] = val;
  });

  if (!valid) return;

  var items = getItems(state.currentCategoryId);
  if (state.editingItemId) {
    items = items.map(function(i) { return i.id === state.editingItemId ? Object.assign({}, i, item) : i; });
  } else {
    item.id = Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    items.push(item);
  }

  saveItems(state.currentCategoryId, items)
    .catch(function(e) { console.error('Save items error:', e); });
  closeModal();
  renderCategory(state.currentCategoryId);
}

function toggleItemDone(itemId) {
  var items = getItems(state.currentCategoryId);
  items = items.map(function(i) {
    if (i.id === itemId) return Object.assign({}, i, { _done: !i._done });
    return i;
  });
  saveItems(state.currentCategoryId, items)
    .catch(function(e) { console.error('Toggle done error:', e); });
  renderCategory(state.currentCategoryId);
}

function toggleTopicDone(itemId, topicIdx, totalTopics) {
  var items = getItems(state.currentCategoryId);
  items = items.map(function(i) {
    if (i.id !== itemId) return i;
    var topicsDone = Object.assign({}, i._topicsDone || {});
    var key = 'topic_' + topicIdx;
    topicsDone[key] = !topicsDone[key];
    var doneCount = Object.keys(topicsDone).filter(function(k) { return topicsDone[k]; }).length;
    return Object.assign({}, i, { _topicsDone: topicsDone, _done: doneCount >= totalTopics });
  });
  saveItems(state.currentCategoryId, items)
    .catch(function(e) { console.error('Toggle topic done error:', e); });
  renderCategory(state.currentCategoryId);
}


function deleteItem(itemId) {
  if (!confirm('Delete this item?')) return;
  var items = getItems(state.currentCategoryId).filter(function(i) { return i.id !== itemId; });
  saveItems(state.currentCategoryId, items)
    .catch(function(e) { console.error('Delete item error:', e); });
  renderCategory(state.currentCategoryId);
}

function compressImage(file, maxWidth, quality, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  state.pendingImageData = null;
  state.editingItemId = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function initApp() {
  _filterSearch = '';
  _filterSelect = '';
  state.selectedCategoryId = null;
  state.currentCategoryId  = null;


  var grid = document.getElementById('category-grid');
  if (grid) grid.innerHTML = '<div class="loading-cats">Loading your data…</div>';

  loadUserData().then(function() {
    renderHome();
  }).catch(function(e) {
    console.error('Load data error:', e);
    if (grid) grid.innerHTML = '<div class="loading-cats" style="color:#ef4444">Failed to load data. Please refresh.</div>';
  });
}
