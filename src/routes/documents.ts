import express from 'express';
import Joi from 'joi';
import Mention from '../models/mention';
import Post from '../models/post';
import Document from '../models/document';
import findIndex from '../service/search';
import update from '../service/update';
import IdInvalidError from '../exceptions/IdInvalidError';
import IdNotFoundError from '../exceptions/IdNotFoundError';
import { Mutation } from '../models/mutation';

const router = express.Router();
const requestSchema = Joi.object().keys({
    original: Joi.object().keys({
        _id: Joi.number().min(0).required(),
        name: Joi.string().required(),
        posts: Joi.array().items(Joi.object().keys({
            _id: Joi.number().min(0).required(),
            value: Joi.string().required(),
            mentions: Joi.array().items(Joi.object().keys({
                _id: Joi.number().min(0).required(),
                text: Joi.string().required()
            })).required()
        })).required()
    }).required(),
    mutation: Joi.object().keys({
        posts: Joi.array().items(Joi.object().keys({
            _id: Joi.number().min(0).when('_delete', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
            value: Joi.string().optional(),
            mentions: Joi.array().items(Joi.object().keys({
                _id: Joi.number().min(0).when('_delete', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
                text: Joi.string().optional(),
                _delete: Joi.bool().valid(true).optional()
            })).optional(),
            _delete: Joi.bool().valid(true).optional()
        })).required()
    }).required()
});

router.post('/', (req, res) => {

    if (!validateRequest(req, res)) {
        console.error("Validation of request is failed.");
        return;
    }

    const { original, mutation } = req.body;

    try {
        const doc: Document = original as Document;
        const commands: Mutation = mutation as Mutation;
        let result = generateUpdateStatement(doc, commands);
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

function validateRequest(req: any, res: any): boolean {
    const result = requestSchema.validate(req.body);

    if (result.error) {
        res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
        return false;
    }

    return true;
}

function generateUpdateStatement(original: Document, mutation: Mutation) {
    let result = [];
    for (let command of mutation.posts) {
        if (!('mentions' in command)) {
            result.push(update<Post>(original.posts, command, 'posts'));
            continue;
        }

        const postIndex = findIndex(original.posts, command._id!);

        if (postIndex < 0) {
            throw new IdNotFoundError('_id ' + command._id + ' is not found.');
        }

        if (original.posts[postIndex].mentions == null) {
            throw new IdNotFoundError('no mentions found in original.posts.' + postIndex);
        }

        for (let mentionCommand of command.mentions!) {
            result.push(update<Mention>(original.posts[postIndex].mentions!, mentionCommand, 'posts.' + postIndex + '.mentions'));
        }
    }
    return result;
}

export default router;