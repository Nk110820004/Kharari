import { supabase } from './supabaseClient';

export type ChatRole = 'user' | 'model';

export const getOrCreateThread = async () => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user; if (!user) return null;
  const { data: threads } = await supabase
    .from('chat_threads')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (threads && threads.length) return threads[0].id as string;
  const { data: created, error } = await supabase
    .from('chat_threads')
    .insert({ user_id: user.id, title: 'New chat' })
    .select('id')
    .single();
  if (error) return null;
  return created?.id as string;
};

export const fetchMessages = async (threadId: string) => {
  const { data } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  return (data || []).map(m => ({ role: m.role as ChatRole, content: m.content as string }));
};

export const appendMessage = async (threadId: string, role: ChatRole, content: string) => {
  await supabase.from('chat_messages').insert({ thread_id: threadId, role, content });
  await supabase.from('chat_threads').update({ updated_at: new Date().toISOString() }).eq('id', threadId);
};
