import { Alert, Anchor, Checkbox, Stack, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";

interface LGPDConsentProps {
	form: UseFormReturnType<any>;
	fieldName?: string;
}

/**
 * LGPD Data Sharing Consent Component
 * Displays terms according to Brazilian General Data Protection Law (LGPD)
 *
 * Single Responsibility: Handles LGPD consent display and acceptance
 */
export const LGPDConsent = ({
	form,
	fieldName = "acceptedTerms",
}: LGPDConsentProps) => {
	return (
		<Stack gap="md">
			<Alert
				icon={<IconInfoCircle size={20} />}
				title="Proteção de Dados Pessoais"
				color="blue"
				variant="light"
			>
				<Text size="sm">
					De acordo com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>
					, informamos que:
				</Text>
				<Stack gap="xs" mt="sm">
					<Text size="sm">
						• Seus dados pessoais serão utilizados exclusivamente para fins de
						cadastro e gestão de membros da igreja.
					</Text>
					<Text size="sm">
						• Suas informações serão armazenadas de forma segura e não serão
						compartilhadas com terceiros sem sua autorização.
					</Text>
					<Text size="sm">
						• Você tem direito de acessar, corrigir, atualizar ou solicitar a
						exclusão de seus dados a qualquer momento.
					</Text>
					<Text size="sm">
						• A igreja é responsável pela proteção e tratamento adequado de seus
						dados pessoais.
					</Text>
					<Text size="sm">
						• Para exercer seus direitos ou tirar dúvidas sobre o tratamento de
						dados, entre em contato com o responsável pela igreja.
					</Text>
				</Stack>
			</Alert>

			<Checkbox
				label={
					<Text size="sm">
						Li e aceito os{" "}
						<Anchor
							href="#"
							onClick={(e) => {
								e.preventDefault();
								// TODO: Open modal with full terms
								alert(
									"Em produção, aqui seria exibido o termo completo de uso e privacidade.",
								);
							}}
							target="_blank"
						>
							termos de uso e política de privacidade
						</Anchor>
						, e autorizo o compartilhamento e tratamento dos meus dados pessoais
						conforme a LGPD.
					</Text>
				}
				{...form.getInputProps(fieldName, { type: "checkbox" })}
				styles={{
					label: {
						cursor: "pointer",
					},
				}}
			/>
		</Stack>
	);
};
