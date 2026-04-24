import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/blob-store';

export const dynamic = "force-dynamic";

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'comment';
  low?: string;
  high?: string;
  placeholder?: string;
}

const DEFAULT_QUESTIONS: Question[] = [
  { id: 'q0', text: "IS THERE ANYTHING ELSE YOU'D LIKE TO SHARE, REFLECT UPON, OR ILLUMINATE?", type: 'comment', placeholder: '...' },
  { id: 'q1', text: "ON A SCALE OF 1\u20135, HOW IMPACTFUL WAS THIS WEEK'S SERVICE FOR YOU, AND WHY?", type: 'scale', low: 'MILDLY PLEASANT', high: 'TRANSFORMATIVE', placeholder: 'WHY...' },
  { id: 'q2', text: 'HOW DID YOU FEEL LEAVING THE SERVICE? WHAT EMOTION LINGERED MOST?', type: 'scale', low: 'UNCHANGED', high: 'DEEPLY SHIFTED', placeholder: 'WHAT EMOTION...' },
  { id: 'q3', text: 'HOW COHESIVE DID THE PACING + FLOW FEEL? WHAT WOULD YOU BE CURIOUS TO SEE NEXT TIME?', type: 'scale', low: 'DISJOINTED', high: 'SEAMLESS', placeholder: 'CURIOUS TO SEE...' },
  { id: 'q4', text: 'IF YOU COULD REQUEST ONE THING FOR WEEK 3, WHAT WOULD IT BE?', type: 'comment', placeholder: 'YOUR REQUEST...' },
  { id: 'q5', text: 'IF YOU HAD TO DESCRIBE THE ASCENSION SERVICE TO A FRIEND, WHAT WOULD YOU SAY?', type: 'comment', placeholder: 'I WOULD SAY...' },
];

export async function GET() {
  const questions = await getData<Question>('feedback-questions.json');
  if (questions.length === 0) {
    await setData('feedback-questions.json', DEFAULT_QUESTIONS);
    return NextResponse.json({ questions: DEFAULT_QUESTIONS });
  }
  return NextResponse.json({ questions });
}

export async function POST(req: NextRequest) {
  const { questions } = await req.json();
  if (!Array.isArray(questions)) {
    return NextResponse.json({ error: 'questions must be an array' }, { status: 400 });
  }
  await setData('feedback-questions.json', questions);
  return NextResponse.json({ ok: true });
}
