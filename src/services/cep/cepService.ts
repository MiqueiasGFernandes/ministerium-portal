/**
 * CEP Service
 * Single Responsibility: Handles CEP (Brazilian postal code) lookup
 * Uses ViaCEP API: https://viacep.com.br/
 */

export interface CepData {
	cep: string;
	logradouro: string; // street
	complemento: string; // complement
	bairro: string; // neighborhood
	localidade: string; // city
	uf: string; // state
	erro?: boolean;
}

export interface AddressData {
	street: string;
	city: string;
	state: string;
	zipCode: string;
}

class CepService {
	private readonly baseUrl = "https://viacep.com.br/ws";

	/**
	 * Fetches address data from CEP
	 * @param cep - Brazilian postal code (can be with or without hyphen)
	 * @returns Address data or null if not found
	 */
	async fetchAddress(cep: string): Promise<AddressData | null> {
		// Remove non-numeric characters
		const cleanCep = cep.replace(/\D/g, "");

		// Validate CEP format (8 digits)
		if (cleanCep.length !== 8) {
			throw new Error("CEP deve conter 8 dígitos");
		}

		try {
			const response = await fetch(`${this.baseUrl}/${cleanCep}/json/`);

			if (!response.ok) {
				throw new Error("Erro ao buscar CEP");
			}

			const data: CepData = await response.json();

			// Check if CEP was not found
			if (data.erro) {
				return null;
			}

			// Transform ViaCEP response to our AddressData format
			return {
				street: data.logradouro,
				city: data.localidade,
				state: data.uf,
				zipCode: this.formatCep(cleanCep),
			};
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Erro ao buscar CEP");
		}
	}

	/**
	 * Formats CEP with hyphen
	 * @param cep - CEP without formatting
	 * @returns Formatted CEP (12345-678)
	 */
	private formatCep(cep: string): string {
		return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
	}

	/**
	 * Validates if a CEP has the correct format
	 * @param cep - CEP to validate
	 * @returns true if valid, false otherwise
	 */
	isValidCep(cep: string): boolean {
		const cleanCep = cep.replace(/\D/g, "");
		return cleanCep.length === 8;
	}
}

// Export singleton instance
export const cepService = new CepService();
