
export function prepareVisIframeHtml(rawHtml, baseHref) {
  const base = (baseHref || '').replace(/\/+$/, '') + '/'

  const hasHead = /<head[^>]*>/i.test(rawHtml)
  const hasBody = /<body[^>]*>/i.test(rawHtml)
  const hasBase = /<base\s/i.test(rawHtml)
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(rawHtml)

  // Жёстко растягиваем всё на 100% и убираем фиксированные размеры/float
  const forceCss = `
    <style id="__embed_vis_full">
      html, body { margin:0; padding:0; width:100%; height:100%; }
      .card, .card-body { width:100% !important; height:100% !important; margin:0 !important; padding:0 !important; border:0 !important; box-sizing:border-box !important; }
      #mynetwork {
        width:100% !important; height:100% !important;
        position:relative !important; float:none !important;
        background:#fff; box-sizing:border-box;
      }
      /* на всякий случай */
      svg { width:100% !important; height:100% !important; }
      body > *:first-child { width:100% !important; height:100% !important; }
    </style>`.trim();

  const fitScript = `
    <script id="__embed_vis_fit">
      (function(){
        function tryFit(){
          try {
            if (window.network && typeof window.network.fit === 'function') {
              if (typeof window.network.redraw === 'function') window.network.redraw();
              window.network.fit({ animation: false });
            }
          } catch(e) {}
        }
        window.addEventListener('load', function(){ setTimeout(tryFit, 0); });
        window.addEventListener('resize', function(){ tryFit(); });
      })();
    </script>`.trim();

  const headInject = [
    !hasBase ? `<base href="${base}">` : '',
    !hasViewport ? `<meta name="viewport" content="width=device-width, initial-scale=1">` : '',
    forceCss,
    fitScript
  ].filter(Boolean).join('\n');

  let html = rawHtml;

  if (hasHead) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n${headInject}\n`)
  } else {
    if (hasBody) {
      html = html.replace(/<body([^>]*)>/i, `<head>\n${headInject}\n</head><body$1>`)
    } else {
      html = `<!doctype html><html><head>${headInject}</head><body>${rawHtml}</body></html>`
    }
  }
  if (hasBody && !/#__embed_full/.test(html)) {
    html = html
      .replace(/<body([^>]*)>/i, `<body$1><div id="__embed_full" style="position:fixed;inset:0;overflow:auto;background:#fff;">`)
      .replace(/<\/body>/i, `</div></body>`);
  }

  return html
}
