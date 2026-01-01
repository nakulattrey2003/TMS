import express from 'express';

const app = express();
app.get('/', (req, res) => res.json({ message: 'Hello' }));

app.listen(4001, () => {
  console.log('Test server running on port 4001');
});

await new Promise(() => {});
