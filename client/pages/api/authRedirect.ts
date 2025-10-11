import { NextApiRequest, NextApiResponse } from 'next';

const authRedirect = async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(307, `${process.env.REACT_APP_SERVER_URL}/auth/google`);
};

export default authRedirect;