# 🏗️ Arquitetura Técnica - Ministerium

## Visão Geral

O Ministerium é um ERP SaaS multi-tenant desenvolvido seguindo os princípios de **Clean Architecture**, **SOLID** e **Clean Code**.

## Stack Tecnológica

### Front-end
- **React 18.2** - Framework UI com hooks e concurrent features
- **TypeScript 5.3** - Type safety e melhor DX
- **Refine.dev 4.47** - Framework para admin panels
- **Mantine UI 7.3** - Sistema de design moderno
- **React Router v6** - Roteamento client-side
- **TanStack Table v8** - Tabelas com sorting, filtering e pagination
- **Vite 5.0** - Build tool moderna e rápida

### Estado e Dados
- **Refine Data Provider** - Camada de abstração de dados
- **React Query** - Cache e sincronização (via Refine)
- **Zustand** - Estado global leve (futuro)

### Testes
- **Playwright** - Testes E2E
- **Vitest** - Unit tests (futuro)

### Backend (Futuro)
- **NestJS** - Framework Node.js enterprise
- **PostgreSQL 14+** - Banco de dados relacional
- **Prisma/TypeORM** - ORM
- **JWT** - Autenticação
- **Docker** - Containerização

## Arquitetura do Front-end

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│      (Pages & Components)           │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│      (Hooks & Providers)            │
├─────────────────────────────────────┤
│         Data Access Layer           │
│      (Data Provider & API)          │
├─────────────────────────────────────┤
│         Infrastructure Layer        │
│      (Config & Utils)               │
└─────────────────────────────────────┘
```

### Fluxo de Dados

```
User Action
    ↓
React Component
    ↓
useTable/useForm (Refine Hooks)
    ↓
Data Provider
    ↓
API Call / Mock Data
    ↓
React Query Cache
    ↓
Component Re-render
```

## Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente tem uma única responsabilidade
- Separação de concerns (UI, lógica, dados)
- Hooks customizados para lógica reutilizável

**Exemplo:**
```typescript
// ❌ Violação do SRP
const MemberList = () => {
  // Lógica de fetch, estado, UI, formatação tudo junto
}

// ✅ Seguindo SRP
const MemberList = () => {
  const { data } = useMembers(); // Data fetching
  return <MemberTable data={data} />; // Apresentação
}
```

### Open/Closed Principle (OCP)
- Componentes extensíveis via props e composition
- Providers configuráveis
- Feature toggles para habilitar/desabilitar módulos

**Exemplo:**
```typescript
// Extensível sem modificar o código base
<ProtectedRoute
  requiredPermission="members:view"
  fallback={<UnauthorizedPage />}
>
  <MemberList />
</ProtectedRoute>
```

### Liskov Substitution Principle (LSP)
- Interfaces consistentes
- Componentes substituíveis
- Props compatíveis

### Interface Segregation Principle (ISP)
- Tipos TypeScript específicos
- Props mínimas necessárias
- Sem dependências desnecessárias

**Exemplo:**
```typescript
// ❌ Interface grande
interface MemberProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ... 20+ campos
}

// ✅ Interfaces segregadas
interface MemberBasicInfo {
  id: string;
  name: string;
}

interface MemberContactInfo {
  email?: string;
  phone?: string;
}
```

### Dependency Inversion Principle (DIP)
- Dependência de abstrações (interfaces)
- Data Provider como abstração
- Auth Provider como abstração

**Exemplo:**
```typescript
// Componentes dependem da abstração DataProvider
// não da implementação concreta (REST, GraphQL, Mock)
const dataProvider: DataProvider = config.useMockData
  ? localDataProvider
  : restDataProvider;
```

## Padrões de Design Utilizados

### Provider Pattern
- AuthProvider para autenticação
- DataProvider para acesso a dados
- ThemeProvider para temas

### Compound Components
- Layout com Header, Sidebar, Content
- Formulários compostos

### Render Props & Hooks
- Custom hooks para lógica reutilizável
- usePermissions, useTable, useForm

### Factory Pattern
- Geração de dados fake
- Criação de instâncias configuráveis

## Multi-tenancy

### Estratégia: Schema Isolation

Cada tenant (igreja) tem isolamento completo:

```sql
-- Todas as tabelas têm tenant_id
CREATE TABLE members (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  -- ...
);

-- RLS garante isolamento
CREATE POLICY tenant_isolation
  ON members
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

### Identificação do Tenant

```typescript
// Via subdomain
igreja1.ministerium.com -> tenant_id: xxx
igreja2.ministerium.com -> tenant_id: yyy

// Via token JWT
{
  "sub": "user-id",
  "tenantId": "tenant-id",
  "role": "admin"
}
```

## Autenticação & Autorização

### JWT Flow

```
1. User login
   ↓
2. Server valida credenciais
   ↓
3. Server gera JWT + Refresh Token
   ↓
4. Client armazena tokens
   ↓
5. Client envia JWT em todas requisições
   ↓
6. Server valida JWT
   ↓
7. Token expira -> usa Refresh Token
```

### RBAC (Role-Based Access Control)

```typescript
const PERMISSIONS = {
  admin: ['*'], // Tudo
  leader: ['members:view', 'members:create', 'events:*'],
  volunteer: ['members:view', 'events:view'],
};

// Verificação
if (hasPermission(user, 'members:create')) {
  // Permitir ação
}
```

## Performance

### Otimizações Implementadas

1. **Code Splitting**
   - Lazy loading de rotas
   - Dynamic imports

2. **Memoization**
   - useMemo para cálculos pesados
   - useCallback para funções

3. **Virtualização**
   - Listas grandes com windowing (futuro)

4. **Caching**
   - React Query cache automático
   - Cache de API com stale-while-revalidate

5. **Bundle Size**
   - Tree shaking automático
   - Compressão gzip/brotli

## Segurança

### Implementações

1. **XSS Protection**
   - React escapa automaticamente
   - Sanitização de inputs

2. **CSRF Protection**
   - Tokens CSRF em formulários
   - SameSite cookies

3. **SQL Injection**
   - Prepared statements
   - Validação de inputs

4. **Autenticação**
   - JWT com expiração
   - Refresh tokens
   - Logout em todas as tabs

5. **Autorização**
   - RBAC granular
   - Protected routes
   - Permission checks

## Escalabilidade

### Horizontal Scaling

```
                   Load Balancer
                         |
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     App 1           App 2           App 3
        ↓               ↓               ↓
        └───────────────┼───────────────┘
                        ↓
                   Database
                   (Master)
                    ↓    ↓
              Read Replicas
```

### Caching Strategy

```
Browser Cache (7d)
        ↓
CDN Cache (24h)
        ↓
API Cache (5m)
        ↓
Database Query Cache
        ↓
Database
```

## Testes

### Pirâmide de Testes

```
        /\
       /E2E\      ← Poucos, críticos
      /──────\
     /Integration\ ← Moderados
    /──────────────\
   /   Unit Tests   \ ← Muitos, rápidos
  /──────────────────\
```

### Cobertura

- **E2E**: Fluxos principais
- **Integration**: Hooks e providers
- **Unit**: Funções puras e utils

## CI/CD Pipeline

```
Git Push
    ↓
GitHub Actions
    ↓
┌─────────────┐
│ Lint        │
│ Type Check  │
│ Unit Tests  │
│ Build       │
└─────────────┘
    ↓
┌─────────────┐
│ E2E Tests   │
└─────────────┘
    ↓
Deploy to Vercel/Netlify
```

## Monitoramento

### Métricas Importantes

1. **Performance**
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)
   - Largest Contentful Paint (LCP)

2. **Errors**
   - Error rate
   - Error types
   - Stack traces

3. **Usage**
   - Active users
   - Feature usage
   - Page views

### Tools (Futuro)

- **Sentry** - Error tracking
- **Datadog** - APM
- **Google Analytics** - Usage analytics
- **LogRocket** - Session replay

## Backup & Recovery

### Estratégia

1. **Backups Automáticos**
   - Diário completo
   - Incremental a cada hora
   - Retenção: 30 dias

2. **Point-in-Time Recovery**
   - PostgreSQL WAL archiving
   - Recovery até 5 minutos atrás

3. **Disaster Recovery**
   - RTO: 1 hora
   - RPO: 5 minutos
   - Backups em múltiplas regiões

## Roadmap Técnico

### Q1 2024
- ✅ MVP Front-end completo
- ⏳ Backend NestJS
- ⏳ Integração Front + Back

### Q2 2024
- ⏳ API pública com rate limiting
- ⏳ Webhooks
- ⏳ Relatórios avançados

### Q3 2024
- ⏳ Mobile app (React Native)
- ⏳ Offline-first
- ⏳ Push notifications

### Q4 2024
- ⏳ Marketplace de plugins
- ⏳ White-label
- ⏳ Enterprise features

## Conclusão

A arquitetura do Ministerium foi projetada para ser:

- 🎯 **Modular** - Fácil de estender
- 🔒 **Segura** - RBAC, JWT, RLS
- ⚡ **Performática** - Code splitting, caching
- 🧪 **Testável** - E2E, integration, unit
- 📈 **Escalável** - Multi-tenant, horizontal scaling
- 🛠️ **Manutenível** - Clean code, SOLID, TypeScript

---

**Desenvolvido com ❤️ seguindo as melhores práticas da indústria.**
