import mongoose, { mongo } from "mongoose";

const ConnectDB=async ()=>{

    mongoose.connection.on('connected',()=>{console.log('database connected')})
 
await mongoose.connect(`${process.env.MONGO_URI}/zorvyn`)

}

export default ConnectDB