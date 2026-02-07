const { Redis } = require('@upstash/redis');

module.exports = async function handler(req, res) {
    try {
        const redis = new Redis({
            url: (process.env.KV_REST_API_URL || '').trim(),
            token: (process.env.KV_REST_API_TOKEN || '').trim(),
        });

        if (req.method === 'GET') {
            var ids = await redis.lrange('feedback_ids', 0, -1);
            if (!ids || ids.length === 0) {
                return res.status(200).json({ feedback: [] });
            }
            var entries = [];
            for (var i = 0; i < ids.length; i++) {
                var data = await redis.get(ids[i]);
                if (data) entries.push(data);
            }
            return res.status(200).json({ feedback: entries });
        }

        if (req.method === 'POST') {
            var body = req.body;
            var id = 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            body.timestamp = Date.now();
            await redis.set(id, JSON.stringify(body));
            await redis.lpush('feedback_ids', id);
            return res.status(200).json({ ok: true });
        }

        if (req.method === 'DELETE') {
            var ids = await redis.lrange('feedback_ids', 0, -1);
            if (ids && ids.length > 0) {
                for (var i = 0; i < ids.length; i++) {
                    await redis.del(ids[i]);
                }
            }
            await redis.del('feedback_ids');
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) {
        console.error('Feedback error:', e.message);
        return res.status(500).json({ error: e.message });
    }
};
