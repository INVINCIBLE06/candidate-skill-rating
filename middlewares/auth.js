
//////////////////////////////////////////////////////////////
//                                                          //
//      This is file is reponsible for verifying the token  //
//                                                          //
//////////////////////////////////////////////////////////////

import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};
