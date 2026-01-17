-- Test blueprint oluşturma script'i
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- Önce bir test kullanıcısının ID'sini alın (mevcut bir kullanıcı ID'si kullanın)
-- Bu örnekte, profiles tablosundan bir kullanıcı ID'si alıyoruz

INSERT INTO blueprints (
  id,
  user_id,
  title,
  description,
  category,
  is_public,
  is_approved,
  tasks,
  clone_count,
  likes_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles LIMIT 1), -- İlk kullanıcının ID'sini al
  'Morning Productivity Routine',
  'A comprehensive morning routine to boost your productivity throughout the day',
  'productivity',
  true,
  true,
  '[
    {
      "title": "Wake up early",
      "description": "Set alarm for 6:00 AM",
      "priority": "high",
      "order": 0
    },
    {
      "title": "Drink water",
      "description": "Start with a glass of water",
      "priority": "medium",
      "order": 1
    },
    {
      "title": "Exercise",
      "description": "20 minutes of light exercise",
      "priority": "high",
      "order": 2
    },
    {
      "title": "Meditation",
      "description": "10 minutes of mindfulness",
      "priority": "medium",
      "order": 3
    },
    {
      "title": "Plan the day",
      "description": "Review tasks and priorities",
      "priority": "urgent",
      "order": 4
    }
  ]'::jsonb,
  0,
  0,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM profiles LIMIT 1),
  'Study Session Blueprint',
  'Effective study routine for focused learning',
  'study',
  true,
  true,
  '[
    {
      "title": "Prepare workspace",
      "description": "Clean and organize study area",
      "priority": "medium",
      "order": 0
    },
    {
      "title": "Review previous notes",
      "description": "Quick review of last session",
      "priority": "low",
      "order": 1
    },
    {
      "title": "Active study",
      "description": "45 minutes focused study",
      "priority": "urgent",
      "order": 2
    },
    {
      "title": "Take break",
      "description": "15 minutes rest",
      "priority": "medium",
      "order": 3
    },
    {
      "title": "Practice problems",
      "description": "Apply what you learned",
      "priority": "high",
      "order": 4
    }
  ]'::jsonb,
  5,
  3,
  NOW(),
  NOW()
);

-- Sonuçları kontrol et
SELECT 
  id,
  title,
  description,
  category,
  is_public,
  is_approved,
  clone_count,
  likes_count,
  jsonb_array_length(tasks) as task_count
FROM blueprints 
WHERE is_public = true
ORDER BY created_at DESC;