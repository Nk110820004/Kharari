import { supabase } from './supabaseClient';
import { User, ActivityLog } from '../App';

export const updateUserProfile = async (user: User) => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return;
  const userId = userData.user.id;

  const { error } = await supabase
    .from('profiles')
    .update({
      name: user.name,
      bio: user.bio,
      language: user.language,
      phone: user.phone,
      diamonds: user.diamonds,
      current_streak: user.currentStreak,
      highest_streak: user.highestStreak,
      last_activity_date: user.lastActivityDate,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<User | null> => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return null;
    const userId = userData.user.id;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return {
        name: data.name,
        bio: data.bio,
        language: data.language,
        accountCreated: new Date(data.created_at),
        phone: data.phone,
        diamonds: data.diamonds,
        currentStreak: data.current_streak,
        highestStreak: data.highest_streak,
        lastActivityDate: data.last_activity_date,
        miniGameAttempts: 0, // This is not persisted in the db in this example
    };
};

export const logUserActivity = async (log: ActivityLog) => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return;
    const userId = userData.user.id;

    const { error } = await supabase
        .from('activity_logs')
        .insert({
            user_id: userId,
            date: log.date,
            time_spent: log.timeSpent,
            completed: log.completed,
        });

    if (error) {
        console.error('Error logging user activity:', error);
        throw error;
    }
};