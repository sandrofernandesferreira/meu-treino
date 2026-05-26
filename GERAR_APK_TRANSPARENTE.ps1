# Script Transparente - Mostra TUDO que está acontecendo
# Execute: .\GERAR_APK_TRANSPARENTE.ps1

$ErrorActionPreference = "Continue"
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🏋️  MEUTEINO - GERADOR DE APK (MODO TRANSPARENTE)       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Etapa 1: Verificar Node.js
Write-Host "ETAPA 1: Verificando Node.js" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Etapa 2: Verificar pasta
Write-Host "ETAPA 2: Verificando pasta do projeto" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
cd "C:\Sandro\PY\Sandro\Meu Treino"
$currentPath = Get-Location
Write-Host "✅ Pasta: $currentPath" -ForegroundColor Green

if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERRO: package.json não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ package.json encontrado" -ForegroundColor Green
Write-Host ""

# Etapa 3: Verificar node_modules
Write-Host "ETAPA 3: Verificando dependências" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules não encontrado. Instalando..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}
$moduleCount = (Get-ChildItem "node_modules" -Directory).Count
Write-Host "✅ Dependências OK ($moduleCount pacotes)" -ForegroundColor Green
Write-Host ""

# Etapa 4: Verificar login Expo
Write-Host "ETAPA 4: Verificando autenticação Expo" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Tentando verificar token de autenticação..." -ForegroundColor Gray

$expoStatus = npx expo whoami 2>&1
if ($expoStatus -like "*Not logged in*" -or $expoStatus -like "*Error*") {
    Write-Host "❌ Você NÃO está logado no Expo" -ForegroundColor Red
    Write-Host ""
    Write-Host "📌 Você PRECISA fazer login:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://expo.dev/signup" -ForegroundColor White
    Write-Host "   2. Crie uma conta (gratuita)" -ForegroundColor White
    Write-Host "   3. Execute: npx eas login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione Enter para fazer login agora..." -ForegroundColor Yellow
    Read-Host

    Write-Host ""
    Write-Host "🌐 Abrindo login Expo..." -ForegroundColor Cyan
    npx eas login

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO ao fazer login!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Logado como: $expoStatus" -ForegroundColor Green
}
Write-Host ""

# Etapa 5: Gerar APK
Write-Host "ETAPA 5: Gerando APK" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Isso pode levar 5-15 minutos..." -ForegroundColor Gray
Write-Host ""

npx eas build --platform android --local

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ ERRO ao gerar APK!" -ForegroundColor Red
    Write-Host "   Verifique a mensagem de erro acima" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Etapa 6: Procurar APK
Write-Host "ETAPA 6: Procurando arquivo APK gerado" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$apks = Get-ChildItem -Path "C:\Sandro\PY\Sandro\Meu Treino" -Recurse -Filter "*.apk" -ErrorAction SilentlyContinue

if ($apks.Count -eq 0) {
    Write-Host "⚠️  Nenhum APK encontrado na pasta" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O APK pode estar em:" -ForegroundColor Yellow
    Write-Host "  • Pasta: $currentPath" -ForegroundColor Gray
    Write-Host "  • Subpastas de build" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pastas encontradas:" -ForegroundColor Cyan
    Get-ChildItem -Path "C:\Sandro\PY\Sandro\Meu Treino" -Directory | Select-Object Name
    Write-Host ""
} else {
    Write-Host "✅ APK encontrado!" -ForegroundColor Green
    Write-Host ""
    $apks | ForEach-Object {
        Write-Host "📁 $($_.FullName)" -ForegroundColor Cyan
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "   Tamanho: $sizeMB MB" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ PROCESSO FINALIZADO!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Copie o arquivo APK para seu Android" -ForegroundColor White
Write-Host "  2. Abra o gerenciador de arquivos no celular" -ForegroundColor White
Write-Host "  3. Clique no APK para instalar" -ForegroundColor White
Write-Host "  4. Pronto! App instalado" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para sair"
