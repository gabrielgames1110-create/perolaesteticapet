# Pérola Pet & Estética Canina · site

Site estático (HTML, CSS e JavaScript puros). Não precisa instalar nada nem rodar build.

## Publicar

1. **GitHub:** crie um repositório (ex.: `perola-site`) e envie todo o conteúdo desta pasta para a raiz dele. No site do GitHub: *Add file → Upload files*, arraste os arquivos e a pasta `assets` e clique em *Commit changes*.
2. **Vercel:** em vercel.com, clique em *Add New → Project*, importe o repositório, deixe *Framework Preset* como **Other** e não preencha comando de build. Clique em *Deploy*.
3. **Depois do primeiro deploy:** no `index.html`, troque `SEU-DOMINIO.vercel.app` (2 ocorrências, no topo do arquivo) pelo endereço que a Vercel gerar ou pelo domínio próprio. Assim, a prévia do link aparece com a logo quando for compartilhado no WhatsApp e no Instagram.

Depois disso, cada alteração enviada ao GitHub atualiza o site automaticamente.

## Editar

- **Preços, horários e textos:** direto no `index.html` (procure pelo texto que quer mudar).
- **Foto do banho:** substitua `assets/foto-banho.jpg` por outra foto em formato paisagem (3:2).
- **Foto da tosa:** salve a foto como `assets/foto-tosa.jpg` e siga o comentário `FOTO DA TOSA` no `index.html`.
- **WhatsApp:** o número aparece nos links `wa.me/5551998346755`.

## Arquivos

- `index.html`: conteúdo da página
- `styles.css`: visual
- `script.js`: animação das bolhas e do selo
- `assets/`: logo, fotos, ícones e imagem de compartilhamento
