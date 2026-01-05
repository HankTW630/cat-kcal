/**
 * 貓咪熱量計算器
 * 計算靜止能量需求（RER）和每日熱量需求（DER）
 */

/**
 * 計算靜止能量需求（RER）
 * 公式: RER = 體重(kg)^0.75 × 70
 *
 * @param {number} weight - 貓咪體重（公斤）
 * @returns {number} RER值（kcal/天）
 */
function calculateRER(weight) {
    // 計算 weight^0.75
    // 方法: weight^3 的平方根的平方根
    // 或使用 Math.pow(weight, 0.75)
    const rer = Math.pow(weight, 0.75) * 70;
    return Math.round(rer);
}

/**
 * 計算每日熱量需求（DER）範圍
 * 公式: DER = RER × 需求因子
 *
 * @param {number} rer - 靜止能量需求
 * @param {number} minFactor - 最小需求因子
 * @param {number} maxFactor - 最大需求因子
 * @returns {object} DER範圍 {min, max}
 */
function calculateDER(rer, minFactor, maxFactor) {
    return {
        min: Math.round(rer * minFactor),
        max: Math.round(rer * maxFactor)
    };
}

/**
 * 主計算函數
 */
function calculateCalories() {
    // 獲取輸入值
    const weightInput = document.getElementById('weight');
    const lifestageSelect = document.getElementById('lifestage');

    const weight = parseFloat(weightInput.value);
    const factorRange = lifestageSelect.value;

    // 驗證輸入
    if (!weight || weight <= 0) {
        alert('請輸入有效的體重！');
        weightInput.focus();
        return;
    }

    if (!factorRange) {
        alert('請選擇貓咪的生活階段！');
        lifestageSelect.focus();
        return;
    }

    if (weight > 20) {
        alert('體重似乎過大，請確認輸入正確！');
        return;
    }

    // 解析需求因子範圍
    const [minFactor, maxFactor] = factorRange.split(',').map(parseFloat);

    // 計算RER和DER範圍
    const rer = calculateRER(weight);
    const der = calculateDER(rer, minFactor, maxFactor);

    // 顯示結果
    document.getElementById('rerValue').textContent = rer;
    document.getElementById('derMinValue').textContent = der.min;
    document.getElementById('derMaxValue').textContent = der.max;

    // 計算並顯示食材換算
    // 主食罐
    const wetFoodMin = convertKcalToGrams(der.min, FOOD_RATIOS.wetFood);
    const wetFoodMax = convertKcalToGrams(der.max, FOOD_RATIOS.wetFood);
    document.getElementById('wetFoodMin').textContent = wetFoodMin;
    document.getElementById('wetFoodMax').textContent = wetFoodMax;

    // 生肉
    const rawMeatMin = convertKcalToGrams(der.min, FOOD_RATIOS.rawMeat);
    const rawMeatMax = convertKcalToGrams(der.max, FOOD_RATIOS.rawMeat);
    document.getElementById('rawMeatMin').textContent = rawMeatMin;
    document.getElementById('rawMeatMax').textContent = rawMeatMax;

    // 凍乾
    const freezeDriedMin = convertKcalToGrams(der.min, FOOD_RATIOS.freezeDried);
    const freezeDriedMax = convertKcalToGrams(der.max, FOOD_RATIOS.freezeDried);
    document.getElementById('freezeDriedMin').textContent = freezeDriedMin;
    document.getElementById('freezeDriedMax').textContent = freezeDriedMax;

    // 顯示結果區域
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';

    // 平滑滾動到結果區域
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * localStorage 操作函數
 * localStorage 在本地文件(file://)也能正常工作
 */
function saveData(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error('無法儲存資料:', e);
    }
}

function getData(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error('無法讀取資料:', e);
        return null;
    }
}

/**
 * 儲存用戶輸入到 localStorage
 */
function saveUserData() {
    const weight = document.getElementById('weight').value;
    const lifestage = document.getElementById('lifestage').value;

    if (weight) {
        saveData('catWeight', weight);
    }
    if (lifestage) {
        saveData('catLifestage', lifestage);
    }
}

/**
 * 從 localStorage 載入用戶資料
 */
function loadUserData() {
    const savedWeight = getData('catWeight');
    const savedLifestage = getData('catLifestage');

    if (savedWeight) {
        document.getElementById('weight').value = savedWeight;
    }
    if (savedLifestage) {
        document.getElementById('lifestage').value = savedLifestage;
    }
}

/**
 * 自動計算(不需要驗證,靜默計算)
 */
function autoCalculate() {
    const weight = parseFloat(document.getElementById('weight').value);
    const factorRange = document.getElementById('lifestage').value;

    // 如果資料不完整,隱藏結果
    if (!weight || weight <= 0 || !factorRange) {
        document.getElementById('results').style.display = 'none';
        return;
    }

    // 解析需求因子範圍
    const [minFactor, maxFactor] = factorRange.split(',').map(parseFloat);

    // 計算RER和DER範圍
    const rer = calculateRER(weight);
    const der = calculateDER(rer, minFactor, maxFactor);

    // 顯示結果
    document.getElementById('rerValue').textContent = rer;
    document.getElementById('derMinValue').textContent = der.min;
    document.getElementById('derMaxValue').textContent = der.max;

    // 計算並顯示食材換算
    // 主食罐
    const wetFoodMin = convertKcalToGrams(der.min, FOOD_RATIOS.wetFood);
    const wetFoodMax = convertKcalToGrams(der.max, FOOD_RATIOS.wetFood);
    document.getElementById('wetFoodMin').textContent = wetFoodMin;
    document.getElementById('wetFoodMax').textContent = wetFoodMax;

    // 生肉
    const rawMeatMin = convertKcalToGrams(der.min, FOOD_RATIOS.rawMeat);
    const rawMeatMax = convertKcalToGrams(der.max, FOOD_RATIOS.rawMeat);
    document.getElementById('rawMeatMin').textContent = rawMeatMin;
    document.getElementById('rawMeatMax').textContent = rawMeatMax;

    // 凍乾
    const freezeDriedMin = convertKcalToGrams(der.min, FOOD_RATIOS.freezeDried);
    const freezeDriedMax = convertKcalToGrams(der.max, FOOD_RATIOS.freezeDried);
    document.getElementById('freezeDriedMin').textContent = freezeDriedMin;
    document.getElementById('freezeDriedMax').textContent = freezeDriedMax;

    // 顯示結果區域
    document.getElementById('results').style.display = 'block';
}

/**
 * 驗證數字輸入
 */
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight');
    const lifestageSelect = document.getElementById('lifestage');

    // 載入儲存的資料
    loadUserData();

    // 載入後如果有資料就自動計算
    autoCalculate();

    // 監聽輸入變化,自動儲存並計算
    weightInput.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
        autoCalculate();
    });

    weightInput.addEventListener('change', saveUserData);

    lifestageSelect.addEventListener('change', function() {
        saveUserData();
        autoCalculate();
    });

    // 監聽Enter鍵
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateCalories();
        }
    });

    lifestageSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateCalories();
        }
    });
});

/**
 * 食材熱量比率（kcal/g）
 */
const FOOD_RATIOS = {
    wetFood: 1,      // 主食罐: 1g = 1 kcal
    rawMeat: 1.5,    // 生肉: 1g = 1.5 kcal
    freezeDried: 4   // 凍乾: 1g = 4 kcal
};

/**
 * 將熱量轉換為食材重量
 * @param {number} kcal - 熱量（kcal）
 * @param {number} ratio - 熱量比率（kcal/g）
 * @returns {number} 食材重量（g）
 */
function convertKcalToGrams(kcal, ratio) {
    return Math.round(kcal / ratio);
}

/**
 * 將食材重量轉換為熱量
 * @param {number} grams - 食材重量（g）
 * @param {number} ratio - 熱量比率（kcal/g）
 * @returns {number} 熱量（kcal）
 */
function convertGramsToKcal(grams, ratio) {
    return Math.round(grams * ratio);
}

/**
 * 手動計算食材總熱量
 */
function calculateManualCalories() {
    // 獲取輸入值
    const wetFoodGrams = parseFloat(document.getElementById('wetFoodInput').value) || 0;
    const rawMeatGrams = parseFloat(document.getElementById('rawMeatInput').value) || 0;
    const freezeDriedGrams = parseFloat(document.getElementById('freezeDriedInput').value) || 0;

    // 計算各食材熱量
    const wetFoodKcal = convertGramsToKcal(wetFoodGrams, FOOD_RATIOS.wetFood);
    const rawMeatKcal = convertGramsToKcal(rawMeatGrams, FOOD_RATIOS.rawMeat);
    const freezeDriedKcal = convertGramsToKcal(freezeDriedGrams, FOOD_RATIOS.freezeDried);

    // 計算總熱量
    const totalKcal = wetFoodKcal + rawMeatKcal + freezeDriedKcal;

    // 顯示結果
    document.getElementById('wetFoodKcal').textContent = wetFoodKcal;
    document.getElementById('rawMeatKcal').textContent = rawMeatKcal;
    document.getElementById('freezeDriedKcal').textContent = freezeDriedKcal;
    document.getElementById('totalKcal').textContent = totalKcal;

    // 顯示結果區域
    const resultSection = document.getElementById('manualResult');
    resultSection.style.display = 'block';

    // 平滑滾動到結果
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 參考數據對照（用於驗證計算）
 */
const referenceRER = {
    1: 70,
    2: 118,
    3: 160,
    4: 198,
    5: 234,
    6: 268,
    7: 301,
    8: 333,
    9: 364,
    10: 394,
    11: 423,
    12: 451,
    13: 479,
    14: 507,
    15: 533
};
