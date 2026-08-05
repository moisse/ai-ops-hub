import { Router } from 'express';

const router = Router();

// AI Chat endpoint
router.post('/', async (req, res) => {
  const { message, serverContext } = req.body;

  // Mock responses for demo
  const responses = {
    'memory': 'Server memory usage: Total 7.7GB, Used 654MB, Free 3.4GB',
    'cpu': 'CPU usage: 2% (idle)',
    'disk': 'Disk usage: /dev/root 77G total, 4.6G used (6%)',
    'restart': 'Service restarted successfully',
    'scan': 'Scan completed: 8 servers checked, 6 online, 1 warning, 1 offline',
  };

  let response = 'I received your command. Processing...';
  for (const [keyword, resp] of Object.entries(responses)) {
    if (message.toLowerCase().includes(keyword)) {
      response = resp;
      break;
    }
  }

  res.json({
    success: true,
    response,
    timestamp: new Date().toISOString(),
  });
});

router.get('/history', (req, res) => {
  res.json([]);
});

export default router;
