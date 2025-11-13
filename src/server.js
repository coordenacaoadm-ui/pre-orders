
import express from 'express';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'sess',
  keys: [process.env.SESSION_SECRET || 'dev'],
  maxAge: 24 * 60 * 60 * 1000
}));

// Serve asset do app
app.get('/assets/preorder.js', (req, res) => {
  res.type('application/javascript').send(`
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.js-preorder');
  if (!btn) return;
  e.preventDefault();
  const variant = btn.dataset.variant;
  const eta = btn.dataset.eta || '7 dias';
  const qty = Number(btn.dataset.qty || 1);

  try {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        id: variant,
        quantity: qty,
        properties: { type: 'preorder', eta }
      })
    });
    window.location.href = '/cart';
  } catch (err) {
    console.error('preorder add error', err);
    alert('Não foi possível adicionar o item. Tente novamente.');
  }
});
  `);
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log('> Nuvemshop Preorder App rodando na porta', PORT);
});
