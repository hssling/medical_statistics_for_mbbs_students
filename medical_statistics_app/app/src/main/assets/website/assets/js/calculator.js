// Sample Size Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const sampleSizeCalc = document.getElementById('sampleSizeCalc');
    const calcTypeSelect = document.getElementById('calcType');
    const calcInputs = document.getElementById('calcInputs');
    const calcResult = document.getElementById('calcResult');

    if (!sampleSizeCalc || !calcTypeSelect || !calcInputs || !calcResult) {
        console.warn('Calculator elements not found');
        return;
    }

    // Initialize calculator with default option
    updateCalculatorForm();

    // Update form when calculation type changes
    calcTypeSelect.addEventListener('change', updateCalculatorForm);

    // Handle form submission
    sampleSizeCalc.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSampleSize();
    });

    function updateCalculatorForm() {
        const calcType = calcTypeSelect.value;
        calcInputs.innerHTML = ''; // Clear existing inputs
        calcResult.innerHTML = ''; // Clear previous results

        let inputsHTML = '';

        if (calcType === 'means') {
            inputsHTML = `
                <div class="form-group">
                    <label for="expectedMean">Expected Mean Difference:</label>
                    <input type="number" id="expectedMean" class="calc-input" placeholder="3.0" step="0.1" required>
                </div>
                <div class="form-group">
                    <label for="sd">Standard Deviation:</label>
                    <input type="number" id="sd" class="calc-input" placeholder="5.0" step="0.1" required>
                </div>
            `;
        } else if (calcType === 'proportions') {
            inputsHTML = `
                <div class="form-group">
                    <label for="p1">Proportion 1:</label>
                    <input type="number" id="p1" class="calc-input" placeholder="0.20" min="0" max="1" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="p2">Proportion 2:</label>
                    <input type="number" id="p2" class="calc-input" placeholder="0.40" min="0" max="1" step="0.01" required>
                </div>
            `;
        } else if (calcType === 'survival') {
            inputsHTML = `
                <div class="form-group">
                    <label for="hr">Hazard Ratio:</label>
                    <input type="number" id="hr" class="calc-input" placeholder="0.75" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="probEvent">Probability of Event:</label>
                    <input type="number" id="probEvent" class="calc-input" placeholder="0.30" min="0" max="1" step="0.01" required>
                </div>
            `;
        }

        // Common inputs for all calculators
        inputsHTML += `
            <div class="form-group">
                <label for="power">Power (1-β):</label>
                <select id="power" class="calc-select" required>
                    <option value="0.80">80%</option>
                    <option value="0.85">85%</option>
                    <option value="0.90">90%</option>
                    <option value="0.95">95%</option>
                </select>
            </div>
            <div class="form-group">
                <label for="alpha">Alpha:</label>
                <select id="alpha" class="calc-select" required>
                    <option value="0.05">0.05 (95% confidence)</option>
                    <option value="0.01">0.01 (99% confidence)</option>
                    <option value="0.10">0.10 (90% confidence)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="tails">Test Type:</label>
                <select id="tails" class="calc-select" required>
                    <option value="2">Two-tailed</option>
                    <option value="1">One-tailed</option>
                </select>
            </div>
        `;

        calcInputs.innerHTML = inputsHTML;

        // Add input validation
        addInputValidation();
    }

    function addInputValidation() {
        const numericInputs = calcInputs.querySelectorAll('.calc-input[type="number"]');
        numericInputs.forEach(input => {
            input.addEventListener('input', function() {
                // Validation based on input type
                if (input.id === 'sd' && this.value < 0) {
                    this.setCustomValidity('Standard deviation must be positive');
                } else if (input.id.includes('p') && (this.value < 0 || this.value > 1)) {
                    this.setCustomValidity('Proportion must be between 0 and 1');
                } else if (input.id === 'hr' && this.value <= 0) {
                    this.setCustomValidity('Hazard ratio must be positive');
                } else {
                    this.setCustomValidity('');
                }
            });
        });
    }

    function calculateSampleSize() {
        const calcType = calcTypeSelect.value;
        let result = '';

        try {
            if (calcType === 'means') {
                result = calculateMeans();
            } else if (calcType === 'proportions') {
                result = calculateProportions();
            } else if (calcType === 'survival') {
                result = calculateSurvival();
            }

            calcResult.innerHTML = `<strong>Sample Size per Group:</strong> ${result}<br>
                                   <small>Note: Final sample size may need adjustment for dropouts</small>`;

        } catch (error) {
            calcResult.innerHTML = `<span style="color: #e74c3c;">Error: ${error.message}</span>`;
        }
    }

    function calculateMeans() {
        const delta = parseFloat(document.getElementById('expectedMean').value);
        const sigma = parseFloat(document.getElementById('sd').value);
        const power = parseFloat(document.getElementById('power').value);
        const alpha = parseFloat(document.getElementById('alpha').value);
        const tails = parseInt(document.getElementById('tails').value);

        if (delta <= 0 || sigma <= 0) throw new Error('Values must be positive');

        // Critical values from normal distribution
        const alphaCritical = tails === 1 ? normalCDFInverse(1 - alpha) : normalCDFInverse(1 - alpha/2);
        const betaCritical = normalCDFInverse(power);

        // Sample size formula: n = (σ² * (Zα + Zβ)²) / δ²
        const variance = sigma * sigma;
        const numerator = variance * Math.pow(alphaCritical + betaCritical, 2);
        const n = Math.ceil(numerator / (delta * delta));

        return `${n} subjects per group`;
    }

    function calculateProportions() {
        const p1 = parseFloat(document.getElementById('p1').value);
        const p2 = parseFloat(document.getElementById('p2').value);
        const power = parseFloat(document.getElementById('power').value);
        const alpha = parseFloat(document.getElementById('alpha').value);
        const tails = parseInt(document.getElementById('tails').value);

        if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) throw new Error('Proportions must be between 0 and 1');
        if (Math.abs(p1 - p2) === 0) throw new Error('Proportions must be different');

        // Critical values
        const alphaCritical = tails === 1 ? normalCDFInverse(1 - alpha) : normalCDFInverse(1 - alpha/2);
        const betaCritical = normalCDFInverse(power);

        // Pooled proportion for maximum sample size
        const p = (p1 + p2) / 2;

        // Sample size formula: n = p(1-p) * (Zα + Zβ)² / δ²
        const variance = p * (1 - p);
        const delta = Math.abs(p1 - p2);
        const numerator = variance * Math.pow(alphaCritical + betaCritical, 2);
        const n = Math.ceil(numerator / (delta * delta));

        return `${n} subjects per group`;
    }

    function calculateSurvival() {
        const hr = parseFloat(document.getElementById('hr').value);
        const probEvent = parseFloat(document.getElementById('probEvent').value);
        const power = parseFloat(document.getElementById('power').value);
        const alpha = parseFloat(document.getElementById('alpha').value);
        const tails = parseInt(document.getElementById('tails').value);

        if (hr <= 0 || probEvent <= 0 || probEvent >= 1) throw new Error('Invalid input values');

        // schildER formula approximation for survival analysis
        const alphaCritical = tails === 1 ? normalCDFInverse(1 - alpha) : normalCDFInverse(1 - alpha/2);
        const betaCritical = normalCDFInverse(power);

        // Simplified calculation using delta
        const delta = Math.abs(Math.log(hr)) * Math.sqrt(probEvent);
        const numerator = Math.pow(alphaCritical + betaCritical, 2);
        const n = Math.ceil(numerator / (2 * delta * delta));

        return `${n} subjects per group (approximate)`;
    }

    // Statistical helper functions
    function normalCDFInverse(p) {
        // Abramowicz & Stegun approximation
        const a1 = -3.969683028665376e+01;
        const a2 =  2.209460984245205e+02;
        const a3 = -2.759285104469687e+02;
        const a4 =  1.383577518672690e+02;
        const a5 = -3.066479806614716e+01;
        const a6 =  2.506628277459239e+00;

        const b1 = -5.447609879822406e+01;
        const b2 =  1.615858368580409e+02;
        const b3 = -1.556989798598866e+02;
        const b4 =  6.680131188771972e+01;
        const b5 = -1.328068155288572e+01;

        const c1 = -7.784894002430293e-03;
        const c2 = -3.223964580411365e-01;
        const c3 = -2.400758277161838e+00;
        const c4 = -2.549732539343734e+00;
        const c5 =  4.374664141464968e+00;
        const c6 =  2.938163982698783e+00;

        const d1 = 7.784695709041462e-03;
        const d2 = 3.224671290700398e-01;
        const d3 = 2.445134137142996e+00;
        const d4 = 3.754408661907416e+00;

        if (p <= 0 || p >= 1) return NaN;

        let q, r;

        if (p < 0.02425) {
            q = Math.sqrt(-2 * Math.log(p));
            return (((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) /
                   ((((d1*q+d2)*q+d3)*q+d4)*q+1);
        } else if (p <= 0.5) {
            q = p - 0.5;
            r = q * q;
            return (((((a1*r+a2)*r+a3)*r+a4)*r+a5)*r+a6)*q /
                   (((((b1*r+b2)*r+b3)*r+b4)*r+b5)*r+1);
        } else {
            q = Math.sqrt(-2 * Math.log(1 - p));
            return -(((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) /
                    ((((d1*q+d2)*q+d3)*q+d4)*q+1);
        }
    }

    // Add change event listeners for real-time validation
    calcInputs.addEventListener('change', function(e) {
        const target = e.target;
        if (target.classList.contains('calc-input') || target.classList.contains('calc-select')) {
            validateInput(target);
        }
    });

    function validateInput(input) {
        input.classList.remove('error');
        let errorMessage = '';

        if (input.id === 'sd' && input.value < 0) {
            errorMessage = 'Must be positive';
        } else if (input.id.includes('p') && (input.value < 0 || input.value > 1)) {
            errorMessage = 'Must be between 0 and 1';
        } else if (input.id === 'hr' && input.value <= 0) {
            errorMessage = 'Must be positive';
        } else if (input.id === 'expectedMean' && input.value <= 0) {
            errorMessage = 'Must be positive';
        }

        if (errorMessage) {
            input.classList.add('error');
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.style.cssText = `
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 4px;
                    display: block;
                `;
                errorSpan.textContent = errorMessage;
                input.parentNode.insertBefore(errorSpan, input.nextSibling);
            }
        } else {
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                input.nextElementSibling.remove();
            }
        }
    }
});
