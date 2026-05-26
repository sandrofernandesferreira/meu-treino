# 📱 Guia de Build - Gerar APK do Meu Treino

## ✅ Opção Recomendada: APK via EAS (Mais Simples)

### Pré-requisitos
- ✅ Node.js instalado ([Download](https://nodejs.org/))
- ✅ Conta Expo gratuita ([Criar](https://expo.dev/signup))

### Passos

#### 1️⃣ Abra o PowerShell na pasta do projeto

```powershell
cd "C:\Sandro\PY\Sandro\Meu Treino"
```

#### 2️⃣ Execute o script de build

```powershell
./BUILD_APK.ps1
```

#### 3️⃣ Escolha a opção 1 (APK via EAS - Recomendado)

O script fará tudo:
- ✅ Instala dependências
- ✅ Instala EAS CLI
- ✅ Abre login na Expo (use sua conta)
- ✅ Gera o APK na nuvem
- ✅ Salva `MeuTreino.apk` na pasta

#### 4️⃣ Transfira o APK para seu Android

```
Copie MeuTreino.apk para seu smartphone Android
Abra em um gerenciador de arquivos
Clique para instalar
Permita instalação de fontes desconhecidas (se pedido)
```

---

## 🌐 Opção 2: Testar no Navegador (Mais Rápido)

Se quiser testar rápido na web **sem gerar APK**:

```powershell
cd "C:\Sandro\PY\Sandro\Meu Treino"
npx expo start --web
```

Abrirá em `http://localhost:19006` automaticamente.

---

## 📱 Opção 3: Build Local com Android Studio

Requer Android SDK configurado localmente (mais complexo).

```powershell
./BUILD_APK.ps1
# Escolha opção 3
```

---

## 🐛 Solução de Problemas

### "Node.js não está instalado"
- Baixe e instale de: https://nodejs.org/
- Reinicie o PowerShell após instalar

### "npm install falha"
- Delete `node_modules` e `package-lock.json`
- Execute novamente: `npm install`

### "EAS login não funciona"
- Certifique-se de ter internet ativa
- Crie conta grátis em: https://expo.dev/signup

### APK não instala no Android
- Verifique se é Android 8+
- Ative "Instalação de apps de fontes desconhecidas" nas Configurações
- Tente com outro dispositivo se o primeiro falhar

---

## 📦 Alternativa: Distribuir via Expo Go

Sem precisar de APK:

```powershell
npx expo start
```

Escaneie o QR Code com Expo Go (app gratuito).

---

## ✨ O que o app faz

- 🔐 **Login com Google** (Tela de login)
- 👋 **Boas-vindas** (Pós-login)
- 💾 **Persistência** (Login salvo automaticamente)
- 🎨 **Dark Mode** (Interface escura com laranja)

---

## 📞 Próximos Passos

Após validar o APK, features a implementar:
- 🏋️ Cadastro de treinos (exercícios, séries, reps)
- 📊 Histórico e gráficos de evolução
- ⏱️ Cronômetro de descanso
- 📱 Notificações de lembrete

---

**Dúvidas?** Verifique o `README.md` ou `CONTEXTO_DO_PROJETO.md`
