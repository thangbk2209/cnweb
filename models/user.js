var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=mongoose.Schema({
  local:{
    email:String,
    password:String,
  },
  profile:{
    fullName: String,
    age: Number,
    city: String,
    job: String,
    words:[{
      title: String
    }],
    following:[{
      id: mongoose.Schema.Types.ObjectId,
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
