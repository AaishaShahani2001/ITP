import Adoption from "../models/Adoption.js";
import Pet from "../models/Pet.js";

//API to create adoption
export const createAdoption = async (req, res) => {
    try {
        const {_id} = req.user;
        const {pet} = req.body;

        const petData = await Pet.findById(pet)

        await Adoption.create({pet, user: _id})

        res.json({success: true, message: "Pet Adopted"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to list Adoptions
export const getUserAdoptions = async (req, res) => {
    try {
        const {_id} = req.user;
        const adoptions = await Adoption.find({user: _id}).populate("pet").toSorted({createdAt: -1})

        res.json({success: true, adoptions})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to change adoption status
export const changeAdoptionStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {adoptionId, status} = req.body;

        const adoptions = await Adoption.findById(adoptionId)

        if (adoptions.user.toString() !== _id.toString()) {
            return res.json({success: false, message: "Unauthorized"})
        }

        adoptions.status = status;

        await adoptions.save();

        res.json({success: true, message: "Status Updated"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API for allocate time slot for visiting
export const allocateVisitDate = async (req, res) => {
    try {
        const {_id} = req.user;
        const {adoptionId, visit} = req.body;

        const adoptions = await Adoption.findById(adoptionId)

        if (adoptions.user.toString() !== _id.toString()) {
            return res.json({success: false, message: "Unauthorized"})
        }

        adoptions.visit = visit;

        await adoptions.save();

        res.json({success: true, message: "Visiting time updated"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to cancel Adoption
export const cancelAdoption = async (req, res) => {
    try {
        const {_id} = req.user;
        const {adoptionId} = req.body;

        const adoptions = await Adoption.findById(adoptionId)

        Adoption.adoptions = null;
        await adoptions.save()

        res.json({success: true, message: "Adoption cancelled"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}