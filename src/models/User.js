const {string, required} = require("joi")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
},
{
    versionKey: false,
}
);

module.exports = mongoose.model("User", userSchema);