const { Redis } = require('@upstash/redis');

module.exports = async function handler(req, res) {
    try {
        const redis = new Redis({
            url: (process.env.KV_REST_API_URL || '').trim(),
            token: (process.env.KV_REST_API_TOKEN || '').trim(),
        });

        if (req.method === 'GET') {
            var emails = await redis.lrange('skyhouse:emails', 0, -1);
            return res.status(200).json({ emails: emails || [] });
        }

        if (req.method === 'POST') {
            var email = req.body.email;
            if (!email) return res.status(400).json({ error: 'Missing email' });
            await redis.lpush('skyhouse:emails', email.trim());
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) {
        console.error('Emails error:', e.message);
        return res.status(500).json({ error: e.message });
    }
};
