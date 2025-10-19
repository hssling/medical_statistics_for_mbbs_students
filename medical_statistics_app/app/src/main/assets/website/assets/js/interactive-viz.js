// Interactive Data Visualization JavaScript
// Advanced D3.js visualizations for medical statistics learning

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDataVisualizer();
    initializeCorrelationVisualizer();
    initializeDistributionVisualizer();
});

function initializeDataVisualizer() {
    // Scatter plot for BMI vs Blood Pressure with interactive regression
    createScatterPlot();
}

function initializeCorrelationVisualizer() {
    // Interactive correlation matrix heatmap
    createCorrelationMatrix();
}

function initializeDistributionVisualizer() {
    // Normal distribution playground with parameter adjustment
    createDistributionPlayground();
}

// Scatter Plot with Regression Line
function createScatterPlot() {
    const scatterContainer = document.getElementById('scatterPlot');
    if (!scatterContainer) return;

    // Sample medical data for visualization
    const data = [
        {bmi: 22.1, bp: 118, age: 25, gender: 'Female'},
        {bmi: 24.3, bp: 125, age: 32, gender: 'Male'},
        {bmi: 26.8, bp: 132, age: 45, gender: 'Female'},
        {bmi: 28.5, bp: 138, age: 52, gender: 'Male'},
        {bmi: 30.2, bp: 144, age: 58, gender: 'Male'},
        {bmi: 32.1, bp: 152, age: 61, gender: 'Female'},
        {bmi: 25.8, bp: 128, age: 38, gender: 'Female'},
        {bmi: 27.3, bp: 135, age: 49, gender: 'Male'},
        {bmi: 29.7, bp: 142, age: 55, gender: 'Male'},
        {bmi: 31.4, bp: 148, age: 62, gender: 'Female'}
    ];

    const margin = {top: 40, right: 40, bottom: 60, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(scatterContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([20, 35])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([110, 160])
        .range([height, 0]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(6))
        .append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("BMI (kg/m²)");

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(6))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height/2)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Blood Pressure (mmHg)");

    // Plot points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.bmi))
        .attr("cy", d => yScale(d.bp))
        .attr("r", 6)
        .attr("fill", "#667eea")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .append("title")
        .text(d => `BMI: ${d.bmi}, BP: ${d.bp} mmHg`);

    // Interactive regression line
    updateRegressionLine(svg, data, xScale, yScale);

    // Add interactivity
    svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "#ff6b6b");

            // Show tooltip
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "correlation-tooltip")
                .style("position", "absolute")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .style("background", "rgba(0,0,0,0.8)")
                .style("color", "white")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .html(`Age: ${d.age}<br>BMI: ${d.bmi}<br>BP: ${d.bp} mmHg<br>Gender: ${d.gender}`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("r", 6)
                .attr("fill", "#667eea");

            d3.selectAll(".correlation-tooltip").remove();
        });
}

function updateRegressionLine(svg, data, xScale, yScale) {
    // Calculate regression coefficients
    const n = data.length;
    const sumX = d3.sum(data, d => d.bmi);
    const sumY = d3.sum(data, d => d.bp);
    const sumXY = d3.sum(data, d => d.bmi * d.bp);
    const sumXX = d3.sum(data, d => d.bmi * d.bmi);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Remove old regression line
    svg.selectAll(".regression-line").remove();

    // Add new regression line
    const xMin = d3.min(data, d => d.bmi);
    const xMax = d3.max(data, d => d.bmi);
    const lineData = [{x: xMin, y: slope * xMin + intercept}, {x: xMax, y: slope * xMax + intercept}];

    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    svg.append("path")
        .datum(lineData)
        .attr("class", "regression-line")
        .attr("fill", "none")
        .attr("stroke", "#ff6b6b")
        .attr("stroke-width", 3)
        .attr("d", line);

    // Add regression equation text
    const equationText = `ŷ = ${intercept.toFixed(1)} + ${slope.toFixed(2)}×BMI`;

    svg.selectAll(".equation-text").remove();
    svg.append("text")
        .attr("class", "equation-text")
        .attr("x", width/2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#2c3e50")
        .style("font-weight", "bold")
        .text(equationText);
}

// Correlation Matrix Heatmap
function createCorrelationMatrix() {
    const correlationContainer = document.getElementById('correlationMatrix');
    if (!correlationContainer) return;

    // Sample correlation data for medical variables
    const variables = ["Age", "BMI", "BP", "Cholesterol", "HbA1c"];
    const correlations = [
        [1.0, 0.45, 0.62, 0.28, 0.33], // Age
        [0.45, 1.0, 0.71, 0.52, 0.67], // BMI
        [0.62, 0.71, 1.0, 0.48, 0.58], // BP
        [0.28, 0.52, 0.48, 1.0, 0.64], // Cholesterol
        [0.33, 0.67, 0.58, 0.64, 1.0]  // HbA1c
    ];

    const margin = {top: 80, right: 80, bottom: 80, left: 80};
    const size = 400;
    const cellSize = (size - margin.left - margin.right) / variables.length;

    const svg = d3.select(correlationContainer)
        .append("svg")
        .attr("width", size)
        .attr("height", size)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scale for correlations
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
        .domain([1, -1]);

    // Create cells
    variables.forEach((var1, i) => {
        variables.forEach((var2, j) => {
            const correlation = i <= j ? correlations[i][j] : correlations[j][i];

            const cell = svg.append("rect")
                .attr("x", i * cellSize)
                .attr("y", j * cellSize)
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("fill", colorScale(correlation))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .on("mouseover", function() {
                    d3.select(this).attr("stroke-width", 3);
                    showCorrelationTooltip(var1, var2, correlation, this);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("stroke-width", 1);
                    hideCorrelationTooltip();
                });

            // Add correlation text
            if (Math.abs(correlation) > 0.3) {
                svg.append("text")
                    .attr("x", i * cellSize + cellSize/2)
                    .attr("y", j * cellSize + cellSize/2)
                    .attr("text-anchor", "middle")
                    .attr("dy", ".35em")
                    .attr("fill", Math.abs(correlation) > 0.7 ? "white" : "black")
                    .style("font-size", "12px")
                    .style("font-weight", "bold")
                    .text(correlation.toFixed(2));
            }
        });
    });

    // Add axis labels
    svg.selectAll(".row-label")
        .data(variables)
        .enter()
        .append("text")
        .attr("class", "row-label")
        .attr("x", d => variables.indexOf(d) * cellSize + cellSize/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(d => d);

    svg.selectAll(".col-label")
        .data(variables)
        .enter()
        .append("text")
        .attr("class", "col-label")
        .attr("x", d => variables.indexOf(d) * cellSize + cellSize/2)
        .attr("y", size - margin.top - margin.bottom + 20)
        .attr("text-anchor", "middle")
        .attr("transform", d => `rotate(-90, ${variables.indexOf(d) * cellSize + cellSize/2}, ${size - margin.top - margin.bottom + 20})`)
        .style("font-weight", "bold")
        .text(d => d);
}

function showCorrelationTooltip(var1, var2, correlation, element) {
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "correlation-tooltip")
        .style("position", "absolute")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 10) + "px")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .html(`<strong>${var1} ↔ ${var2}</strong><br>
              Correlation: ${correlation.toFixed(3)}<br>
              Strength: ${getCorrelationStrength(Math.abs(correlation))}`);

    // Move tooltip if it's off-screen
    const rect = tooltip.node().getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        tooltip.style("left", (d3.event.pageX - rect.width - 10) + "px");
    }
}

function hideCorrelationTooltip() {
    d3.selectAll(".correlation-tooltip").remove();
}

function getCorrelationStrength(r) {
    if (r >= 0.8) return "Very Strong";
    if (r >= 0.6) return "Strong";
    if (r >= 0.4) return "Moderate";
    if (r >= 0.2) return "Weak";
    return "Very Weak";
}

// Distribution Playground
function createDistributionPlayground() {
    const distributionContainer = document.getElementById('distributionPlayground');
    if (!distributionContainer) return;

    // Create controls
    const controls = document.createElement('div');
    controls.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 10px;
    `;

    controls.innerHTML = `
        <div>
            <label for="meanSlider" style="display: block; font-weight: 600;">Mean: <span id="meanValue">120</span></label>
            <input type="range" id="meanSlider" min="100" max="160" value="120" step="1">
        </div>
        <div>
            <label for="sdSlider" style="display: block; font-weight: 600;">SD: <span id="sdValue">15</span></label>
            <input type="range" id="sdSlider" min="5" max="30" value="15" step="0.5">
        </div>
        <div>
            <label for="sampleSlider" style="display: block; font-weight: 600;">Sample Size: <span id="sampleValue">100</span></label>
            <input type="range" id="sampleSlider" min="50" max="1000" value="100" step="50">
        </div>
        <button id="generateBtn" style="padding: 8px 15px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Generate New Sample</button>
    `;

    distributionContainer.appendChild(controls);

    // Create SVG for distribution plot
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(distributionContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let currentMean = 120;
    let currentSD = 15;
    let sampleSize = 100;

    // Initial plot
    updateDistributionPlot(svg, width, height, currentMean, currentSD, sampleSize);

    // Add event listeners
    document.getElementById('meanSlider').addEventListener('input', function() {
        currentMean = parseFloat(this.value);
        document.getElementById('meanValue').textContent = currentMean;
        updateDistributionPlot(svg, width, height, currentMean, currentSD, sampleSize);
    });

    document.getElementById('sdSlider').addEventListener('input', function() {
        currentSD = parseFloat(this.value);
        document.getElementById('sdValue').textContent = currentSD;
        updateDistributionPlot(svg, width, height, currentMean, currentSD, sampleSize);
    });

    document.getElementById('sampleSlider').addEventListener('input', function() {
        sampleSize = parseInt(this.value);
        document.getElementById('sampleValue').textContent = sampleSize;
        updateDistributionPlot(svg, width, height, currentMean, currentSD, sampleSize);
    });

    document.getElementById('generateBtn').addEventListener('click', function() {
        updateDistributionPlot(svg, width, height, currentMean, currentSD, sampleSize);
    });
}

function updateDistributionPlot(svg, width, height, mean, sd, n) {
    // Clear previous plot
    svg.selectAll("*").remove();

    // Generate sample data
    const data = [];
    for (let i = 0; i < n; i++) {
        data.push(d3.randomNormal(mean, sd)());
    }

    // Calculate histogram
    const histogram = d3.histogram()
        .domain([mean - 4*sd, mean + 4*sd])
        .thresholds(20);

    const bins = histogram(data);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([mean - 4*sd, mean + 4*sd])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);

    // Normal curve
    const x = d3.range(mean - 4*sd, mean + 4*sd, 0.1);
    const yNormal = x.map(d => (1/(sd * Math.sqrt(2*Math.PI))) *
                          Math.exp(-0.5 * Math.pow((d - mean)/sd, 2)));

    const yScaleNormal = d3.scaleLinear()
        .domain([0, d3.max(yNormal)])
        .range([height, 0]);

    // Plot bars
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => height - yScale(d.length))
        .attr("fill", "#667eea")
        .attr("opacity", 0.7);

    // Plot normal curve
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScaleNormal(d.y));

    svg.selectAll(".normal-curve")
        .data([{points: x.map((d, i) => ({x: d, y: yNormal[i]}))}])
        .enter()
        .append("path")
        .attr("class", "normal-curve")
        .attr("d", d => line(d.points))
        .attr("stroke", "#ff6b6b")
        .attr("stroke-width", 3)
        .attr("fill", "none");

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(8))
        .append("text")
        .attr("x", width/2)
        .attr("y", 35)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Value");

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(6))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height/2)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Frequency");

    // Add sample statistics
    const sampleMean = d3.mean(data);
    const sampleSD = d3.deviation(data);

    svg.append("text")
        .attr("x", width - 10)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .attr("fill", "#2c3e50")
        .style("font-weight", "bold")
        .text(`Sample Mean: ${sampleMean.toFixed(1)}`);

    svg.append("text")
        .attr("x", width - 10)
        .attr("y", 50)
        .attr("text-anchor", "end")
        .attr("fill", "#2c3e50")
        .style("font-weight", "bold")
        .text(`Sample SD: ${sampleSD.toFixed(1)}`);
}

// Make functions globally available
window.createScatterPlot = createScatterPlot;
window.createCorrelationMatrix = createCorrelationMatrix;
window.createDistributionPlayground = createDistributionPlayground;
