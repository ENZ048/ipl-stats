const express = require('express');
const cors = require('cors');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

app.use(cors());

app.use("/api/stats", statsRoutes);

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
