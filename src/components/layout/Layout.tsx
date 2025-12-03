import { PropsWithChildren } from 'react';
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/mantine';
import { Header } from './Header';

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemedLayoutV2
      Header={() => <Header />}
      Title={({ collapsed }) => (
        <ThemedTitleV2
          collapsed={collapsed}
          text="Ministerium"
          icon={<span style={{ fontSize: '24px' }}>⛪</span>}
        />
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
};

export default Layout;
