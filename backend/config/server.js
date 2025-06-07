const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect('mongodb+srv://Pegatoon:Pegatoon123@pegatoon.pbnmuen.mongodb.net/myDB?retryWrites=true&w=majority&appName=Pegatoon')
    .then(() => console.log('✅ Kết nối MongoDB thành công'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Schema User
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});
const User = mongoose.model('User', UserSchema);

// API Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ success: true, role: user.role });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('❌ Lỗi API /login:', err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});
// Tạo OTP random
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
}

// API Lấy mã OTP
app.get('/generate-otp', (req, res) => {
    const otp = generateOTP();
    console.log('📨 Mã OTP:', otp);

    // Tạm trả về OTP cho client, thực tế thì gửi mail hoặc SMS
    res.json({ success: true, otp });
});


// Server listen
app.listen(3000, () => {
    console.log('🚀 Server chạy ở cổng 3000');
});
