import { config } from '@packages/config';

const html = `<!doctype html><html><head><title>${config.BOT_NAME}</title></head><body style="font-family:sans-serif;max-width:720px;margin:40px auto;">
<h1>${config.BOT_NAME}</h1><p>${config.BOT_DESCRIPTION}</p>
<ul><li><a href="${config.BOT_INVITE_URL}">Invite</a></li><li><a href="${config.BOT_SUPPORT_SERVER_URL}">Support</a></li><li><a href="${config.BOT_DOCS_URL}">Docs</a></li></ul>
<p>Dashboard/OAuth scaffolding ready for next phase.</p></body></html>`;

console.log(html);
