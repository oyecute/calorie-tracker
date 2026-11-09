/**
 * NutriTrack - Pure Vanilla JavaScript Calorie & Macro Tracker
 * 100% Vanilla: No backend, persistent localStorage, zero frameworks.
 */

(function () {
  'use strict';

  // ==========================================
  // STORAGE KEYS & CONSTANTS
  // ==========================================
  const STORAGE_KEYS = {
    LOGS: 'nutritrack_logs_v1',
    PROFILE: 'nutritrack_profile_v1',
    CUSTOM_PRESETS: 'nutritrack_custom_presets_v1'
  };

  const DEFAULT_PROFILE = {
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 65,
    streak: 1,
    lastActiveDate: null
  };

  // Built-in library of common healthy staple foods with accurate nutrition
  const BUILTIN_PRESETS = [
    // High Protein
    { id: 'bp-1', name: 'Grilled Chicken Breast', serving: '150g', calories: 247, protein: 46.5, carbs: 0, fat: 5.4, category: 'protein' },
    { id: 'bp-2', name: 'Large Whole Egg', serving: '1 egg (50g)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, category: 'protein' },
    { id: 'bp-3', name: 'Egg Whites', serving: '100g (approx 3 whites)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, category: 'protein' },
    { id: 'bp-4', name: 'Atlantic Salmon Fillet', serving: '150g cooked', calories: 310, protein: 34, carbs: 0, fat: 18, category: 'protein' },
    { id: 'bp-5', name: 'Greek Yogurt 0% Fat', serving: '170g (1 container)', calories: 100, protein: 18, carbs: 6, fat: 0, category: 'protein' },
    { id: 'bp-6', name: 'Whey Protein Powder', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5, category: 'protein' },
    { id: 'bp-7', name: 'Canned Tuna in Water', serving: '1 can drained (120g)', calories: 130, protein: 29, carbs: 0, fat: 1, category: 'protein' },
    { id: 'bp-8', name: 'Firm Tofu', serving: '150g', calories: 125, protein: 15, carbs: 3.5, fat: 6.5, category: 'protein' },
    { id: 'bp-9', name: 'Lean Ground Beef (93/7)', serving: '150g cooked', calories: 260, protein: 36, carbs: 0, fat: 12, category: 'protein' },

    // Carbs & Grains
    { id: 'bp-10', name: 'Rolled Oats (Dry)', serving: '50g (1/2 cup)', calories: 190, protein: 6.5, carbs: 34, fat: 3, category: 'carbs' },
    { id: 'bp-11', name: 'White Jasmine Rice (Cooked)', serving: '150g (1 cup)', calories: 195, protein: 4.2, carbs: 43, fat: 0.4, category: 'carbs' },
    { id: 'bp-12', name: 'Brown Rice (Cooked)', serving: '150g (1 cup)', calories: 165, protein: 3.8, carbs: 35, fat: 1.4, category: 'carbs' },
    { id: 'bp-13', name: 'Sweet Potato (Baked)', serving: '150g medium', calories: 135, protein: 3, carbs: 31, fat: 0.2, category: 'carbs' },
    { id: 'bp-14', name: 'Whole Wheat Bread', serving: '1 slice (40g)', calories: 95, protein: 4.5, carbs: 17, fat: 1.2, category: 'carbs' },
    { id: 'bp-15', name: 'Cooked Quinoa', serving: '150g', calories: 180, protein: 6.6, carbs: 32, fat: 2.9, category: 'carbs' },
    { id: 'bp-16', name: 'Whole Grain Pasta (Cooked)', serving: '140g (1 cup)', calories: 174, protein: 7.5, carbs: 37, fat: 0.8, category: 'carbs' },
    { id: 'bp-17', name: 'Black Beans (Cooked)', serving: '130g', calories: 170, protein: 11, carbs: 31, fat: 0.7, category: 'carbs' },

    // Produce (Fruits & Vegetables)
    { id: 'bp-18', name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'produce' },
    { id: 'bp-19', name: 'Honeycrisp Apple', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'produce' },
    { id: 'bp-20', name: 'Fresh Blueberries', serving: '100g (1 cup)', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, category: 'produce' },
    { id: 'bp-21', name: 'Hass Avocado', serving: 'Half avocado (75g)', calories: 120, protein: 1.5, carbs: 6.4, fat: 11, category: 'produce' },
    { id: 'bp-22', name: 'Steamed Broccoli', serving: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, category: 'produce' },
    { id: 'bp-23', name: 'Baby Spinach (Raw)', serving: '60g (2 cups)', calories: 14, protein: 1.7, carbs: 2.2, fat: 0.2, category: 'produce' },
    { id: 'bp-24', name: 'Mixed Salad Greens', serving: '100g', calories: 18, protein: 1.5, carbs: 3.2, fat: 0.2, category: 'produce' },

    // Snacks & Healthy Fats & Dairy
    { id: 'bp-25', name: 'Peanut Butter (Natural)', serving: '2 tbsp (32g)', calories: 190, protein: 8, carbs: 7, fat: 16, category: 'snacks' },
    { id: 'bp-26', name: 'Raw Almonds', serving: '1 oz (28g / ~23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14, category: 'snacks' },
    { id: 'bp-27', name: 'Extra Virgin Olive Oil', serving: '1 tbsp (14ml)', calories: 119, protein: 0, carbs: 0, fat: 13.5, category: 'snacks' },
    { id: 'bp-28', name: 'Cheddar Cheese', serving: '1 oz (28g)', calories: 115, protein: 7, carbs: 0.4, fat: 9.4, category: 'snacks' },
    { id: 'bp-29', name: 'Dark Chocolate (70%)', serving: '25g (2 squares)', calories: 145, protein: 2, carbs: 13, fat: 10, category: 'snacks' },
    { id: 'bp-30', name: 'Cottage Cheese 2%', serving: '150g', calories: 120, protein: 18, carbs: 6, fat: 3, category: 'snacks' }
  ];

  // ==========================================
  // APPLICATION STATE
  // ==========================================
  let appLogs = {};
  let appProfile = { ...DEFAULT_PROFILE };
  let customPresets = [];
  let currentDate = getTodayDateString();
  let currentPresetCategory = 'all';

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const DOM = {
    // Date navigation
    dateDisplayLabel: document.getElementById('date-display-label'),
    datePickerInput: document.getElementById('date-picker-input'),
    prevDayBtn: document.getElementById('prev-day-btn'),
    nextDayBtn: document.getElementById('next-day-btn'),
    todayBtn: document.getElementById('today-btn'),

    // Top Calorie Dashboard
    calorieStatusPill: document.getElementById('calorie-status-pill'),
    quickChangeGoalBtn: document.getElementById('quick-change-goal-btn'),
    calorieProgressCircle: document.getElementById('calorie-progress-circle'),
    remainingCaloriesVal: document.getElementById('remaining-calories-val'),
    remainingCaloriesLabel: document.getElementById('remaining-calories-label'),
    consumedCaloriesVal: document.getElementById('consumed-calories-val'),
    goalCaloriesVal: document.getElementById('goal-calories-val'),
    diffCaloriesVal: document.getElementById('diff-calories-val'),
    diffCaloriesLabel: document.getElementById('diff-calories-label'),

    // Macros
    proteinCurrent: document.getElementById('protein-current'),
    proteinTarget: document.getElementById('protein-target'),
    proteinPct: document.getElementById('protein-pct'),
    proteinProgressBar: document.getElementById('protein-progress-bar'),

    carbsCurrent: document.getElementById('carbs-current'),
    carbsTarget: document.getElementById('carbs-target'),
    carbsPct: document.getElementById('carbs-pct'),
    carbsProgressBar: document.getElementById('carbs-progress-bar'),

    fatCurrent: document.getElementById('fat-current'),
    fatTarget: document.getElementById('fat-target'),
    fatPct: document.getElementById('fat-pct'),
    fatProgressBar: document.getElementById('fat-progress-bar'),

    macroKcalSum: document.getElementById('macro-kcal-sum'),
    ratioProtein: document.getElementById('ratio-protein'),
    ratioCarbs: document.getElementById('ratio-carbs'),
    ratioFat: document.getElementById('ratio-fat'),
    ratioProteinText: document.getElementById('ratio-protein-text'),
    ratioCarbsText: document.getElementById('ratio-carbs-text'),
    ratioFatText: document.getElementById('ratio-fat-text'),

    // Water & Streak
    waterCountDisplay: document.getElementById('water-count-display'),
    waterGlassesGrid: document.getElementById('water-glasses-grid'),
    btnWaterMinus: document.getElementById('btn-water-minus'),
    btnWaterPlus: document.getElementById('btn-water-plus'),
    btnWaterReset: document.getElementById('btn-water-reset'),
    streakCount: document.getElementById('streak-count'),

    // Chart
    chartContainer: document.getElementById('chart-container'),

    // Meal Food Lists & Subtotals
    mealLists: {
      breakfast: document.getElementById('breakfast-food-list'),
      lunch: document.getElementById('lunch-food-list'),
      dinner: document.getElementById('dinner-food-list'),
      snacks: document.getElementById('snacks-food-list')
    },
    mealTotals: {
      breakfast: {
        cal: document.getElementById('breakfast-total-cal'),
        p: document.getElementById('breakfast-total-p'),
        c: document.getElementById('breakfast-total-c'),
        f: document.getElementById('breakfast-total-f')
      },
      lunch: {
        cal: document.getElementById('lunch-total-cal'),
        p: document.getElementById('lunch-total-p'),
        c: document.getElementById('lunch-total-c'),
        f: document.getElementById('lunch-total-f')
      },
      dinner: {
        cal: document.getElementById('dinner-total-cal'),
        p: document.getElementById('dinner-total-p'),
        c: document.getElementById('dinner-total-c'),
        f: document.getElementById('dinner-total-f')
      },
      snacks: {
        cal: document.getElementById('snacks-total-cal'),
        p: document.getElementById('snacks-total-p'),
        c: document.getElementById('snacks-total-c'),
        f: document.getElementById('snacks-total-f')
      }
    },
    btnQuickAddMeal: document.getElementById('btn-quick-add-meal'),

    // Modals
    modalFoodEntry: document.getElementById('modal-food-entry'),
    modalFoodTitle: document.getElementById('modal-food-title'),
    foodForm: document.getElementById('food-form'),
    foodEditId: document.getElementById('food-edit-id'),
    foodNameInput: document.getElementById('food-name-input'),
    foodMealSelect: document.getElementById('food-meal-select'),
    foodServingInput: document.getElementById('food-serving-input'),
    foodCaloriesInput: document.getElementById('food-calories-input'),
    foodProteinInput: document.getElementById('food-protein-input'),
    foodCarbsInput: document.getElementById('food-carbs-input'),
    foodFatInput: document.getElementById('food-fat-input'),
    foodSaveToPresets: document.getElementById('food-save-to-presets'),
    btnAutocalcCalories: document.getElementById('btn-autocalc-calories'),

    // Presets Modal
    modalPresets: document.getElementById('modal-presets'),
    btnOpenPresets: document.getElementById('btn-open-presets'),
    presetsSearchInput: document.getElementById('presets-search-input'),
    presetMealTarget: document.getElementById('preset-meal-target'),
    presetsGridContainer: document.getElementById('presets-grid-container'),

    // Calculator Modal
    modalCalculator: document.getElementById('modal-calculator'),
    btnOpenCalculator: document.getElementById('btn-open-calculator'),
    calcForm: document.getElementById('calc-form'),
    calcAge: document.getElementById('calc-age'),
    calcWeight: document.getElementById('calc-weight'),
    calcHeight: document.getElementById('calc-height'),
    calcActivity: document.getElementById('calc-activity'),
    calcGoalType: document.getElementById('calc-goal-type'),
    resBmr: document.getElementById('res-bmr'),
    resTdee: document.getElementById('res-tdee'),
    resTarget: document.getElementById('res-target'),
    btnRunCalc: document.getElementById('btn-run-calc'),
    btnApplyCalcGoal: document.getElementById('btn-apply-calc-goal'),

    // Settings Modal
    modalSettings: document.getElementById('modal-settings'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    settingsForm: document.getElementById('settings-form'),
    settingsCalorieGoal: document.getElementById('settings-calorie-goal'),
    settingsProteinGoal: document.getElementById('settings-protein-goal'),
    settingsCarbsGoal: document.getElementById('settings-carbs-goal'),
    settingsFatGoal: document.getElementById('settings-fat-goal'),
    btnExportData: document.getElementById('btn-export-data'),
    fileImportInput: document.getElementById('file-import-input'),
    btnClearData: document.getElementById('btn-clear-data'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    loadData();
    checkStreak();
    bindEvents();
    setDate(getTodayDateString());
    renderPresets();
    runTDEECalculation();
  }

  // ==========================================
  // STORAGE & DATA HANDLING
  // ==========================================
  function loadData() {
    try {
      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedPresets = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS);

      if (storedLogs) {
        appLogs = JSON.parse(storedLogs);
      } else {
        // Seed with sample initial data so user sees active state
        seedInitialDemoData();
      }

      if (storedProfile) {
        appProfile = { ...DEFAULT_PROFILE, ...JSON.parse(storedProfile) };
      } else {
        appProfile = { ...DEFAULT_PROFILE };
        saveProfile();
      }

      if (storedPresets) {
        customPresets = JSON.parse(storedPresets);
      } else {
        customPresets = [];
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      showToast('Error loading local data. Restoring defaults.', 'error');
    }
  }

  function saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(appLogs));
    } catch (err) {
      console.error('Error saving logs:', err);
      showToast('Failed to save log to local storage', 'error');
    }
  }

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(appProfile));
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  }

  function saveCustomPresets() {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(customPresets));
    } catch (err) {
      console.error('Error saving custom presets:', err);
    }
  }

  function seedInitialDemoData() {
    const today = getTodayDateString();
    const yesterday = offsetDateString(today, -1);
    const twoDaysAgo = offsetDateString(today, -2);

    appLogs = {
      [today]: {
        meals: {
          breakfast: [
            { id: 'demo-1', name: 'Rolled Oatmeal with Blueberries', serving: '1 large bowl', calories: 285, protein: 9, carbs: 54, fat: 4, timestamp: Date.now() - 36000000 },
            { id: 'demo-2', name: 'Greek Yogurt 0%', serving: '170g', calories: 100, protein: 18, carbs: 6, fat: 0, timestamp: Date.now() - 35500000 }
          ],
          lunch: [
            { id: 'demo-3', name: 'Grilled Chicken & Quinoa Salad', serving: '1 plate (250g)', calories: 480, protein: 44, carbs: 42, fat: 12, timestamp: Date.now() - 18000000 }
          ],
          dinner: [],
          snacks: [
            { id: 'demo-4', name: 'Handful of Raw Almonds', serving: '30g', calories: 175, protein: 6, carbs: 6, fat: 15, timestamp: Date.now() - 10000000 }
          ]
        },
        water: 4
      },
      [yesterday]: {
        meals: {
          breakfast: [
            { id: 'demo-y1', name: 'Eggs & Whole Wheat Toast', serving: '2 eggs + 2 slices', calories: 340, protein: 21, carbs: 34, fat: 12, timestamp: Date.now() - 120000000 }
          ],
          lunch: [
            { id: 'demo-y2', name: 'Salmon with Steamed Rice & Veggies', serving: '1 meal bowl', calories: 650, protein: 42, carbs: 60, fat: 22, timestamp: Date.now() - 105000000 }
          ],
          dinner: [
            { id: 'demo-y3', name: 'Lean Beef & Sweet Potato Mash', serving: '1 plate', calories: 590, protein: 45, carbs: 55, fat: 18, timestamp: Date.now() - 85000000 }
          ],
          snacks: [
            { id: 'demo-y4', name: 'Whey Protein Shake', serving: '1 scoop with water', calories: 120, protein: 24, carbs: 3, fat: 1.5, timestamp: Date.now() - 95000000 },
            { id: 'demo-y5', name: 'Fresh Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, timestamp: Date.now() - 90000000 }
          ]
        },
        water: 7
      },
      [twoDaysAgo]: {
        meals: {
          breakfast: [
            { id: 'demo-2d1', name: 'Protein Pancakes with Honey', serving: '3 pancakes', calories: 420, protein: 30, carbs: 55, fat: 8, timestamp: Date.now() - 200000000 }
          ],
          lunch: [
            { id: 'demo-2d2', name: 'Turkey Breast Sandwich', serving: '1 sandwich', calories: 460, protein: 38, carbs: 45, fat: 11, timestamp: Date.now() - 180000000 }
          ],
          dinner: [
            { id: 'demo-2d3', name: 'Chicken Stir-fry with Brown Rice', serving: '1 large bowl', calories: 610, protein: 48, carbs: 65, fat: 14, timestamp: Date.now() - 160000000 }
          ],
          snacks: [
            { id: 'demo-2d4', name: 'Dark Chocolate & Apple', serving: '2 squares + 1 apple', calories: 240, protein: 2.5, carbs: 38, fat: 10.3, timestamp: Date.now() - 170000000 }
          ]
        },
        water: 8
      }
    };
    saveLogs();
  }

  function getDayLog(dateStr) {
    if (!appLogs[dateStr]) {
      appLogs[dateStr] = {
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        water: 0
      };
    }
    return appLogs[dateStr];
  }

  // ==========================================
  // STREAK MANAGEMENT
  // ==========================================
  function checkStreak() {
    const today = getTodayDateString();
    const lastActive = appProfile.lastActiveDate;

    if (!lastActive) {
      appProfile.streak = 1;
      appProfile.lastActiveDate = today;
      saveProfile();
    } else if (lastActive === today) {
      // Already logged today, keep streak
    } else {
      const yesterday = offsetDateString(today, -1);
      if (lastActive === yesterday) {
        // Consecutive day
        appProfile.streak = (appProfile.streak || 1) + 1;
        appProfile.lastActiveDate = today;
        saveProfile();
      } else {
        // Missed one or more days
        appProfile.streak = 1;
        appProfile.lastActiveDate = today;
        saveProfile();
      }
    }
    DOM.streakCount.textContent = appProfile.streak || 1;
  }

  // ==========================================
  // DATE HELPERS & NAVIGATION
  // ==========================================
  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function offsetDateString(baseDateStr, offsetDays) {
    const parts = baseDateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateDisplay(dateStr) {
    const today = getTodayDateString();
    const yesterday = offsetDateString(today, -1);
    const tomorrow = offsetDateString(today, 1);

    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formatted = d.toLocaleDateString(undefined, options);

    if (dateStr === today) {
      return `Today, ${formatted}`;
    } else if (dateStr === yesterday) {
      return `Yesterday, ${formatted}`;
    } else if (dateStr === tomorrow) {
      return `Tomorrow, ${formatted}`;
    }
    return formatted;
  }

  function setDate(newDateStr) {
    currentDate = newDateStr;
    DOM.datePickerInput.value = newDateStr;
    DOM.dateDisplayLabel.textContent = formatDateDisplay(newDateStr);
    renderAll();
  }

  // ==========================================
  // RENDERING ENGINE
  // ==========================================
  function renderAll() {
    renderDashboard();
    renderMeals();
    renderWater();
    renderWeeklyChart();
  }

  function renderDashboard() {
    const dayLog = getDayLog(currentDate);
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    Object.keys(dayLog.meals).forEach(mealKey => {
      dayLog.meals[mealKey].forEach(item => {
        totalCalories += Number(item.calories) || 0;
        totalProtein += Number(item.protein) || 0;
        totalCarbs += Number(item.carbs) || 0;
        totalFat += Number(item.fat) || 0;
      });
    });

    const goal = Number(appProfile.calorieGoal) || 2000;
    const remaining = goal - totalCalories;

    // Numbers display
    DOM.consumedCaloriesVal.textContent = `${Math.round(totalCalories).toLocaleString()} kcal`;
    DOM.goalCaloriesVal.textContent = `${Math.round(goal).toLocaleString()} kcal`;

    if (remaining >= 0) {
      DOM.diffCaloriesLabel.textContent = 'Remaining';
      DOM.diffCaloriesVal.textContent = `${Math.round(remaining).toLocaleString()} kcal`;
      DOM.remainingCaloriesVal.textContent = Math.round(remaining).toLocaleString();
      DOM.remainingCaloriesLabel.textContent = 'kcal left';
      DOM.calorieStatusPill.textContent = 'On Track';
      DOM.calorieStatusPill.className = 'status-pill status-on-track';
      DOM.calorieProgressCircle.style.stroke = '#10b981';
    } else {
      const overBudget = Math.abs(remaining);
      DOM.diffCaloriesLabel.textContent = 'Over by';
      DOM.diffCaloriesVal.textContent = `${Math.round(overBudget).toLocaleString()} kcal`;
      DOM.remainingCaloriesVal.textContent = `+${Math.round(overBudget).toLocaleString()}`;
      DOM.remainingCaloriesLabel.textContent = 'kcal over';
      DOM.calorieStatusPill.textContent = 'Over Budget';
      DOM.calorieStatusPill.className = 'status-pill status-over';
      DOM.calorieProgressCircle.style.stroke = '#ef4444';
    }

    // SVG Circular Ring: circumference = 2 * PI * 76 = ~477.52
    const circumference = 477.52;
    const pct = Math.min(totalCalories / goal, 1);
    const strokeOffset = circumference - (pct * circumference);
    DOM.calorieProgressCircle.style.strokeDashoffset = strokeOffset;

    // Macronutrients Rendering
    const pTarget = Number(appProfile.proteinGoal) || 150;
    const cTarget = Number(appProfile.carbsGoal) || 200;
    const fTarget = Number(appProfile.fatGoal) || 65;

    DOM.proteinCurrent.textContent = Math.round(totalProtein);
    DOM.proteinTarget.textContent = pTarget;
    const pPct = Math.round((totalProtein / pTarget) * 100);
    DOM.proteinPct.textContent = `${pPct}%`;
    DOM.proteinProgressBar.style.width = `${Math.min(pPct, 100)}%`;

    DOM.carbsCurrent.textContent = Math.round(totalCarbs);
    DOM.carbsTarget.textContent = cTarget;
    const cPct = Math.round((totalCarbs / cTarget) * 100);
    DOM.carbsPct.textContent = `${cPct}%`;
    DOM.carbsProgressBar.style.width = `${Math.min(cPct, 100)}%`;

    DOM.fatCurrent.textContent = Math.round(totalFat);
    DOM.fatTarget.textContent = fTarget;
    const fPct = Math.round((totalFat / fTarget) * 100);
    DOM.fatPct.textContent = `${fPct}%`;
    DOM.fatProgressBar.style.width = `${Math.min(fPct, 100)}%`;

    // Energy distribution calculation
    const kcalFromProtein = totalProtein * 4;
    const kcalFromCarbs = totalCarbs * 4;
    const kcalFromFat = totalFat * 9;
    const macroKcalTotal = kcalFromProtein + kcalFromCarbs + kcalFromFat;

    DOM.macroKcalSum.textContent = `${Math.round(macroKcalTotal).toLocaleString()} kcal from macros`;

    if (macroKcalTotal > 0) {
      const pRatio = Math.round((kcalFromProtein / macroKcalTotal) * 100);
      const cRatio = Math.round((kcalFromCarbs / macroKcalTotal) * 100);
      const fRatio = 100 - pRatio - cRatio;

      DOM.ratioProtein.style.width = `${pRatio}%`;
      DOM.ratioCarbs.style.width = `${cRatio}%`;
      DOM.ratioFat.style.width = `${Math.max(fRatio, 0)}%`;

      DOM.ratioProteinText.textContent = `${pRatio}%`;
      DOM.ratioCarbsText.textContent = `${cRatio}%`;
      DOM.ratioFatText.textContent = `${Math.max(fRatio, 0)}%`;
    } else {
      DOM.ratioProtein.style.width = '33%';
      DOM.ratioCarbs.style.width = '33%';
      DOM.ratioFat.style.width = '34%';
      DOM.ratioProteinText.textContent = '0%';
      DOM.ratioCarbsText.textContent = '0%';
      DOM.ratioFatText.textContent = '0%';
    }
  }

  function renderMeals() {
    const dayLog = getDayLog(currentDate);

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealKey => {
      const foodItems = dayLog.meals[mealKey] || [];
      const listContainer = DOM.mealLists[mealKey];
      const totalElements = DOM.mealTotals[mealKey];

      let mealCals = 0;
      let mealP = 0;
      let mealC = 0;
      let mealF = 0;

      listContainer.innerHTML = '';

      if (foodItems.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-meal-state">
            <span>No foods logged for this meal yet.</span>
          </div>
        `;
      } else {
        foodItems.forEach(item => {
          mealCals += Number(item.calories) || 0;
          mealP += Number(item.protein) || 0;
          mealC += Number(item.carbs) || 0;
          mealF += Number(item.fat) || 0;

          const row = document.createElement('div');
          row.className = 'food-row-item';
          row.dataset.id = item.id;
          row.dataset.meal = mealKey;

          row.innerHTML = `
            <div class="food-main-info">
              <span class="food-name-text" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
              <span class="food-serving-text">${escapeHtml(item.serving || '1 portion')}</span>
            </div>
            <div class="food-nutrition-pills">
              <span class="food-cal-badge">${Math.round(item.calories)} kcal</span>
              <div class="food-macro-tags">
                <span class="food-macro-tag macro-tag-p" title="Protein">P: ${item.protein !== undefined && item.protein !== '' ? Math.round(item.protein) : 0}g</span>
                <span class="food-macro-tag macro-tag-c" title="Carbs">C: ${item.carbs !== undefined && item.carbs !== '' ? Math.round(item.carbs) : 0}g</span>
                <span class="food-macro-tag macro-tag-f" title="Fat">F: ${item.fat !== undefined && item.fat !== '' ? Math.round(item.fat) : 0}g</span>
              </div>
            </div>
            <div class="food-actions-group">
              <button class="btn-icon-tiny edit-food-btn" title="Edit food" data-action="edit" data-id="${item.id}" data-meal="${mealKey}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon-tiny delete-btn delete-food-btn" title="Delete item" data-action="delete" data-id="${item.id}" data-meal="${mealKey}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `;
          listContainer.appendChild(row);
        });
      }

      // Update subtotals
      totalElements.cal.textContent = Math.round(mealCals);
      totalElements.p.textContent = Math.round(mealP);
      totalElements.c.textContent = Math.round(mealC);
      totalElements.f.textContent = Math.round(mealF);
    });
  }

  function renderWater() {
    const dayLog = getDayLog(currentDate);
    const count = dayLog.water || 0;
    const ml = count * 250;

    DOM.waterCountDisplay.textContent = `${count} / 8 Glasses (${ml} ml)`;

    DOM.waterGlassesGrid.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
      const isActive = i <= count;
      const glassBtn = document.createElement('button');
      glassBtn.className = `water-glass-btn ${isActive ? 'active' : ''}`;
      glassBtn.title = `Glass ${i} (250 ml)`;
      glassBtn.dataset.glass = i;

      glassBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="${isActive ? '#3b82f6' : 'none'}" stroke="${isActive ? '#2563eb' : '#94a3b8'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
        <span class="glass-ml-tag">250ml</span>
      `;
      glassBtn.addEventListener('click', () => {
        if (dayLog.water === i) {
          dayLog.water = i - 1;
        } else {
          dayLog.water = i;
        }
        saveLogs();
        renderWater();
        showToast(`Water updated: ${dayLog.water * 250} ml logged!`, 'info');
      });
      DOM.waterGlassesGrid.appendChild(glassBtn);
    }
  }

  function renderWeeklyChart() {
    const daysToShow = 7;
    const daysData = [];
    const goal = Number(appProfile.calorieGoal) || 2000;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const dStr = offsetDateString(currentDate, -i);
      const log = appLogs[dStr];
      let cals = 0;
      if (log && log.meals) {
        Object.keys(log.meals).forEach(k => {
          log.meals[k].forEach(item => {
            cals += Number(item.calories) || 0;
          });
        });
      }

      const parts = dStr.split('-');
      const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' });

      daysData.push({
        dateStr: dStr,
        label: dayLabel,
        calories: Math.round(cals),
        isCurrent: dStr === currentDate
      });
    }

    const maxCal = Math.max(...daysData.map(d => d.calories), goal, 2200) * 1.15;
    const chartHeight = 160;
    const chartWidth = 560;
    const padTop = 20;
    const padBottom = 26;
    const usableHeight = chartHeight - padTop - padBottom;
    const goalY = chartHeight - padBottom - (goal / maxCal) * usableHeight;

    const colWidth = chartWidth / daysToShow;
    const barWidth = 32;

    let barsSvg = '';
    daysData.forEach((day, idx) => {
      const x = idx * colWidth + (colWidth - barWidth) / 2;
      const barH = (day.calories / maxCal) * usableHeight;
      const y = chartHeight - padBottom - barH;
      const isOver = day.calories > goal;
      const barColor = isOver ? '#ef4444' : (day.calories === 0 ? '#e2e8f0' : '#10b981');
      const isSelectedStroke = day.isCurrent ? 'stroke="#0f172a" stroke-width="2"' : '';

      barsSvg += `
        <g class="chart-day-group" style="cursor: pointer;" data-date="${day.dateStr}">
          <title>${day.label} (${day.dateStr}): ${day.calories} kcal</title>
          <rect
            class="chart-bar"
            x="${x}"
            y="${y}"
            width="${barWidth}"
            height="${Math.max(barH, 3)}"
            rx="6"
            ry="6"
            fill="${barColor}"
            ${isSelectedStroke}
          />
          <text class="chart-val-text" x="${x + barWidth / 2}" y="${y - 6}">${day.calories > 0 ? day.calories : ''}</text>
          <text class="chart-axis-text" x="${x + barWidth / 2}" y="${chartHeight - 6}" font-weight="${day.isCurrent ? 'bold' : 'normal'}">${day.label}</text>
        </g>
      `;
    });

    DOM.chartContainer.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <!-- Target Goal Line -->
        <line x1="0" y1="${goalY}" x2="${chartWidth}" y2="${goalY}" class="chart-goal-line" />
        <text x="${chartWidth - 4}" y="${goalY - 5}" text-anchor="end" font-size="10" font-weight="700" fill="#64748b">Goal: ${goal} kcal</text>
        ${barsSvg}
      </svg>
    `;

    // Click on bar navigates to that day
    const dayGroups = DOM.chartContainer.querySelectorAll('.chart-day-group');
    dayGroups.forEach(grp => {
      grp.addEventListener('click', () => {
        const dStr = grp.dataset.date;
        if (dStr) {
          setDate(dStr);
          showToast(`Viewing ${formatDateDisplay(dStr)}`, 'info');
        }
      });
    });
  }

  // ==========================================
  // PRESET LIBRARY
  // ==========================================
  function renderPresets() {
    const searchTerm = (DOM.presetsSearchInput.value || '').trim().toLowerCase();
    const allItems = [...customPresets, ...BUILTIN_PRESETS];

    const filtered = allItems.filter(item => {
      // Category match
      if (currentPresetCategory !== 'all') {
        if (currentPresetCategory === 'custom') {
          if (!item.id.startsWith('cust-')) return false;
        } else if (item.category !== currentPresetCategory) {
          return false;
        }
      }
      // Search match
      if (searchTerm) {
        return item.name.toLowerCase().includes(searchTerm) || (item.serving && item.serving.toLowerCase().includes(searchTerm));
      }
      return true;
    });

    DOM.presetsGridContainer.innerHTML = '';

    if (filtered.length === 0) {
      DOM.presetsGridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
          No matching food presets found. Try another search or category.
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'preset-card';

      card.innerHTML = `
        <div class="preset-card-top">
          <div>
            <div class="preset-food-name">${escapeHtml(item.name)}</div>
            <div class="preset-food-serving">${escapeHtml(item.serving || '1 portion')}</div>
          </div>
          <button class="btn-preset-add" title="Add to current meal" data-id="${item.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="preset-card-bottom">
          <span class="preset-calories">${Math.round(item.calories)} kcal</span>
          <span class="preset-macros-compact">P: ${item.protein}g | C: ${item.carbs}g | F: ${item.fat}g</span>
        </div>
      `;

      card.querySelector('.btn-preset-add').addEventListener('click', () => {
        const targetMeal = DOM.presetMealTarget.value || 'breakfast';
        addFoodToMeal(targetMeal, {
          name: item.name,
          serving: item.serving,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        });
        showToast(`Added ${item.name} to ${capitalize(targetMeal)}!`, 'info');
      });

      DOM.presetsGridContainer.appendChild(card);
    });
  }

  function addFoodToMeal(mealKey, foodData) {
    const dayLog = getDayLog(currentDate);
    const newFood = {
      id: 'food_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: foodData.name,
      serving: foodData.serving || '1 portion',
      calories: Number(foodData.calories) || 0,
      protein: foodData.protein !== '' ? Number(foodData.protein) : 0,
      carbs: foodData.carbs !== '' ? Number(foodData.carbs) : 0,
      fat: foodData.fat !== '' ? Number(foodData.fat) : 0,
      timestamp: Date.now()
    };

    if (!dayLog.meals[mealKey]) {
      dayLog.meals[mealKey] = [];
    }
    dayLog.meals[mealKey].push(newFood);
    saveLogs();
    renderAll();
  }

  // ==========================================
  // FOOD FORM (ADD / EDIT)
  // ==========================================
  function openFoodModal(mealKey = 'breakfast', editItemId = null) {
    DOM.foodEditId.value = editItemId || '';
    DOM.foodMealSelect.value = mealKey;

    if (editItemId) {
      DOM.modalFoodTitle.textContent = 'Edit Food Item';
      const dayLog = getDayLog(currentDate);
      let foundItem = null;

      Object.keys(dayLog.meals).forEach(k => {
        const match = dayLog.meals[k].find(i => i.id === editItemId);
        if (match) {
          foundItem = match;
          DOM.foodMealSelect.value = k;
        }
      });

      if (foundItem) {
        DOM.foodNameInput.value = foundItem.name;
        DOM.foodServingInput.value = foundItem.serving || '';
        DOM.foodCaloriesInput.value = foundItem.calories;
        DOM.foodProteinInput.value = foundItem.protein !== undefined ? foundItem.protein : '';
        DOM.foodCarbsInput.value = foundItem.carbs !== undefined ? foundItem.carbs : '';
        DOM.foodFatInput.value = foundItem.fat !== undefined ? foundItem.fat : '';
      }
      DOM.foodSaveToPresets.parentElement.style.display = 'none';
    } else {
      DOM.modalFoodTitle.textContent = 'Add Food Item';
      DOM.foodNameInput.value = '';
      DOM.foodServingInput.value = '';
      DOM.foodCaloriesInput.value = '';
      DOM.foodProteinInput.value = '';
      DOM.foodCarbsInput.value = '';
      DOM.foodFatInput.value = '';
      DOM.foodSaveToPresets.checked = false;
      DOM.foodSaveToPresets.parentElement.style.display = 'flex';
    }

    openModal(DOM.modalFoodEntry);
    setTimeout(() => DOM.foodNameInput.focus(), 50);
  }

  function handleFoodFormSubmit(e) {
    e.preventDefault();
    const name = DOM.foodNameInput.value.trim();
    const meal = DOM.foodMealSelect.value;
    const serving = DOM.foodServingInput.value.trim() || '1 serving';
    const calories = parseFloat(DOM.foodCaloriesInput.value);
    const protein = DOM.foodProteinInput.value !== '' ? parseFloat(DOM.foodProteinInput.value) : 0;
    const carbs = DOM.foodCarbsInput.value !== '' ? parseFloat(DOM.foodCarbsInput.value) : 0;
    const fat = DOM.foodFatInput.value !== '' ? parseFloat(DOM.foodFatInput.value) : 0;
    const editId = DOM.foodEditId.value;

    if (!name || isNaN(calories)) {
      showToast('Please enter food name and valid calories', 'error');
      return;
    }

    const dayLog = getDayLog(currentDate);

    if (editId) {
      // Editing existing food: find and update
      Object.keys(dayLog.meals).forEach(k => {
        const idx = dayLog.meals[k].findIndex(i => i.id === editId);
        if (idx !== -1) {
          if (k === meal) {
            dayLog.meals[k][idx] = {
              ...dayLog.meals[k][idx],
              name,
              serving,
              calories,
              protein,
              carbs,
              fat
            };
          } else {
            // Moved to a different meal
            const [item] = dayLog.meals[k].splice(idx, 1);
            item.name = name;
            item.serving = serving;
            item.calories = calories;
            item.protein = protein;
            item.carbs = carbs;
            item.fat = fat;
            dayLog.meals[meal].push(item);
          }
        }
      });
      showToast(`Updated "${name}"`, 'info');
    } else {
      // Create new food
      addFoodToMeal(meal, { name, serving, calories, protein, carbs, fat });

      // Save to presets if checkbox was ticked
      if (DOM.foodSaveToPresets.checked) {
        const customItem = {
          id: 'cust-' + Date.now(),
          name,
          serving,
          calories,
          protein,
          carbs,
          fat,
          category: 'custom'
        };
        customPresets.unshift(customItem);
        saveCustomPresets();
        renderPresets();
        showToast(`Saved "${name}" to your Food Library!`, 'info');
      } else {
        showToast(`Logged "${name}" to ${capitalize(meal)}!`, 'info');
      }
    }

    saveLogs();
    renderAll();
    closeModal(DOM.modalFoodEntry);
  }

  function deleteFoodItem(mealKey, itemId) {
    const dayLog = getDayLog(currentDate);
    if (!dayLog.meals[mealKey]) return;

    const idx = dayLog.meals[mealKey].findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const removed = dayLog.meals[mealKey].splice(idx, 1);
      saveLogs();
      renderAll();
      showToast(`Removed "${removed[0].name}"`, 'info');
    }
  }

  // Auto calculate calories from macro numbers: (4 * P) + (4 * C) + (9 * F)
  function autoCalculateCalories() {
    const p = parseFloat(DOM.foodProteinInput.value) || 0;
    const c = parseFloat(DOM.foodCarbsInput.value) || 0;
    const f = parseFloat(DOM.foodFatInput.value) || 0;

    if (p === 0 && c === 0 && f === 0) {
      showToast('Enter Protein, Carbs, or Fat to calculate', 'info');
      return;
    }

    const calculated = Math.round((p * 4) + (c * 4) + (f * 9));
    DOM.foodCaloriesInput.value = calculated;
    showToast(`Calculated: ${calculated} kcal from macros`, 'info');
  }

  // ==========================================
  // TDEE & BMR CALCULATOR
  // ==========================================
  function runTDEECalculation() {
    const genderInput = document.querySelector('input[name="calc-gender"]:checked');
    const gender = genderInput ? genderInput.value : 'male';
    const age = parseFloat(DOM.calcAge.value) || 28;
    const weight = parseFloat(DOM.calcWeight.value) || 75;
    const height = parseFloat(DOM.calcHeight.value) || 175;
    const activityMult = parseFloat(DOM.calcActivity.value) || 1.375;
    const goalDelta = parseFloat(DOM.calcGoalType.value) || 0;

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activityMult;
    const target = Math.max(1200, Math.round(tdee + goalDelta));

    DOM.resBmr.textContent = `${Math.round(bmr).toLocaleString()} kcal`;
    DOM.resTdee.textContent = `${Math.round(tdee).toLocaleString()} kcal`;
    DOM.resTarget.textContent = `${target.toLocaleString()} kcal`;

    return target;
  }

  function applyTDEECalculation() {
    const target = runTDEECalculation();
    appProfile.calorieGoal = target;

    // Auto-balance macros: 30% Protein, 40% Carbs, 30% Fat
    const pKcal = target * 0.30;
    const cKcal = target * 0.40;
    const fKcal = target * 0.30;

    appProfile.proteinGoal = Math.round(pKcal / 4);
    appProfile.carbsGoal = Math.round(cKcal / 4);
    appProfile.fatGoal = Math.round(fKcal / 9);

    saveProfile();
    renderAll();
    closeModal(DOM.modalCalculator);
    showToast(`Daily Goal set to ${target.toLocaleString()} kcal!`, 'info');
  }

  // ==========================================
  // SETTINGS & PROFILE FORM
  // ==========================================
  function openSettingsModal() {
    DOM.settingsCalorieGoal.value = appProfile.calorieGoal;
    DOM.settingsProteinGoal.value = appProfile.proteinGoal;
    DOM.settingsCarbsGoal.value = appProfile.carbsGoal;
    DOM.settingsFatGoal.value = appProfile.fatGoal;
    openModal(DOM.modalSettings);
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    const cals = parseInt(DOM.settingsCalorieGoal.value, 10);
    const p = parseInt(DOM.settingsProteinGoal.value, 10);
    const c = parseInt(DOM.settingsCarbsGoal.value, 10);
    const f = parseInt(DOM.settingsFatGoal.value, 10);

    if (isNaN(cals) || cals < 500) {
      showToast('Please enter a realistic calorie goal (min 500)', 'error');
      return;
    }

    appProfile.calorieGoal = cals;
    appProfile.proteinGoal = isNaN(p) ? 150 : p;
    appProfile.carbsGoal = isNaN(c) ? 200 : c;
    appProfile.fatGoal = isNaN(f) ? 65 : f;

    saveProfile();
    renderAll();
    closeModal(DOM.modalSettings);
    showToast('Nutrition preferences saved successfully!', 'info');
  }

  // Export / Import Data
  function exportUserData() {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: appProfile,
      logs: appLogs,
      customPresets: customPresets
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack-backup-${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data exported successfully!', 'info');
  }

  function importUserData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const imported = JSON.parse(evt.target.result);
        if (imported.profile && imported.logs) {
          appProfile = { ...DEFAULT_PROFILE, ...imported.profile };
          appLogs = imported.logs;
          customPresets = imported.customPresets || [];

          saveProfile();
          saveLogs();
          saveCustomPresets();

          renderAll();
          renderPresets();
          closeModal(DOM.modalSettings);
          showToast('Data restored successfully!', 'info');
        } else {
          showToast('Invalid backup file structure.', 'error');
        }
      } catch (err) {
        console.error('Import error:', err);
        showToast('Failed to parse backup file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function clearAllData() {
    if (confirm('Are you sure you want to reset all data? This will clear all logged meals, water history, and reset goals.')) {
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRESETS);

      appLogs = {};
      appProfile = { ...DEFAULT_PROFILE };
      customPresets = [];
      saveProfile();
      saveLogs();
      renderAll();
      renderPresets();
      closeModal(DOM.modalSettings);
      showToast('All data has been reset.', 'info');
    }
  }

  // ==========================================
  // MODAL CONTROLS
  // ==========================================
  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : (type === 'info' ? 'toast-info' : '')}`;
    toast.textContent = message;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  function bindEvents() {
    // Date Navigation
    DOM.prevDayBtn.addEventListener('click', () => {
      setDate(offsetDateString(currentDate, -1));
    });

    DOM.nextDayBtn.addEventListener('click', () => {
      setDate(offsetDateString(currentDate, 1));
    });

    DOM.todayBtn.addEventListener('click', () => {
      setDate(getTodayDateString());
    });

    DOM.datePickerInput.addEventListener('change', (e) => {
      if (e.target.value) {
        setDate(e.target.value);
      }
    });

    // Quick Change Goal
    DOM.quickChangeGoalBtn.addEventListener('click', openSettingsModal);

    // Food Entry & Meal Add
    DOM.btnQuickAddMeal.addEventListener('click', () => openFoodModal('breakfast'));

    document.querySelectorAll('.btn-add-to-meal').forEach(btn => {
      btn.addEventListener('click', () => {
        const meal = btn.dataset.meal || 'breakfast';
        openFoodModal(meal);
      });
    });

    DOM.foodForm.addEventListener('submit', handleFoodFormSubmit);
    DOM.btnAutocalcCalories.addEventListener('click', autoCalculateCalories);

    // Edit and Delete Food delegations
    document.querySelector('.meals-cards-container').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-food-btn');
      if (editBtn) {
        const id = editBtn.dataset.id;
        const meal = editBtn.dataset.meal;
        openFoodModal(meal, id);
        return;
      }

      const delBtn = e.target.closest('.delete-food-btn');
      if (delBtn) {
        const id = delBtn.dataset.id;
        const meal = delBtn.dataset.meal;
        deleteFoodItem(meal, id);
        return;
      }
    });

    // Water Controls
    DOM.btnWaterPlus.addEventListener('click', () => {
      const dayLog = getDayLog(currentDate);
      dayLog.water = Math.min((dayLog.water || 0) + 1, 16);
      saveLogs();
      renderWater();
      showToast(`+1 Glass! Total: ${dayLog.water * 250} ml`, 'info');
    });

    DOM.btnWaterMinus.addEventListener('click', () => {
      const dayLog = getDayLog(currentDate);
      dayLog.water = Math.max((dayLog.water || 0) - 1, 0);
      saveLogs();
      renderWater();
    });

    DOM.btnWaterReset.addEventListener('click', () => {
      const dayLog = getDayLog(currentDate);
      dayLog.water = 0;
      saveLogs();
      renderWater();
      showToast('Water intake reset', 'info');
    });

    // Presets Modal
    DOM.btnOpenPresets.addEventListener('click', () => {
      openModal(DOM.modalPresets);
      renderPresets();
      setTimeout(() => DOM.presetsSearchInput.focus(), 50);
    });

    DOM.presetsSearchInput.addEventListener('input', renderPresets);

    document.querySelectorAll('.preset-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentPresetCategory = tab.dataset.cat || 'all';
        renderPresets();
      });
    });

    // Calculator Modal
    DOM.btnOpenCalculator.addEventListener('click', () => {
      openModal(DOM.modalCalculator);
      runTDEECalculation();
    });

    DOM.btnRunCalc.addEventListener('click', runTDEECalculation);
    DOM.calcForm.addEventListener('input', runTDEECalculation);
    DOM.btnApplyCalcGoal.addEventListener('click', applyTDEECalculation);

    // Settings Modal
    DOM.btnOpenSettings.addEventListener('click', openSettingsModal);
    DOM.settingsForm.addEventListener('submit', handleSettingsSubmit);
    DOM.btnExportData.addEventListener('click', exportUserData);
    DOM.fileImportInput.addEventListener('change', importUserData);
    DOM.btnClearData.addEventListener('click', clearAllData);

    // Modal Close Buttons & Backdrop Clicks
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.closeModal;
        const modal = document.getElementById(modalId);
        if (modal) closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    });

    // Escape Key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
          closeModal(modal);
        });
      }
    });
  }

  // Kickoff on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

