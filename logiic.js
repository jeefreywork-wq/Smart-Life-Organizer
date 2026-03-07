var STORAGE_KEY = 'slo_v2';

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
      { key: 'subject',     label: 'Subject' },
      { key: 'studyTime',   label: 'Study Time' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { key: 'subject',     label: 'Subject',     type: 'text',   required: true,  placeholder: 'e.g. Math' },
      { key: 'studyTime',   label: 'Study Time',  type: 'select', required: true,
        options: ['< 1 hour','1h – 2h','2h – 3h','3h+','Custom...'] },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g. Solve exercises' },
    ],
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
      // { key: 'notes',       label: 'Notes' },
    ],
    fields: [
      { key: 'exercise',    label: 'Exercise Name', type: 'text',   required: true,
        placeholder: 'e.g. Bench Press' },
      { key: 'muscleGroup', label: 'Muscle Group',  type: 'select', required: true,
        options: ['Chest','Back','Legs','Shoulders','Arms','Cardio','Core','Full Body','Glutes'] },
      { key: 'sets',     label: 'Sets',     type: 'number', placeholder: '3' },
      { key: 'reps',     label: 'Reps',     type: 'number', placeholder: '10' },
      { key: 'duration', label: 'Duration', type: 'text',   placeholder: 'e.g. 45 min' },
      // { key: 'notes',    label: 'Notes',    type: 'textarea', placeholder: 'Optional notes...' },
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
      // { key: 'notes',     label: 'Notes' },
    ],
    fields: [
      { key: 'itemName',  label: 'Item Name', type: 'text', required: true, placeholder: 'e.g. AirPods Pro' },
      { key: 'category',  label: 'Category',  type: 'select', required: true,
        options: ['Electronics','Clothes','Books','Shoes','Beauty','Home','Sports','Other'] },
      { key: 'price',     label: 'Est. Price (MAD)', type: 'number', placeholder: '0.00' },
      { key: 'priority',  label: 'Priority',  type: 'select',
        options: ['High','Medium','Low'] },
      { key: 'link',      label: 'Link (optional)',  type: 'text', placeholder: 'https://...' },
      // { key: 'notes',     label: 'Notes',     type: 'textarea', placeholder: 'Optional notes...' },
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
      // { key: 'notes',       label: 'Notes' },
    ],
    fields: [
      { key: 'type', label: 'Type', type: 'select', required: true,
        options: ['Appointment','Medication','Test / Analysis','Surgery','Other'] },
      { key: 'name', label: 'Name / Doctor / Medication', type: 'text', required: true,
        placeholder: 'e.g. Dr. Ahmed – Dentist' },
      { key: 'date',   label: 'Date',             type: 'date' },
      { key: 'time',   label: 'Time',             type: 'text', placeholder: 'e.g. 10:30 AM' },
      { key: 'dosage', label: 'Dosage / Location',type: 'text', placeholder: 'e.g. 500mg twice/day or Clinic name' },
      { key: 'status', label: 'Status',           type: 'select',
        options: ['Upcoming','Completed','Cancelled','Recurring'] },
      // { key: 'notes',  label: 'Notes',            type: 'textarea', placeholder: 'Optional notes...' },
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
      // { key: 'notes',  label: 'Notes' },
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
      // { key: 'notes',  label: 'Notes',  type: 'textarea', placeholder: 'Thoughts, where to watch...' },
    ],
    hasFilter: true,
    filterKey: 'status',
    filterType: 'select_filter',
    filterOptions: ['Want to Watch','Watching','Watched','Dropped'],
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
      { key: 'hours',   label: 'Hours Worked' },
      // { key: 'project', label: 'Task / Project' },
      { key: 'notes',   label: 'Notes' },
    ],
    fields: [
      { key: 'date',    label: 'Date',           type: 'date',   required: true },
      { key: 'day',     label: 'Day of Week',    type: 'select', required: true,
        options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
      { key: 'hours',   label: 'Hours Worked',   type: 'number', required: true, placeholder: 'e.g. 8' },
      // { key: 'project', label: 'Task / Project', type: 'text',   placeholder: 'e.g. Client report' },
      { key: 'notes',   label: 'Notes',          type: 'textarea', placeholder: 'Optional notes...' },
    ],
    hasWorkSummary: true,
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

var state = {
  selectedCategoryId: null,
  currentCategoryId: null,
  editingItemId: null,
  pendingImageData: null,
};

function getData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {
    alert('Storage full. Try removing some items or images.');
  }
}

function getCategories() {
  var data = getData();
  var custom = data.customCategories || [];
  return BUILT_IN_CATEGORIES.concat(custom);
}

function getItems(categoryId) {
  var data = getData();
  return data[categoryId] || [];
}

function saveItems(categoryId, items) {
  var data = getData();
  data[categoryId] = items;
  saveData(data);
}

function getSchema(category) {
  if (SCHEMAS[category.id]) return SCHEMAS[category.id];
  return SCHEMAS.custom;
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
  var data = getData();
  var grid = document.getElementById('category-grid');
  var openBtn = document.getElementById('open-btn');

  grid.innerHTML = categories.map(function(cat) {
    var count = (data[cat.id] || []).length;
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
  var data = getData();
  data.customCategories = (data.customCategories || []).filter(function(c) { return c.id !== id; });
  delete data[id];
  saveData(data);
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
  var data = getData();
  if (!data.customCategories) data.customCategories = [];
  data.customCategories.push({ id: id, name: name, icon: icon, builtIn: false });
  saveData(data);
  closeModal();
  renderHome();
}

function renderCategory(categoryId) {
  var categories = getCategories();
  var cat = categories.find(function(c) { return c.id === categoryId; });
  if (!cat) { showHome(); return; }

  var schema = getSchema(cat);
  var content = document.getElementById('category-content');
  content.innerHTML =
    '<div class="cat-page">' +
      '<div class="cat-topbar">' +
        '<button class="back-btn" onclick="showHome()">← Back</button>' +
        '<div class="cat-title">' + cat.icon + ' ' + escapeHtml(cat.name) + '</div>' +
        (schema.hasGrocery ? '<button class="btn-success btn-small" onclick="showGroceryList()">🛒 Grocery List</button>' : '') +
      '</div>' +
      '<div class="cat-body">' +
        '<div class="table-controls">' +
          buildSearchBar(schema, categoryId) +
          '<button class="btn-primary btn-small" onclick="showAddItemModal()">' + schema.addLabel + '</button>' +
        '</div>' +
        '<div class="table-wrapper"><div class="table-scroll" id="table-scroll">' +
          buildTable(cat, schema, getItems(categoryId), '', '') +
        '</div></div>' +
        (schema.hasTotals ? '<div id="totals-panel">' + buildPriceTotals(schema, getItems(categoryId), '') + '</div>' : '') +
        (schema.hasWorkSummary ? '<div id="work-panel">' + buildWorkSummary(getItems(categoryId)) + '</div>' : '') +
      '</div>' +
    '</div>';
}

function buildSearchBar(schema) {
  var html = '<input class="search-box" id="search-input" type="text" placeholder="Search..." ' +
    'oninput="filterTable()">';
  if (schema.hasFilter && schema.filterKey === 'category') {
    html += '<select class="filter-select" id="filter-select" onchange="filterTable()">' +
      '<option value="">All Categories</option>' +
      SHOPPING_CATS.map(function(c) { return '<option value="' + c + '">' + c + '</option>'; }).join('') +
      '</select>';
  }
  if (schema.hasFilter && schema.filterType === 'select_filter' && schema.filterOptions) {
    html += '<select class="filter-select" id="filter-select" onchange="filterTable()">' +
      '<option value="">All</option>' +
      schema.filterOptions.map(function(o) { return '<option value="' + escapeAttr(o) + '">' + escapeHtml(o) + '</option>'; }).join('') +
      '</select>';
  }
  return html;
}

function filterTable() {
  var search = (document.getElementById('search-input') || {}).value || '';
  var filter = (document.getElementById('filter-select') || {}).value || '';
  var categoryId = state.currentCategoryId;
  var categories = getCategories();
  var cat = categories.find(function(c) { return c.id === categoryId; });
  if (!cat) return;
  var schema = getSchema(cat);
  var items = getItems(categoryId);

  var scroll = document.getElementById('table-scroll');
  if (scroll) scroll.innerHTML = buildTable(cat, schema, items, search, filter);

  if (schema.hasTotals) {
    var panel = document.getElementById('totals-panel');
    if (panel) panel.innerHTML = buildPriceTotals(schema, items, filter);
  }
  if (schema.hasWorkSummary) {
    var wPanel = document.getElementById('work-panel');
    if (wPanel) wPanel.innerHTML = buildWorkSummary(items);
  }
}

function buildTable(cat, schema, items, search, filter) {
  search = (search || '').toLowerCase();
  filter = filter || '';

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
      return '<tr>' +
        schema.columns.map(function(col) {
          return '<td>' + renderCell(col, item) + '</td>';
        }).join('') +
        '<td class="actions">' +
          '<button class="btn-edit btn-small" onclick="showEditItemModal(\'' + item.id + '\')">Edit</button>' +
          '<button class="btn-danger btn-small" onclick="deleteItem(\'' + item.id + '\')">Delete</button>' +
        '</td>' +
      '</tr>';
    }).join('') + '</tbody>';
  }

  return '<table>' + thead + tbody + '</table>';
}

function renderCell(col, item) {
  var val = item[col.key];
  if (col.type === 'image') {
    return val ? '<img class="row-image" src="' + val + '" alt="photo">' : '';
  }
  if (col.type === 'price') {
    return val ? '<span class="price-cell">' + parseFloat(val || 0).toFixed(2) + ' MAD</span>' : '—';
  }
  if (col.type === 'badge') {
    var typeClass = 'type-' + String(val || '').toLowerCase().replace(/\s+/g,'-');
    return val ? '<span class="type-badge ' + typeClass + '">' + escapeHtml(val) + '</span>' : '—';
  }
  if (col.type === 'status') {
    var statusClass = 'status-' + String(val || '').toLowerCase().replace(/\s+/g,'-');
    return val ? '<span class="status-badge ' + statusClass + '">' + escapeHtml(val) + '</span>' : '—';
  }
  if (col.type === 'link') {
    if (!val) return '—';
    var href = val.startsWith('http') ? val : 'https://' + val;
    return '<a href="' + escapeAttr(href) + '" target="_blank" rel="noopener" ' +
      'style="color:#60a5fa;text-decoration:none;font-size:0.8rem;">🔗 Open</a>';
  }
  return escapeHtml(String(val || '—'));
}

function buildPriceTotals(schema, items, filterVal) {
  if (!items || items.length === 0) return '';

  var groupKey = schema.totalsKey || 'category';
  var label    = schema.totalsLabel || 'Shopping';

  var byGroup = {};
  items.forEach(function(item) {
    var grp = item[groupKey] || 'Other';
    if (!byGroup[grp]) byGroup[grp] = 0;
    byGroup[grp] += parseFloat(item.price || 0);
  });

  var filteredItems = filterVal
    ? items.filter(function(i) { return i[groupKey] === filterVal; })
    : items;
  var grandTotal = filteredItems.reduce(function(sum, i) { return sum + parseFloat(i.price || 0); }, 0);

  var chipsHtml = Object.keys(byGroup).map(function(grp) {
    return '<div class="total-chip">' +
      '<div class="total-chip-label">' + escapeHtml(grp) + '</div>' +
      '<div class="total-chip-value">' + byGroup[grp].toFixed(2) + ' MAD</div>' +
      '</div>';
  }).join('');

  return '<div class="summary-panel">' +
    '<div class="summary-title">💰 Totals by Category</div>' +
    '<div class="totals-grid">' + chipsHtml + '</div>' +
    '<div class="grand-total">' +
      '<span>Total' + (filterVal ? ' (' + filterVal + ')' : ' ' + label) + '</span>' +
      '<span class="grand-total-value">' + grandTotal.toFixed(2) + ' MAD</span>' +
    '</div>' +
  '</div>';
}

function buildWorkSummary(items) {
  if (!items || items.length === 0) return '';

  var totalHours = items.reduce(function(sum, i) { return sum + parseFloat(i.hours || 0); }, 0);
  var totalDays  = items.length;
  var avgHours   = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0;

  var byDay = {};
  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].forEach(function(d) {
    byDay[d] = 0;
  });
  items.forEach(function(item) {
    var d = item.day || 'Other';
    if (!byDay[d]) byDay[d] = 0;
    byDay[d] += parseFloat(item.hours || 0);
  });

  var dayChips = Object.keys(byDay).filter(function(d) { return byDay[d] > 0; }).map(function(d) {
    return '<div class="total-chip">' +
      '<div class="total-chip-label">' + d + '</div>' +
      '<div class="total-chip-value">' + byDay[d].toFixed(1) + 'h</div>' +
    '</div>';
  }).join('');

  return '<div class="summary-panel">' +
    '<div class="summary-title">💼 Work Summary</div>' +
    '<div class="totals-grid">' +
      '<div class="total-chip"><div class="total-chip-label">Total Hours</div>' +
        '<div class="total-chip-value">' + totalHours.toFixed(1) + 'h</div></div>' +
      '<div class="total-chip"><div class="total-chip-label">Days Logged</div>' +
        '<div class="total-chip-value">' + totalDays + '</div></div>' +
      '<div class="total-chip"><div class="total-chip-label">Avg per Day</div>' +
        '<div class="total-chip-value">' + avgHours + 'h</div></div>' +
    '</div>' +
    (dayChips ? '<div class="summary-title" style="margin-top:1rem">Hours by Day of Week</div><div class="totals-grid">' + dayChips + '</div>' : '') +
  '</div>';
}

function showGroceryList() {
  var items = getItems('food');
  if (items.length === 0) {
    showModal('<div class="modal-title">🛒 Grocery List</div><p style="color:var(--text-muted);text-align:center;padding:2rem 0">No ingredients added yet.</p>');
    return;
  }

  var grouped = {};
  INGREDIENT_TYPES.forEach(function(t) { grouped[t] = []; });

  items.forEach(function(item) {
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
        '<div class="grocery-type-name">' +
          '<span class="type-badge ' + typeClass + '">' + INGREDIENT_ICONS[type] + ' ' + type + '</span>' +
        '</div>' +
        (typeTotal > 0 ? '<div class="grocery-type-total">' + typeTotal.toFixed(2) + ' MAD</div>' : '') +
      '</div>' +
      '<div class="grocery-items">' +
        group.map(function(i) {
          return '<div class="grocery-item">' +
            escapeHtml(i.ingredient) +
            (i.recipeName ? ' <span style="color:var(--text-dim);font-size:0.78rem;">(' + escapeHtml(i.recipeName) + ')</span>' : '') +
            (i.price ? ' — <span style="color:#10b981">' + parseFloat(i.price).toFixed(2) + ' MAD</span>' : '') +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }).join('');

  showModal(
    '<div class="modal-title">🛒 Grocery List</div>' +
    sectionsHtml +
    (grandTotal > 0 ?
      '<div class="grocery-grand-total"><span>Total Cost</span><span style="color:#f59e0b">' + grandTotal.toFixed(2) + ' MAD</span></div>'
      : '')
  );
}

function showAddItemModal() {
  state.editingItemId = null;
  state.pendingImageData = null;
  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  var schema = getSchema(cat);
  showModal(buildItemForm(schema, null, cat));
}

function showEditItemModal(itemId) {
  state.editingItemId = itemId;
  var cat = getCategories().find(function(c) { return c.id === state.currentCategoryId; });
  if (!cat) return;
  var schema = getSchema(cat);
  var items = getItems(state.currentCategoryId);
  var item = items.find(function(i) { return i.id === itemId; });
  if (!item) return;
  state.pendingImageData = item.image || null;
  showModal(buildItemForm(schema, item, cat));
}

function buildItemForm(schema, item, cat) {
  var isEdit = !!item;
  var html = '<div class="modal-title">' + (isEdit ? 'Edit' : schema.addLabel) + '</div>';

  schema.fields.forEach(function(field) {
    html += '<div class="form-group">';
    html += '<label class="form-label">' + field.label + (field.required ? ' *' : '') + '</label>';

    var currentVal = item ? (item[field.key] || '') : '';

    if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
      html += '<input class="form-input" id="field-' + field.key + '" ' +
        'type="' + field.type + '" ' +
        (field.placeholder ? 'placeholder="' + field.placeholder + '" ' : '') +
        'value="' + escapeAttr(String(currentVal)) + '">';
    } else if (field.type === 'textarea') {
      html += '<textarea class="form-textarea" id="field-' + field.key + '" ' +
        (field.placeholder ? 'placeholder="' + field.placeholder + '" ' : '') +
        '>' + escapeHtml(String(currentVal)) + '</textarea>';
    } else if (field.type === 'select') {
      var hasCustom = field.options[field.options.length - 1] === 'Custom...';
      var isCurrentCustom = currentVal && !field.options.includes(currentVal);

      html += '<select class="form-select" id="field-' + field.key + '" ' +
        'onchange="handleSelectChange(this)">';
      field.options.forEach(function(opt) {
        var selected = (opt === currentVal) || (isCurrentCustom && opt === 'Custom...');
        html += '<option value="' + escapeAttr(opt) + '"' + (selected ? ' selected' : '') + '>' + opt + '</option>';
      });
      html += '</select>';

      if (hasCustom) {
        html += '<div class="custom-input-wrapper" id="custom-wrapper-' + field.key + '" ' +
          'style="display:' + (isCurrentCustom ? 'block' : 'none') + '">' +
          '<input class="form-input" id="custom-field-' + field.key + '" type="text" ' +
          'placeholder="Type custom value..." value="' + (isCurrentCustom ? escapeAttr(currentVal) : '') + '">' +
          '</div>';
      }
    } else if (field.type === 'file') {
      html += '<label class="form-file-label" for="field-' + field.key + '">' +
        '📷 ' + (currentVal || state.pendingImageData ? 'Change photo' : 'Choose photo') +
        '</label>' +
        '<input class="form-file-input" id="field-' + field.key + '" type="file" accept="image/*" ' +
        'onchange="handleImageChange(this)">';
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
    '<button class="btn-primary" onclick="submitItemForm()">Save</button>' +
  '</div>';

  return html;
}

function handleSelectChange(selectEl) {
  var key = selectEl.id.replace('field-', '');
  var wrapper = document.getElementById('custom-wrapper-' + key);
  if (wrapper) {
    wrapper.style.display = selectEl.value === 'Custom...' ? 'block' : 'none';
  }
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
  var item = {};

  var valid = true;
  schema.fields.forEach(function(field) {
    if (field.type === 'file') {
      item[field.key] = state.pendingImageData || null;
      return;
    }

    var el = document.getElementById('field-' + field.key);
    if (!el) return;
    var val = el.value;

    if (val === 'Custom...') {
      var customEl = document.getElementById('custom-field-' + field.key);
      val = customEl ? customEl.value.trim() : '';
    }

    if (field.required && !val.trim()) {
      el.style.borderColor = '#ef4444';
      valid = false;
    } else {
      el.style.borderColor = '';
    }

    item[field.key] = val;
  });

  if (!valid) { return; }

  var items = getItems(state.currentCategoryId);
  if (state.editingItemId) {
    items = items.map(function(i) {
      return i.id === state.editingItemId ? Object.assign({}, i, item) : i;
    });
  } else {
    item.id = Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    items.push(item);
  }

  saveItems(state.currentCategoryId, items);
  closeModal();
  renderCategory(state.currentCategoryId);
}

function deleteItem(itemId) {
  if (!confirm('Delete this item?')) return;
  var items = getItems(state.currentCategoryId).filter(function(i) { return i.id !== itemId; });
  saveItems(state.currentCategoryId, items);
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
      canvas.width = w;
      canvas.height = h;
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
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function init() {
  var data = getData();
  if (!data.customCategories) { data.customCategories = []; saveData(data); }
  renderHome();
}

init();