import { Client } from 'square';
import { randomUUID } from 'crypto';
import { onError } from '../../utils/error';
import { isAuth } from '../../utils/auth';
import nc from 'next-connect';

// eslint-disable-next-line no-undef
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: 'production',
});

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { result } = await paymentsApi.createPayment({
//       idempotencyKey: randomUUID(),
//       sourceId: req.body.sourceId,
//       amountMoney: {
//         currency: 'USD',
//         amount: req.body.amount * 100,
//       },
//     });

//     res.status(200).json(result);
//   } else {
//     res.status(500).send();
//   }
// }
const handler = nc({
  onError,
});
handler.use(isAuth);
handler.post(async (req, res) => {
  if (req.method === 'POST') {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: 'USD',
        amount: req.body.amount * 100,
      },
    });

    res.status(200).json(result);
  } else {
    res.status(500).send();
  }
});

export default handler;
