import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types

const adoptionSchema = new mongoose.Schema({
    pet: {type: ObjectId, ref: 'Pet', required: true},
    user: {type: ObjectId, ref: 'User', required: true},
    adopter: {type: String, required: true},
    date: {type: Date, required: true},
    visit: {type: Date, required: true},
    status: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    price: {type: Number, required: true},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    age: {type: Number, required: true},
}, {timesatmps: true})

const Adoption = mongoose.model('Adoption', adoptionSchema)

export default Adoption;

// {
//         "_id": "879y3428fb",
//         "adopter": "Megan",
//         "pet": dummyPetData[0],
//         "date": "2025-08-26",
//         "visit": "2025-09-23",
//         "status": "pending",
//         "price": "20000",
//         "address": "Malabe",
//         "phone": "0761234567",
//         "age": "22",
//     },