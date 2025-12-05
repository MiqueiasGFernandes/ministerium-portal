# Tour Guiado - Ministerium

## Visão Geral

Sistema de tour guiado para primeiro acesso dos usuários, construído seguindo princípios de Clean Code, SOLID e baixo acoplamento.

## Arquitetura

### Princípios Aplicados

- **Single Responsibility**: Cada componente/serviço tem uma única responsabilidade
- **Open/Closed**: Sistema extensível sem modificar código existente
- **Dependency Inversion**: Componentes dependem de abstrações (interfaces)
- **Interface Segregation**: Interfaces pequenas e específicas
- **Low Coupling**: Componentes desacoplados através de contexto e serviços

### Estrutura

```
src/
├── types/tour.ts                          # Tipos e interfaces
├── services/
│   ├── tour/TourService.ts               # Gerenciamento de persistência
│   └── featureToggle/FeatureToggleService.ts  # Feature flags
├── contexts/TourContext.tsx              # Estado global do tour
├── components/tour/TourTooltip.tsx       # UI do tooltip
├── config/tours/dashboardTour.ts         # Configuração dos passos
└── hooks/useDashboardTour.ts             # Hook para iniciar tour
```

## Uso

### Criar um Novo Tour

1. **Definir configuração do tour:**

```typescript
// src/config/tours/myTour.ts
import type { TourConfig } from "@/types/tour";

export const myTourConfig: TourConfig = {
  id: "my-feature-tour",
  steps: [
    {
      id: "step1",
      target: "my-element", // data-tour attribute
      title: "Título do Passo",
      content: "Descrição do que fazer",
      placement: "bottom",
      showSkip: true,
    },
    // ... mais passos
  ],
  onComplete: () => console.log("Tour completo!"),
  onSkip: () => console.log("Tour pulado!"),
};
```

2. **Adicionar data-tour nos elementos:**

```tsx
<div data-tour="my-element">
  Conteúdo...
</div>
```

3. **Criar hook para iniciar o tour:**

```typescript
// src/hooks/useMyTour.ts
import { useEffect } from "react";
import { useTour } from "@/contexts/TourContext";
import { myTourConfig } from "@/config/tours/myTour";
import { tourService } from "@/services/tour/TourService";

export const useMyTour = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if (tourService.shouldShowTour(myTourConfig.id)) {
      const timeoutId = setTimeout(() => {
        startTour(myTourConfig);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [startTour]);
};
```

4. **Usar o hook no componente:**

```tsx
import { useMyTour } from "@/hooks/useMyTour";

export const MyComponent = () => {
  useMyTour();

  return <div>...</div>;
};
```

## Feature Toggles

### Habilitar/Desabilitar Tours

```typescript
import { featureToggleService } from "@/services/featureToggle/FeatureToggleService";

// Habilitar
featureToggleService.enable("firstAccessTour");

// Desabilitar
featureToggleService.disable("firstAccessTour");

// Verificar
if (featureToggleService.isEnabled("firstAccessTour")) {
  // Tour está habilitado
}
```

### Features Disponíveis

- `firstAccessTour`: Tour de primeiro acesso
- `dashboardTour`: Tour do dashboard

## Testes E2E

Os testes e2e estão em `/e2e/tour.spec.ts` e cobrem:

- ✅ Exibição do tour no primeiro acesso
- ✅ Navegação entre passos
- ✅ Botão voltar
- ✅ Pular tour
- ✅ Completar tour
- ✅ Não mostrar em visitas subsequentes
- ✅ Destaque de elementos
- ✅ Respeitar feature toggles

### Executar Testes

```bash
npm run test:e2e -- tour.spec.ts
```

## Performance

### Otimizações Implementadas

1. **Lazy Loading**: Componente do tour só renderiza quando ativo
2. **Timeout Strategy**: Delay de 1s para garantir DOM pronto
3. **Local Storage**: Persistência leve sem impacto
4. **Animações Suaves**: Transições de 200ms para UX fluida
5. **Z-index Dinâmico**: Apenas elemento ativo tem z-index elevado

## Personalização

### Estilos do Tooltip

Edite `/src/components/tour/TourTooltip.tsx` para customizar:

- Cores e temas
- Tamanho do tooltip
- Animações
- Layout dos botões

### Posicionamento

Suporta 4 posições:

- `top`: Acima do elemento
- `bottom`: Abaixo do elemento (padrão)
- `left`: À esquerda do elemento
- `right`: À direita do elemento

## Boas Práticas

1. **Mantenha tours curtos**: Máximo 5-7 passos
2. **Seja objetivo**: Textos claros e diretos
3. **Permita pular**: Sempre ofereça opção de skip
4. **Destaque o essencial**: Foque nas features principais
5. **Teste em mobile**: Verifique responsividade
6. **Use feature toggles**: Permite ligar/desligar facilmente

## Troubleshooting

### Tour não aparece

1. Verifique se o feature toggle está habilitado
2. Confirme que o tour não foi completado (localStorage)
3. Verifique se os atributos `data-tour` estão corretos
4. Confirme que o componente está montado antes do timeout

### Elementos não destacados

1. Verifique se o seletor `data-tour` está correto
2. Confirme que o elemento está visível no DOM
3. Verifique z-index do container pai

### Tour fica preso

1. Limpe o localStorage: `localStorage.removeItem('ministerium_completed_tours')`
2. Recarregue a página
3. Verifique console para erros

## Licença

Parte do projeto Ministerium - Todos os direitos reservados
