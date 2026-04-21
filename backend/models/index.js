const sequelize = require('../config/database');
const User = require('./User');
const Country = require('./Country');
const Booking = require('./Booking');
const Notification = require('./Notification');

const db = {
    sequelize,
    User,
    Country,
    Booking,
    Notification
};

// Thiết lập Quan hệ (Associations)
// 1-N: Một User có nhiều Booking
db.User.hasMany(db.Booking, { foreignKey: 'userId', as: 'bookings' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// 1-N: Một Country có nhiều Booking
db.Country.hasMany(db.Booking, { foreignKey: 'countryId', as: 'bookings' });
db.Booking.belongsTo(db.Country, { foreignKey: 'countryId', as: 'country' });

// 1-N: Một User có nhiều Notification
db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'notifications' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;