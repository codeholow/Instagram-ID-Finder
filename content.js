function getInstagramID() {
    const metaProperty = document.querySelector('meta[property="al:ios:url"]');
    if (metaProperty) {
        const idMatch = metaProperty.getAttribute('content').match(/user\?id=(\d+)/);
        if (idMatch && idMatch[1]) return idMatch[1];
    }
    return null;
}

function resolveIDFromScripts(badge) {
    try {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            if (script.innerText && script.innerText.includes('profilePage_')) {
                const match = script.innerText.match(/"id":"(\d+)"/);
                if (match && match[1]) {
                    badge.innerText = `ID: ${match[1]}`;
                    return;
                }
            }
        }
        badge.innerText = "ID: não encontrado";
    } catch (e) {
        badge.innerText = "ID: erro";
    }
}

function injectIDBadge() {
    const usernameHeader = document.querySelector('header h2, header section h2');
    if (!usernameHeader || document.getElementById('added-insta-id')) return;

    const badge = document.createElement('span');
    badge.id = 'added-insta-id';
    badge.className = 'insta-id-badge';

    const userId = getInstagramID();

    if (userId) {
        badge.innerText = `ID: ${userId}`;
    } else {
        badge.innerText = "ID: buscando...";
        resolveIDFromScripts(badge);
    }

    usernameHeader.appendChild(badge);
}

const observer = new MutationObserver(() => injectIDBadge());
observer.observe(document.body, { childList: true, subtree: true });

injectIDBadge();