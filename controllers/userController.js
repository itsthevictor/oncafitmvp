const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {createTokenUser, attachCookiesToResponse, isSubscribed, checkPermissions} =require('../utils')

const getAllUsers = async (req, res) => {
    const users = await User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password');
    if(!user){
        throw new CustomError.NotFoundError('no user with that id')
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user});
}


const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user:req.user})
}

// Update User with user.save()
const updateUser = async (req, res) => {
        const { email, name } =  req.body;
        if(!email || !name){
            throw new CustomError.BadRequestError('please provide both values')
        }
        const user = await User.findOne({_id:req.user.userId})
        user.email = email;
        user.name = name;

        await user.save();

        

        const tokenUser = createTokenUser(user);
        attachCookiesToResponse({res, user:tokenUser});
        res.status(StatusCodes.OK).json({user:tokenUser})
    }

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.NotFoundError('Please provide both values');
    };
    const user = await User.findOne({_id:req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid credentials');
    };
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:'password changed successfully'})
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}



// Udate User wth FindOneAndUpdate
// const updateUser = async (req, res) => {
//     const { email, name } =  req.body;
//     if(!email || !name){
//         throw new CustomError.BadRequestError('please provide both values')
//     }
//     const user = await User.findOneAndUpdate(
//         {_id:req.user.userId},
//         {email, name},
//         {new:true, runValidators:true}
//     );
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res, user:tokenUser});
//     res.status(StatusCodes.OK).json({user:tokenUser})
// }