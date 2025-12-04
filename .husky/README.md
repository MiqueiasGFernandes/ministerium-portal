# Git Hooks Configuration

Este diretório contém os hooks do Git configurados com Husky para garantir a qualidade do código antes de cada commit.

## Hooks Configurados

### 1. Pre-commit Hook
**Arquivo:** `.husky/pre-commit`

Executa antes de cada commit e realiza:

#### a) Testes Unitários
```bash
npm test -- --run
```
- Roda todos os testes unitários com Vitest
- Os testes e2e (Playwright) são automaticamente excluídos via configuração no `vite.config.ts`
- Se algum teste falhar, o commit será bloqueado

#### b) Lint-Staged
```bash
npx lint-staged
```
- Processa apenas os arquivos TypeScript/TSX que estão no stage
- Executa Biome para formatação e correção automática
- Executa ESLint para correção de problemas de lint
- As correções são automaticamente adicionadas ao commit

### 2. Commit-msg Hook
**Arquivo:** `.husky/commit-msg`

Valida a mensagem do commit usando Commitlint:

```bash
npx --no -- commitlint --edit "$1"
```

#### Tipos de Commit Permitidos (Conventional Commits)

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação, sem alteração de código
- `refactor:` - Refatoração de código
- `perf:` - Melhoria de performance
- `test:` - Adição ou correção de testes
- `build:` - Alterações no build ou dependências
- `ci:` - Alterações em CI/CD
- `chore:` - Outras alterações
- `revert:` - Revert de commit anterior

#### Exemplos de Mensagens Válidas

✅ **Correto:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor: simplify onboarding flow"
git commit -m "test: add unit tests for CEP service"
```

❌ **Incorreto:**
```bash
git commit -m "Added new feature"          # Sem tipo
git commit -m "FIX: bug fix"               # Tipo em maiúsculas
git commit -m "feat:"                      # Sem descrição
git commit -m "feat: Added new feature."   # Ponto final não permitido
```

## Configurações

### Commitlint
**Arquivo:** `commitlint.config.js`

Define as regras de validação das mensagens de commit.

### Lint-staged
**Arquivo:** `package.json` → `lint-staged`

Define quais comandos executar em arquivos staged:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true",
      "eslint --fix"
    ]
  }
}
```

### Vitest
**Arquivo:** `vite.config.ts` → `test.exclude`

Exclui os testes e2e do Vitest:
```typescript
test: {
  exclude: [
    '**/e2e/**',
    // outros...
  ]
}
```

## Executando os Testes Manualmente

### Testes Unitários (Vitest)
```bash
npm test              # Modo watch
npm test -- --run     # Execução única (usado no hook)
```

### Testes E2E (Playwright)
```bash
npm run test:e2e      # Execução normal
npm run test:e2e:ui   # Modo UI
```

## Desabilitando os Hooks (Não Recomendado)

Se precisar fazer um commit sem executar os hooks:

```bash
git commit --no-verify -m "feat: emergency fix"
```

⚠️ **Atenção:** Use apenas em casos de emergência. Os hooks existem para garantir a qualidade do código.

## Solução de Problemas

### Problema: Testes falhando
**Solução:** Corrija os testes antes de fazer commit. Os hooks garantem que apenas código testado seja commitado.

### Problema: Lint-staged muito lento
**Solução:** O lint-staged processa apenas arquivos staged. Se muitos arquivos foram modificados, considere fazer commits menores.

### Problema: Mensagem de commit rejeitada
**Solução:** Verifique se sua mensagem segue o padrão conventional commits (tipo: descrição).

## Manutenção

Para atualizar os hooks:

1. Edite os arquivos em `.husky/`
2. Certifique-se de que os arquivos são executáveis:
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```

Para reinstalar os hooks após clonar o repositório:

```bash
npm install  # O script 'prepare' executará 'husky' automaticamente
```
