# WSL2 Android 개발을 위한 Windows 방화벽 규칙 설정
#
# 작성일: 2025-11-12
# 실행 방법: PowerShell (관리자 권한) 에서 실행
#
# .\setup-windows-firewall.ps1

#Requires -RunAsAdministrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WSL2 Android 개발 방화벽 규칙 설정" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 스크립트 실행 확인
$confirmation = Read-Host "Windows 방화벽에 WSL2 인바운드 규칙을 추가하시겠습니까? (Y/N)"
if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "취소되었습니다." -ForegroundColor Yellow
    exit
}

Write-Host ""

# 기존 규칙 제거 (있으면)
Write-Host "[1/4] 기존 규칙 확인 및 제거 중..." -ForegroundColor Yellow

$existingAdbRule = Get-NetFirewallRule -DisplayName "WSL2 ADB (React Native)" -ErrorAction SilentlyContinue
if ($existingAdbRule) {
    Remove-NetFirewallRule -DisplayName "WSL2 ADB (React Native)"
    Write-Host "  ✓ 기존 ADB 규칙 제거됨" -ForegroundColor Green
}

$existingMetroRule = Get-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)" -ErrorAction SilentlyContinue
if ($existingMetroRule) {
    Remove-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)"
    Write-Host "  ✓ 기존 Metro 규칙 제거됨" -ForegroundColor Green
}

Write-Host ""

# ADB 포트 (5037) 규칙 생성
Write-Host "[2/4] ADB 포트 (5037) 인바운드 규칙 생성 중..." -ForegroundColor Yellow

try {
    New-NetFirewallRule `
        -DisplayName "WSL2 ADB (React Native)" `
        -Description "WSL2에서 Windows ADB 서버 접근 허용 (React Native 개발)" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 5037 `
        -Action Allow `
        -Profile Domain,Private,Public `
        -RemoteAddress 172.16.0.0/12 `
        -Enabled True | Out-Null

    Write-Host "  ✓ ADB 포트 (5037) 규칙 생성 완료" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ADB 규칙 생성 실패: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Metro 포트 (8081) 규칙 생성
Write-Host "[3/4] Metro 포트 (8081) 인바운드 규칙 생성 중..." -ForegroundColor Yellow

try {
    New-NetFirewallRule `
        -DisplayName "WSL2 Metro Bundler (React Native)" `
        -Description "WSL2 Metro Bundler 접근 허용 (React Native 개발)" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8081 `
        -Action Allow `
        -Profile Domain,Private,Public `
        -RemoteAddress 172.16.0.0/12 `
        -Enabled True | Out-Null

    Write-Host "  ✓ Metro 포트 (8081) 규칙 생성 완료" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Metro 규칙 생성 실패: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 검증
Write-Host "[4/4] 방화벽 규칙 검증 중..." -ForegroundColor Yellow

$adbRule = Get-NetFirewallRule -DisplayName "WSL2 ADB (React Native)" -ErrorAction SilentlyContinue
$metroRule = Get-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)" -ErrorAction SilentlyContinue

if ($adbRule -and $adbRule.Enabled -eq $true) {
    Write-Host "  ✓ ADB 규칙: 활성화됨" -ForegroundColor Green
} else {
    Write-Host "  ✗ ADB 규칙: 비활성화 또는 없음" -ForegroundColor Red
}

if ($metroRule -and $metroRule.Enabled -eq $true) {
    Write-Host "  ✓ Metro 규칙: 활성화됨" -ForegroundColor Green
} else {
    Write-Host "  ✗ Metro 규칙: 비활성화 또는 없음" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "설정 완료!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. WSL2에서 wslinfo --networking-mode 실행하여 'mirrored' 확인" -ForegroundColor White
Write-Host "2. WSL2 .bashrc에 ADB alias 추가" -ForegroundColor White
Write-Host "3. npm run android 테스트" -ForegroundColor White
Write-Host ""

# 규칙 상세 정보 출력 (선택 사항)
$showDetails = Read-Host "생성된 규칙 상세 정보를 확인하시겠습니까? (Y/N)"
if ($showDetails -eq 'Y' -or $showDetails -eq 'y') {
    Write-Host ""
    Write-Host "=== ADB 규칙 ===" -ForegroundColor Cyan
    Get-NetFirewallRule -DisplayName "WSL2 ADB (React Native)" | Format-List DisplayName, Enabled, Direction, Action, Profile
    Get-NetFirewallPortFilter -AssociatedNetFirewallRule (Get-NetFirewallRule -DisplayName "WSL2 ADB (React Native)") | Format-List Protocol, LocalPort
    Get-NetFirewallAddressFilter -AssociatedNetFirewallRule (Get-NetFirewallRule -DisplayName "WSL2 ADB (React Native)") | Format-List RemoteAddress

    Write-Host ""
    Write-Host "=== Metro 규칙 ===" -ForegroundColor Cyan
    Get-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)" | Format-List DisplayName, Enabled, Direction, Action, Profile
    Get-NetFirewallPortFilter -AssociatedNetFirewallRule (Get-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)") | Format-List Protocol, LocalPort
    Get-NetFirewallAddressFilter -AssociatedNetFirewallRule (Get-NetFirewallRule -DisplayName "WSL2 Metro Bundler (React Native)") | Format-List RemoteAddress
}

Write-Host ""
Write-Host "방화벽 규칙 설정이 완료되었습니다!" -ForegroundColor Green
