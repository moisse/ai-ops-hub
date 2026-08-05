import { Router } from 'express';

const router = Router();

// AI Chat 端点（对接 Hermes Agent API）
router.post('/chat', async (req, res) => {
  const { message, serverContext } = req.body;

  // TODO: 对接 Hermes Agent API
  // 目前返回模拟响应
  
  const responses: Record<string, string> = {
    'memory': 'Server memory usage: Total 7.7GB, Used 654MB, Free 3.4GB',
    'cpu': 'CPU usage: 2% (idle)',
    'disk': 'Disk usage: /dev/root 77G total, 4.6G used (6%)',
    'restart': 'Service restarted successfully',
    'scan': 'Scan completed: 8 servers checked, 6 online, 1 warning, 1 offline',
  };

  // 简单关键词匹配
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
  // TODO: 从数据库获取对话历史
  res.json([]);
});

export default router;
