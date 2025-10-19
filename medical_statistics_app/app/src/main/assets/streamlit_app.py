#!/usr/bin/env python3
"""
Medical Statistics Streamlit Application
Interactive Data Science Platform for Medical Statistics Education

Usage:
    streamlit run streamlit_app.py --server.port 8501 --server.address 0.0.0.0

Features:
- Interactive sample size calculations
- Data visualization dashboard
- Clinical decision support
- Statistical analysis tools
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from scipy import stats
import statistics
import math

# Page configuration
st.set_page_config(
    page_title="Medical Statistics Interactive App",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for medical theme
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2rem;
    }
    .card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
    }
    .metric-card {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

def main():
    """Main application function"""
    st.markdown('<h1 class="main-header">📊 Medical Statistics Interactive Platform</h1>',
                unsafe_allow_html=True)

    st.markdown("""
    **Welcome to the Interactive Medical Statistics Platform!**

    This application provides powerful data analysis tools for medical research and education.
    Choose from the sidebar options to explore various statistical methods and visualizations.
    """)

    # Sidebar navigation
    st.sidebar.title("🧮 Tools & Calculators")
    app_mode = st.sidebar.selectbox(
        "Choose a tool:",
        ["🏠 Home", "📏 Sample Size Calculator", "📊 Data Visualization",
         "🔬 Statistical Tests", "📈 Correlation Analysis", "🏥 Clinical Decision"]
    )

    # Main content area based on selection
    if app_mode == "🏠 Home":
        show_homepage()
    elif app_mode == "📏 Sample Size Calculator":
        sample_size_calculator()
    elif app_mode == "📊 Data Visualization":
        data_visualization()
    elif app_mode == "🔬 Statistical Tests":
        statistical_tests()
    elif app_mode == "📈 Correlation Analysis":
        correlation_analysis()
    elif app_mode == "🏥 Clinical Decision":
        clinical_decision_support()

def show_homepage():
    """Show homepage with overview and key metrics"""
    st.subheader("🎯 Platform Overview")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("📏 Calculators", "6+ Tools")
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("📊 Visualizations", "Interactive")
        st.markdown('</div>', unsafe_allow_html=True)

    with col3:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("🏥 Clinical Tools", "Decision Support")
        st.markdown('</div>', unsafe_allow_html=True)

    with col4:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric("📈 Statistical Tests", "Multiple Methods")
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("---")

    # About section
    st.subheader("📚 About This Application")
    st.markdown("""
    This interactive platform complements the book "Essential Medical Statistics: A Practical Guide
    for Healthcare Professionals" by Dr. Siddalingaiah H S. It provides:

    - **Resource-Limited Calculator**: Minimal dependencies, works offline
    - **Educational Focus**: Designed for medical students and practitioners
    - **Evidence-Based**: Based on established statistical principles
    - **Interactive Learning**: Hands-on exploration of statistical concepts

    **Institution**: Shridevi Institute of Medical Sciences & Research Hospital, Tumkur, Karnataka, India
    **Contact**: +91-8941087719
    """)

def sample_size_calculator():
    """Interactive sample size calculator for medical studies"""
    st.header("📏 Sample Size Calculator")
    st.markdown("Calculate appropriate sample sizes for medical research studies.")

    # Calculator inputs
    col1, col2 = st.columns([1, 2])

    with col1:
        st.subheader("Study Parameters")

        test_type = st.selectbox(
            "Test Type:",
            ["Means Difference", "Proportions Difference", "Survival Analysis"]
        )

        power = st.slider("Power (1-β):", 0.70, 0.95, 0.80, 0.05)
        alpha = st.selectbox("Alpha (α):", [0.05, 0.01, 0.10], index=0)
        tails = st.selectbox("Test Type:", ["Two-tailed", "One-tailed"])

        if test_type == "Means Difference":
            effect_size = st.number_input("Expected Mean Difference:", 0.1, 10.0, 2.0)
            sd = st.number_input("Standard Deviation:", 0.1, 20.0, 5.0)
        elif test_type == "Proportions Difference":
            p1 = st.slider("Proportion 1:", 0.0, 1.0, 0.20, 0.01)
            p2 = st.slider("Proportion 2:", 0.0, 1.0, 0.40, 0.01)
        else:  # Survival Analysis
            hr = st.number_input("Hazard Ratio:", 0.1, 5.0, 0.75)
            prob_event = st.slider("Probability of Event:", 0.0, 1.0, 0.30, 0.01)

    with col2:
        st.subheader("Sample Size Results")

        if st.button("Calculate Sample Size"):
            try:
                n = calculate_sample_size(test_type, effect_size if 'effect_size' in locals() else None,
                                        sd if 'sd' in locals() else None, power, alpha, tails,
                                        p1 if 'p1' in locals() else None,
                                        p2 if 'p2' in locals() else None,
                                        hr if 'hr' in locals() else None,
                                        prob_event if 'prob_event' in locals() else None)

                st.success(f"**Required sample size per group:** {n}")

                # Power analysis visualization
                powers = np.linspace(0.1, 0.99, 100)
                effect_sizes = generate_power_curve(test_type, n, alpha, tails)

                if len(effect_sizes) > 0:
                    fig = px.line(x=powers, y=effect_sizes,
                                labels={'x': 'Power', 'y': 'Effect Size'},
                                title=f"Power Analysis for {test_type}")
                    st.plotly_chart(fig)

            except Exception as e:
                st.error(f"Calculation error: {str(e)}")

def calculate_sample_size(test_type, effect_size=None, sd=None, power=0.80,
                         alpha=0.05, tails="Two-tailed", p1=None, p2=None,
                         hr=None, prob_event=None):
    """Calculate sample size using appropriate statistical formulas"""

    # Normal distribution inverse for critical values
    from scipy.stats import norm

    alpha_critical = norm.ppf(1 - alpha/2) if tails == "Two-tailed" else norm.ppf(1 - alpha)
    beta_critical = norm.ppf(power)

    if test_type == "Means Difference":
        variance = sd * sd
        numerator = variance * (alpha_critical + beta_critical) ** 2
        return math.ceil(numerator / (effect_size * effect_size))

    elif test_type == "Proportions Difference":
        p_avg = (p1 + p2) / 2
        numerator = p_avg * (1 - p_avg) * (alpha_critical + beta_critical) ** 2
        delta = abs(p1 - p2)
        return math.ceil(numerator / (delta * delta))

    else:  # Survival Analysis
        # Simplified hazard ratio formula
        delta = abs(math.log(hr)) * math.sqrt(prob_event)
        numerator = (alpha_critical + beta_critical) ** 2
        return math.ceil(numerator / (2 * delta * delta))

def data_visualization():
    """Interactive data visualization for medical datasets"""
    st.header("📊 Interactive Data Visualization")

    # Load sample datasets
    datasets = {
        "Patient Demographics": pd.DataFrame({
            'age': np.random.normal(50, 15, 100),
            'bmi': np.random.normal(27, 5, 100),
            'bp': np.random.normal(135, 20, 100),
            'cholesterol': np.random.normal(240, 40, 100),
            'gender': np.random.choice(['Male', 'Female'], 100)
        }),
        "Clinical Trial Data": pd.DataFrame({
            'treatment': np.random.choice(['Treatment A', 'Treatment B', 'Placebo'], 120),
            'baseline_bp': np.random.normal(140, 20, 120),
            'final_bp': np.random.normal(130, 18, 120),
            'adverse_events': np.random.choice([0, 1], 120, p=[0.85, 0.15])
        })
    }

    selected_dataset = st.selectbox("Choose Dataset:", list(datasets.keys()))

    df = datasets[selected_dataset]

    # Visualization options
    viz_type = st.selectbox("Visualization Type:",
                           ["Scatter Plot", "Histogram", "Box Plot", "Correlation Heatmap"])

    if viz_type == "Scatter Plot":
        col1, col2 = st.columns(2)
        with col1:
            x_var = st.selectbox("X-axis:", df.select_dtypes(include=[np.number]).columns)
        with col2:
            y_var = st.selectbox("Y-axis:", df.select_dtypes(include=[np.number]).columns)

        if x_var and y_var:
            fig = px.scatter(df, x=x_var, y=y_var,
                           title=f"{y_var} vs {x_var}")
            st.plotly_chart(fig)

    elif viz_type == "Histogram":
        var = st.selectbox("Variable:", df.select_dtypes(include=[np.number]).columns)
        bins = st.slider("Number of bins:", 5, 50, 20)

        fig = px.histogram(df, x=var, nbins=bins,
                          title=f"Distribution of {var}")
        st.plotly_chart(fig)

    elif viz_type == "Box Plot":
        var = st.selectbox("Variable:", df.select_dtypes(include=[np.number]).columns)
        group_by = st.selectbox("Group by (optional):",
                              ['None'] + list(df.select_dtypes(include=['object']).columns))

        if group_by == 'None':
            fig = px.box(df, y=var, title=f"Box Plot of {var}")
        else:
            fig = px.box(df, x=group_by, y=var,
                        title=f"Box Plot of {var} by {group_by}")
        st.plotly_chart(fig)

    elif viz_type == "Correlation Heatmap":
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        corr_matrix = df[numeric_cols].corr()

        fig = px.imshow(corr_matrix,
                       text_auto='.2f',
                       aspect="auto",
                       title="Correlation Matrix")
        st.plotly_chart(fig)

def statistical_tests():
    """Perform statistical tests on uploaded data"""
    st.header("🔬 Statistical Tests")

    # File upload
    uploaded_file = st.file_uploader("Upload CSV file:",
                                   type=['csv'],
                                   help="Upload your data for statistical analysis")

    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file)
            st.success(f"Data loaded successfully! {len(df)} rows × {len(df.columns)} columns")

            # Choose analysis
            analysis_type = st.selectbox(
                "Choose Statistical Test:",
                ["Descriptive Statistics", "t-Test", "Chi-Square Test",
                 "ANOVA", "Correlation", "Regression"]
            )

            if analysis_type == "Descriptive Statistics":
                st.subheader("Descriptive Statistics")

                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) > 0:
                    stats_df = df[numeric_cols].describe()
                    st.dataframe(stats_df)

                    # Visualization
                    selected_var = st.selectbox("Visualize distribution:",
                                              numeric_cols)

                    fig = px.histogram(df, x=selected_var, marginal="box",
                                     title=f"Distribution of {selected_var}")
                    st.plotly_chart(fig)

            elif analysis_type == "t-Test":
                st.subheader("Independent t-Test")

                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) == 0:
                    st.error("No numeric columns found!")
                else:
                    col1, col2 = st.columns(2)
                    with col1:
                        var1 = st.selectbox("Variable 1:", numeric_cols)
                    with col2:
                        var2 = st.selectbox("Variable 2:", numeric_cols)

                    if st.button("Run t-Test"):
                        t_stat, p_value = stats.ttest_ind(df[var1], df[var2])

                        st.success(".4f"
                                 ".4f")

                        if p_value < 0.05:
                            st.info("**Significant difference** (p < 0.05)")
                        else:
                            st.info("**No significant difference** (p ≥ 0.05)")

        except Exception as e:
            st.error(f"Error processing file: {str(e)}")

def correlation_analysis():
    """Perform correlation analysis"""
    st.header("📈 Correlation Analysis")

    uploaded_file = st.file_uploader("Upload dataset for correlation analysis:",
                                   type=['csv'])

    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)

        numeric_cols = df.select_dtypes(include=[np.number]).columns

        if len(numeric_cols) >= 2:
            st.subheader("Correlation Matrix")

            # Calculate correlations
            corr_matrix = df[numeric_cols].corr()

            # Display matrix
            st.dataframe(corr_matrix.style.background_gradient(cmap='RdBu', axis=None))

            # Scatter plot matrix for selected variables
            st.subheader("Scatter Plot Matrix")
            selected_vars = st.multiselect("Select variables to plot:",
                                         numeric_cols,
                                         default=list(numeric_cols)[:4])

            if len(selected_vars) >= 2:
                fig = px.scatter_matrix(df[selected_vars],
                                       title="Scatter Plot Matrix")
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Need at least 2 numeric columns for correlation analysis.")

def clinical_decision_support():
    """Clinical decision support interface"""
    st.header("🏥 Clinical Decision Support")

    st.markdown("""
    **Note**: This is an educational tool. Always consult with qualified healthcare
    professionals for actual clinical decisions.
    """)

    # Basic patient information inputs
    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.number_input("Age:", 1, 120, 50)
    with col2:
        gender = st.selectbox("Gender:", ["Female", "Male", "Other"])
    with col3:
        presenting_symptom = st.selectbox("Main Symptom:", [
            "Chest Pain", "Abdominal Pain", "Headache", "Fever",
            "Shortness of Breath", "Nausea/Vomiting", "Fatigue"
        ])

    # Basic vitals
    st.subheader("Vital Signs")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        hr = st.number_input("Heart Rate (bpm):", 40, 200, 80)
    with col2:
        bp_systolic = st.number_input("BP Systolic (mmHg):", 80, 250, 120)
    with col3:
        temp = st.number_input("Temperature (°C):", 35.0, 42.0, 37.0)
    with col4:
        rr = st.number_input("Respiratory Rate:", 6, 60, 16)

    if st.button("Analyze"):
        # Simple clinical decision support logic
        findings = []

        # Check vital signs
        if bp_systolic >= 140:
            findings.append("**Hypertension** - Consider antihypertensive medication")
        if hr > 100:
            findings.append("**Tachycardia** - Assess for causes (anxiety, infection, etc.)")
        if temp > 38:
            findings.append("**Fever** - Consider infection screening")

        # Symptom-based recommendations
        if presenting_symptom == "Chest Pain":
            if bp_systolic >= 140 or hr > 100:
                findings.append("**Chest Pain with Elevated Vitals** - Consider cardiomyopathy or pulmonary embolism")
            else:
                findings.append("**Chest Pain Assessment** - Rule out cardiac origin with ECG and troponin")

        st.subheader("Clinical Assessment")
        if findings:
            for finding in findings:
                st.warning(finding)
        else:
            st.success("**Normal Assessment** - No immediate concerns identified")

        st.info("""
        **Disclaimer**: This tool provides general educational recommendations only.
        Always perform thorough clinical assessment and consider multiple factors.
        """)

if __name__ == "__main__":
    main()
