export function moderationPage(title: string, message: string, success = true) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #050508; color: #e2e8f0; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px; }
    main { max-width: 480px; width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
    h1 { margin: 0 0 12px; font-size: 1.5rem; color: ${success ? "#00d4ff" : "#f87171"}; }
    p { margin: 0; line-height: 1.6; color: #94a3b8; }
    a { color: #00d4ff; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:20px;"><a href="/admin/comentarios">Ir para o painel</a></p>
  </main>
</body>
</html>`;
}

export function rejectFormPage(token: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Rejeitar comentário</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #050508; color: #e2e8f0; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px; }
    main { max-width: 480px; width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; }
    p { margin: 0 0 20px; color: #94a3b8; line-height: 1.6; }
    label { display: block; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
    textarea { width: 100%; min-height: 120px; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #e2e8f0; padding: 12px; font: inherit; resize: vertical; }
    button { margin-top: 16px; width: 100%; padding: 12px 16px; border: 0; border-radius: 999px; background: #ef4444; color: white; font: inherit; cursor: pointer; }
  </style>
</head>
<body>
  <main>
    <h1>Rejeitar comentário</h1>
    <p>Informe o motivo da rejeição. Este campo é obrigatório.</p>
    <form method="POST">
      <input type="hidden" name="token" value="${token}" />
      <label for="reason">Motivo</label>
      <textarea id="reason" name="reason" required minlength="3" maxlength="500" placeholder="Descreva o motivo..."></textarea>
      <button type="submit">Confirmar rejeição</button>
    </form>
  </main>
</body>
</html>`;
}
