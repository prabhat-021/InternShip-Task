const jwt = require('jsonwebtoken');

exports.authUser = async (req, res, next) => {

    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();

    } catch (error) {

        console.error(error);
        res.clearCookie('token');

        res.json({ success: false, message: error.message });
    }
}
