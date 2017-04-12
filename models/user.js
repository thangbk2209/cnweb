var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=mongoose.Schema({
  local:{
    email:String,
    password:String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    username: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  profile:{
    fullName: String,
    age: Number,
    city: String,
    job: String,
    avatar: String,
    words:[{
      title: String
    }],
    following:[{
      id: mongoose.Schema.Types.ObjectId,
      avatar: String,
      name: String
    }
    ]
  }
});

userSchema.methods.generateHash=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.local.password);
}

module.exports = mongoose.model('User',userSchema);
