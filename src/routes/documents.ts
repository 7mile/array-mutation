import express from 'express';
import generateUpdateStatement from '../service/generateUpdateStatement';
import IdInvalidError from '../exceptions/IdInvalidError';
import IdNotFoundError from '../exceptions/IdNotFoundError';

const router = express.Router();

router.post('/', (req, res) => {

    const { original, mutation } = req.body;

    try {
        let result = generateUpdateStatement(original, mutation);
        res.send(result);
    } catch (e) {
        if (e instanceof IdInvalidError) {
            console.error(e.message);
            res.status(400).json({ success: false, msg: '_id should be number' });
            return;
        } else if (e instanceof IdNotFoundError) {
            console.error(e.message);
            res.status(404).json({ success: false, msg: '_id is not found' });
            return;
        }
        console.error(e);
        res.status(400).json({ success: false });
    }
});

export default router;