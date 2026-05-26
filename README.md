# 💪 Meu Treino — App Android

App de acompanhamento de musculação com login via Google.

---

## 📁 Estrutura do projeto

```
Meu Treino/
├── App.js                        ← Ponto de entrada, gerencia navegação
├── app.json                      ← Configurações do Expo / Android
├── google-services.json          ← ⚠️ Você deve criar este arquivo (ver abaixo)
├── src/
│   ├── context/
│   │   └── AuthContext.js        ← Estado de autenticação (login/logout/persistência)
│   └── screens/
│       ├── LoginScreen.js        ← Tela inicial com ilustração + botão Google
│       ├── HomeScreen.js         ← Tela pós-login com boas-vindas
│       └── LoadingScreen.js      ← Tela de carregamento (verifica login salvo)
└── assets/                       ← Ícones e splash screen
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [Expo Go](https://expo.dev/go) instalado no seu Android

### Passos

```bash
# 1. Entre na pasta do projeto
cd "C:\Sandro\PY\Sandro\Meu Treino"

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start

# 4. Escaneie o QR Code com o Expo Go no seu Android
```

---

## 🔑 Configurar o login real com o Google

O projeto atualmente usa **login simulado** (mock) para desenvolvimento.
Para ativar o login real com o Google, siga os passos:

### Passo 1 — Google Cloud Console
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto (ou use um existente)
3. Vá em **APIs e Serviços → Credenciais**
4. Clique em **Criar credenciais → ID do cliente OAuth**
5. Selecione **Aplicativo Android**
6. Preencha o nome do pacote: `com.sandro.meutreino`
7. Gere o SHA-1 do seu keystore (veja abaixo)
8. Crie também um cliente para **Aplicativo da Web** (necessário para o webClientId)

### Passo 2 — Obter o SHA-1
```bash
# No terminal, dentro da pasta android/ do projeto
cd android && ./gradlew signingReport
```

### Passo 3 — Baixar o google-services.json
1. No Google Cloud Console → seu projeto Android
2. Clique em **Baixar JSON**
3. Renomeie para `google-services.json`
4. Coloque na **raiz do projeto** (junto ao App.js)

### Passo 4 — Ativar o login real no código
No arquivo `src/screens/LoginScreen.js`:
1. Substitua `SEU_WEB_CLIENT_ID_AQUI` pelo Web Client ID obtido no passo 1
2. Remova o código de mock e descomente o bloco `/* ---- LOGIN REAL ---- */`

---

## 🎨 Design

- **Tema:** Dark (fundo escuro, acentos laranja #FF6B00)
- **Fonte:** Sistema (sem dependências externas)
- **Animações:** React Native Animated API
- **Gradientes:** expo-linear-gradient

---

## 📦 Dependências principais

| Pacote | Uso |
|--------|-----|
| `expo` | Framework base |
| `expo-linear-gradient` | Gradientes nas telas |
| `@react-native-async-storage/async-storage` | Persistir login entre sessões |
| `@react-native-google-signin/google-signin` | Login Google (ativar após configurar) |

---

## 🗺️ Próximos passos (roadmap)

- [ ] Cadastro de treinos (exercícios, séries, repetições)
- [ ] Histórico de treinos por data
- [ ] Gráficos de evolução (peso por exercício)
- [ ] Cronômetro de descanso entre séries
- [ ] Controle de peso corporal e medidas
- [ ] Planos de treino pré-definidos
- [ ] Notificações de lembrete de treino
