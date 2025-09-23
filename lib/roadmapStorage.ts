import { supabase } from './supabaseClient';
import type { Roadmap } from './gemini';

export const persistRoadmap = async (topic: string, language: 'en'|'hi'|'ta'|'ml', roadmap: Roadmap) => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return;
  const userId = userData.user.id;

  const { data: rm, error: rmErr } = await supabase
    .from('roadmaps')
    .insert({ user_id: userId, topic, status: 'active', language_code: language })
    .select('id')
    .single();
  if (rmErr) throw rmErr;

  const roadmapId = rm.id as string;
  const tiles = roadmap.tiles.map((t, idx) => ({
    roadmap_id: roadmapId,
    index: idx,
    title: t.title,
    description: t.description,
    concepts: t.concepts,
    youtube_query: t.youtubeSearchQuery,
    completed: false,
  }));
  const { error: tilesErr } = await supabase.from('roadmap_tiles').insert(tiles);
  if (tilesErr) throw tilesErr;
};
