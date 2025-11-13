
# Nuvemshop Preorder App (Sob Demanda)

App Node/Express para habilitar **pré-venda / sob demanda** na Nuvemshop sem burlar estoque.
Fluxo:
- Metafields por **variante** (preorder_enabled, preorder_cap, lead_time_days)
- Script (ScriptTag) adiciona item ao carrinho com **line item properties**
- Webhook em `orders/create` para etiquetar e acionar automações

## 1) Requisitos
- Node 18+
- Conta no Portal de Parceiros Nuvemshop (CLIENT_ID, CLIENT_SECRET)
- Um domínio público (Render/VPS/etc.) acessível via HTTPS

## 2) Variáveis de ambiente
Crie `.env` com base em `.env.example`:

```
CLIENT_ID=xxx
CLIENT_SECRET=yyy
APP_URL=https://seuapp.com
SESSION_SECRET=uma-chave-segura
```

## 3) Rodando local
```
npm install
npm run dev
```
Exponha com ngrok se precisar: `ngrok http 3000`

## 4) Instalação do app na loja
Abra no navegador:
```
https://SEU-DOMINIO-LOJA/admin/oauth/authorize?client_id=CLIENT_ID&redirect_uri=APP_URL/oauth/callback&response_type=code&scope=read_products,write_products,read_orders,write_orders,read_script_tags,write_script_tags
```
ou acesse `/install?store_domain=SEU-DOMINIO-LOJA` no servidor do app.

## 5) Deploy via GitHub
### Opção A — VPS com PM2 (SSH)
1. Suba uma VPS (Ubuntu) com Node + PM2.
2. Configure variáveis `.env` no servidor.
3. Use o workflow `.github/workflows/deploy.yml`:
   - secrets no GitHub: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `APP_DIR`.
   - a cada `push` na `main`, o GitHub Actions envia e reinicia com PM2.

### Opção B — Render (simples)
- Crie um serviço Web no Render apontando para este repositório.
- Defina environment variables no painel do Render.
- Build command: `npm install`
- Start command: `npm run start`

## 6) Ajustes no tema
Inclua um botão condicional quando `estoque == 0` e preorder ativo (ou use apenas JS para injetar o botão).
O script servido em `/assets/preorder.js` lida com o clique `.js-preorder` e adiciona o item ao carrinho com properties.

## 7) Rotas principais
- `GET /install` → inicia OAuth
- `GET /oauth/callback` → troca `code` por `access_token`
- `GET /assets/preorder.js` → JS do carrinho sob demanda
- `POST /webhooks/orders/create` → processa pedidos de pré-venda

> Base simples para adaptar (DB, UI interna, etc.).
