var STORAGE_KEY = 'slo_v2';

var BUILT_IN_CATEGORIES = [
  { id: 'school',   name: 'School',   icon: '🎓', builtIn: true },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', builtIn: true },
  { id: 'food',     name: 'Food',     icon: '🍽️', builtIn: true },
  { id: 'gym',      name: 'Gym',      icon: '💪', builtIn: true },
  { id: 'travel',   name: 'Travel',   icon: '✈️', builtIn: true },
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
      { key: 'notes',       label: 'Notes' },
    ],
    fields: [
      { key: 'exercise',    label: 'Exercise Name', type: 'text',   required: true,
        placeholder: 'e.g. Bench Press' },
      { key: 'muscleGroup', label: 'Muscle Group',  type: 'select', required: true,
        options: ['Chest','Back','Legs','Shoulders','Arms','Cardio','Core','Full Body','Glutes'] },
      { key: 'sets',     label: 'Sets',     type: 'number', placeholder: '3' },
      { key: 'reps',     label: 'Reps',     type: 'number', placeholder: '10' },
      { key: 'duration', label: 'Duration', type: 'text',   placeholder: 'e.g. 45 min' },
      { key: 'notes',    label: 'Notes',    type: 'textarea', placeholder: 'Optional notes...' },
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

// ───────────────────────────────────────────────
//  STATE
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  NAVIGATION
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  HOME PAGE
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  CATEGORY PAGE
// ───────────────────────────────────────────────

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
        (schema.hasTotals ? '<div id="totals-panel">' + buildShoppingTotals(getItems(categoryId), '') + '</div>' : '') +
      '</div>' +
    '</div>';
}

function buildSearchBar(schema, categoryId) {
  var html = '<input class="search-box" id="search-input" type="text" placeholder="Search..." ' +
    'oninput="filterTable()">';
  if (schema.hasFilter && schema.filterKey === 'category') {
    html += '<select class="filter-select" id="filter-select" onchange="filterTable()">' +
      '<option value="">All Categories</option>' +
      SHOPPING_CATS.map(function(c) { return '<option value="' + c + '">' + c + '</option>'; }).join('') +
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
    if (panel) panel.innerHTML = buildShoppingTotals(items, filter);
  }
}

function buildTable(cat, schema, items, search, filter) {
  search = (search || '').toLowerCase();
  filter = filter || '';

  var filtered = items.filter(function(item) {
    var matchSearch = !search || Object.values(item).some(function(v) {
      return String(v || '').toLowerCase().includes(search);
    });
    var matchFilter = !filter || item.category === filter || item.ingredientType === filter;
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
  return escapeHtml(String(val || '—'));
}

// ───────────────────────────────────────────────
//  SHOPPING TOTALS
// ───────────────────────────────────────────────

function buildShoppingTotals(items, filterCat) {
  if (!items || items.length === 0) return '';

  var byCategory = {};
  items.forEach(function(item) {
    var cat = item.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = 0;
    byCategory[cat] += parseFloat(item.price || 0);
  });

  var filteredItems = filterCat ? items.filter(function(i) { return i.category === filterCat; }) : items;
  var grandTotal = filteredItems.reduce(function(sum, i) { return sum + parseFloat(i.price || 0); }, 0);

  var chipsHtml = Object.keys(byCategory).map(function(cat) {
    return '<div class="total-chip">' +
      '<div class="total-chip-label">' + escapeHtml(cat) + '</div>' +
      '<div class="total-chip-value">' + byCategory[cat].toFixed(2) + ' MAD</div>' +
      '</div>';
  }).join('');

  return '<div class="summary-panel">' +
    '<div class="summary-title">💰 Totals by Category</div>' +
    '<div class="totals-grid">' + chipsHtml + '</div>' +
    '<div class="grand-total">' +
      '<span>Total' + (filterCat ? ' (' + filterCat + ')' : ' Shopping') + '</span>' +
      '<span class="grand-total-value">' + grandTotal.toFixed(2) + ' MAD</span>' +
    '</div>' +
  '</div>';
}

// ───────────────────────────────────────────────
//  GROCERY LIST (Food)
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  ADD / EDIT ITEM MODAL
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  IMAGE COMPRESSION
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  MODAL SYSTEM
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  UTILITIES
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
//  INIT
// ───────────────────────────────────────────────

function init() {
  var data = getData();
  if (!data.customCategories) { data.customCategories = []; saveData(data); }
  renderHome();
}

init();