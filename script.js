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

    // 顯示結果區域
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';

    // 平滑滾動到結果區域
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 驗證數字輸入
 */
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight');

    // 監聽Enter鍵
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateCalories();
        }
    });

    document.getElementById('lifestage').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateCalories();
        }
    });

    // 限制輸入為正數
    weightInput.addEventListener('input', function(e) {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});

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
