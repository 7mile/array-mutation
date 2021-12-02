
# Subdocument Array Mutation 

  Features:
  - TypeScript, Joy for validation
  - **Stack**: NodeJS / Express / Jest
  - Nodejs API Server - Open-source Nodejs Starter provided by AppSeed

## How to use the code

**Step #1** - Clone the project

```bash
$ git clone https://github.com/7mile/array-mutation.git
$ cd array-mutation
```

**Step #2** - Install dependencies via NPM or Yarn

```bash
$ npm i
// OR
$ yarn
```

**Step #3** - Start the API server (development mode)

```bash
$ npm run dev
// OR
$ yarn dev
```

The API server will start using the `PORT` specified in `.env` file (default 5000).

## API

For a fast set up, use this POSTMAN file: [api_sample](https://github.com/7mile/array-mutation/media/array-mutation.postman_collection.json)

> **Update original document** - `api/documents`

```
POST api/documents
Content-Type: application/json

{
    "original": {
        "_id": 1,
        "name": "document1",
        "posts": [
            {"_id": 2, "value": "2", "mentions": [] },
            {"_id": 3, "value": "3", "mentions": [] },
            {"_id": 4, "value": "4", "mentions": [] },
            {"_id": 5, "value": "5", "mentions": [{"_id": 7, "text": "new"}] },
            {"_id": 6, "value": "6", "mentions": []}
        ]
    },
    
    "mutation": { 
        "posts":[ 
            {"_id": 5, "mentions": [{"_delete": true, "_id": 7}, {"text": "banana"}]}
        ] 
    }
}
```

## To improve
- When adding a post or mentions, use an id generator to get the next id instead of the biggest id + 1
- Consider concurrent mutation by multiple users
