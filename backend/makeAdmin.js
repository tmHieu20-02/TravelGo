const db = require('./models');

async function makeAdmin() {
    try {
        await db.sequelize.sync();
        const users = await db.User.findAll();
        if (users.length === 0) {
            console.log("❌ Bạn chưa tạo tài khoản nào! Hãy vào website để Đăng ký 1 tài khoản trước đã nhé.");
        } else {
            for (let user of users) {
                user.role = 'admin';
                await user.save();
                console.log(`✅ Đã cấp quyền Admin thành công cho tài khoản: ${user.email}`);
            }
        }
    } catch (err) {
        console.error("Lỗi:", err);
    } finally {
        process.exit();
    }
}

makeAdmin();
