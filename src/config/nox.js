// ÚNICO lugar para editar dados da Nox. A IA só usa o que estiver aqui.
export const NOX = {
    company: 'Nox',
    sellerName: 'SEU NOME',            // quem assina as mensagens
    sellerWhatsapp: '',                // ex: 47999999999 (opcional)
    site: '',                          // ex: https://nox.com.br (opcional)

    // Benefícios do seguro fiança (genéricos; ajuste ao que a Nox realmente oferece)
    productBenefits: [
        'Substitui fiador, caução e título de capitalização na locação',
        'Aprovação do inquilino 100% digital e rápida',
        'Garante ao proprietário aluguel e encargos em caso de inadimplência',
        'Imobiliária fecha mais contratos e reduz desistência por falta de fiador'
    ],

    // Condições da parceria — PREENCHA com os valores reais. Vazio = a IA não menciona números.
    partnership: {
        commissionText: '',   // ex: "comissão recorrente de X% sobre cada apólice"
        onboardingText: '',   // ex: "cadastro em 1 dia, sem custo"
        supportText: ''       // ex: "material de apoio e atendimento dedicado"
    }
};
