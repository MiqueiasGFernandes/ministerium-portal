# 🤝 Guia de Contribuição - Ministerium

## Bem-vindo!

Obrigado por considerar contribuir com o Ministerium! Este guia vai ajudá-lo a entender nosso processo de desenvolvimento.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testes](#testes)

## Código de Conduta

- Seja respeitoso e profissional
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## Como Contribuir

### 1. Fork o Repositório

```bash
git clone https://github.com/seu-usuario/ministerium-portal.git
cd ministerium-portal
```

### 2. Crie uma Branch

```bash
# Feature
git checkout -b feature/nome-da-feature

# Bug fix
git checkout -b fix/nome-do-bug

# Hotfix
git checkout -b hotfix/nome-do-hotfix
```

### 3. Faça suas Alterações

Siga os padrões de código descritos abaixo.

### 4. Commit suas Alterações

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### 5. Push para o GitHub

```bash
git push origin feature/nome-da-feature
```

### 6. Abra um Pull Request

Descreva suas alterações de forma clara e objetiva.

## Padrões de Código

### TypeScript

#### Nomenclatura

```typescript
// ✅ BOM
const userName = 'João';
const UserProfile = () => {};
interface UserData {}
type UserId = string;

// ❌ RUIM
const username = 'João'; // sem camelCase
const userprofile = () => {}; // componente em minúscula
interface userdata {} // interface em minúscula
```

#### Tipos

```typescript
// ✅ BOM - Sempre tipar
const fetchUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ RUIM - Sem tipos
const fetchUser = async (id) => {
  // ...
}

// ✅ BOM - Interfaces para objetos
interface User {
  id: string;
  name: string;
}

// ❌ RUIM - any
const user: any = {};
```

### React Components

#### Functional Components

```typescript
// ✅ BOM - Arrow function tipada
export const MemberList: React.FC = () => {
  return <div>...</div>;
};

// ✅ BOM - Com props interface
interface MemberCardProps {
  member: Member;
  onEdit?: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit }) => {
  return <div>...</div>;
};
```

#### Hooks

```typescript
// ✅ BOM - Ordem dos hooks
const Component = () => {
  // 1. useState
  const [count, setCount] = useState(0);

  // 2. useRef
  const ref = useRef<HTMLDivElement>(null);

  // 3. useContext
  const theme = useContext(ThemeContext);

  // 4. Custom hooks
  const { user } = useAuth();

  // 5. useEffect
  useEffect(() => {
    // side effects
  }, []);

  // 6. Event handlers
  const handleClick = () => {
    setCount(count + 1);
  };

  // 7. JSX
  return <div onClick={handleClick}>{count}</div>;
};
```

### Imports

```typescript
// ✅ BOM - Ordem de imports
// 1. External libraries
import { useState, useEffect } from 'react';
import { Button, Stack } from '@mantine/core';

// 2. Internal modules
import { useAuth } from '@/hooks/useAuth';
import { Member } from '@/types';

// 3. Relative imports
import { MemberCard } from './MemberCard';

// 4. Styles
import './styles.css';
```

### Comentários

```typescript
// ✅ BOM - Comentário útil
// Calculate user age based on birth date
const age = calculateAge(birthDate);

// ❌ RUIM - Comentário óbvio
// Set name to John
const name = 'John';

// ✅ BOM - JSDoc para funções públicas
/**
 * Formats currency to Brazilian Real
 * @param value - The numeric value to format
 * @returns Formatted string with R$ prefix
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
```

### Clean Code Principles

#### DRY (Don't Repeat Yourself)

```typescript
// ❌ RUIM - Código duplicado
const formatUserName = (name: string) => name.toUpperCase();
const formatCityName = (name: string) => name.toUpperCase();

// ✅ BOM - Função reutilizável
const formatName = (name: string) => name.toUpperCase();
```

#### KISS (Keep It Simple, Stupid)

```typescript
// ❌ RUIM - Complexo desnecessariamente
const isAdult = (age: number) => {
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
};

// ✅ BOM - Simples e direto
const isAdult = (age: number) => age >= 18;
```

#### YAGNI (You Aren't Gonna Need It)

```typescript
// ❌ RUIM - Código para funcionalidade futura
interface User {
  id: string;
  name: string;
  futureField1?: string; // Não usado agora
  futureField2?: number; // Não usado agora
}

// ✅ BOM - Apenas o necessário
interface User {
  id: string;
  name: string;
}
```

## Commits

### Conventional Commits

Usamos a convenção [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto-e-vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Manutenção, deps, config

#### Exemplos

```bash
# Feature
git commit -m "feat(members): add photo upload functionality"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(dashboard): extract stats widget component"

# Tests
git commit -m "test(members): add e2e tests for member creation"
```

### Commit Messages

```bash
# ✅ BOM
git commit -m "feat: add member photo upload"
git commit -m "fix: resolve dashboard loading issue"

# ❌ RUIM
git commit -m "updated stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

## Pull Requests

### Checklist

Antes de abrir um PR, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Testes passando (`npm run test:e2e`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Build funcionando (`npm run build`)
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem Conventional Commits

### Template de PR

```markdown
## Descrição

Breve descrição das mudanças.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (correção ou feature que causaria quebra)
- [ ] Documentação

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)

[Adicione screenshots]

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Revisei meu próprio código
- [ ] Comentei código complexo
- [ ] Atualizei documentação
- [ ] Mudanças não geram warnings
- [ ] Adicionei testes
- [ ] Testes passam localmente
```

## Testes

### Escrevendo Testes E2E

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/login');
    // Login etc
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/page');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Rodando Testes

```bash
# Todos os testes
npm run test:e2e

# Testes específicos
npx playwright test members

# Com UI
npm run test:e2e:ui

# Debug
npx playwright test --debug
```

## Estrutura de Arquivos

### Organizando Novos Componentes

```
src/components/
└── feature-name/
    ├── FeatureList.tsx       # Componente principal
    ├── FeatureCard.tsx       # Sub-componente
    ├── FeatureForm.tsx       # Formulário
    ├── index.ts              # Barrel export
    └── types.ts              # Types locais (se necessário)
```

### Organizando Novas Pages

```
src/pages/
└── feature-name/
    ├── FeatureList.tsx
    ├── FeatureCreate.tsx
    ├── FeatureEdit.tsx
    ├── FeatureShow.tsx
    └── index.ts
```

## Boas Práticas

### Performance

```typescript
// ✅ BOM - Memoização
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// ✅ BOM - useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ BOM - Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Acessibilidade

```typescript
// ✅ BOM - Labels em inputs
<TextInput
  label="Nome"
  aria-label="Nome completo do usuário"
  required
/>

// ✅ BOM - Alt em imagens
<img src={photo} alt={`Foto de ${name}`} />

// ✅ BOM - Roles semânticos
<button role="button" aria-label="Fechar modal">
  <IconX />
</button>
```

### Segurança

```typescript
// ✅ BOM - Sanitização de inputs
const sanitizedInput = DOMPurify.sanitize(userInput);

// ✅ BOM - Validação
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
});

// ❌ RUIM - Dados sensíveis no console
console.log('User password:', password);
```

## Dúvidas?

- Abra uma issue
- Entre em contato com a equipe
- Consulte a documentação

## Agradecimentos

Obrigado por contribuir com o Ministerium! 🙏

---

**Happy coding!** 💻⛪
