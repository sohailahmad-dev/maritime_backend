// import jwt from 'jsonwebtoken';

// const jwtSecret = process.env.JWT_SECRET; // Replace with your actual secret key
// // const jwtSecret = process.env.JWT_SECRET || 'uhUy7iKJ8989&*uiiuyh&uyhuj*&yj*uhj&*ujn*ij*u8UJHNU5tgh';

// // Middleware to authenticate user using JWT
// export const authenticateJwt = (req, res, next) => {
//     // console.log(req)
//     const token = req.header('x-auth-token');


//     if (!token) {
//         return res.status(401).json({ msg: 'No authorization token was found' });
//     }

//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.user = decoded.userId; // Assuming the payload has a userId property
//         next();
//     } catch (err) {
//         return res.status(401).json({ msg: 'Invalid authorization token' });
//     }
// };


export const authenticateJwt = async (req, res, next) => {

    try {

        if (
            !req.headers.authentication ||
            !req.headers.authentication.startsWith('Bearer') ||
            !req.headers.authentication.split(' ')[1]

        ) {
            return res.status(200).json({
                message: "Please provide token"
            })
        }
        // else {
        //     let token = req.headers.authentication.split(' ')[1];
        //     console.log('Token is : ', token)
        // }

        next();
    }
    catch (error) {
        console.log(error.meesage)
    }
};
