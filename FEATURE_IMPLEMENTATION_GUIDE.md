# Guia de Implementação - Auto-Inscrição Pública para Eventos

## Status da Implementação

### ✅ Concluído
1. **Tipos TypeScript** - Todos os tipos necessários foram definidos em `src/types/index.ts`:
   - `FormFieldType` - enum com tipos de campos
   - `EventFormField` - estrutura de campo do formulário
   - `EventRegistrationConfig` - configuração de registro
   - `EventRegistration` - registro de participante

2. **Data Provider** - `src/providers/dataProvider.ts` atualizado com:
   - Storage para `eventRegistrations`
   - Endpoints custom:
     - `GET /events/:id/registration-config` - busca config do evento
     - `POST /public/event-registration` - submete inscrição pública
   - Validações de capacidade e deadline
   - Suporte a aprovação manual ou automática

3. **Form Builder Component** - `src/components/events/EventRegistrationFormBuilder.tsx`:
   - Interface para configurar campos do formulário
   - Suporte a múltiplos tipos de campo
   - Configurações gerais (aprovação, capacidade, mensagem)

### 🚧 Próximos Passos

#### 1. Atualizar EventCreate e EventEdit
Adicionar seção de configuração de registro:

```tsx
// Em EventCreate.tsx e EventEdit.tsx
import { EventRegistrationFormBuilder } from "@/components/events/EventRegistrationFormBuilder";

// Adicionar no estado inicial:
registrationConfig: {
  enabled: false,
  fields: [],
  requiresApproval: false,
},

// Adicionar no formulário:
<Accordion>
  <Accordion.Item value="registration">
    <Accordion.Control>Inscrição Pública</Accordion.Control>
    <Accordion.Panel>
      <Switch
        label="Habilitar inscrição pública"
        {...getInputProps("registrationConfig.enabled")}
      />
      {getInputProps("registrationConfig.enabled").value && (
        <EventRegistrationFormBuilder
          value={getInputProps("registrationConfig").value}
          onChange={(value) => setFieldValue("registrationConfig", value)}
        />
      )}
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### 2. Criar Página Pública de Inscrição

Criar `src/pages/public/EventRegistration.tsx`:

```tsx
import { useParams } from "react-router-dom";
import { useCustom } from "@refinedev/core";
import { DynamicForm } from "@/components/events/DynamicForm";

export const EventRegistration = () => {
  const { eventId } = useParams();
  const { data, isLoading } = useCustom({
    url: `/events/${eventId}/registration-config`,
    method: "get",
  });

  // Renderizar formulário dinâmico baseado na config
  return <DynamicForm config={data?.data} />;
};
```

#### 3. Criar Componente DynamicForm

Criar `src/components/events/DynamicForm.tsx` que renderiza campos dinamicamente baseado na configuração.

#### 4. Adicionar QR Code no EventShow

```tsx
import QRCode from "qrcode.react";

// No EventShow.tsx:
{event.registrationConfig?.enabled && (
  <Card>
    <Title order={4}>Link de Inscrição</Title>
    <QRCode
      value={`${window.location.origin}/events/${event.id}/register`}
      size={200}
    />
    <Text size="sm">
      {`${window.location.origin}/events/${event.id}/register`}
    </Text>
  </Card>
)}
```

#### 5. Adicionar Rotas Públicas

Em `src/App.tsx` ou router config:

```tsx
<Route path="/events/:eventId/register" element={<EventRegistration />} />
```

### 📋 Testes Necessários

#### Testes Unitários (`src/providers/__tests__/eventRegistration.test.ts`):
- Criação de inscrição
- Validação de capacidade
- Validação de deadline
- Busca de configuração

#### Testes E2E (`e2e/event-registration.spec.ts`):
- Criar evento com formulário customizado
- Acessar link público
- Preencher e submeter formulário
- Verificar inscrição criada
- Testar limite de capacidade

### 📚 Documentação

Atualizar README.md com:
1. Funcionalidade de auto-inscrição
2. Como configurar formulário de evento
3. Como gerar QR code
4. Exemplo de uso

### Dependências Necessárias

```bash
npm install qrcode.react
npm install @tabler/icons-react # se não instalado
```

## Arquitetura

### Separação de Responsabilidades (SOLID)

1. **Single Responsibility**: Cada componente tem uma responsabilidade única
   - `EventRegistrationFormBuilder`: construir formulário
   - `DynamicForm`: renderizar formulário baseado em config
   - `EventShow`: exibir detalhes + QR code

2. **Open/Closed**: Sistema extensível sem modificar código existente
   - Novos tipos de campo podem ser adicionados via enum
   - Validações customizadas podem ser implementadas

3. **Liskov Substitution**: FormFields são intercambiáveis

4. **Interface Segregation**: Interfaces específicas por necessidade

5. **Dependency Inversion**: Componentes dependem de abstrações (tipos)

### Design Patterns Utilizados

1. **Builder Pattern**: `EventRegistrationFormBuilder`
2. **Factory Pattern**: Criação dinâmica de campos no `DynamicForm`
3. **Strategy Pattern**: Validações diferentes por tipo de campo
4. **Repository Pattern**: DataProvider como repositório

## Notas de Segurança

- Validar todos os inputs no servidor (dataProvider)
- Sanitizar dados antes de armazenar
- Implementar rate limiting em produção
- Validar capacidade atomicamente

## Performance

- Lazy loading da página pública
- Memoização de componentes de formulário
- Debounce em campos de input
