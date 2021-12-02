import 'dotenv/config';

/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from 'express';

import documentRoutes from '../routes/documents';

// Instantiate express
const server = express();
server.use(express.json());

// Initialize routes middleware
server.use('/api/documents', documentRoutes);
export default server;
