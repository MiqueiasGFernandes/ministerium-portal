import { Box } from "@mantine/core";
import {
	ThemedLayoutV2,
	ThemedSiderV2,
	ThemedTitleV2,
} from "@refinedev/mantine";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { createLayoutStyles } from "@/styles/components";
import { FooterNav } from "./FooterNav";
import { Header } from "./Header";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	const styles = useMemo(() => createLayoutStyles(), []);

	return (
		<>
			<ThemedLayoutV2
				Header={() => <Header />}
				Title={({ collapsed }) => (
					<ThemedTitleV2
						collapsed={collapsed}
						text="Ministerium"
						icon={<span style={styles.logoIcon}>⛪</span>}
					/>
				)}
				Sider={() => (
					<Box visibleFrom="sm" data-tour="sidebar-navigation">
						<ThemedSiderV2
							render={({ items }) => {
								return <>{items}</>;
							}}
						/>
					</Box>
				)}
			>
				<Box pb={{ base: 80, sm: 0 }} style={styles.contentContainer}>
					{children}
				</Box>
			</ThemedLayoutV2>
			<FooterNav />
		</>
	);
};

export default Layout;
