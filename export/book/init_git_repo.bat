@echo off
echo Initializing Git Repository for Online Publishing...

cd /d "%~dp0"

REM Initialize git repository
git init

REM Add all files
git add .

REM Initial commit
git commit -m "Initial commit: CBME Community Medicine Textbook

- Complete 45-chapter textbook
- CBME-aligned content
- Evidence-based medical education
- Professional formatting ready for publishing"

echo.
echo Git repository initialized successfully!
echo.
echo Next steps:
echo 1. Create GitHub repository at https://github.com/new
echo 2. Run: git remote add origin https://github.com/YOUR-USERNAME/community-medicine-cbme-textbook.git
echo 3. Run: git push -u origin main
echo 4. Follow publish_online.bat instructions for GitHub Pages setup

pause
