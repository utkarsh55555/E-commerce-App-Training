const mongoose = require("mongoose");
const { convertToSlug } = require("../utils/slug");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    logo: {
      url: String,
      publicId: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.pre("validate", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = convertToSlug(this.name);
    }
    next();
});

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
