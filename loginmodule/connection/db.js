const Sequelize = require("sequelize");

const sequelize = new Sequelize('trial','root','Navnath@1997',{
    host:'127.0.0.1',
    dialect:'mysql'
})

module.exports = sequelize