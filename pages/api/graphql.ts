import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return httpProxyMiddleware(req, res, {
    target: process.env.API_URL || 'http://localhost:4000/graphql',
    pathRewrite: [
      {
        patternStr: '^/api/graphql',
        replaceStr: '',
      },
    ],
  });
}
