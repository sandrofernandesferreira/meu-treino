# Script rápido - Gera APK em 3 passos
# Execute: .\GERAR_APK_RAPIDO.ps1

$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🏋️  MEUTEINO - BUILD RÁPIDO           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. Verificar Node.js
Write-Host "1️⃣  Verificando Node.js..." -ForegroundColor Yellow
$node = node --version 2>$null
if ($node) {
    Write-Host "   ✅ $node`n" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js não instalado!" -ForegroundColor Red
    Write-Host "   📥 Baixe em: https://nodejs.org/`n" -ForegroundColor Gray
    Read-Host "Pressione Enter"
    exit
}

# 2. Instalar dependências (se necessário)
if (-not (Test-Path "node_modules")) {
    Write-Host "2️⃣  Instalando dependências..." -ForegroundColor Yellow
    Write-Host "   ⏳ Aguarde 2-3 minutos...`n" -ForegroundColor Gray
    npm install --silent | Out-Null
} else {
    Write-Host "2️⃣  Dependências já instaladas ✅`n" -ForegroundColor Green
}

# 3. Menu final
Write-Host "3️⃣  Escolha:" -ForegroundColor Yellow
Write-Host "    [1] Gerar APK (EAS)" -ForegroundColor White
Write-Host "    [2] Testar no navegador" -ForegroundColor White
$op = Read-Host "    Opção"

switch ($op) {
    "1" {
        Write-Host "`n🚀 Instalando EAS..." -ForegroundColor Yellow
        npm install -g eas-cli 2>$null

        Write-Host "🔑 Faça login na Expo..." -ForegroundColor Yellow
        eas login

        Write-Host "`n⚙️  Compilando (isso leva um tempo)..." -ForegroundColor Yellow
        eas build --platform android --local

        Write-Host "`n✅ APK gerado! Procure por MeuTreino.apk" -ForegroundColor Green
    }
    "2" {
        Write-Host "`n🌐 Abrindo navegador..." -ForegroundColor Yellow
        Write-Host "   Ctrl+C para parar`n" -ForegroundColor Gray
        npx expo start --web
    }
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
    }
}

Read-Host "`nPressione Enter para sair"
