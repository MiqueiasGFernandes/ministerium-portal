# Refatoração de Estilos - Ministerium Portal

## 📋 Visão Geral

Este documento descreve a refatoração implementada no projeto seguindo princípios SOLID e boas práticas de arquitetura.

## 🎯 Objetivos Alcançados

- ✅ Separação de estilos dos componentes
- ✅ Implementação de princípios SOLID
- ✅ Criação de provider global para temas
- ✅ Manutenção da funcionalidade e layout existentes
- ✅ Melhoria na manutenibilidade e testabilidade

## 🏗️ Arquitetura

### 1. Contexto de Tema (Theme Context)

**Localização:** `src/contexts/ThemeContext.tsx`

**Responsabilidade:** Gerenciar o acesso global ao tema Mantine e utilitários customizados.

```typescript
// Uso
import { useThemeContext } from "@/contexts/ThemeContext";

const { theme, gradients, shadows } = useThemeContext();
```

**Princípios SOLID aplicados:**
- **Single Responsibility:** Apenas gerencia acesso ao tema
- **Dependency Inversion:** Componentes dependem da abstração (contexto), não da implementação

### 2. Módulos de Estilos

**Localização:** `src/styles/components/`

Cada componente possui seu próprio módulo de estilos seguindo SOLID:

#### Button Styles (`button.styles.ts`)

```typescript
// Interface para estilos de botão
interface IButtonStyles {
  getStyles(): ButtonProps["styles"];
}

// Implementações específicas
class GradientButtonStyles implements IButtonStyles { }
class BackButtonStyles implements IButtonStyles { }
class StaticGradientButtonStyles implements IButtonStyles { }

// Factory para criação
class ButtonStylesFactory {
  static createGradientStyles(theme: MantineTheme): IButtonStyles
  static createBackStyles(): IButtonStyles
}
```

**Princípios SOLID aplicados:**
- **Single Responsibility:** Cada classe cuida de um tipo específico de botão
- **Open/Closed:** Pode-se adicionar novos tipos sem modificar existentes
- **Liskov Substitution:** Todas implementam `IButtonStyles`
- **Interface Segregation:** Interface focada apenas no necessário
- **Dependency Inversion:** Factory retorna abstrações, não implementações concretas

#### Login Styles (`login.styles.ts`)

```typescript
class LoginStyles {
  private theme: MantineTheme;

  get container(): CSSProperties { }
  get mobileWrapper(): CSSProperties { }
  get brandingSection(): CSSProperties { }
  // ... outros estilos
}

// Factory function
const createLoginStyles = (theme: MantineTheme): LoginStyles
```

#### Header & Layout Styles

Classes similares para Header e Layout, cada uma com suas responsabilidades específicas.

### 3. Estrutura de Arquivos

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Provider global de tema
├── styles/
│   ├── components/
│   │   ├── button.styles.ts      # Estilos de botões (SOLID)
│   │   ├── login.styles.ts       # Estilos da página de login
│   │   ├── header.styles.ts      # Estilos do header
│   │   ├── layout.styles.ts      # Estilos do layout
│   │   └── index.ts              # Export centralizado
│   ├── buttonStyles.ts           # @deprecated - mantido para compatibilidade
│   └── global.css                # Estilos globais
├── theme/
│   └── index.ts                  # Configuração do tema Mantine
└── components/
    └── ...                       # Componentes refatorados
```

## 🔄 Migração de Componentes

### Antes (Login.tsx)

```typescript
// Estilos misturados com lógica
<Box
  style={{
    minHeight: "100vh",
    background: theme.other.gradients.background,
  }}
>
```

### Depois (Login.tsx)

```typescript
// Estilos separados
const styles = useMemo(() => createLoginStyles(theme), [theme]);

<Box style={styles.container}>
```

## 📦 Exportações Centralizadas

**`src/styles/components/index.ts`** centraliza todas as exportações:

```typescript
// Importação simplificada
import {
  createLoginStyles,
  createHeaderStyles,
  createLayoutStyles,
  ButtonStylesFactory
} from "@/styles/components";
```

## 🔌 Provider Integration

O `ThemeProvider` é integrado no `main.tsx`:

```typescript
<MantineProvider theme={ministeriumTheme} defaultColorScheme="light">
  <ThemeProvider>
    <Notifications position="top-right" zIndex={1000} />
    <App />
  </ThemeProvider>
</MantineProvider>
```

## ✅ Benefícios da Refatoração

### 1. Manutenibilidade
- Estilos organizados em módulos coesos
- Fácil localização e modificação
- Redução de duplicação de código

### 2. Testabilidade
- Classes de estilos podem ser testadas independentemente
- Mock facilitado através de interfaces
- Injeção de dependências clara

### 3. Escalabilidade
- Adição de novos estilos sem quebrar existentes
- Pattern Factory permite extensão fácil
- Código desacoplado e modular

### 4. Type Safety
- TypeScript em todas as definições
- Autocomplete melhorado na IDE
- Detecção precoce de erros

### 5. Performance
- Uso de `useMemo` para evitar recriação desnecessária
- Estilos computados apenas quando necessário
- Bundle otimizado com tree-shaking

## 🎨 Padrões de Uso

### Criar novos estilos para um componente

```typescript
// 1. Criar o arquivo de estilos
// src/styles/components/mycomponent.styles.ts

export class MyComponentStyles {
  private theme: MantineTheme;

  constructor(config: { theme: MantineTheme }) {
    this.theme = config.theme;
  }

  get container(): CSSProperties {
    return {
      // seus estilos
    };
  }
}

export const createMyComponentStyles = (theme: MantineTheme) => {
  return new MyComponentStyles({ theme });
};

// 2. Exportar no index
// src/styles/components/index.ts
export { MyComponentStyles, createMyComponentStyles } from "./mycomponent.styles";

// 3. Usar no componente
import { useMemo } from "react";
import { useMantineTheme } from "@mantine/core";
import { createMyComponentStyles } from "@/styles/components";

const MyComponent = () => {
  const theme = useMantineTheme();
  const styles = useMemo(() => createMyComponentStyles(theme), [theme]);

  return <div style={styles.container}>...</div>;
};
```

## 🔄 Retrocompatibilidade

O arquivo `src/styles/buttonStyles.ts` foi mantido como wrapper para garantir compatibilidade:

```typescript
// @deprecated - Use @/styles/components instead
export {
  useGradientButtonStyles,
  useBackButtonStyles,
  gradientButtonStyles,
  backButtonStyles,
} from "./components/button.styles";
```

## 🧪 Testes

A arquitetura facilita testes unitários:

```typescript
import { GradientButtonStyles } from "@/styles/components";

describe("GradientButtonStyles", () => {
  it("should generate correct styles", () => {
    const mockTheme = { /* ... */ };
    const styles = new GradientButtonStyles({ theme: mockTheme });
    const result = styles.getStyles();

    expect(result.root).toBeDefined();
  });
});
```

## 📝 Princípios SOLID - Resumo

### Single Responsibility Principle (SRP)
- Cada classe de estilo tem uma única responsabilidade
- ThemeContext apenas gerencia tema
- Factory apenas cria instâncias

### Open/Closed Principle (OCP)
- Pode-se estender com novos estilos sem modificar existentes
- Implementação através de herança e interfaces

### Liskov Substitution Principle (LSP)
- Todas as classes de botão implementam `IButtonStyles`
- Podem ser substituídas sem quebrar o código

### Interface Segregation Principle (ISP)
- Interfaces pequenas e focadas
- Clientes não dependem de métodos não utilizados

### Dependency Inversion Principle (DIP)
- Componentes dependem de abstrações (interfaces/contextos)
- Não de implementações concretas
- Factory retorna interfaces, não classes

## 🚀 Próximos Passos (Opcionais)

1. **Tematização Dinâmica:** Expandir ThemeContext para suportar múltiplos temas
2. **CSS-in-JS:** Considerar migração para styled-components ou emotion
3. **Design Tokens:** Criar sistema de tokens de design
4. **Documentação Storybook:** Adicionar stories para cada componente estilizado
5. **Testes Visuais:** Implementar testes de regressão visual

## 📚 Referências

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Mantine Theme Documentation](https://mantine.dev/theming/theme-object/)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Data da Refatoração:** 2025-12-04
**Status:** ✅ Concluído
**Build Status:** ✅ Passing
**Testes:** ✅ All components functional
