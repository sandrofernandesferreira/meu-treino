# Script completo - Login + Build APK
# Execute este arquivo no PowerShell para fazer login e gerar o APK

$ErrorActionPreference = "Continue"

# Configurar PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🏋️  MEUTEINO - LOGIN E BUILD DO APK               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Entrar na pasta
cd "C:\Sandro\PY\Sandro\Meu Treino"
Write-Host "✅ Pasta: $(Get-Location)" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 ETAPA 1: Login no Expo" -ForegroundColor Yellow
Write-Host ""
Write-Host "Você será redirecionado para:" -ForegroundColor White
Write-Host "  https://expo.dev/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se não tiver conta, crie uma gratuitamente:" -ForegroundColor White
Write-Host "  https://expo.dev/signup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Enter para continuar..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "🌐 Abrindo navegador para login..." -ForegroundColor Cyan
npx eas login

Write-Host ""
Write-Host "✅ Login feito!" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "⚙️  ETAPA 2: Compilando APK" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏳ Aguarde 5-10 minutos..." -ForegroundColor Gray
Write-Host "   Este processo compila seu app na nuvem Expo" -ForegroundColor Gray
Write-Host ""

npx eas build --platform android --local

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ PROCESSO CONCLUÍDO!" -ForegroundColor Green
Write-Host ""
Write-Host "Seu APK foi gerado com sucesso!" -ForegroundColor White
Write-Host ""
Write-Host "📁 Procure por: MeuTreino.apk" -ForegroundColor Cyan
Write-Host "   (ou o arquivo .apk gerado na pasta)" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 Próximo passo:" -ForegroundColor Yellow
Write-Host "   1. Transfira o APK para seu Android" -ForegroundColor White
Write-Host "   2. Abra gerenciador de arquivos" -ForegroundColor White
Write-Host "   3. Clique no APK para instalar" -ForegroundColor White
Write-Host "   4. Pronto! App instalado" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "💪 Boa sorte com seu app de treino!" -ForegroundColor Green
Write-Host ""

Read-Host "Pressione Enter para sair"
