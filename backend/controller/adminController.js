import  imageKit from "../configs/imageKit.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import fs from 'fs';

export const changeRoleToAdmin = async (req, res) => {
    try {
        const {_id} = req.user;

        await User.findByIdAndUpdate(_id, {role: "admin"})
        res.json({success: true, message: "Now you can manage adoptions"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to add pets
export const addPet = async (req, res) => {
    try {
        const {_id} = req.user;
        let pet = JSON.parse(req.body.petData)
        const imageFile = req.file;

        //Upload to imageKit
        const fileBuffer = fs.readFileSync(imageFile.path)

        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/pets'
        })

        // //Optimization through imageKit URL transformation
        var OoptimizedImageURL = imageKit.url({
            path: response.filePath,
            transformation: [
                {width: '1280'}, //resizing
                {quality: 'auto'}, //auto compression
                {format: 'webp'} //convert to webp format
            ]
        });

        const image = OoptimizedImageURL;
        await Pet.create({...pet, admin: _id, image})

        res.json({success: true, message: "Pet Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to list pets
export const getPets = async (req, res) => {
    try {
        const {_id} = req.user;
        const pets = await Pet.find({pet: _id})

        res.json({success: true, pets})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to get Dashboard Data
// export const getDashboardData = 6.32.30, 7.09.00

//API to update user image 7.16.00

//API to remove pets
export const removePet = async (req, res) => {
    try {
        const {_id} = req.user;
        const {petId} = req.body;
        const pet = await Pet.findById(petId)

        pet.pet = null;
        await pet.save()

        res.json({success: true, message: "Pet adopted"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to edit pet details
export const editPet = async (req, res) => {
  try {
    const { _id } = req.user;
    const { petId } = req.body;
    const updatedData = JSON.parse(req.body.petData || '{}');
    const imageFile = req.file;

    if (!petId) {
      return res.json({ success: false, message: "Pet ID is required" });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.json({ success: false, message: "Pet not found" });
    }

    let image = pet.image;

    if (imageFile) {
      const fileBuffer = fs.readFileSync(imageFile.path);

      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: '/pets',
      });

      const optimizedImageURL = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { width: '1280' },
          { quality: 'auto' },
          { format: 'webp' },
        ],
      });

      image = optimizedImageURL;

      fs.unlinkSync(imageFile.path);
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { ...updatedData, image, admin: _id },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Pet details updated successfully", pet: updatedPet });
  } catch (error) {
    console.error("Error in editPet:", error.message);
    if (req.file?.path) {
      fs.unlinkSync(req.file.path).catch((err) => console.error("Cleanup error:", err));
    }
    res.status(500).json({ success: false, message: error.message });
  }
};