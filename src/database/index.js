const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/noderest", {
    useNewUrlParser: true,
});


module.exports = mongoose;