import { checkValueEntered } from "../utils/helper.js";

export async function checkCreateUserBody(req, res, next) {
    try
    {
        const { name, role } = req.body
        await checkValueEntered(name, `Name`)(req, res, next);
        await checkValueEntered(role, `Role`)(req, res, next);
        next();
    } 
    catch (error) 
    {
        console.log(`Error from checkCreateUserBody`, error.message);
    }
}