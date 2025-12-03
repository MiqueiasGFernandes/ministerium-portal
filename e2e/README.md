# E2E Tests - Ministerium Portal

Este diretório contém testes end-to-end (E2E) usando Playwright para validar a funcionalidade completa do Ministerium Portal.

## Estrutura de Testes

### Módulos Testados

- **auth.spec.ts** - Autenticação e autorização
- **dashboard.spec.ts** - Dashboard e navegação principal
- **members.spec.ts** - Gestão de membros
- **finance.spec.ts** - Gestão financeira
- **events.spec.ts** - Gestão de eventos
- **ministries.spec.ts** - Gestão de ministérios (NOVO)

## Testes de Ministérios

O arquivo `ministries.spec.ts` contém testes completos para a funcionalidade de ministérios:

### Casos de Teste Cobertos

1. **Visualização**
   - Exibição da lista de ministérios
   - Exibição de colunas da tabela
   - Visualização de detalhes do ministério
   - Badge com contagem de membros

2. **Criação**
   - Criar novo ministério com sucesso
   - Validação de campos obrigatórios
   - Cancelar criação e retornar à lista

3. **Edição**
   - Editar ministério existente
   - Navegar de detalhes para edição
   - Cancelar edição e retornar à lista

4. **Integração**
   - Ministérios aparecem no dropdown de escalas
   - Paginação da lista de ministérios

5. **Permissões**
   - Admin tem acesso total (criar, editar, excluir)

## Como Executar os Testes

### Pré-requisitos

```bash
# Instalar dependências
npm install

# Instalar browsers do Playwright
npx playwright install
```

### Executar Testes

```bash
# Todos os testes
npm run test:e2e

# Apenas testes de ministérios
npx playwright test e2e/ministries.spec.ts

# Apenas testes de ministérios no Chrome
npx playwright test e2e/ministries.spec.ts --project=chromium

# Modo de debug (com UI)
npx playwright test e2e/ministries.spec.ts --debug

# Modo headed (vê o browser)
npx playwright test e2e/ministries.spec.ts --headed
```

### Visualizar Relatório

```bash
# Após executar os testes, visualize o relatório HTML
npx playwright show-report
```

## Configuração

A configuração dos testes está em `playwright.config.ts`:

- **baseURL**: http://localhost:3000
- **Navegadores**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **webServer**: Inicia automaticamente `npm run dev`
- **Retries**: 2 tentativas em CI, 0 localmente
- **Screenshots**: Apenas em falhas
- **Trace**: Na primeira tentativa de retry

## Estrutura dos Testes de Ministérios

```typescript
test.describe('Ministries Module', () => {
  test.beforeEach(async ({ page }) => {
    // Login automático antes de cada teste
  });

  test('should display ministries list', async ({ page }) => {
    // Testa visualização da lista
  });

  test('should create new ministry', async ({ page }) => {
    // Testa criação de ministério
  });

  // ... outros testes
});
```

## Credenciais de Teste

Os testes usam as seguintes credenciais padrão:

- **Email**: admin@ministerium.com
- **Senha**: admin123
- **Role**: ADMIN (acesso total)

## Boas Práticas

1. **Sempre fazer login antes dos testes**: Use o `beforeEach` para autenticar
2. **Esperar elementos carregarem**: Use `waitForSelector` quando necessário
3. **Usar seletores semânticos**: Prefira `text=`, `role=`, etc.
4. **Timeouts adequados**: Configure timeouts para operações lentas
5. **Cleanup**: Não deixe dados de teste no sistema (use fixtures quando possível)

## Troubleshooting

### Testes falhando por timeout

Se os testes estão falhando por timeout:

1. Verifique se o servidor está rodando
2. Aumente o timeout em operações lentas
3. Use `waitUntil: 'networkidle'` no `page.goto()`

### Seletores não encontrados

Se os seletores não são encontrados:

1. Execute em modo `--headed` para ver o que acontece
2. Use `--debug` para pausar e inspecionar
3. Verifique se o elemento existe com Playwright Inspector

### Servidor não inicia

Se o webServer não inicia:

1. Certifique-se que a porta 3000 está livre
2. Execute `npm run dev` manualmente primeiro
3. Use `reuseExistingServer: true` no config

## CI/CD

Os testes são configurados para rodar em CI com:

- Retries automáticos (2 tentativas)
- 1 worker (execução sequencial)
- Screenshots e traces em falhas
- Relatório HTML gerado automaticamente

## Recursos Adicionais

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
