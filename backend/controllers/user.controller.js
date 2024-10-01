import mongoose from "mongoose";
import  UserModel from "../models/user.model.js";

export const createUser = async (req, res) => {
    const user = req.body;
    if( !user || !user.name || !user.age || !user.email || !user.password ){
        return res.status(400).json({ success:false, message:"Provide all fields." });
    }
    
    UserModel.findOne({ email: user.email })
    .then((userExist) => {
        if(userExist){
            return res.status(400).json({ success:false, message:"Email already exist." });
        }
        const newUser = new UserModel(user);

        newUser.save()
        .then(() => {
            return res.status(201).json({ success:true, data:newUser });
        })
        .catch((err) => {
            console.log("Error in creating new user: ", err.message);
            res.status(500).json({ success:false, message:"Server Error"});
        })
    }).catch((err) => { console.log(err) });
}

export const getAllUsers = async (req, res) => {    
    try {
        const users = await UserModel.find();
        res.status(201).json({ success:true, data:users });
    } catch (error) {
        console.log("Error in fetching users: ", error.message);
        res.status(500).json({ success:false, message:"Server Error"});
    }
}

export const removeUser = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success:false, message:"Invalid User Id" });
    }
    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ success:true, message:"User deleted" });
    } catch (error) {
        console.log("Error in removing user: ", error.message);
        res.status(500).json({ success:false, message:"Server Error"});
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const user = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success:false, message:"Invalid User Id" });
    }
    try {
        const updateUser = await UserModel.findByIdAndUpdate(id, user, {new: true})
        res.status(200).json({ success:true, data: updateUser });
    } catch (error) {
        console.log("Error in updating user: ", error.message);
        res.status(500).json({ success:false, message:"Server Error"});
    }
}