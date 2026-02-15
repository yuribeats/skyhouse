const { Redis } = require('@upstash/redis');

var DEFAULT_QUESTIONS = [
    { id: 'q0', text: "IS THERE ANYTHING ELSE YOU'D LIKE TO SHARE, REFLECT UPON, OR ILLUMINATE?", type: 'comment', placeholder: '...' },
    { id: 'q1', text: "ON A SCALE OF 1\u20135, HOW IMPACTFUL WAS THIS WEEK'S SERVICE FOR YOU, AND WHY?", type: 'scale', low: 'MILDLY PLEASANT', high: 'TRANSFORMATIVE', placeholder: 'WHY...' },
    { id: 'q2', text: 'HOW DID YOU FEEL LEAVING THE SERVICE? WHAT EMOTION LINGERED MOST?', type: 'scale', low: 'UNCHANGED', high: 'DEEPLY SHIFTED', placeholder: 'WHAT EMOTION...' },
    { id: 'q3', text: 'HOW COHESIVE DID THE PACING + FLOW FEEL? WHAT WOULD YOU BE CURIOUS TO SEE NEXT TIME?', type: 'scale', low: 'DISJOINTED', high: 'SEAMLESS', placeholder: 'CURIOUS TO SEE...' },
    { id: 'q4', text: 'IF YOU COULD REQUEST ONE THING FOR WEEK 3, WHAT WOULD IT BE?', type: 'comment', placeholder: 'YOUR REQUEST...' },
    { id: 'q5', text: 'IF YOU HAD TO DESCRIBE THE ASCENSION SERVICE TO A FRIEND, WHAT WOULD YOU SAY?', type: 'comment', placeholder: 'I WOULD SAY...' }
];

module.exports = async function handler(req, res) {
    try {
        const redis = new Redis({
            url: (process.env.KV_REST_API_URL || '').trim(),
            token: (process.env.KV_REST_API_TOKEN || '').trim(),
        });

        if (req.method === 'GET') {
            var data = await redis.get('skyhouse:questions');
            if (!data) {
                await redis.set('skyhouse:questions', JSON.stringify(DEFAULT_QUESTIONS));
                return res.status(200).json({ questions: DEFAULT_QUESTIONS });
            }
            var questions = typeof data === 'string' ? JSON.parse(data) : data;
            return res.status(200).json({ questions: questions });
        }

        if (req.method === 'POST') {
            var questions = req.body.questions;
            if (!Array.isArray(questions)) return res.status(400).json({ error: 'questions must be an array' });
            await redis.set('skyhouse:questions', JSON.stringify(questions));
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) {
        console.error('Questions error:', e.message);
        return res.status(500).json({ error: e.message });
    }
};
