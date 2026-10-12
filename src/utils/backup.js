// Mitigação para o risco de perda de dados do localStorage: exporta/importa
// um snapshot completo em JSON. Não substitui um banco de dados real, mas
// evita perda total se o usuário limpar cache ou trocar de navegador.

const STORAGE_KEYS = ['prospectmaster_data', 'manual_leads', 'search_history'];

export function exportBackup() {
    const snapshot = {
        exportedAt: new Date().toISOString(),
        version: 1,
        data: {}
    };

    STORAGE_KEYS.forEach(key => {
        const raw = localStorage.getItem(key);
        if (raw) {
            try {
                snapshot.data[key] = JSON.parse(raw);
            } catch (e) {
                snapshot.data[key] = null;
            }
        }
    });

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prospectmaster_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function importBackup(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const snapshot = JSON.parse(e.target.result);
            if (!snapshot.data) {
                throw new Error('Arquivo de backup inválido');
            }
            Object.entries(snapshot.data).forEach(([key, value]) => {
                if (STORAGE_KEYS.includes(key) && value !== null) {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            });
            onSuccess();
        } catch (err) {
            onError(err.message || 'Erro ao ler arquivo de backup');
        }
    };
    reader.onerror = () => onError('Erro ao ler arquivo');
    reader.readAsText(file);
}
