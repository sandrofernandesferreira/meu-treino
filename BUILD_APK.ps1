# Script de Build do APK - Meu Treino
# ==================================================

Write-Host "🏋️ MEUTEINO - GERADOR DE APK" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Verificar Node.js
Write-Host "✓ Verificando dependências..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green

# Instalar dependências
Write-Host "`n📦 Instalando dependências do projeto..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

# Menu de opções
Write-Host "`n🎯 Escolha o tipo de build:" -ForegroundColor Cyan
Write-Host "1 - APK (Android) via EAS - Nuvem (Recomendado, mais rápido)" -ForegroundColor White
Write-Host "2 - Web para testar no navegador (Rápido, sem APK)" -ForegroundColor White
Write-Host "3 - APK Local via Expo CLI (Requer Android SDK)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Escolha (1, 2 ou 3)"

switch ($choice) {
    "1" {
        Write-Host "`n🚀 Iniciando build via EAS..." -ForegroundColor Yellow
        Write-Host "   Você será redirecionado para login na Expo. Use sua conta Expo." -ForegroundColor Gray

        # Instalar EAS CLI globalmente
        Write-Host "`n📥 Instalando EAS CLI..." -ForegroundColor Yellow
        npm install -g eas-cli

        # Login Expo
        Write-Host "`n🔑 Faça login na sua conta Expo..." -ForegroundColor Yellow
        eas login

        # Build APK
        Write-Host "`n⚙️ Compilando APK..." -ForegroundColor Yellow
        eas build --platform android --local

        Write-Host "`n✅ Build concluído! Procure pelo APK em: eas/" -ForegroundColor Green
    }

    "2" {
        Write-Host "`n🌐 Iniciando versão Web..." -ForegroundColor Yellow
        Write-Host "   O navegador abrirá automaticamente em http://localhost:19006" -ForegroundColor Gray
        Write-Host "   Pressione Ctrl+C para parar o servidor`n" -ForegroundColor Gray

        npx expo start --web
    }

    "3" {
        Write-Host "`n📱 Build APK Local (Requer Android SDK instalado)..." -ForegroundColor Yellow
        Write-Host "   Verificando Android SDK..." -ForegroundColor Gray

        $androidHome = $env:ANDROID_HOME
        if (-not $androidHome) {
            Write-Host "`n❌ Variável ANDROID_HOME não encontrada!" -ForegroundColor Red
            Write-Host "   Configure o Android SDK e tente novamente." -ForegroundColor Gray
            exit 1
        }

        Write-Host "   Android SDK encontrado: $androidHome" -ForegroundColor Green
        Write-Host "`n⚙️ Compilando... Isso pode levar alguns minutos..." -ForegroundColor Yellow

        npx expo build:android --output=MeuTreino.apk

        if (Test-Path "MeuTreino.apk") {
            Write-Host "`n✅ APK gerado com sucesso!" -ForegroundColor Green
            Write-Host "   📁 Local: MeuTreino.apk" -ForegroundColor Green
        }
    }

    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "✅ Processo concluído!" -ForegroundColor Green
Write-Host "   Para dúvidas, veja o arquivo README.md" -ForegroundColor Gray
