# Ministerium - ERP SaaS para Igrejas

## 🎯 Sobre o Projeto

Ministerium é um ERP SaaS moderno e completo para gestão administrativa de igrejas, desenvolvido com as melhores práticas e tecnologias atuais. O sistema oferece uma solução integrada para gerenciar todos os aspectos operacionais de igrejas, desde membros e finanças até eventos e escalas de voluntários.

### Visão do Produto

O Ministerium nasceu da necessidade de oferecer às igrejas uma ferramenta de gestão profissional, moderna e acessível. Nosso objetivo é simplificar a administração eclesiástica, permitindo que líderes e voluntários foquem no que realmente importa: cuidar das pessoas e expandir o reino.

## ✨ Funcionalidades

### MVP Completo

- ✅ **Dashboard** - Visão geral com widgets e métricas importantes
- ✅ **Gestão de Membros** - CRUD completo com fotos, tags e campos personalizáveis
- ✅ **Financeiro** - Controle de entradas e saídas com categorização
- ✅ **Eventos** - Gestão de eventos com:
  - Criação e edição de eventos
  - Sistema de inscrição pública personalizável
  - Check-in via QR Code
  - Rascunhos e publicação
- ✅ **Escalas** - Organização de voluntários por ministério
- ✅ **Ministérios** - Gestão completa de ministérios com:
  - CRUD de ministérios
  - Associação de líderes e membros
  - Integração com escalas
- ✅ **Autenticação JWT/RBAC** - Sistema seguro com 3 níveis (Admin, Líder, Voluntário)
- ✅ **Personalização** - Logo, cores e configurações do tenant
- ✅ **Multi-tenant** - Isolamento completo por organização

## 🚀 Começando

### Requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **PostgreSQL** 14+ (para backend futuro)

### Instalação Rápida

```bash
# Clone o repositório
git clone <repository-url>
cd ministerium-portal

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Credenciais de Acesso (Demo)

- **Email**: `admin@ministerium.com`
- **Senha**: qualquer senha com 3+ caracteres

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
VITE_FEATURE_MINISTRIES=true
VITE_FEATURE_CUSTOM_FIELDS=true

# Development
VITE_USE_MOCK_DATA=true
```

## 📖 Guia do Usuário

### Para Administradores

Como **administrador**, você tem acesso total ao sistema:

1. **Dashboard**: Visualize métricas importantes da sua igreja
2. **Membros**: Gerencie o cadastro completo de membros
3. **Financeiro**: Controle entradas (dízimos, ofertas) e saídas
4. **Eventos**: Crie eventos e ative inscrições públicas
5. **Escalas**: Organize voluntários por ministério
6. **Configurações**: Personalize cores, logo e preferências

### Para Líderes de Ministério

Como **líder**, você pode:

1. Gerenciar membros do seu ministério
2. Criar e editar eventos
3. Organizar escalas de voluntários
4. Visualizar relatórios do seu ministério

### Para Voluntários

Como **voluntário**, você pode:

1. Visualizar informações de membros
2. Ver eventos agendados
3. Confirmar presença em escalas

## 🎯 Casos de Uso

### Criando um Evento com Inscrição Pública

1. Acesse **Eventos** > **Novo Evento**
2. Preencha as informações básicas (título, data, local, etc.)
3. Na seção "Inscrição Pública", configure:
   - Capacidade máxima
   - Campos personalizados do formulário
   - Mensagem de confirmação
4. **Salvar Rascunho** ou **Publicar** diretamente
5. Compartilhe o QR Code ou link de inscrição

### Gerenciando Finanças

1. Acesse **Financeiro** > **Nova Transação**
2. Selecione o tipo (Entrada ou Saída)
3. Escolha a categoria (Dízimo, Oferta, Compra, etc.)
4. Preencha valor e descrição
5. Salve e acompanhe no dashboard

### Organizando Escalas

1. Acesse **Escalas** > **Nova Escala**
2. Selecione o ministério
3. Defina data e título
4. Adicione voluntários
5. Os voluntários serão notificados automaticamente

## 🛠️ Tecnologias

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

### Backend (Futuro)

- **NestJS** - Framework Node.js enterprise
- **PostgreSQL 14+** - Banco de dados relacional
- **Prisma/TypeORM** - ORM
- **JWT** - Autenticação
- **Docker** - Containerização

## 🏗️ Arquitetura

### Princípios de Design

O Ministerium foi construído seguindo os princípios **SOLID** e **Clean Architecture**:

1. **Single Responsibility** - Cada componente tem uma responsabilidade única
2. **Open/Closed** - Extensível via props e composition
3. **Liskov Substitution** - Componentes substituíveis
4. **Interface Segregation** - Interfaces específicas
5. **Dependency Inversion** - Dependência de abstrações

### Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── events/         # Componentes de eventos
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
│   ├── ministries/    # Gestão de ministérios
│   └── settings/      # Configurações
├── providers/          # Data e Auth providers
├── styles/             # Estilos organizados (SOLID)
├── types/              # TypeScript types
└── utils/              # Utilitários e helpers
```

### Autenticação e Autorização

O sistema implementa **RBAC (Role-Based Access Control)** com 3 níveis:

**Administrador** - Acesso total
- Gestão de usuários e configurações
- Visualização e edição de todos os dados
- Controle financeiro completo

**Líder** - Gestão do ministério
- Gestão de membros do ministério
- Criação e edição de eventos
- Gestão de escalas

**Voluntário** - Acesso limitado
- Visualização de membros
- Visualização de eventos
- Confirmação de escalas

## 🧪 Testes

### Testes E2E com Playwright

```bash
# Instalar navegadores (primeira vez)
npx playwright install

# Rodar todos os testes
npm run test:e2e

# Rodar com UI interativa
npm run test:e2e:ui

# Rodar em modo debug
npx playwright test --debug
```

**Cobertura de testes:**
- ✅ Autenticação (login, logout, validações)
- ✅ Dashboard (widgets, responsividade)
- ✅ Membros (CRUD, filtros)
- ✅ Financeiro (transações)
- ✅ Eventos (CRUD, QR Code, inscrição pública)
- ✅ Ministérios (CRUD, permissões)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                # Inicia servidor de desenvolvimento
npm run build             # Build para produção
npm run preview           # Preview da build

# Testes
npm run test:e2e          # Testes E2E
npm run test:e2e:ui       # Testes com UI

# Qualidade de Código
npm run lint              # Verifica erros de lint
npm run type-check        # Verifica tipos TypeScript
```

## 🚢 Deploy

### Build de Produção

```bash
npm run build
```

O build será gerado na pasta `dist/` e pode ser servido por qualquer servidor estático.

### Plataformas Recomendadas

- **Vercel** - Deploy automático
- **Netlify** - Deploy com CI/CD
- **Railway** - Full-stack hosting
- **AWS S3 + CloudFront** - Produção enterprise

## 🔄 Feature Toggles

O sistema possui feature toggles configuráveis via `.env`:

```typescript
VITE_FEATURE_MEMBERS=true      // Módulo de Membros
VITE_FEATURE_FINANCE=true      // Módulo Financeiro
VITE_FEATURE_EVENTS=true       // Módulo de Eventos
VITE_FEATURE_SCHEDULES=true    // Módulo de Escalas
VITE_FEATURE_MINISTRIES=true   // Módulo de Ministérios
VITE_FEATURE_CUSTOM_FIELDS=true // Campos Personalizáveis
```

## 🗄️ Dados de Demonstração

O sistema inclui um data provider local completo com:

- 100+ membros fake
- 200+ transações financeiras
- 50+ eventos
- 30+ escalas
- 8 ministérios predefinidos
- Dados realistas em português

## 🤝 Contribuindo

Adoraríamos sua contribuição! Por favor, siga estes passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todo código novo
- Siga os princípios SOLID
- Escreva testes E2E para novas funcionalidades
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

## 📝 Roadmap

### Próximas Funcionalidades

- [ ] Integração com Backend real (NestJS)
- [ ] Sistema de notificações push
- [ ] Módulo de células/pequenos grupos
- [ ] Escola bíblica dominical
- [ ] Relatórios avançados em PDF
- [ ] Exportação para Excel
- [ ] Comunicação via WhatsApp
- [ ] App mobile nativo (React Native)
- [ ] Integração com gateways de pagamento
- [ ] Sistema de doações online

### Melhorias Técnicas

- [ ] Testes unitários com Vitest
- [ ] Documentação com Storybook
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Sentry
- [ ] Analytics com Google Analytics
- [ ] PWA (Progressive Web App)

## 📚 Documentação Adicional

- [Arquitetura Técnica](docs/ARCHITECTURE.md) - Detalhes sobre a arquitetura do sistema
- [Guia de Contribuição](docs/CONTRIBUTING.md) - Como contribuir com o projeto
- [Changelog](docs/CHANGELOG.md) - Histórico de mudanças

## 🐛 Suporte e Bugs

Encontrou um bug ou tem uma sugestão?

1. Verifique se já não existe uma [issue aberta](https://github.com/seu-usuario/ministerium-portal/issues)
2. Abra uma nova issue descrevendo o problema ou sugestão
3. Inclua screenshots se possível
4. Descreva os passos para reproduzir o problema

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

Desenvolvido com ❤️ para igrejas modernas.

## 🙏 Agradecimentos

Agradecimentos especiais a todas as tecnologias e bibliotecas open-source que tornam este projeto possível:

- React Team
- Refine.dev Team
- Mantine UI Team
- Toda a comunidade open-source

---

**Ministerium** - Gestão simples, igreja organizada. ⛪

> *"Tudo, porém, seja feito com decência e ordem."* - 1 Coríntios 14:40
