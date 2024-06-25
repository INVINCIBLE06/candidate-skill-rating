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
