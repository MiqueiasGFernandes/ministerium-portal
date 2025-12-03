import { Box } from "@mantine/core";
import { ThemedLayoutV2, ThemedTitleV2, ThemedSiderV2 } from "@refinedev/mantine";
import type { PropsWithChildren } from "react";
import { FooterNav } from "./FooterNav";
import { Header } from "./Header";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<ThemedLayoutV2
				Header={() => <Header />}
				Title={({ collapsed }) => (
					<ThemedTitleV2
						collapsed={collapsed}
						text="Ministerium"
						icon={<span style={{ fontSize: "24px" }}>⛪</span>}
					/>
				)}
				Sider={() => (
					<Box visibleFrom="sm">
						<ThemedSiderV2 />
					</Box>
				)}
			>
				<Box
					pb={{ base: 80, sm: 0 }}
					style={{
						minHeight: "calc(100vh - 60px)",
					}}
				>
					{children}
				</Box>
			</ThemedLayoutV2>
			<FooterNav />
		</>
	);
};

export default Layout;
