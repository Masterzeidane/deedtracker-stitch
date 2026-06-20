-- ============================================================
-- DeedTracker — Seed Data
-- ============================================================

-- ============================================================
-- DEEDS
-- ============================================================
insert into public.deeds (title, description, branch, xp_reward, coin_reward, energy_cost, difficulty, estimated_minutes) values
-- Worship
('Fajr Prayer',          'Complete the Fajr prayer at its appointed time before sunrise.',                   'worship',    150, 25,  5, 'medium',  10),
('Morning Dhikr',        'Complete the morning remembrance supplications (Adhkar al-Sabah).',                'worship',    100, 15,  5, 'easy',    15),
('Read 5 Pages Quran',   'Read with tajweed and reflection.',                                                'worship',    200, 30, 10, 'medium',  20),
('Dhuhr Prayer',         'Pray Dhuhr at its time.',                                                          'worship',    100, 15,  5, 'easy',     5),
('Asr Prayer',           'Pray Asr at its time.',                                                            'worship',    100, 15,  5, 'easy',     5),
('Maghrib Prayer',       'Pray Maghrib at its time.',                                                        'worship',    100, 15,  5, 'easy',     5),
('Isha Prayer',          'Pray Isha at its time.',                                                           'worship',    100, 15,  5, 'easy',     5),
('Evening Dhikr',        'Complete the evening remembrance supplications (Adhkar al-Masaa).',                'worship',    100, 15,  5, 'easy',    15),
('Tahajjud Prayer',      'Wake in the last third of the night for voluntary prayer.',                        'worship',    500, 80, 25, 'legendary',20),
('Memorize Ayah',        'Commit one new verse of the Quran to memory.',                                     'knowledge',  220, 35, 12, 'medium',  30),
-- Knowledge
('Islamic Study',        'Read one chapter from a scholarly work on Islamic history or jurisprudence.',      'knowledge',  175, 25, 15, 'medium',  45),
('Beneficial Podcast',   'Listen to a scholarly lecture or beneficial podcast episode.',                     'knowledge',  120, 18,  8, 'easy',    30),
('Take Notes',           'Write structured notes from today''s learning session.',                           'knowledge',  130, 20, 10, 'easy',    20),
('Teach Others',         'Share a beneficial piece of knowledge with family or friends.',                    'knowledge',  180, 28, 10, 'medium',  15),
-- Discipline
('30-Min Workout',       'Maintain your physical vessel through disciplined exercise.',                      'discipline', 250, 35, 20, 'hard',    30),
('Cold Shower',          'Build mental fortitude through cold immersion.',                                   'discipline', 120, 20,  8, 'hard',     5),
('No Social Media',      'Spend the full day without scrolling social media.',                               'discipline', 180, 28,  0, 'hard',     0),
('Intermittent Fast',    'Fast from food for 16 hours (excluding Ramadan).',                                 'discipline', 200, 32,  5, 'hard',     0),
('Wake Before 6AM',      'Rise early before 6am and start your day with intention.',                        'discipline', 130, 20,  0, 'medium',   0),
('Plan Your Day',        'Write a focused plan for the day before checking your phone.',                     'discipline',  80, 12,  5, 'easy',    10),
-- Character
('Forgive Someone',      'Practice active forgiveness for a grievance, no matter how small.',               'character',  200, 30, 10, 'medium',   5),
('Control Anger',        'Identify and respond to a trigger situation with patience.',                       'character',  180, 28, 10, 'hard',     5),
('Character Journal',    'Write a daily reflection on your character growth.',                               'character',  120, 18,  8, 'easy',    15),
('Apologize Sincerely',  'Offer a genuine apology to someone you have wronged.',                             'character',  220, 33, 10, 'hard',    10),
-- Charity
('Act of Charity',       'Give sadaqah or help someone in need today.',                                     'charity',    300, 50, 10, 'medium',  20),
('Visit Family',         'Maintain family ties (silat al-rahm) with a visit or call.',                      'charity',    150, 22, 15, 'easy',    60),
('Volunteer',            'Give an hour of your time to a community or charitable cause.',                    'charity',    350, 55, 20, 'medium',  60),
('Random Act of Kindness','Do an unplanned act of kindness for a stranger.',                                'charity',    180, 28,  5, 'easy',    10),
('Feed Someone',         'Provide a meal for someone in need.',                                              'charity',    250, 40, 10, 'medium',  30);

-- ============================================================
-- CHALLENGES
-- ============================================================
insert into public.challenges (title, description, branch, goal, xp_reward, coin_reward, end_date, rarity) values
('30-Day Fajr Streak',    'Complete Fajr prayer every single day for 30 days without missing.',             'worship',    30,  5000, 750,  now() + interval '30 days', 'epic'),
('Knowledge Marathon',    'Read 100 pages of Islamic scholarship within 14 days.',                          'knowledge',  100, 3500, 500,  now() + interval '14 days', 'rare'),
('Iron Will: 21-Day',     'Complete all 3 daily discipline deeds for 21 consecutive days.',                 'discipline', 21,  8000, 1200, now() + interval '21 days', 'legendary'),
('Community Compass',     'Perform 10 acts of charity in one month.',                                       'charity',    10,  2500, 400,  now() + interval '30 days', 'rare'),
('Mirror of the Soul',    'Journal your character reflections daily for 7 days.',                           'character',  7,   1800, 280,  now() + interval '7 days',  'common'),
('Quran Journey',         'Read the entire Quran (30 juz) within 30 days.',                                 'worship',    30,  10000,1500, now() + interval '30 days', 'legendary'),
('Morning Person',        'Wake before 6am for 14 consecutive days.',                                       'discipline', 14,  3000, 450,  now() + interval '14 days', 'rare');

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
insert into public.achievements (title, description, icon, rarity, branch, xp_reward, criteria_type, criteria_value) values
('First Light',        'Complete your very first deed.',                      '⭐', 'common',    null,         100,  'total_deeds',  1),
('Streak Starter',     'Maintain a 7-day streak.',                            '🔥', 'common',    'discipline', 200,  'streak',       7),
('Centurion',          'Complete 100 total deeds.',                           '💯', 'rare',      null,         500,  'total_deeds',  100),
('Tree Blossoms',      'Reach Level 5 in all 5 branches.',                    '🌳', 'epic',      null,         1000, 'level',        10),
('Diamond Devotee',    'Maintain a 30-day streak.',                           '💎', 'epic',      'worship',    1500, 'longest_streak',30),
('Scholar',            'Reach Level 10 in the Knowledge branch.',             '📚', 'rare',      'knowledge',  750,  'branch_level', 10),
('Legacy Forged',      'Reach overall Level 50.',                             '👑', 'legendary', null,         5000, 'level',        50),
('Generous Heart',     'Complete 50 charity deeds.',                          '❤️', 'rare',      'charity',    600,  'branch_deeds', 50),
('Iron Body',          'Complete 100 discipline deeds.',                      '⚔️', 'epic',      'discipline', 1200, 'branch_deeds', 100),
('Community Pillar',   'Reach 50,000 total XP.',                              '🏛️', 'rare',      null,         800,  'total_xp',     50000),
('Night Owl',          'Complete Tahajjud prayer 10 times.',                  '🌙', 'epic',      'worship',    1000, 'branch_deeds', 10),
('Transcendent',       'Reach 100,000 total XP.',                             '✨', 'legendary', null,         10000,'total_xp',     100000),
('Virtue Master',      'Reach Level 20 in the Character branch.',             '🎭', 'epic',      'character',  2000, 'branch_level', 20),
('Dedicated',          'Log in for 60 consecutive days.',                     '🗓️', 'legendary', null,         3000, 'longest_streak',60),
('Branch Master',      'Reach Level 25 in any single branch.',                '🏆', 'legendary', null,         5000, 'level',        25),
('First Week',         'Complete deeds for 7 consecutive days.',              '📅', 'common',    null,         150,  'streak',       7),
('XP Hunter',          'Earn 10,000 total XP.',                               '💫', 'common',    null,         300,  'total_xp',     10000),
('Worshipper',         'Complete 50 worship deeds.',                          '🌿', 'rare',      'worship',    600,  'branch_deeds', 50),
('Knowledge Seeker',   'Complete 25 knowledge deeds.',                        '📖', 'common',    'knowledge',  250,  'branch_deeds', 25),
('Disciplined One',    'Complete 25 discipline deeds.',                       '💪', 'common',    'discipline', 250,  'branch_deeds', 25);
