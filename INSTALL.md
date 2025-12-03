# 🚀 Guia de Instalação - Ministerium

## Requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **PostgreSQL** 14+ (para backend futuro)

## Instalação Front-end

### 1. Clone o repositório

```bash
git clone <repository-url>
cd ministerium-portal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_MOCK_DATA=true
VITE_ENABLE_DEV_TOOLS=true
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### 5. Credenciais de acesso

Use as seguintes credenciais para fazer login:

- **Email**: `admin@ministerium.com`
- **Senha**: qualquer senha com 3+ caracteres (modo demo)

## Build para Produção

```bash
npm run build
```

Os arquivos de build estarão em `dist/`

## Testes

### Testes E2E

```bash
# Instalar navegadores do Playwright (primeira vez)
npx playwright install

# Rodar todos os testes
npm run test:e2e

# Rodar testes com UI
npm run test:e2e:ui
```

## Configuração do Banco de Dados (Backend)

### 1. Criar o banco de dados

```bash
createdb ministerium_db
```

### 2. Executar o schema

```bash
psql -d ministerium_db -f database/schema.sql
```

### 3. Verificar instalação

```bash
psql ministerium_db -c "\dt"
```

Você deverá ver todas as tabelas criadas.

## Estrutura de Pastas

```
ministerium-portal/
├── src/                    # Código fonte
│   ├── components/        # Componentes reutilizáveis
│   ├── config/           # Configurações
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas
│   ├── providers/        # Data/Auth providers
│   ├── types/            # TypeScript types
│   └── utils/            # Utilitários
├── e2e/                   # Testes E2E
├── database/              # Scripts SQL
├── public/               # Arquivos públicos
└── dist/                 # Build de produção
```

## Troubleshooting

### Problema: Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problema: Porta 3000 já em uso

Edite `vite.config.ts` e altere a porta:

```typescript
server: {
  port: 3001, // Altere para outra porta
}
```

### Problema: Testes E2E falhando

```bash
# Reinstalar navegadores
npx playwright install --with-deps
```

## Feature Toggles

Você pode habilitar/desabilitar módulos editando o `.env`:

```env
VITE_FEATURE_MEMBERS=true       # Módulo de Membros
VITE_FEATURE_FINANCE=true       # Módulo Financeiro
VITE_FEATURE_EVENTS=true        # Módulo de Eventos
VITE_FEATURE_SCHEDULES=true     # Módulo de Escalas
VITE_FEATURE_CUSTOM_FIELDS=true # Campos Personalizáveis
```

## Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker (Futuro)

```bash
docker build -t ministerium-portal .
docker run -p 3000:3000 ministerium-portal
```

## Próximos Passos

1. ✅ Front-end completo funcionando
2. ⏳ Desenvolver backend com NestJS
3. ⏳ Conectar frontend com backend
4. ⏳ Deploy em produção
5. ⏳ Implementar funcionalidades avançadas

## Suporte

Para dúvidas e problemas:

1. Verifique a [documentação](README.md)
2. Abra uma issue no GitHub
3. Entre em contato com a equipe

---

**Ministerium** - Gestão simples, igreja organizada. ⛪
