# Ministerium - ERP SaaS para Igrejas

## 🎯 Visão Geral

Ministerium é um ERP SaaS moderno e completo para gestão administrativa de igrejas, desenvolvido com as melhores práticas e tecnologias atuais.

## ✨ Funcionalidades

### MVP Completo

- ✅ **Dashboard** - Visão geral com widgets e métricas
- ✅ **Gestão de Membros** - CRUD completo com fotos, tags e campos personalizáveis
- ✅ **Financeiro** - Controle de entradas e saídas com categorização
- ✅ **Eventos** - Gestão de eventos com check-in via QR Code
- ✅ **Escalas** - Organização de voluntários por ministério
- ✅ **Autenticação JWT/RBAC** - Sistema seguro com 3 níveis (Admin, Líder, Voluntário)
- ✅ **Personalização** - Logo, cores e configurações do tenant
- ✅ **Multi-tenant** - Isolamento completo por organização

## 🚀 Tecnologias

### Front-end
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Refine.dev** - Framework para admin panels
- **Mantine UI** - Biblioteca de componentes moderna
- **React Router v6** - Roteamento
- **TanStack Table** - Tabelas avançadas
- **Dayjs** - Manipulação de datas
- **QRCode.react** - Geração de QR Codes
- **Faker.js** - Dados fake para testes

### Desenvolvimento
- **Vite** - Build tool ultrarrápido
- **ESLint** - Linting
- **Playwright** - Testes E2E
- **PostCSS** - Processamento CSS

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Rodar testes E2E
npm run test:e2e

# Rodar testes E2E com UI
npm run test:e2e:ui
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Environment
VITE_NODE_ENV=development

# API Configuration
VITE_API_URL=http://localhost:8000/api/v1

# Feature Toggles
VITE_FEATURE_MEMBERS=true
VITE_FEATURE_FINANCE=true
VITE_FEATURE_EVENTS=true
VITE_FEATURE_SCHEDULES=true
VITE_FEATURE_CUSTOM_FIELDS=true

# Development
VITE_USE_MOCK_DATA=true
```

## 🎨 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   └── layout/         # Layout e navegação
├── config/             # Configurações e constantes
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
│   ├── auth/          # Login/Logout
│   ├── dashboard/     # Dashboard principal
│   ├── members/       # Gestão de membros
│   ├── finance/       # Gestão financeira
│   ├── events/        # Gestão de eventos
│   ├── schedules/     # Gestão de escalas
│   └── settings/      # Configurações
├── providers/          # Data e Auth providers
├── types/              # TypeScript types
└── utils/              # Utilitários e helpers
```

## 🧪 Testes

### Testes E2E com Playwright

```bash
# Rodar todos os testes
npm run test:e2e

# Rodar com UI interativa
npm run test:e2e:ui

# Rodar em modo debug
npx playwright test --debug
```

Cobertura de testes:
- ✅ Autenticação (login, logout, validações)
- ✅ Dashboard (widgets, responsividade)
- ✅ Membros (CRUD, filtros)
- ✅ Financeiro (transações)
- ✅ Eventos (CRUD, QR Code)

## 🔐 Autenticação

### Credenciais de Teste

- **Admin**: `admin@ministerium.com` / qualquer senha (mínimo 3 caracteres)
- **Outros usuários**: Use qualquer email dos usuários fake gerados

### Permissões por Role

**Administrador**
- Acesso total a todos os módulos
- Gestão de usuários e configurações
- Visualização e edição de todos os dados

**Líder**
- Gestão de membros do seu ministério
- Criação e edição de eventos
- Gestão de escalas

**Voluntário**
- Visualização de membros
- Visualização de eventos
- Confirmação de escalas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🎯 Boas Práticas Implementadas

### SOLID Principles
- **Single Responsibility** - Componentes com responsabilidade única
- **Open/Closed** - Extensível via props e composition
- **Liskov Substitution** - Componentes substituíveis
- **Interface Segregation** - Interfaces específicas
- **Dependency Inversion** - Dependência de abstrações

### Clean Code
- ✅ Nomenclatura clara e descritiva
- ✅ Funções pequenas e focadas
- ✅ Comentários apenas quando necessário
- ✅ Evitar código duplicado (DRY)
- ✅ Tratamento adequado de erros
- ✅ Code splitting e lazy loading

### Performance
- ✅ Memoização de componentes
- ✅ Lazy loading de rotas
- ✅ Otimização de re-renders
- ✅ Code splitting automático

## 🔄 Feature Toggles

O sistema possui feature toggles configuráveis:

```typescript
VITE_FEATURE_MEMBERS=true      // Módulo de Membros
VITE_FEATURE_FINANCE=true      // Módulo Financeiro
VITE_FEATURE_EVENTS=true       // Módulo de Eventos
VITE_FEATURE_SCHEDULES=true    // Módulo de Escalas
VITE_FEATURE_CUSTOM_FIELDS=true // Campos Personalizáveis
```

## 🗄️ Data Provider Local

O sistema inclui um data provider local completo com:
- 100+ membros fake
- 200+ transações financeiras
- 50+ eventos
- 30+ escalas
- 8 ministérios
- Dados realistas em português

## 🚢 Deploy

### Build

```bash
npm run build
```

O build será gerado na pasta `dist/` e pode ser servido por qualquer servidor estático.

### Ambientes Recomendados

- **Vercel** - Deploy automático
- **Netlify** - Deploy com CI/CD
- **Railway** - Full-stack hosting
- **AWS S3 + CloudFront** - Produção enterprise

## 📝 Próximos Passos (Pós-MVP)

- [ ] Integração com Backend real
- [ ] Sistema de notificações
- [ ] Módulo de células
- [ ] Escola bíblica
- [ ] Relatórios avançados
- [ ] Exportação PDF/Excel
- [ ] Comunicação via WhatsApp
- [ ] App mobile nativo

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

Desenvolvido com ❤️ para igrejas modernas.

---

**Ministerium** - Gestão simples, igreja organizada. ⛪
