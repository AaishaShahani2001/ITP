import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types

const petSchema = new mongoose.Schema({
    pet: {type: ObjectId, ref: 'Pet'},
    species: {type: String, required: true},
    breed: {type: String, required: true},
    gender: {type: String, required:true},
    color: {type: String, required:true},
    diet: {type: String, required:true},
    image: {type: String, required:true},
    age: {type: Number, required:true},
    price: {type: Number, required:true},
    medical: {type: String, required:true},
    born: {type: String, required:true},
}, {timesatmps: true})

const Pet = mongoose.model("Pet", petSchema)

export default Pet;

// "_id": "pet9",
//         "species": "Parrot",
//         "breed": "Cockatiel",
//         "gender": "Male",
//         "color": "Grey and yellow",
//         "diet": "Seeds, veggies",
//         "image": parrot4,
//         "age": 2,
//         "price": 15000,
//         "medical": "Vaccinated",
//         "born": "2023-03-22",