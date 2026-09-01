const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    label: { type: String, trim: true, maxlength: 30 },
    street: { type: String, trim: true, required: true, maxlength: 120 },
    city: { type: String, trim: true, required: true, maxlength: 60 },
    state: { type: String, trim: true, required: true, maxlength: 60 },
    postalCode: { type: String, trim: true, required: true, maxlength: 20 },
    country: { type: String, trim: true, required: true, maxlength: 60 },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        minlength:2,
        maxlength:50,
        required:true
    },
    email:{
        type: String,
        trim: true,
        minlength:5,
        maxlength:254,
        unique:true,
        lowercase:true,
        required: true
    },
    password:{
        type: String,
        required:true,
        minlength:6,
        maxlength:128,
        select: false
    },
    phone:{
    type: String,
    trim: true
    },
    role:{
        type: String,
        enum:["user","seller","admin"],
        default:"user",
        index:true
    },
    profilephoto:{
        type: String,
        trim: true
    },
    addresses: [addressSchema]
}, {
    timestamps: true
});

userSchema.set("toJSON", {
    transform: (_document, returnedUser) => {
        delete returnedUser.password;
        delete returnedUser.__v;
        return returnedUser;
    }
});
module.exports = mongoose.model("User", userSchema);