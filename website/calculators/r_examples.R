# R Code Examples for Medical Statistics
# Chapter 7: Correlation and Regression

# Load required libraries
library(ggplot2)
library(stats)

# Example: Correlation and Regression with Patient Data
# Load patient data
patient_data <- read.csv("data/patient_demographics.csv")

# Calculate correlation between BMI and blood pressure
correlation <- cor(patient_data$bmi, patient_data$blood_pressure, use = "complete.obs")
print(paste("Correlation between BMI and blood pressure:", round(correlation, 3)))

# Perform simple linear regression
model <- lm(blood_pressure ~ bmi, data = patient_data)
summary(model)

# Create scatter plot with regression line
ggplot(patient_data, aes(x = bmi, y = blood_pressure)) +
  geom_point() +
  geom_smooth(method = "lm", se = TRUE, color = "blue") +
  labs(title = "BMI vs Blood Pressure",
       x = "BMI (kg/m²)",
       y = "Blood Pressure (mmHg)") +
  theme_minimal()

# Calculate confidence intervals for prediction
new_data <- data.frame(bmi = c(25, 30, 35))
predictions <- predict(model, newdata = new_data, interval = "confidence")
predictions

# Example: Multiple regression
multi_model <- lm(blood_pressure ~ age + bmi + cholesterol, data = patient_data)
summary(multi_model)

# Check model assumptions
# Plot residuals
plot(multi_model)

# Calculate R-squared and adjusted R-squared
r_squared <- summary(multi_model)$r.squared
adj_r_squared <- summary(multi_model)$adj.r.squared
print(paste("R-squared:", round(r_squared, 3)))
print(paste("Adjusted R-squared:", round(adj_r_squared, 3)))

# Example: Spearman correlation for ordinal data
# (Assuming we have ordinal data like pain levels)

# Convert variables to appropriate scales
patient_data$diabetes_numeric <- ifelse(patient_data$diabetes == "Yes", 1, 0)
patient_data$smoking_numeric <- ifelse(patient_data$smoking == "Yes", 1, 0)

# Spearman correlation matrix for categorical variables
cor_matrix <- cor(patient_data[c("diabetes_numeric", "smoking_numeric", "age", "bmi")],
                  method = "spearman", use = "complete.obs")
print("Spearman correlation matrix:")
print(round(cor_matrix, 3))
