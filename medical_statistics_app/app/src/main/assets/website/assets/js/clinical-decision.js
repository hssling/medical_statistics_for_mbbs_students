// Clinical Decision Support Simulator
// Interactive tool for learning diagnostic decision-making

class ClinicalDecisionSimulator {
    constructor(containerId) {
        this.containerId = containerId;
        this.patient = null;
        this.probabilities = {};
        this.decisionTree = {};
        this.currentNode = null;
        this.diagnosisHistory = [];

        this.init();
    }

    init() {
        this.createPatientDatabase();
        this.createDiagnosticTree();
        this.renderUI();
    }

    createPatientDatabase() {
        this.patientDatabase = [
            {
                id: 1,
                name: "Sarah Johnson",
                age: 45,
                gender: "Female",
                symptoms: ["chest pain", "shortness of breath", "fatigue"],
                pmh: ["hypertension", "family history of heart disease"],
                medications: ["lisinopril 10mg"],
                vitals: {bp: "150/95", hr: "85", temp: "98.6°F"},
                labs: {troponin: "0.05 ng/mL", ck_mb: "6 ng/mL", ekg: "normal"},
                trueDiagnosis: "stable angina",
                probabilities: {
                    "stable angina": 0.7,
                    "acute MI": 0.15,
                    "pulmonary embolism": 0.05,
                    "pneumonia": 0.05,
                    "GERD": 0.05
                }
            },
            {
                id: 2,
                name: "Michael Chen",
                age: 32,
                gender: "Male",
                symptoms: ["fever", "cough", "sore throat", "headache"],
                pmh: ["asthma", "seasonal allergies"],
                medications: ["albuterol PRN"],
                vitals: {bp: "120/80", hr: "88", temp: "101.2°F"},
                labs: {wbc: "12.5 × 10³/μL", chest_xray: "clear"},
                trueDiagnosis: "viral upper respiratory infection",
                probabilities: {
                    "viral URI": 0.85,
                    "bacterial pneumonia": 0.08,
                    "COVID-19": 0.05,
                    "asthma exacerbation": 0.02
                }
            },
            {
                id: 3,
                name: "Maria Rodriguez",
                age: 28,
                gender: "Female",
                symptoms: ["nausea", "vomiting", "lower abdominal pain", "spotting"],
                pmh: ["mild anemia"],
                medications: ["prenatal vitamins"],
                vitals: {bp: "110/70", hr: "82", temp: "98.9°F"},
                labs: {hCG: "2,500 mIU/mL", hemoglobin: "11.5 g/dL"},
                trueDiagnosis: "early pregnancy complications",
                probabilities: {
                    "normal pregnancy": 0.6,
                    "ectopic pregnancy": 0.25,
                    "miscarriage": 0.1,
                    "ovarian cyst": 0.05
                }
            }
        ];
    }

    createDiagnosticTree() {
        this.decisionTree = {
            start: {
                text: "Welcome to the Clinical Decision Support Simulator. Choose a patient case to begin:",
                options: [
                    {text: "Case 1: 45-year-old female with chest pain", nextNode: "case1"},
                    {text: "Case 2: 32-year-old male with respiratory symptoms", nextNode: "case2"},
                    {text: "Case 3: 28-year-old female with abdominal pain", nextNode: "case3"}
                ]
            },
            case1: {
                patient: this.patientDatabase[0],
                text: "Patient: Sarah Johnson, 45F with chest pain, SOB, and fatigue. What initial diagnostic steps would you take?",
                options: [
                    {text: "Order ECG and cardiac enzymes", nextNode: "case1_ecg"},
                    {text: "Chest X-ray and pulmonary function tests", nextNode: "case1_cxr"},
                    {text: "CT chest scan", nextNode: "case1_ct", penalty: true}
                ],
                probabilities: this.patientDatabase[0].probabilities
            },
            case1_ecg: {
                text: "ECG shows normal sinus rhythm, normal enzymes (troponin 0.05). Clinical assessment suggests stable angina. What's your management plan?",
                options: [
                    {text: "Start anti-anginal therapy (beta-blocker, nitrate)", nextNode: "case1_correct"},
                    {text: "Immediate cardiac catheterization", nextNode: "case1_overtreatment"},
                    {text: "Stress test first", nextNode: "case1_delay"}
                ]
            },
            case1_correct: {
                outcome: "correct",
                text: "Excellent! You've correctly diagnosed stable angina and initiated appropriate medical therapy.",
                feedback: "Stable angina typically presents with chest pain on exertion. Normal ECG and enzymes with classic symptoms support this diagnosis. Medical therapy is first-line treatment unless symptoms are unstable."
            },
            case2: {
                patient: this.patientDatabase[1],
                text: "Patient: Michael Chen, 32M with fever, cough, and sore throat. How would you initially evaluate this patient?",
                options: [
                    {text: "Complete blood count and chest X-ray", nextNode: "case2_lab"},
                    {text: "COVID-19 test and wait for results", nextNode: "case2_covid"},
                    {text: "Empiric antibiotics for pneumonia", nextNode: "case2_antibiotics", penalty: true}
                ]
            },
            case2_lab: {
                text: "WBC 12.5K, chest X-ray clear. Symptoms suggest viral infection. What's your next step?",
                options: [
                    {text: "Conservative management with supportive care", nextNode: "case2_correct"},
                    {text: "Order viral panel", nextNode: "case2_overtesting"},
                    {text: "Hospitalize for possible pneumonia", nextNode: "case2_overtreatment"}
                ]
            }
        };
    }

    renderUI() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="clinical-simulator">
                <div class="sim-header">
                    <h3><i class="fas fa-stethoscope"></i> Clinical Decision Support Simulator</h3>
                    <p>Learn diagnostic reasoning through interactive case studies</p>
                </div>

                <div id="patientInfo" class="patient-info-card" style="display: none;">
                    <!-- Patient information will be displayed here -->
                </div>

                <div id="decisionArea" class="decision-area">
                    <div id="scenario" class="scenario-card">
                        <h4>Scenario</h4>
                        <div id="scenarioText"></div>
                    </div>

                    <div id="options" class="options-container">
                        <!-- Options will be displayed here -->
                    </div>
                </div>

                <div id="outcome" class="outcome-card" style="display: none;">
                    <!-- Outcome feedback will be shown here -->
                </div>

                <div class="sim-controls">
                    <button id="startBtn" class="btn primary">Start New Case</button>
                    <button id="resetBtn" class="btn secondary" style="display: none;">Try Again</button>
                    <button id="newPatientBtn" class="btn secondary" style="display: none;">Different Patient</button>
                </div>

                <div id="probabilitiesDisplay" class="probabilities-display" style="display: none;">
                    <h4>Current Diagnostic Probabilities</h4>
                    <div id="probChart"></div>
                </div>
            </div>
        `;

        this.bindEvents();
        this.startSimulation();
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());
        document.getElementById('newPatientBtn').addEventListener('click', () => this.startNewPatient());
    }

    startSimulation() {
        this.currentNode = 'start';
        this.diagnosisHistory = [];
        this.renderCurrentNode();
    }

    renderCurrentNode() {
        const node = this.decisionTree[this.currentNode];
        if (!node) return;

        const scenarioDiv = document.getElementById('scenarioText');
        const optionsDiv = document.getElementById('options');

        scenarioDiv.innerHTML = `<p>${node.text}</p>`;

        if (node.patient) {
            this.renderPatientInfo(node.patient);
        }

        if (node.outcome) {
            this.renderOutcome(node);
        } else {
            this.renderOptions(node.options);
        }

        if (node.probabilities) {
            this.renderProbabilities(node.probabilities);
        }

        this.updateControls();
    }

    renderPatientInfo(patient) {
        const patientDiv = document.getElementById('patientInfo');
        patientDiv.style.display = 'block';
        patientDiv.innerHTML = `
            <h4>Patient Information</h4>
            <div class="patient-details">
                <p><strong>${patient.name}, ${patient.age} ${patient.gender[0]}</strong></p>
                <p><strong>Symptoms:</strong> ${patient.symptoms.join(', ')}</p>
                <p><strong>PMH:</strong> ${patient.pmh.join(', ')}</p>
                <p><strong>Medications:</strong> ${patient.medications.join(', ')}</p>
                <p><strong>Vitals:</strong> BP ${patient.vitals.bp}, HR ${patient.vitals.hr}, Temp ${patient.vitals.temp}</p>
            </div>
        `;
    }

    renderOptions(options) {
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '<h4>Select your next action:</h4>';

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'decision-btn';
            button.textContent = option.text;
            button.onclick = () => this.makeDecision(option, index);
            optionsDiv.appendChild(button);
        });
    }

    renderOutcome(node) {
        const outcomeDiv = document.getElementById('outcome');

        let outcomeClass = 'outcome-correct';
        let icon = 'check-circle';
        let heading = 'Correct Diagnosis!';

        if (node.outcome === 'incorrect') {
            outcomeClass = 'outcome-incorrect';
            icon = 'times-circle';
            heading = 'Incorrect Diagnosis';
        } else if (node.outcome === 'penalty') {
            outcomeClass = 'outcome-penalty';
            icon = 'exclamation-triangle';
            heading = 'Sub-optimal Choice';
        }

        outcomeDiv.className = `outcome-card ${outcomeClass}`;
        outcomeDiv.style.display = 'block';
        outcomeDiv.innerHTML = `
            <div class="outcome-header">
                <i class="fas fa-${icon}"></i>
                <h4>${heading}</h4>
            </div>
            <p>${node.text}</p>
            ${node.feedback ? `<div class="feedback"><p><strong>Learning Points:</strong> ${node.feedback}</p></div>` : ''}
        `;

        const optionsDiv = document.getElementById('options');
        optionsDiv.style.display = 'none';
    }

    renderProbabilities(probabilities) {
        const probDiv = document.getElementById('probabilitiesDisplay');
        probDiv.style.display = 'block';

        const probChart = document.getElementById('probChart');
        probChart.innerHTML = '';

        Object.entries(probabilities).forEach(([diagnosis, prob]) => {
            const probBar = document.createElement('div');
            probBar.className = 'probability-bar';
            probBar.innerHTML = `
                <div class="diagnosis-name">${diagnosis}</div>
                <div class="probability-bar-bg">
                    <div class="probability-bar-fill" style="width: ${prob * 100}%">
                        <span class="probability-text">${(prob * 100).toFixed(1)}%</span>
                    </div>
                </div>
            `;
            probChart.appendChild(probBar);
        });
    }

    makeDecision(option, index) {
        this.diagnosisHistory.push({
            node: this.currentNode,
            choice: index,
            option: option.text
        });

        if (option.nextNode) {
            this.currentNode = option.nextNode;
            this.renderCurrentNode();
        } else if (option.penalty) {
            // Handle penalty decisions
            const penaltyNode = {...option};
            penaltyNode.outcome = 'penalty';
            penaltyNode.text = `That choice was sub-optimal. ${penaltyNode.text}`;
            penaltyNode.feedback = "Consider cost-effectiveness and clinical appropriateness when ordering tests.";
            this.renderOutcome(penaltyNode);
        }
    }

    updateControls() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const newPatientBtn = document.getElementById('newPatientBtn');

        if (this.currentNode === 'start') {
            startBtn.style.display = 'inline-block';
            resetBtn.style.display = 'none';
            newPatientBtn.style.display = 'none';
        } else {
            startBtn.style.display = 'none';
            resetBtn.style.display = 'inline-block';
            newPatientBtn.style.display = 'inline-block';
        }
    }

    resetSimulation() {
        this.currentNode = null;
        this.patient = null;
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('outcome').style.display = 'none';
        document.getElementById('probabilitiesDisplay').style.display = 'none';
        this.startSimulation();
    }

    startNewPatient() {
        this.resetSimulation();
    }
}

// Statistics Learning Game
class StatsLearningGame {
    constructor(gameContainerId) {
        this.gameContainerId = gameContainerId;
        this.questions = this.createQuestions();
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 30;

        this.initGame();
    }

    createQuestions() {
        return [
            {
                question: "What is the sum of all probabilities in a probability distribution?",
                options: ["0", "1", "100", "It varies"],
                correct: 1,
                explanation: "The sum of all probabilities in any probability distribution must equal 1 (or 100% when expressed as a percentage). This is a fundamental rule of probability theory."
            },
            {
                question: "In a normal distribution, what percentage of data falls within 2 standard deviations of the mean?",
                options: ["68%", "95%", "99.7%", "50%"],
                correct: 1,
                explanation: "In a normal distribution: 68% within 1 SD, 95% within 2 SD, and 99.7% within 3 SD of the mean."
            },
            {
                question: "What does a p-value of 0.03 mean?",
                options: [
                    "There's a 3% chance the results are due to chance",
                    "The results are 97% likely to be true", 
                    "There's a 97% chance the null hypothesis is false",
                    "The study had a 3% error rate"
                ],
                correct: 0,
                explanation: "A p-value of 0.03 means there's a 3% probability of observing these results (or more extreme) if the null hypothesis were true. It doesn't tell us the probability that the results are true."
            },
            {
                question: "What is the Central Limit Theorem?",
                options: [
                    "The sum of squares equals the variance",
                    "Sample means become normally distributed as sample size increases",
                    "P-values become smaller with larger samples",
                    "T-tests are better than ANOVA"
                ],
                correct: 1,
                explanation: "The Central Limit Theorem states that as sample size increases, the sampling distribution of sample means approaches a normal distribution, regardless of the shape of the population distribution."
            },
            {
                question: "Which correlation coefficient represents perfect positive correlation?",
                options: ["-1", "-0.5", "0", "+1"],
                correct: 3,
                explanation: "A correlation coefficient of +1 indicates perfect positive linear relationship (as one variable increases, the other increases proportionally)."
            }
        ];
    }

    initGame() {
        const container = document.getElementById(this.gameContainerId);
        if (!container) return;

        container.innerHTML = `
            <div class="stats-game">
                <header class="game-header">
                    <h3><i class="fas fa-brain"></i> Medical Statistics Quiz</h3>
                    <div class="game-stats">
                        <span>Score: <span id="score">0</span></span>
                        <span>Question: <span id="questionNum">1</span>/<span id="totalQuestions">${this.questions.length}</span></span>
                        <span>Time: <span id="timer">30</span>s</span>
                    </div>
                </header>

                <div id="questionArea" class="question-area">
                    <!-- Question and options will be rendered here -->
                </div>

                <div id="explanationArea" class="explanation-area" style="display: none;">
                    <!-- Explanation will be shown here -->
                </div>

                <div class="game-controls">
                    <button id="startGameBtn" class="btn primary">Start Quiz</button>
                    <button id="nextBtn" class="btn primary" style="display: none;">Next Question</button>
                    <button id="restartBtn" class="btn secondary" style="display: none;">Play Again</button>
                </div>

                <div id="gameResults" class="game-results" style="display: none;">
                    <!-- Final results will be shown here -->
                </div>
            </div>
        `;

        this.bindGameEvents();
    }

    bindGameEvents() {
        const startBtn = document.getElementById('startGameBtn');
        const nextBtn = document.getElementById('nextBtn');
        const restartBtn = document.getElementById('restartBtn');

        startBtn.addEventListener('click', () => this.startGame());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        restartBtn.addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        document.getElementById('startGameBtn').style.display = 'none';
        this.showQuestion();
        this.startTimer();
    }

    showQuestion() {
        const questionArea = document.getElementById('questionArea');
        const explanationArea = document.getElementById('explanationArea');

        // Hide explanation area
        explanationArea.style.display = 'none';

        const currentQ = this.questions[this.currentQuestion];
        questionArea.innerHTML = `
            <h4>${currentQ.question}</h4>
            <div class="options-container">
                ${currentQ.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;

        // Update question counter
        document.getElementById('questionNum').textContent = this.currentQuestion + 1;

        // Bind option click events
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAnswer(parseInt(e.target.dataset.index));
            });
        });
    }

    selectAnswer(selectedIndex) {
        const currentQ = this.questions[this.currentQuestion];
        const optionButtons = document.querySelectorAll('.option-btn');

        // Disable all buttons
        optionButtons.forEach(btn => btn.disabled = true);

        // Highlight correct and selected answers
        optionButtons.forEach((btn, index) => {
            if (index === currentQ.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex) {
                if (selectedIndex === currentQ.correct) {
                    this.score++;
                    document.getElementById('score').textContent = this.score;
                } else {
                    btn.classList.add('incorrect');
                }
            }
        });

        // Show explanation
        this.showExplanation();
        this.stopTimer();

        // Show next button
        document.getElementById('nextBtn').style.display = 'inline-block';
    }

    showExplanation() {
        const explanationArea = document.getElementById('explanationArea');
        const currentQ = this.questions[this.currentQuestion];

        explanationArea.style.display = 'block';
        explanationArea.innerHTML = `
            <h4>Explanation</h4>
            <p>${currentQ.explanation}</p>
            <div class="correct-answer">
                <strong>Correct Answer:</strong> ${currentQ.options[currentQ.correct]}
            </div>
        `;
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
        } else {
            this.timeLeft = 30;
            document.getElementById('timer').textContent = this.timeLeft;
            document.getElementById('nextBtn').style.display = 'none';
            this.showQuestion();
            this.startTimer();
        }
    }

    showResults() {
        document.getElementById('questionArea').style.display = 'none';
        document.getElementById('explanationArea').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';

        const resultsDiv = document.getElementById('gameResults');
        resultsDiv.style.display = 'block';

        const percentage = Math.round((this.score / this.questions.length) * 100);
        let performance = 'Keep studying!';
        if (percentage >= 90) performance = 'Medical statistics expert!';
        else if (percentage >= 80) performance = 'Very good!';
        else if (percentage >= 70) performance = 'Good work!';
        else if (percentage >= 60) performance = 'Not bad!';

        resultsDiv.innerHTML = `
            <h3>Quiz Complete!</h3>
            <div class="final-score">
                <div class="score-circle">
                    <span class="score-number">${percentage}%</span>
                    <span class="score-label">Score</span>
                </div>
            </div>
            <p class="performance-message">${performance}</p>
            <p>You answered ${this.score} out of ${this.questions.length} questions correctly.</p>
        `;

        document.getElementById('restartBtn').style.display = 'inline-block';
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.timeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    timeOut() {
        // Auto-select the first (incorrect) option
        this.selectAnswer(-1);
    }

    restartGame() {
        document.getElementById('gameResults').style.display = 'none';
        document.getElementById('questionArea').style.display = 'block';
        document.getElementById('restartBtn').style.display = 'none';
        this.startGame();
    }
}

// Initialize features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize clinical decision simulator
    new ClinicalDecisionSimulator('clinicalSimulator');

    // Initialize statistics learning game
    new StatsLearningGame('statsGame');
});
