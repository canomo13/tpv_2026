const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

/**
 * ESC/POS Thermal Printer Endpoint
 */
app.post('/printer/print', (req, res) => {
  const { data } = req.body;
  console.log('--- ENVIANDO COMANDO ESC/POS ---');
  console.log(data);
  // Logic for node-escpos would go here
  res.json({ success: true, message: 'Comando enviado a la impresora' });
});

/**
 * RS232 Cash Drawer Endpoint
 */
app.post('/hardware/drawer/open', (req, res) => {
  console.log('--- ABRIENDO CAJÓN (COMANDO SERIE RS232) ---');
  // Logic for serialport library would go here
  res.json({ success: true, status: 'Cajón abierto' });
});

/**
 * NFC Status (Local Fallback)
 */
app.get('/hardware/nfc/status', (req, res) => {
  res.json({ ready: true, device: 'PC/SC SmartCard Reader' });
});

app.listen(port, () => {
  console.log(`Local Bridge activo en http://localhost:${port}`);
});
