
import express from 'express';
import { getAccessToken } from './services/oauth.js';
import { ensureScriptTag } from './services/scriptTag.js';
import { onOrderCreate } from './services/orders.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Nuvemshop Preorder App up!');
});

router.get('/install', (req, res) => {
  const { store_domain } = req.query;
  if (!store_domain) return res.status(400).send('store_domain é obrigatório');
  const redirect = `https://${store_domain}/admin/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.APP_URL + '/oauth/callback')}&response_type=code&scope=read_products,write_products,read_orders,write_orders,read_script_tags,write_script_tags`;
  res.redirect(redirect);
});

router.get('/oauth/callback', async (req, res) => {
  const { code, store_domain } = req.query;
  if (!code || !store_domain) return res.status(400).send('code/store_domain ausentes');

  try {
    const token = await getAccessToken({ code, store_domain });
    req.session.token = token;
    req.session.store_domain = store_domain;

    await ensureScriptTag({ access_token: token, store_domain });

    res.send('App instalado! Você pode fechar esta janela.');
  } catch (err) {
    console.error('oauth callback error', err?.response?.data || err.message);
    res.status(500).send('Erro na instalação do app.');
  }
});

router.post('/webhooks/orders/create', express.json({ type: '*/*' }), onOrderCreate);

export default router;
