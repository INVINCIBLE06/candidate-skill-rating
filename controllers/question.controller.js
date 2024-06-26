//////////////////////////////////////////////////////////////
//                                                          //
//      This is a controller file for question collection   //
//      which will be responsible for all the operations    //
//                                                          //
//////////////////////////////////////////////////////////////

import { closeDbConnection, createDbConnection } from '../configs/db.config.js';
import Question from '../models/question.model.js';

// Get Aggregate Skills and Ratings
export const getAggregateRatings = async (req, res, next) => {
    try {
        await createDbConnection();
        const questions = await Question.aggregate([
            {
                $group: {
                    _id: "$skillId",
                    easyCount: { $sum: { $cond: [{ $eq: ["$difficulty_level", "easy"] }, 1, 0] } },
                    mediumCount: { $sum: { $cond: [{ $eq: ["$difficulty_level", "medium"] }, 1, 0] } },
                    hardCount: { $sum: { $cond: [{ $eq: ["$difficulty_level", "hard"] }, 1, 0] } },
                    easyTotal: { $sum: { $cond: [{ $eq: ["$difficulty_level", "easy"] }, "$rating", 0] } },
                    mediumTotal: { $sum: { $cond: [{ $eq: ["$difficulty_level", "medium"] }, "$rating", 0] } },
                    hardTotal: { $sum: { $cond: [{ $eq: ["$difficulty_level", "hard"] }, "$rating", 0] } }
                }
            },
            {
                $project: {
                    skillId: "$_id",
                    _id: 0,
                    rating: {
                        $divide: [
                            {
                                $add: [
                                    { $multiply: ["$easyTotal", 1] },
                                    { $multiply: ["$mediumTotal", 2] },
                                    { $multiply: ["$hardTotal", 3] }
                                ]
                            },
                            {
                                $add: [
                                    { $multiply: ["$easyCount", 1] },
                                    { $multiply: ["$mediumCount", 2] },
                                    { $multiply: ["$hardCount", 3] }
                                ]
                            }
                        ]
                    }
                }
            }
        ]);
        await closeDbConnection();
        return res.status(200).json({
            status: true,
            data: questions
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// The below function is for adding or updating candidate response    
export const createOrUpdateResponse = async (req, res, next) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ message: 'Only candidate can give the response' });
    }
    const { skillId, difficulty_level, question, response } = req.body;
    try {
        await createDbConnection();
        let questionDoc = await Question.findOneAndUpdate(
            { skillId, question, candidate: req.user.id },
            { response, difficulty_level, candidate: req.user.id },
            { new: true, upsert: true }
        );
        await closeDbConnection();
        return res.status(201).json({
            status: true,
            data: questionDoc
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
}

// The below function will give all the question and answer of a particular user
export const getParticularUserAllResponse = async (req, res, next) => {
    const userId = req.params.id;
    if (req.user.id !== userId) {
        return res.status(403).json({
            status: false,
            message: 'Token is of a different user.'
        });
    }
    try {
        await createDbConnection();
        const userResponses = await Question.find({ candidate: userId });
        await closeDbConnection();
        return res.status(200).json({
            status: true,
            data: userResponses
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message
        });
    }
};

// The below function will be used for adding or updating the rating of a particular questions.
export const submitRating = async (req, res, next) => {
    const _id  = req.params.id;
    const { rating } = req.body;
    if (req.user.role !== 'reviewer') {
        return res.status(403).json({ message: 'Not allowed to give rating' });
    }
    try {
        await createDbConnection();
        const updatedQuestion = await Question.findByIdAndUpdate(_id, { rating }, { new: true });
        await closeDbConnection();
        return res.status(200).json({
            status: true,
            data: updatedQuestion
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message
        });
    }
};
