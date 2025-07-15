const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const Fuse = require('fuse.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let transpoter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err.message));

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    email: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    role: { type: String, default: "user" },
    bio: { type: String },
    linkedin: { type: String },
    website: { type: String },
    location: { type: String },
    company: { type: String },
    github: { type: String },
    image: {
        data: Buffer,
        contentType: String
    }
});

const postSchema = mongoose.Schema({
    username: { type: String, required: true },
    html: String,
    css: String,
    category: String,
    likedPeople: { type: [String], default: [] },
    tailwind: String,
    background: String,
    creator: String,
    creatorName: String,
    creationLink: String,
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

const verificationCodeSchema = mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, require: true },
    verificationCode: Number,
    createdAt: { type: Date, default: Date.now, expires: 3600 }
});

const reviewPostSchema = mongoose.Schema({
    username: { type: String, required: true },
    html: String,
    css: String,
    tailwind: String,
    category: String,
    background: String,
    creator: String,
    creatorName: String,
    creationLink: String
});

const draftSchema = mongoose.Schema({
    username: { type: String, required: true },
    html: String,
    css: String,
    category: String,
    background: String
})

const reportSchema = mongoose.Schema({
    id: { type: String, required: true },
    reason: { type: String, required: true },
    reportTo: { type: String, required: true },
    reportFrom: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const EmailVerification = mongoose.model("VerificationCode", verificationCodeSchema);
const Review = mongoose.model("Review", reviewPostSchema);
const Draft = mongoose.model("Draft", draftSchema);
const Report = mongoose.model("Report", reportSchema);

app.use(bodyParser.json());
app.use(cors());


const verify = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided" });
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (e) {
        res.status(403).json({ message: "Invalid token" });
    }
}

app.get("/verifyToken", (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        res.status(200).json({ message: "Token is valid", role: decoded.role });
    });
});

app.post('/emailVerify', async (req, res) => {
    try {
        const { username, password, email, verificationCode } = req.body;
        const verificationEntry = await EmailVerification.findOne({ email });

        if (!verificationEntry) {
            return res.status(404).json({ message: "Email Address not found or code expires" });
        } else {
            if (verificationEntry.verificationCode.toString() === verificationCode.toString()) {

                const newUser = new User({ username, password, email });
                await newUser.save();

                const token = jwt.sign({ username }, process.env.SECRET_KEY);
                return res.status(200).json({ message: "success", username, token });
            } else {
                return res.status(401).json({ message: "Invalid Code" });
            }
        }
    } catch (e) {
        return res.status(500).json({ message: "Internal error" });
    }
})

app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        const existingVerificationCode = await EmailVerification.findOne({ email });

        if (existingVerificationCode) {
            let mailOptions = {
                from: "elementx.dev01@gmail.com",
                to: email,
                subject: "ElementX vefication code",
                text: `yout verification code is ${existingVerificationCode.verificationCode} it expires in 1 hour`
            }
            await transpoter.sendMail(mailOptions);
            return res.status(200).json({ message: "success" });
        } else {
            const verificationCode = generateVerificationCode();

            let mailOptions = {
                from: "elementx.dev01@gmail.com",
                to: email,
                subject: "ElementX vefication code",
                text: `yout verification code is ${verificationCode} it expires in 1 hour`
            }
            await transpoter.sendMail(mailOptions);

            const newCode = new EmailVerification({ email, username, password, verificationCode });
            await newCode.save();
            return res.status(200).json({ message: "success" });
        }
    } catch (e) {
        res.status(500).json({ message: "Inter server error", error: e.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            if (password == existingUser.password) {
                const token = jwt.sign({ username, role: existingUser.role }, process.env.SECRET_KEY);
                res.status(200).json({ message: "Login successful", token, username, role: existingUser.role });
            } else {
                return res.status(401).json({ message: "Password is incorrect" });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        console.error("Login Error:", e.message);
        res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
});

app.post("/createElement", verify, async (req, res) => {
    try {
        if (req.user.role != "admin") {
            return res.status(401).json({ message: "Access denied" });
        }

        const element = req.body.element;

        const {
            html,
            css,
            category,
            username,
            _id: id,
            tailwind,
            background,
            creator,
            creatorName,
            creationLink
        } = element;



        let newElement;


        if (!html || !css || !category || !username || !id || !tailwind || !background || !creator) {
            console.log("error");
            return res.status(400).json({ message: "All fields are required" });
        }



        if (creator === "original") newElement = new Post({ html, css, category, username, tailwind, background, creator });
        else newElement = new Post({ html, css, category, username, tailwind, background, creator, creatorName, creationLink });

        const savedElement = await newElement.save();
        await Review.deleteOne({ _id: id });

        const existingUser = await User.findOne({ username: username });
        existingUser.posts.push(savedElement._id);
        await existingUser.save();

        const mailOptions = {
            from: "elementx.dev01@gmail.com",
            to: existingUser.email,
            subject: "Your Creation is Accepted",
            html: `
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <p>Dear ${existingUser.username},</p>
                  <p>We are delighted to inform you that your creation has been successfully accepted on the ElementX platform.</p>
                  <p>Please click the button below to view your creation:</p>
                  <p>
                    <a href="https://www.elementx.com/view-creation" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 4px;">
                      View Your Creation
                    </a>
                  </p>
                  <p>Thank you for your contribution and creativity. If you have any questions or require further assistance, please do not hesitate to contact our support team.</p>
                  <p>Best regards,<br>The ElementX Team</p>
                </body>
              </html>
            `
        };

        await transpoter.sendMail(mailOptions);

        res.status(201).json({ message: "New Element Added susseccefully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post("/rejectPost", verify, async (req, res) => {
    try {

        if (req.user.role != "admin") {
            return res.status(401).json({ message: "Access denied" });
        }

        const { username, id } = req.body;
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "user not found" });
        }
        const mailOptions = {
            from: "elementx.dev01@gmail.com",
            to: existingUser.email,
            subject: "Your Creation Submission Status",
            html: `
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Dear ${existingUser.username},</p>
                <p>Thank you for submitting your creation to <strong>ElementX</strong>. After careful review, we regret to inform you that your submission has not been approved at this time.</p>
                <p><strong>Reason for Rejection:</strong> </p>
                <p>We encourage you to make the necessary improvements and resubmit your creation. Please click the button below to make changes and submit again:</p>
                <p>
                  <a href="https://www.elementx.com/resubmit" target="_blank" 
                     style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #DC3545; text-decoration: none; border-radius: 4px;">
                    Resubmit Your Creation
                  </a>
                </p>
                <p>If you have any questions or need further clarification, feel free to contact our support team.</p>
                <p>Best regards,<br>The ElementX Team</p>
                </body>
                </html>`
        };

        await Review.deleteOne({ _id: id });
        await transpoter.sendMail(mailOptions);

        res.status(200).json({ message: "Reject mail send" });
    } catch (e) {
        res.status(500).json(e)
    }
})

app.get("/getDraftElements", verify, async (req, res) => {

});


app.get("/getReviewElements", verify, async (req, res) => {
    try {

        if (req.user.role != "admin") {
            return res.status(401).json({ message: "Access denied" });
        }
        const data = await Review.find({});
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/reviewPost", verify, async (req, res) => {
    try {
        const {
            html,
            css,
            category,
            username,
            background,
            tailwind,
            creator,
            creatorName,
            creationLink
        } = req.body;

        if (!html || !css || !category || !username || !background || !tailwind || !creator) {
            return res.status(400).json({ message: "All fields are required" });
        }


        if (creator === "original") {
            const newElement = new Review({ html, css, category, username, background, tailwind, creator });
            await newElement.save();
            return res.status(200).json({ message: "Element Sends for Review" });
        }

        if (!creatorName || !creationLink) {
            return res.status(400).json({ message: "Creator name or link are required" });
        }

        const newElement = new Review({ html, css, category, username, background, tailwind, creator, creatorName, creationLink });
        await newElement.save();
        return res.status(200).json({ message: "Element Sends for Review" });

    } catch (e) {
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post("/saveDraft", verify, async (req, res) => {
    try {
        const { html, css, category, username } = req.body;
        if (!html || !css || !category || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newElement = new Draft({ html, css, category, username });
        await newElement.save();

        res.status(201).json({ message: "Draft saved" });
    } catch (e) {
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post("/updateElement", verify, async (req, res) => {
    const { id, html, css, background } = req.body;
    try {
        if (!id || !html || !css || !background) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const postExist = await Post.updateOne(
            { _id: id },
            { $set: { html: html, css: css, background: background } }
        );

        console.log(postExist);
        if (postExist.matchedCount === 1 && postExist.modifiedCount === 1) {
            res.status(200).json({ message: "Update successful" });
        } else {
            res.status(400).json({ message: "Post not found or no changes were made" });
        }
    } catch (e) {
        return res.status(404).json({ message: "Internal server error", error: e.message });
    }
});

app.delete("/deleteElement", verify, async (req, res) => {
    try {
        const id = req.body.id;
        const deletePost = await Post.deleteOne({ _id: id });
        if (deletePost.deletedCount == 1) {
            return res.status(200).json({ message: "post deleted" });
        } else {
            res.status(404).json({ message: "Post Does not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "internal server error", error: e.message });
    }
});

app.get("/getUserInfo/:username", async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(404).json({ message: "Username is required" });
        }

        const existingUser = await User.findOne({ username })
            .populate("posts")
            .exec();

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        res.status(200).json(existingUser);
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/updateFollower", verify, async (req, res) => {
    try {
        const { username, follower } = req.body;
        if (!username || !follower) {
            return res.status(404).json({ message: "Username is required" });
        }

        const existingUser = await User.findOne({ username }).populate("posts").exec();
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const followerUser = await User.findOne({ username: follower }).exec();
        if (!followerUser) {
            return res.status(404).json({ message: "Follower not found" });
        }

        if (existingUser.followers.includes(follower)) {
            existingUser.followers = existingUser.followers.filter(f => f !== follower);
            followerUser.following = followerUser.following.filter(f => f !== username);
            await existingUser.save();
            await followerUser.save();
            return res.status(200).json(existingUser);
        } else {
            existingUser.followers.push(follower);
            followerUser.following.push(username);
            await existingUser.save();
            await followerUser.save();
            return res.status(200).json(existingUser);
        }
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/getall/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;


        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', or 'oldest'." });
        }

        if (sortBy !== "random") {
            skipElements = parseInt(skip);
            if (isNaN(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid positive number." });
            }
        }

        let pipeline = [];

        if (sortBy === "random") pipeline.push({ $sample: { size: 30 } });
        else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: username } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);
        let modifiedData = [];
        let temp = [];
        data.forEach((item) => {
            if (item.category == "form" || item.category == "card") {
                temp.push(item);
            } else {
                modifiedData.push(item);
            }
        });

        if (temp.length > 0) modifiedData.push(...temp);
        if (modifiedData.length < 30) {
            return res.status(200).json({ data: modifiedData, lastPage: true });
        }
        res.status(200).json({ data: modifiedData, lastPage: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getbutton/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', or 'oldest'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "button" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getbutton route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getform/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', or 'oldest'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "form" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getbutton route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getcard/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "card" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getcard route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getcheck/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "check" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getcheckbox route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getinput/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "input" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getinput route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getloader/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "loader" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getloader route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getradio/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "radioButtons" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /getradio route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getswitch/:sortBy/:skip/:username", async (req, res) => {
    try {
        const { sortBy, skip, username } = req.params;
        let skipElements = 0;

        const validSortOptions = ["random", "newest", "oldest", "mostLiked", "likedByUser"];
        if (!validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sortBy value. Use 'random', 'newest', 'oldest', 'mostLiked', or 'likedByUser'." });
        }

        if (sortBy !== "random") {
            skipElements = Number(skip);
            if (!Number.isInteger(skipElements) || skipElements < 0) {
                return res.status(400).json({ error: "Skip must be a valid non-negative integer." });
            }
        }

        let pipeline = [{ $match: { category: "toggleSwitche" } }];

        if (sortBy === "random") {
            pipeline.push({ $sample: { size: 30 } });
        } else if (sortBy === "newest") {
            pipeline.push({ $sort: { _id: -1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "oldest") {
            pipeline.push({ $sort: { _id: 1 } }, { $skip: skipElements }, { $limit: 30 });
        } else if (sortBy === "mostLiked") {
            pipeline.push({ $addFields: { likesCount: { $size: "$likedPeople" } } });
            pipeline.push({ $sort: { likesCount: -1 } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        } else if (sortBy === "likedByUser") {
            pipeline.push({ $match: { likedPeople: { $in: [username] } } });
            pipeline.push({ $skip: skipElements });
            pipeline.push({ $limit: 30 });
        }

        const data = await Post.aggregate(pipeline);

        if (data.length < 30) {
            return res.status(200).json({ data, lastPage: true });
        }

        res.status(200).json({ data, lastPage: false });
    } catch (err) {
        console.error("Error in /gettoggle route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/getRandomElements", async (req, res) => {
    try {
        const data = await Post.aggregate([
            {
                $group: {
                    _id: "$category",
                    docs: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    randomDoc: {
                        $arrayElemAt: [
                            "$docs",
                            { $floor: { $multiply: [{ $rand: {} }, { $size: "$docs" }] } }
                        ]
                    }
                }
            }
        ]);
        const randomElements = data.map(d => d.randomDoc);
        return res.status(200).json(randomElements);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/getElementById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Post.findOne({ _id: id });
        if (data) {
            res.status(200).json(data);
        }
    } catch (e) {
        res.status(400).json({ message: "Internal server error" });
    }
});

app.post("/like/:id", verify, async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        const post = await Post.findOne({ _id: id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likedPeople.includes(username)) {
            post.likedPeople = post.likedPeople.filter((user) => user !== username);
        } else {
            post.likedPeople.push(username);
        }

        await post.save();

        res.status(200).json({ likes: post.likedPeople.length, message: "Like updated" });

    } catch (e) {
        res.status(400).json({ message: "Internal server error" });
    }
});

app.post("/report", verify, async (req, res) => {
    try {
        const { id, reason, reportFrom, reportTo } = req.body;
        if (!id || !reason || !reportFrom || !reportTo) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log(id, reason, reportFrom, reportTo);
        const newReport = new Report({ id, reason, reportFrom, reportTo });
        await newReport.save();

        res.status(200).json({ message: "Report send successfully" });
    } catch (
    e
    ) {
        res.status(400).json({ message: "Internal server error" });
    }
});

app.get("/getInfo", async (req, res) => {
    const totalElement = await Post.countDocuments({});
    const totalUser = await User.countDocuments({});
    return res.status(200).json({ totalElement, totalUser });
});

app.post("/search", async (req, res) => {
    const { search } = req.body;
    if (!search) {
        return res.status(400).json({ message: "Search field is required" });
    }

    const data = await Post.find({});

    const options = {
        keys: ['category', 'username', 'background', 'tags'],
        threshold: 0.4,
        ignoreLocation: true
    };

    const fuse = new Fuse(data, options);
    const results = fuse.search(search);

    const matchedPosts = results.map(result => result.item);
    return res.status(200).json(matchedPosts);
});


app.put(
    '/editProfile/:id',
    verify,
    upload.single('image'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const updatable = [
                'username',
                'bio',
                'linkedin',
                'website',
                'location',
                'company',
                'github',
            ];
            const updateFields = {};

            updatable.forEach((field) => {
                if (req.body[field] !== undefined) {
                    updateFields[field] = req.body[field];
                }
            });

            if (req.file) {
                updateFields.image = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                };
            }

            const updated = await User.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updated) {
                return res.status(404).json({ error: 'User not found' });
            }

            let userObj = updated.toObject();
            if (userObj.image && userObj.image.data) {
                const base64 = userObj.image.data.toString('base64');
                userObj.image = `data:${userObj.image.contentType};base64,${base64}`;
            }

            res.status(200).json(userObj);

        } catch (err) {
            console.error('Profile update error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// GET /api/users/:id/image
app.get(
  '/getUserInfo/:id/image',
  async (req, res) => {
    const user = await User.findById(req.params.id).select('image');
    if (!user || !user.image?.data) return res.sendStatus(404);

    res.set('Content-Type', user.image.contentType);
    res.send(user.image.data);
  }
);





app.get("/temp", async (req, res) => {
    const data = await User.find({username : "karan"});
    res.json(data);
})

app.listen(process.env.PORT, () => {
    console.log(`Listening at port number : ${process.env.PORT}`);
})

