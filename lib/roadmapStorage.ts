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

export const getRoadmap = async () => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return null;
  const userId = userData.user.id;

  const { data: rm, error: rmErr } = await supabase
    .from('roadmaps')
    .select('id, topic, language_code')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (rmErr || !rm) return null;

  const { data: tiles, error: tilesErr } = await supabase
    .from('roadmap_tiles')
    .select('title, description, concepts, youtube_query, completed')
    .eq('roadmap_id', rm.id)
    .order('index', { ascending: true });

  if (tilesErr || !tiles) return null;

  return {
    topic: rm.topic,
    language: rm.language_code,
    roadmap: {
      tiles: tiles.map(t => ({
        title: t.title,
        description: t.description,
        concepts: t.concepts,
        youtubeSearchQuery: t.youtube_query,
      })),
    },
    completedTiles: tiles.map(t => t.completed),
  };
};
