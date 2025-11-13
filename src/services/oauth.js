
import axios from 'axios';

export async function getAccessToken({ code, store_domain }) {
  const tokenURL = `https://${store_domain}/admin/oauth/access_token`;
  const { data } = await axios.post(tokenURL, {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code
  });
  if (!data?.access_token) {
    throw new Error('Token não retornado pela Nuvemshop');
  }
  return data.access_token;
}
