const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' })
        }

        const userExist = await userModel.findOne({ email });

        console.log("function called ")

        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        };

        console.log(userExist);

        if (name.length < 3 || name.length > 20) {
            return res.status(400).json({ success: false, message: "Name must be 3 to 20 characters long!" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ success: false, message: "Password must be 8 to 20 characters long!" })
        }

        const OTP = generateOTP();
        const verificationToken = new VerificationToken({
            owner: email,
            token: OTP,
        })

        await verificationToken.save();

        transporter().sendMail({
            from: 'prabhatsahrawat010203@gmail.com',
            to: email,
            subject: "Verify your email account",
            html: generateEmailTemplate(OTP),
        });

        res.status(200).json({
            success: true,
            message: "Please verify your email to login",
            email,
            name,
            password
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Provide All Details" });
        };

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Account not verified. Please verify your email first."
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(404).json({ success: false, message: "Password Is Wrong" });
        }

        const authToken = generateToken(user._id);

        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None'
        });

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const verifyEmail = async (req, res) => {

    try {

        const { email, otp, name, password } = req.body;

        if (!email || !otp.trim() || !name || !password) {
            return res.status(400).json({ message: "Invalid request, missing parameters!" });
        };

        const user = await userModel.findOne({ email });


        if (user) {
            return res.status(404).json({ success: false, message: "User Already Found" });
        }

        const token = await VerificationToken.findOne({ owner: email });

        if (!token) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        const isMatched = await token.matchToken(otp);

        if (!isMatched) {
            return res.status(404).json({ success: false, message: "OTP Is Wrong" });
        }

        const newUser = new userModel({
            name,
            email,
            password,
            verified: true
        });

        await VerificationToken.findByIdAndDelete(token._id);

        await newUser.save();

        console.log(newUser);
        
        const authToken = generateToken(newUser._id);

        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 days
            sameSite: 'None'
        });
            
        transporter().sendMail({
            from: 'prabhatsahrawat010203@gmail.com',
            to: email,
            subject: "Verify your email account",
            html: plainEmailTemplate("Email Verified Succesfully", "Thanks for connecting with us "),
        });

        res.status(201).json({
            success: true,
            message: "Registration successful , Your Email is Verified",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail
}