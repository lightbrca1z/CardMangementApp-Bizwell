import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const card = await request.json();
    const { data, error } = await supabase.from('cards').insert(card).select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error inserting card:', error);
    return NextResponse.json({ error: 'Failed to insert card' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const card = await request.json();
    const { data, error } = await supabase.from('cards').update(card).eq('id', card.id).select();
    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
} 