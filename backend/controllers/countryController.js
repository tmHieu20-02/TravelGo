const db = require('../models');
const Country = db.Country;
const fs = require('fs');
const path = require('path');

// Create 1 quoc gia moi
exports.createCountry = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        
        // Kiểm tra xem có file được upload lên không
        let thumbnail = null;
        if (req.file) {
            // Nếu có, lưu lại đường dẫn tới file (ví dụ: /uploads/thumbnail-12345.jpg)
            // Đường dẫn này FE sẽ nối với http://localhost:5000 để tạo link ảnh hoàn chỉnh
            thumbnail = '/uploads/' + req.file.filename;
        }

        const country = await Country.create({
            name,
            slug,
            description,
            thumbnail // Giá trị giờ có thể là null hoặc url đường dẫn ảnh
        });
        
        res.status(201).json({ message: "Thêm quốc gia thành công", data: country });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// GET ALL COUNTRIES
exports.getAllCountries = async (req, res) => {
    try {
        const countries = await Country.findAll();
        // Cần đảm bảo nếu load từ web sẽ trả thêm domain tĩnh hoặc FE xử lý ghép url
        res.status(200).json(countries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách quốc gia" });
    }
};

// GET COUNTRY BY SLUG
exports.getCountryBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const country = await Country.findOne({ where: { slug: slug } });
        
        if (!country) {
            return res.status(404).json({ message: "Không tìm thấy quốc gia" });
        }
        res.status(200).json(country);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin quốc gia" });
    }
};

// UPDATE COUNTRY
exports.updateCountry = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, slug, description } = req.body;
        
        let country = await Country.findByPk(id);
        if (!country) return res.status(404).json({ message: "Không tìm thấy quốc gia" });

        let newThumbnail = country.thumbnail; // Giữ nguyên ảnh cũ mặc định
        
        if (req.file) {
            newThumbnail = '/uploads/' + req.file.filename; // Có ảnh mới
            // Xóa ảnh cũ khỏi server để đỡ rác ổ cứng
            if (country.thumbnail) {
                const oldImagePath = path.join(__dirname, '..', country.thumbnail);
                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                    } catch(e) {}
                }
            }
        }

        await country.update({
            name,
            slug,
            description,
            thumbnail: newThumbnail
        });

        res.status(200).json({ message: "Cập nhật thành công", data: country });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi cập nhật" });
    }
};

// DELETE COUNTRY
exports.deleteCountry = async (req, res) => {
    try {
        const id = req.params.id;
        const country = await Country.findByPk(id);
        
        if (!country) return res.status(404).json({ message: "Không tìm thấy quốc gia" });

        // Xóa ảnh thumbnail khỏi thư mục
        if (country.thumbnail) {
            const imagePath = path.join(__dirname, '..', country.thumbnail);
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch(e) {}
            }
        }

        await country.destroy();
        res.status(200).json({ message: "Đã xóa quốc gia thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa quốc gia" });
    }
};
