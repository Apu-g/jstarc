@echo off
echo =======================================================
echo          Fix Supabase DNS Block (Run as Admin)
echo =======================================================
echo.
echo This script will add an entry to your Windows Hosts file
echo to bypass the local ISP (Jio/Airtel) block on Supabase.
echo.

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] Administrative privileges required.
    echo Please right-click this file and select "Run as administrator".
    pause
    exit /b
)

:: Back up the hosts file just in case
copy "C:\Windows\System32\drivers\etc\hosts" "C:\Windows\System32\drivers\etc\hosts.backup" >nul

:: Append the Cloudflare IP for the Supabase domain
echo. >> "C:\Windows\System32\drivers\etc\hosts"
echo # Bypass ISP block for JSTARC project >> "C:\Windows\System32\drivers\etc\hosts"
echo 104.18.38.10 jgmwqjepeyjgjsmlkaej.supabase.co >> "C:\Windows\System32\drivers\etc\hosts"
echo 172.64.149.246 jgmwqjepeyjgjsmlkaej.supabase.co >> "C:\Windows\System32\drivers\etc\hosts"

echo [SUCCESS] The hosts file has been updated!
echo Your local Vite development server should now be able to connect to Supabase.
echo.
pause
