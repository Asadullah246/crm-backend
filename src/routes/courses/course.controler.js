import { course } from "./course.modal.js";

export const getCourses = async (req,res) => {
    try {
        const getCourses = await course.find({});
        if(getCourses){
            res.status(200).json({
                status:"success",
                data:getCourses,
            });
        }
    } catch (error) {
         res.status(500).json({message:error.message});
    }
}