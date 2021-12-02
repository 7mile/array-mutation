export type Mutation = {
    posts: [{
        _id?: number,
        value?: string,
        _delete?: true
        mentions: [{
            _id?: number,
            text?: string,
            _delete?: true
        }]
    }]
};