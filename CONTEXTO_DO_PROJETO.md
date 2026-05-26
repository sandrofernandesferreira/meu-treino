# 📚 CONTEXTO COMPLETO - MEU TREINO

## Conversa Inicial (Maio 2026)

### Solicitação Original do Sandro
"Chat, meu projeto fica na pasta C:\Sandro\PY\Sandro\Meu Treino. Inicie um novo projeto que será um app para celular, vou aplicá-lo inicialmente no Android, pois é o aparelho que tenho. Chame esse APP de Meu Treino."

### Requisitos Definidos

#### Autenticação
- ✅ Login com Gmail (Google Sign-In)
- ✅ Após registro, **NUNCA pedir login novamente**
- ✅ Persistência local de dados com AsyncStorage

#### MVP - Tela Inicial
- ✅ Imagem/ilustração de academia (atleta levantando peso)
- ✅ Botão "Entrar com o Google" na primeira vez
- ✅ Após login: mensagem "Seja bem-vindo ao App que vai te acompanhar durante o seu treino"
- ✅ Design dark com tema laranja (#FF6B00)

#### Tecnologia
- **Framework**: React Native (Expo) — multiplataforma, rápido de desenvolver
- **Persistência**: AsyncStorage
- **Autenticação**: @react-native-google-signin/google-signin (com fallback mock)
- **UI**: Gradientes (expo-linear-gradient), Animated API
- **Target**: Android (Expo Go para testes rápidos)

---

## Arquitetura Criada

### App Flow
```
App.js (entrada)
  ↓
AuthProvider (contexto global)
  ↓
AppNavigator (lógica de telas)
  ├─ LoadingScreen (verifica login salvo)
  ├─ LoginScreen (primeira vez)
  └─ HomeScreen (autenticado)
```

### Estado de Autenticação
- **user**: dados do usuário logado (id, name, email, photo)
- **loading**: verificando AsyncStorage na inicialização
- **signIn(userData)**: persiste e autentica
- **signOut()**: limpa dados e desautentica

### Persistência
```javascript
AsyncStorage.setItem('@MeuTreino:user', JSON.stringify(userData))
// Carregado automaticamente ao abrir o app
// Se encontrar, vai direto para HomeScreen (sem pedir login)
```

---

## Telas Implementadas

### 1. LoginScreen
- Ilustração do atleta levantando peso (desenhada com Views)
- Gradiente dark de fundo
- Botão Google com ícone (cores reais do Google)
- Atualmente: **login simulado (mock)** para testes
- Futuro: descomente para login real com Google OAuth

**Arquivo**: `src/screens/LoginScreen.js` (~400 linhas)

### 2. HomeScreen
- Header: Avatar + botão Sair
- Card animado com boas-vindas (💪)
- Stats: Treinos (0), Sequência (0 dias), Horas (0h)
- Botão principal: "Iniciar Treino de Hoje"
- Dica do dia
- Preview de features futuras

**Arquivo**: `src/screens/HomeScreen.js` (~300 linhas)

### 3. LoadingScreen
- Tela simples durante carregamento do AsyncStorage
- Logo + spinner

**Arquivo**: `src/screens/LoadingScreen.js` (~30 linhas)

### 4. AuthContext
- Gerencia estado global de autenticação
- Hook `useAuth()` para acessar em qualquer componente
- Carrega usuário salvo ao iniciar

**Arquivo**: `src/context/AuthContext.js` (~60 linhas)

---

## Design System

### Paleta de Cores
- **Background Principal**: #0D0D1A (preto bem escuro)
- **Background Gradiente**: #1A1A2E → #16213E
- **Destaque (CTA)**: #FF6B00 (laranja vivo)
- **Texto Primário**: #FFFFFF (branco)
- **Texto Secundário**: #8892A4 (cinza)

### Componentes
- Cartões com sombras soft
- Gradientes lineares nos botões
- Animações de fade-in e slide-up
- BorderRadius: 12-20px (arredondado, não quadrado)

### Tipografia
- Títulos: fontWeight 700-900, fontSize 18-38px
- Corpo: fontWeight 400-500, fontSize 13-16px
- Sistema nativo (sem fontes customizadas)

---

## Fluxo de Uso

### Primeira Vez
```
Abrir App
  ↓
LoadingScreen (verifica AsyncStorage)
  ↓
Nenhum usuário salvo
  ↓
LoginScreen (mostra ilustração + botão)
  ↓
Clica "Entrar com o Google"
  ↓
(Atualmente) Simula login com mock user
  ↓
Salva no AsyncStorage
  ↓
HomeScreen (boas-vindas)
```

### Segunda Vez (e próximas)
```
Abrir App
  ↓
LoadingScreen
  ↓
Encontra usuário salvo no AsyncStorage
  ↓
Va direto para HomeScreen
  ↓
(Sem pedir login novamente!)
```

### Logout
```
Na HomeScreen, clica "Sair"
  ↓
signOut() remove AsyncStorage
  ↓
Volta para LoginScreen
```

---

## Setup Inicial Realizado

```bash
# Projeto criado com Expo
npx create-expo-app@latest MeuTreino

# Dependências instaladas
npm install \
  @react-native-google-signin/google-signin \
  expo-auth-session \
  expo-web-browser \
  @react-native-async-storage/async-storage \
  expo-linear-gradient

# Estrutura de pastas criada
├── src/context/
├── src/screens/
└── assets/ (futura)
```

---

## Próximos Passos (Roadmap)

### FASE 2: Cadastro de Treinos
- [ ] Tela com lista de exercícios
- [ ] Formulário: escolher exercício → séries → repetições → peso
- [ ] Salvar treino com data/hora
- [ ] Histórico por data

### FASE 3: Evolução Visual
- [ ] Gráfico de peso por exercício (crescimento)
- [ ] Controle de medidas (altura, peso, perímetros)
- [ ] Dashboard com estatísticas

### FASE 4: Planos de Treino
- [ ] Templates pré-definidos (Push/Pull/Legs, etc)
- [ ] Editor customizado
- [ ] Sistema de dias (seg/ter/qua...)

### FASE 5: Motivação & Social
- [ ] Notificações de lembrete
- [ ] Compartilhar treino com amigos
- [ ] Comparar progressão

---

## Como Testar Agora

### Opção 1: Expo Go (Recomendado)
```bash
cd C:\Sandro\PY\Sandro\Meu Treino
npm install
npx expo start
# Escaneie QR com Expo Go no Android
```

### Opção 2: Android Studio (Emulador)
```bash
npx expo start
# Pressione 'a' para emulador Android
```

### Opção 3: Build APK
```bash
eas build --platform android
# Requer conta Expo + configuração
```

---

## Configuração do Login Real com Google

### Quando Estiver Pronto:

1. **Google Cloud Console**
   - Crie projeto
   - APIs → OAuth 2.0
   - Crie credenciais para Android + Web

2. **SHA-1 do Keystore**
   ```bash
   cd android && ./gradlew signingReport
   ```

3. **google-services.json**
   - Download do Google Cloud
   - Salve na raiz do projeto

4. **No código (LoginScreen.js)**
   - Substitua `SEU_WEB_CLIENT_ID_AQUI`
   - Descomente bloco "LOGIN REAL COM GOOGLE"
   - Remova mock login

5. **Recompile**
   ```bash
   npx expo start --clear
   ```

---

## Informações do Desenvolvedor

- **Projetista**: Sandro
- **Local**: C:\Sandro\PY\Sandro\Meu Treino
- **Data Início**: Maio 2026
- **Status**: MVP em produção
- **Versão**: 1.0.0
- **Target**: Android (Expo)

---

## Notas Importantes

✅ **O que está funcionando:**
- Navegação entre telas
- Persistência de login
- Animações
- Design responsivo
- Login mock (para testar sem Google)

🔄 **Em progresso:**
- Nada no momento

⏳ **A fazer:**
- Cadastro de treinos
- Gráficos
- Notificações
- Social features

---

## Arquivos de Referência

| Arquivo | Responsabilidade |
|---------|------------------|
| `App.js` | Ponto de entrada + navegação |
| `app.json` | Configurações Expo |
| `package.json` | Dependências |
| `src/context/AuthContext.js` | Estado de autenticação |
| `src/screens/LoginScreen.js` | Tela 1 |
| `src/screens/HomeScreen.js` | Tela 2 |
| `src/screens/LoadingScreen.js` | Tela 3 |
| `README.md` | Setup rápido |
| `help.txt` | Este contexto (versão curta) |
| `CONTEXTO_DO_PROJETO.md` | Este arquivo (versão completa) |

---

**Última atualização**: Maio 2026  
**Por**: Claude (Sandro's AI Assistant)  
**Próxima revisão**: Quando adicionar features de FASE 2
