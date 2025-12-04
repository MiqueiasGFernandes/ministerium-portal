export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // Nova funcionalidade
				"fix", // Correção de bug
				"docs", // Alterações na documentação
				"style", // Formatação, sem alteração de código
				"refactor", // Refatoração de código
				"perf", // Melhoria de performance
				"test", // Adição ou correção de testes
				"build", // Alterações no build ou dependências
				"ci", // Alterações em CI/CD
				"chore", // Outras alterações que não modificam src ou test
				"revert", // Revert de commit anterior
			],
		],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "."],
		"header-max-length": [2, "always", 100],
	},
};
