
import axios from 'axios';
const NS = 'preorder';

function api(store_domain, token) {
  return axios.create({
    baseURL: `https://${store_domain}/admin`,
    headers: { 'Authentication-Token': token }
  });
}

export async function setVariantPreorder({ store_domain, token, variant_id, payload }) {
  return api(store_domain, token).post(`/variants/${variant_id}/metafields`, {
    namespace: NS,
    key: 'config',
    value: JSON.stringify(payload)
  });
}

export async function getVariantPreorder({ store_domain, token, variant_id }) {
  const { data } = await api(store_domain, token).get(`/variants/${variant_id}/metafields`);
  const mf = (data || []).find(m => m.namespace === NS && m.key === 'config');
  return mf ? JSON.parse(m.value) : null;
}
