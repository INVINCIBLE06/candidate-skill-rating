import { closeDbConnection, createDbConnection } from '../configs/db.config.js';
import Question from '../models/question.model.js';

// Create or Update Question Response and Rating
export const createOrUpdateResponse = async (req, res, next) => {
    try {
        const { skillId, difficulty_level, question, response, rating } = req.body;
        let questionDoc = await Question.findOneAndUpdate(
            { skillId, question },
            { response, rating, difficulty_level },
            { new: true, upsert: true }
        );
        res.status(201).json(questionDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Aggregate Skills and Ratings
export const getAggregateRatings = async (req, res, next) => {
    try {
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
        res.status(200).json(questions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




export const candidateReponse = async (req, res, next) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ message: 'Access denied' });
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

// The below will give all the question of a particular
export const getParticularUserAllResponse = async (req, res, next) => {
    const userId = req.params.id;
    if (req.user.id !== userId) {
        return res.status(403).json({
            status: false,
            message: 'Access denied'
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

export const submitRating = async (req, res) => {
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

