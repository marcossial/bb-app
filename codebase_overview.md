# BiggerBet App — Visão Geral da Base de Código

> App mobile em **React Native + Expo** que simula uma plataforma de apostas como **sátira educativa** sobre dark patterns e vício em jogos de azar. Nenhum dinheiro real é envolvido.

---

## Stack Tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | Expo SDK 56 + React Native 0.85 | Compilação cross-platform (Android/iOS) sem config nativa manual |
| Roteamento | `expo-router` (file-based) | Rotas derivadas da estrutura de pastas, sem boilerplate de navegação |
| Estado global | `zustand` + `persist` | Store simples, sem Provider, com persistência em AsyncStorage nativa |
| Animações | `react-native-reanimated` + `moti` | Reanimated roda animações na thread da UI (sem jank); Moti é uma camada declarativa em cima dele |
| Gráficos | `react-native-svg` | Roda na thread nativa, sem WebView; usado para geometria da roleta e explosão do Mines |
| Fontes | `expo-google-fonts` (Bebas Neue + Funnel Sans) | Fontes carregadas em bundle, garantindo consistência de design |

---

## Estrutura de Pastas

```
src/
├── app/                     # Rotas (Expo Router file-based)
│   ├── _layout.tsx          # Root layout — fontes, splash, stack global
│   ├── index.tsx            # Guard de entrada: redireciona para onboarding ou tabs
│   ├── profile.tsx          # Tela de perfil do apostador (modal/stack)
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Slides de apresentação do app
│   │   └── terms.tsx        # Termos de serviço satíricos (porta de entrada)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar customizada (flutuante, pill style)
│       ├── index.tsx        # Home: saldo, estatísticas, venda de bens
│       ├── jogar/
│       │   ├── _layout.tsx
│       │   ├── index.tsx    # Lista de jogos disponíveis
│       │   ├── roleta/      # Jogo: Brazilian Roulette
│       │   ├── mines/       # Jogo: Atomic Mines
│       │   └── crash/       # Jogo: Money Abductor (crash)
│       ├── info/            # Tab informativa
│       └── suporte/         # Tab de suporte com contatos reais
├── components/ui/           # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── GlowBorder.tsx
│   ├── Card.tsx
│   ├── OnboardingSlide.tsx
│   ├── RevealCard.tsx
│   └── StatBadge.tsx
├── store/
│   └── useAppStore.ts       # Estado global (Zustand)
└── theme/
    ├── colors.ts            # Paleta de cores
    └── typography.ts        # Escala tipográfica
```

---

## 1. Roteamento — `expo-router` (file-based)

### O que faz
O Expo Router mapeia automaticamente a estrutura de pastas dentro de `src/app/` para rotas navegáveis. Pastas entre parênteses como `(tabs)` são **grupos** — agrupam rotas sem afetar a URL.

### Como funciona

```
src/app/index.tsx          →  /
src/app/onboarding/index.tsx  →  /onboarding
src/app/(tabs)/index.tsx   →  / (dentro das tabs)
src/app/(tabs)/jogar/roleta/index.tsx  →  /(tabs)/jogar/roleta
```

### Por que desse jeito
Eliminação de boilerplate. Sem `Stack.Navigator`, sem definir rotas manualmente. Cada arquivo `_layout.tsx` define como os filhos são apresentados (Stack, Tabs, etc). O Expo Router também gera tipagem automática para as rotas.

---

## 2. Guard de Entrada — [`src/app/index.tsx`](file:///c:/dev/biggerbet-app/src/app/index.tsx)

```tsx
export default function Index() {
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);

  if (hasCompletedOnboarding) return <Redirect href="/(tabs)" />;
  return <Redirect href="/onboarding" />;
}
```

### O que faz
É o único arquivo na raiz da aplicação. Não renderiza nada — apenas decide para onde redirecionar o usuário baseado no estado persistido.

### Por que desse jeito
Separação de responsabilidade clara: a lógica de "já vi o onboarding?" vive no store, não em um `useEffect` espalhado pelo app. O componente é um **guard puro** — sem JSX real.

---

## 3. Estado Global — [`src/store/useAppStore.ts`](file:///c:/dev/biggerbet-app/src/store/useAppStore.ts)

### O que faz
Store central de toda a aplicação, persistido em `AsyncStorage`. Gerencia:

| Campo | Tipo | Significado |
|---|---|---|
| `balance` | `number` | Saldo fictício do jogador (começa em R$ 0,42) |
| `sadnessLevel` | `number` | "Nível de Tristeza" — sobe conforme o XP acumula |
| `xp` | `number` | Pontos ganhos ao perder apostas |
| `username` | `string \| null` | Apelido satírico sorteado aleatoriamente |
| `luckyDays` | `number` | Contador de "dias de sorte" |
| `hasCompletedOnboarding` | `boolean` | Flag de primeira execução |
| `assets` | `AssetItem[]` | Bens do jogador (casa, carro, etc.) disponíveis para venda |

### Como funciona

```ts
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // estado inicial...
      
      sellAsset: (id) => set((state) => {
        // marca bem como vendido
        // adiciona valor ao saldo
        // concede +500 XP
        // recalcula sadnessLevel = Math.floor(xp / 1000) + 1
      }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        return { xp: newXp, sadnessLevel: Math.floor(newXp / XP_PER_LEVEL) + 1 };
      }),
    }),
    { name: "biggerbet-storage", storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

### Por que desse jeito

- **Zustand sem Provider**: qualquer componente chama `useAppStore()` diretamente, sem precisar estar dentro de um contexto.
- **`persist` middleware**: serializa o estado em JSON e salva no `AsyncStorage` a cada mudança, restaurando automaticamente na próxima abertura.
- **`sadnessLevel` é computado, nunca salvo separado**: calculado como `Math.floor(xp / 1000) + 1` sempre que o XP muda. Evita inconsistência entre os dois campos.
- **`XP_PER_LEVEL = 1000` é exportado**: a constante é compartilhada com as telas que exibem a barra de progresso, garantindo que o cálculo seja sempre o mesmo.

---

## 4. Sistema de Tema — [`src/theme/`](file:///c:/dev/biggerbet-app/src/theme/)

### [`colors.ts`](file:///c:/dev/biggerbet-app/src/theme/colors.ts)

```ts
export const colors = {
  bgBase:         "#09090B",  // quase preto — fundo principal
  bgCard:         "#13141F",  // escuro azulado — cards
  accentLime:     "#9DFF20",  // verde neon — cor primária de ação
  accentIndigo:   "#4355F9",  // roxo — cor secundária
  accentDanger:   "#FF3B6E",  // rosa/vermelho — explosão, derrota
  textPrimary:    "#FFFFFF",
  textSecondary:  "#8B92A5",
};
```

### [`typography.ts`](file:///c:/dev/biggerbet-app/src/theme/typography.ts)

```ts
export const typography = {
  fonts: {
    condensed:  'BebasNeue_400Regular',  // títulos, números grandes
    regular:    'FunnelSans_400Regular',
    bold:       'FunnelSans_700Bold',
    extraBold:  'FunnelSans_800ExtraBold',
  },
  sizes: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 }
};
```

### Por que desse jeito
Um único objeto importado substitui o uso de magic strings de cor e tamanho pelo código todo. Alterar uma cor ou fonte reflete em 100% do app instantaneamente. A Bebas Neue foi escolhida por ter personalidade de "apostas/casino" (condensada, agressiva).

---

## 5. Root Layout — [`src/app/_layout.tsx`](file:///c:/dev/biggerbet-app/src/app/_layout.tsx)

```tsx
SplashScreen.preventAutoHideAsync(); // segura a splash enquanto as fontes carregam

export default function RootLayout() {
  const [loaded, error] = useFonts({ BebasNeue_400Regular, FunnelSans_400Regular, ... });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null; // não renderiza nada até as fontes estarem prontas

  return (
    <>
      <StatusBar style="light" />
      <NavigationBar style="light" hidden={true} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
```

### Por que desse jeito
- **`SplashScreen.preventAutoHideAsync()`** garante que o usuário nunca veja uma tela com a fonte padrão do sistema antes da Bebas Neue carregar.
- **`NavigationBar hidden={true}`** remove a barra de navegação Android para um visual mais imersivo.
- **`animation: "fade"`** como padrão de transição — suave e consistente com o tema escuro.

---

## 6. Tab Bar Customizada — [`src/app/(tabs)/_layout.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/_layout.tsx)

### O que faz
Substitui completamente a tab bar padrão do React Navigation por um componente `CustomTabBar` flutuante no estilo "pill" com borda neon.

### Como funciona
```tsx
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}> {/* position: absolute, bottom: 16 */}
      <View style={styles.tabBarContainer}> {/* borderRadius: 32, pill shape */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const color = isFocused ? colors.accentLime : "rgba(157, 255, 32, 0.4)";
          
          return (
            <Pressable
              style={[
                styles.tabItem,
                isFocused && { borderColor: color, borderWidth: 1, borderRadius: 20 }
              ]}
              onPress={() => navigation.navigate(route.name)}
            >
              {options.tabBarIcon({ focused: isFocused, color, size: 20 })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
```

### Por que desse jeito
A tab bar padrão do Expo/React Navigation não suporta o design "pill flutuante com glow neon". A única forma de ter controle total é passar `tabBar={(props) => <CustomTabBar {...props} />}`. O componente recebe `state`, `descriptors` e `navigation` diretamente do React Navigation, mantendo o comportamento nativo (eventos de press, acessibilidade, etc.).

---

## 7. Onboarding — [`src/app/onboarding/`](file:///c:/dev/biggerbet-app/src/app/onboarding/)

### Fluxo
```
/onboarding/index.tsx  →  3 slides animados  →  /onboarding/terms.tsx  →  /(tabs)
```

### Slides (`index.tsx`)
Usa `Animated.FlatList` com `pagingEnabled` para o carrossel horizontal. Os dots de paginação usam `interpolate` do Reanimated para animar largura (8px → 24px) e cor simultaneamente conforme o scroll avança — tudo na thread da UI.

```ts
const animatedDotStyle = useAnimatedStyle(() => {
  const width = interpolate(scrollX.value, 
    [(index-1)*W, index*W, (index+1)*W], 
    [8, 24, 8], Extrapolation.CLAMP
  );
  const backgroundColor = interpolateColor(scrollX.value, [...], [...]);
  return { width, backgroundColor };
});
```

### Terms (`terms.tsx`)
- Exibe os termos satíricos com disclaimer explícito de que é um app educativo.
- O botão "Aceitar" só fica habilitado após o checkbox ser marcado.
- Ao aceitar, chama `completeOnboarding()` no store (seta `hasCompletedOnboarding: true`) e faz `router.replace("/(tabs)")` — o `replace` garante que o botão voltar não retorne ao onboarding.

---

## 8. Home — [`src/app/(tabs)/index.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/index.tsx)

### O que faz
Dashboard principal com:
- **Saldo atual** em destaque com text-shadow neon e animação de pulsação (`moti` loop)
- **Badge "Risco de Falência: Crítico"** com dot piscando
- **Stats cards**: Dias de Sorte e Nível de Tristeza com barra de XP animada
- **Lista de bens** que o usuário pode vender para aumentar o saldo

### Barra de XP
```tsx
const progressWidth = useSharedValue(0);
useEffect(() => {
  progressWidth.value = withTiming(progressPercent, { duration: 800 });
}, [progressPercent]);
```
`withTiming` anima a largura da barra suavemente a cada mudança de XP. `useSharedValue` garante que a animação rode na thread da UI, sem bloqueio do JS.

### Venda de bens
Chama `sellAsset(id)` no store. O item vira `sold: true`, o saldo aumenta pelo valor do bem, e o usuário ganha 500 XP. O card fica opaco (`opacity: 0.5`) e o texto com `textDecorationLine: "line-through"`.

---

## 9. Lista de Jogos — [`src/app/(tabs)/jogar/index.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/jogar/index.tsx)

Grid de 3 cards de jogos hardcoded na constante `GAMES`:

```ts
const GAMES = [
  { id: "roleta", name: "BRAZILIAN ROULETTE", route: "/(tabs)/jogar/roleta", image: ... },
  { id: "mines",  name: "ATOMIC MINES",       route: "/(tabs)/jogar/mines",  image: ... },
  { id: "crash",  name: "MONEY ABDUCTOR",     route: "/(tabs)/jogar/crash",  image: ... },
];
```

---

## 10. Jogos

Todos os 3 jogos seguem o mesmo padrão estrutural:
- Compartilham `balance`, `updateBalance`, `addXp` do store.
- Ganhar → `updateBalance(+ganho)`.
- Perder → `addXp(30)` (perdas viram XP de "tristeza").
- Um badge `"SIMULAÇÃO • SEM DINHEIRO REAL"` sempre visível.
- Um botão `?` que navega para a tela `/info` do jogo.

### 10.1 Brazilian Roulette — [`jogar/roleta/index.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/jogar/roleta/index.tsx)

**Mecânica satírica:** chance de 10% de ganhar (`Math.random() > 0.9`).

**Roda desenhada em SVG puro:**
```tsx
function WheelSegments() {
  const slices = useMemo(() => {
    const r = DISC_SIZE / 2;
    const step = 360 / SEGMENT_COUNT; // 16 fatias, 22.5° cada
    return Array.from({ length: 16 }).map((_, i) => ({
      d: describeSlice(r, r, r, i * step, (i + 1) * step),
      color: i % 2 === 0 ? "#0A0A0A" : "#F2F2F2", // preto/branco alternado
    }));
  }, []);
  // renderiza como <Path> dentro de <Svg>
}
```
A geometria usa `polarToCartesian` + SVG Arc (`A`) para gerar o path de cada fatia. O `useMemo` garante que os cálculos trigonométricos rodem apenas uma vez.

**Animação de spin:**
```ts
rotation.value = withTiming(
  rotation.value + 360 * 4 + Math.random() * 360, // 4 voltas + ângulo aleatório
  { duration: 1500, easing: Easing.out(Easing.cubic) }
);
```
> ⚠️ O ângulo final da roda é **puramente estético** — o resultado (ganhou/perdeu) já foi decidido por `Math.random() > 0.9` antes da animação começar.

---

### 10.2 Atomic Mines — [`jogar/mines/index.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/jogar/mines/index.tsx)

**Mecânica satírica (dark pattern explícito):**
```ts
// A primeira célula tem 30% de chance de ser segura
// A segunda célula é SEMPRE mina
const isMine = revealedSafeCount === 0 ? Math.random() < 0.7 : true;
```
O comentário no código documenta intencionalmente o dark pattern para fins educativos.

**Multiplicador crescente:**
```ts
const MULTIPLIER_PER_SAFE = 1.5;
const multiplier = 1 + revealedSafeCount * MULTIPLIER_PER_SAFE;
// 0 seguras → 1.0x | 1 segura → 2.5x | 2 seguras → 4.0x (mas sempre explode na 2ª)
```

**Explosão KABOOM:** estrela desenhada em SVG com `describeStar()` (pontos alternando raio externo/interno). Aparece com spring animation (`withSpring`, `damping: 7`).

**Cash out:** se o usuário tiver revelado ao menos 1 célula segura, pode retirar o multiplicador antes de tentar a próxima.

---

### 10.3 Money Abductor (Crash) — [`jogar/crash/index.tsx`](file:///c:/dev/biggerbet-app/src/app/(tabs)/jogar/crash/index.tsx)

**Mecânica satírica (dark pattern explícito):**
```ts
// O crash é decidido ANTES do jogo começar
crashPointRef.current = Number((Math.random() * 3 + 1).toFixed(2)); // entre 1x e 4x

// Tick a cada 100ms: incrementa 0.05x
intervalRef.current = setInterval(() => {
  current += TICK_STEP;
  if (rounded >= crashPointRef.current) {
    // crash! para tudo
  }
}, TICK_MS);
```
Comentário explícito no código: *"a barra só parece imprevisível, mas o resultado já estava decidido"* — expõe o mecanismo de crash games reais.

**Foguete animado:**
```tsx
const rocketStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: flightProgress.value * FLIGHT_WIDTH },   // move para a direita
    { translateY: -flightProgress.value * FLIGHT_HEIGHT },  // sobe
    { rotate: crashed ? "15deg" : "-35deg" },              // tomba no crash
  ],
}));

useEffect(() => {
  const progress = Math.min((multiplier - 1) / (VISUAL_CEILING - 1), 1);
  flightProgress.value = withTiming(progress, { duration: TICK_MS });
}, [multiplier]);
```
`VISUAL_CEILING = 4.5` normaliza o progresso visual — o foguete "sai da tela" antes do multiplicador ir ao infinito.

---

## 11. Componentes UI

### [`Button.tsx`](file:///c:/dev/biggerbet-app/src/components/ui/Button.tsx)

5 variantes: `primary`, `secondary`, `danger`, `ghost`, `outline-neon`.

- `primary/secondary/danger`: usa `expo-linear-gradient` como background absoluto sobre o `TouchableOpacity`.
- `ghost/outline-neon`: sem gradiente, apenas borda ou transparente.

```tsx
// primary usa gradiente diagonal:
<LinearGradient
  colors={[colors.accentLime, '#85CC31']}
  style={[StyleSheet.absoluteFill, styles.gradient]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
/>
```

Por que `LinearGradient` absoluteFill dentro do TouchableOpacity ao invés de ser o container: porque `TouchableOpacity` precisa ser o elemento externo para receber os eventos de toque corretamente.

### [`GlowBorder.tsx`](file:///c:/dev/biggerbet-app/src/components/ui/GlowBorder.tsx)

Wrapper que adiciona borda neon com glow (shadow) ao redor de qualquer conteúdo.

```tsx
<View> {/* container com borderRadius */}
  <View style={[absoluteFill, { borderColor: color, shadowColor: color, shadowRadius: 12 }]} />
  <View style={{ overflow: 'hidden' }}>
    {children}
  </View>
</View>
```
Usa dois `View` sobrepostos: o de baixo é a borda/shadow, o de cima é o conteúdo com `overflow: hidden` para respeitar o `borderRadius`.

---

## 12. Profile — [`src/app/profile.tsx`](file:///c:/dev/biggerbet-app/src/app/profile.tsx)

Tela modal (acessada pelo avatar na Home) com:
- **Username satírico**: gerado aleatoriamente de uma lista de apelidos ("Rei do Loss", "Sardinha Emocionada") via `generateInitialName()` no store — só sorteia se ainda não tiver nome.
- **XP total** + barra de progresso para o próximo nível.
- **Conquistas (Hall da Fama)**: 4 achievements desbloqueados por estado real do jogo (ter perdido XP, ter vendido a casa, vendido o carro, atingido nível 5).

---

## Fluxo Completo do Usuário

```mermaid
flowchart TD
    A[App abre] --> B{hasCompletedOnboarding?}
    B -- não --> C[/onboarding - 3 slides/]
    C --> D[/onboarding/terms - aceitar termos/]
    D --> E[completeOnboarding no store]
    E --> F[/(tabs)/]
    B -- sim --> F

    F --> G[Home: ver saldo + vender bens]
    F --> H[Jogar: escolher jogo]
    H --> I[Roleta: 10% de chance]
    H --> J[Mines: sempre explode na 2ª célula]
    H --> K[Crash: resultado decidido antes]

    I -- perde --> L[addXp: +30]
    J -- explode --> L
    K -- crash --> L
    L --> M[sadnessLevel sobe a cada 1000 XP]

    G --> N[sellAsset: +500 XP + valor do bem]
    N --> M
```

---

## Convenções do Projeto

| Convenção | Decisão |
|---|---|
| Estilos | `StyleSheet.create` inline em cada arquivo — sem CSS-in-JS externo |
| Fontes em texto | Sempre `fontFamily: typography.fonts.X` — nunca string direta |
| Cores | Sempre `colors.X` — nunca hex literal nas telas |
| Navegação | `expo-router` (`useRouter`, `<Redirect>`) — nunca `react-navigation` direto |
| Estado local | `useState` para estado de jogo efêmero; `useAppStore` para o que precisa persistir |
| Animações simples | `moti` (declarativo); animações complexas com dependência de gesto ou performance crítica → `reanimated` direto |
| Comentários satíricos | Os dark patterns são documentados nos comentários do código intencionalmente |
