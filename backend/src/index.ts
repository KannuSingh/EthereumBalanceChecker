import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ethereum Balance Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
