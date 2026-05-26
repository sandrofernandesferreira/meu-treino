# 🔄 Alternativas se o Web Não Funcionar

## ⚠️ Se Receber Erro de Conexão

Se `http://localhost:19006` não conectar, tente:

### Opção 1: Usar Expo Go (Smartphone)

Mais fácil e não requer web:

```powershell
cd "C:\Sandro\PY\Sandro\Meu Treino"
npx expo start
```

Depois:
1. Baixe app **Expo Go** no Android Play Store
2. Abra Expo Go no seu celular
3. Escaneie o QR Code que aparece no terminal
4. App abre no smartphone!

---

### Opção 2: Gerar APK para Android

Para instalar no smartphone permanentemente:

```powershell
cd "C:\Sandro\PY\Sandro\Meu Treino"
npx eas build --platform android
```

Aguarde 5-15 minutos e baixe o APK.

---

### Opção 3: Compilar Web Localmente com Python

Se Node.js web tiver problemas:

```powershell
cd "C:\Sandro\PY\Sandro\Meu Treino"
python -m http.server 8000
```

Depois abra: `http://localhost:8000`

---

## 🔧 Se Tudo Falhar

### Resetar Ambiente

```powershell
# Limpar tudo
rm -Recurse -Force node_modules -ErrorAction SilentlyContinue
rm package-lock.json -ErrorAction SilentlyContinue
rm .expo -Recurse -Force -ErrorAction SilentlyContinue

# Reinstalar
npm install

# Tentar novamente
npx expo start --web
```

---

## 📱 Recomendação

**Usar Expo Go no smartphone** é mais rápido e simples:
- ✅ Não requer compilação pesada
- ✅ App roda perfeitamente
- ✅ Testes instantâneos
- ✅ Sem problemas de porta

```powershell
npx expo start
```

---

## 💡 Debug

Se quiser ver erros detalhados:

```powershell
npx expo start --web --verbose 2>&1 | Tee-Object debug.log
```

Depois analise `debug.log`

