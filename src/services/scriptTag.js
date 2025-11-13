
import axios from 'axios';

export async function ensureScriptTag({ access_token, store_domain }) {
  const api = axios.create({
    baseURL: `https://${store_domain}/admin`,
    headers: { 'Authentication-Token': access_token }
  });

  const { data } = await api.get('/scripts');
  const scripts = Array.isArray(data) ? data : (data?.scripts || []);
  const exists = scripts.some(s => (s.src || '').includes('/assets/preorder.js'));

  if (!exists) {
    await api.post('/scripts', {
      src: `${process.env.APP_URL}/assets/preorder.js`,
      event: 'onload',
      where: 'store'
    });
  }
}
