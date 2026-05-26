@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════╗
echo ║  🏋️  MEUTEINO - GERADOR DE APK        ║
echo ║                                        ║
echo ║  Versão simplificada para Windows      ║
echo ╚════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Node.js não está instalado!
    echo.
    echo 📥 Baixe em: https://nodejs.org/
    echo    Após instalar, reinicie este script.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado:
node --version
echo.

REM Verificar se npm install foi feito
if not exist "node_modules" (
    echo 📦 Instalando dependências (primeira vez)...
    echo    Isso pode levar 2-3 minutos...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas!
    echo.
) else (
    echo ✅ Dependências já estão instaladas
    echo.
)

echo.
echo 🎯 ESCOLHA UMA OPÇÃO:
echo.
echo   [1] APK Android via Expo EAS (Recomendado - Automático)
echo   [2] Testar no navegador (Rápido - Sem APK)
echo   [3] APK Local (Requer Android SDK)
echo   [4] Abrir guia de instruções
echo.

set /p opcao="Digite o número (1-4): "

if "%opcao%"=="1" (
    echo.
    echo 🚀 Iniciando build do APK...
    echo.
    echo   Você será redirecionado para login na Expo.
    echo   - Use email para criar conta gratuita
    echo   - Ou faça login se já tiver conta
    echo.
    pause

    REM Instalar EAS CLI
    echo 📥 Instalando EAS CLI...
    call npm install -g eas-cli

    REM Login
    echo.
    echo 🔑 Faça login ou crie conta Expo...
    call eas login

    REM Build
    echo.
    echo ⚙️  Compilando APK (pode levar 5-10 minutos)...
    call eas build --platform android --local

    if exist "MeuTreino.apk" (
        echo.
        echo ✅ APK gerado com sucesso!
        echo 📁 Arquivo: MeuTreino.apk
        echo.
        pause
    ) else (
        echo ⚠️  APK pode estar em uma pasta diferente.
        echo    Verifique a saída acima para o local exato.
        pause
    )

) else if "%opcao%"=="2" (
    echo.
    echo 🌐 Abrindo no navegador...
    echo    Ctrl+C para parar o servidor
    echo.
    call npx expo start --web

) else if "%opcao%"=="3" (
    echo.
    echo 📱 Build Local...
    echo    (Requer Android Studio e SDK configurado)
    echo.
    call npx expo build:android --output=MeuTreino.apk

    if exist "MeuTreino.apk" (
        echo.
        echo ✅ APK gerado: MeuTreino.apk
        echo.
        pause
    )

) else if "%opcao%"=="4" (
    echo.
    echo 📖 Abrindo guia...
    start notepad "BUILD_GUIDE.md"

) else (
    echo ❌ Opção inválida!
    pause
    exit /b 1
)

cls
echo ✅ Processo finalizado!
echo.
pause
