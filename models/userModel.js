const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const userSchema=new mongoose.Schema({
    name:{type:String,
    required:[true,"please tell us your name"]
    },
    email:{type:String,
    required:[true,"please provide your email address"],
    unique:true,
    lowercase:true,
    validate:[validator.isEmail,"please provide a valid email address"]

    },
    photo:{type:String},
    password:{type:String,
    required:true,
    minlength:8,
    },
    passwordConfirm:{type:String,
        required:[true,"please confirm password"],
        validate:function(el){
            return el===this.password;
        },
        message:"password are not same"
    }
})
userSchema.pre("save",async function(next){
    if(!this.isDirectModified("password"))
    return next();
    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})

const User=mongoose.model("user",userSchema);

module.exports=User;