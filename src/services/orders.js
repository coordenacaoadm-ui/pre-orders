
export async function onOrderCreate(req, res) {
  try {
    const order = req.body || {};
    const products = order.products || order.items || [];
    const hasPreorder = products.some(p => {
      const props = p.properties || p.line_item_properties || [];
      return props.some(prop =>
        (prop.name || prop.key) === 'type' &&
        (prop.value || prop.val) === 'preorder'
      );
    });

    if (hasPreorder) {
      console.log('[webhook] Pedido com PREORDER detectado:', order.id || order.number);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('webhook orders/create error', err.message);
    res.sendStatus(500);
  }
}
