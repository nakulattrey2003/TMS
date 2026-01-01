import express from 'express';

console.log('[1] Starting script...');
const app = express();
console.log('[2] Express app created');

const server = app.listen(5002, () => {
  console.log('[3] Server callback - listening on 5002');
});

console.log('[4] After app.listen() call');

server.on('listening', () => {
  console.log('[5] Server listening event');
});

server.on('error', (err) => {
  console.log('[ERROR] Server error:', err);
});

process.on('beforeExit', (code) => {
  console.log('[BEFORE EXIT] Code:', code);
});

process.on('exit', (code) => {
  console.log('[EXIT] Code:', code);
});

console.log('[6] End of script');
