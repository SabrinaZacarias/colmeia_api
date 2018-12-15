var mongoose = require("mongoose");

var Schema = mongoose.Schema;


let UserSchema = new Schema(
  
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String },
    entidade:{ type: String},
    cnpj:{type: String},
    phone: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
  },
  
  {
    collection: "users",
    versionKey: false,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

UserSchema.virtual("id").get(function() {
  return this._id;
});


let users = mongoose.model("users", UserSchema);

module.exports = users;
