-- Optional example content only. Do not run this file for an empty production
-- course. Use /admin to create real lessons instead.

delete from lessons
where id in (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007'
);

delete from words
where id in (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005',
  '10000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000007'
);

with course_start as (
  select current_date::date as start_date
)
insert into lessons (
  id,
  day_number,
  title,
  description,
  unlock_date,
  video_url,
  personal_note
)
select
  lesson.id::uuid,
  lesson.day_number,
  lesson.title,
  lesson.description,
  course_start.start_date + lesson.day_offset,
  lesson.video_url,
  lesson.personal_note
from course_start
cross join (
  values
    ('00000000-0000-4000-8000-000000000001', 1, 0, '你好 — Hello', 'Your first tiny greeting.', '', 'First word planted. I am already proud of you.'),
    ('00000000-0000-4000-8000-000000000002', 2, 1, '谢谢 — Thank you', 'A sweet way to show gratitude.', '', 'Thank you for learning this with me.'),
    ('00000000-0000-4000-8000-000000000003', 3, 2, '再见 — Goodbye', 'A goodbye that feels like see you again.', '', 'Tiny lesson done, but never goodbye for long.'),
    ('00000000-0000-4000-8000-000000000004', 4, 3, '我 — I/me', 'A small word for yourself.', '', 'A sentence with your Chinese name in it looks extra pretty.'),
    ('00000000-0000-4000-8000-000000000005', 5, 4, '你 — You', 'A word for the person right in front of you.', '', 'This one is for you, obviously.'),
    ('00000000-0000-4000-8000-000000000006', 6, 5, '喜欢 — Like', 'Say what makes your heart light up.', '', 'A very useful word. I may have picked it on purpose.'),
    ('00000000-0000-4000-8000-000000000007', 7, 6, '奶茶 — Milk tea', 'Essential vocabulary for our next treat.', '', 'Lesson complete. Milk tea soon?')
) as lesson(id, day_number, day_offset, title, description, video_url, personal_note);

insert into words (
  id,
  hanzi,
  pinyin,
  english,
  part_of_speech,
  example_hanzi,
  example_pinyin,
  example_english,
  notes
)
values
  ('10000000-0000-4000-8000-000000000001', '你好', 'ni hao', 'hello', 'phrase', '你好，小羊。', 'Ni hao, Xiao Yang.', 'Hello, Xiao Yang.', 'A gentle, everyday greeting.'),
  ('10000000-0000-4000-8000-000000000002', '谢谢', 'xie xie', 'thank you', 'phrase', '谢谢你。', 'Xie xie ni.', 'Thank you.', 'Say it twice softly: xie xie.'),
  ('10000000-0000-4000-8000-000000000003', '再见', 'zai jian', 'goodbye', 'phrase', '明天再见。', 'Ming tian zai jian.', 'See you tomorrow.', 'Literally carries the feeling of seeing someone again.'),
  ('10000000-0000-4000-8000-000000000004', '我', 'wo', 'I / me', 'pronoun', '我是小羊。', 'Wo shi Xiao Yang.', 'I am Xiao Yang.', 'The third tone dips low before rising.'),
  ('10000000-0000-4000-8000-000000000005', '你', 'ni', 'you', 'pronoun', '你好吗？', 'Ni hao ma?', 'How are you?', 'Pairs with hao to make ni hao.'),
  ('10000000-0000-4000-8000-000000000006', '喜欢', 'xi huan', 'to like', 'verb', '我喜欢你。', 'Wo xi huan ni.', 'I like you.', 'A useful word for feelings, food, music, and tiny joys.'),
  ('10000000-0000-4000-8000-000000000007', '奶茶', 'nai cha', 'milk tea', 'noun', '我喜欢奶茶。', 'Wo xi huan nai cha.', 'I like milk tea.', 'Important vocabulary for excellent dates.');

insert into lesson_words (lesson_id, word_id)
values
  ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002'),
  ('00000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003'),
  ('00000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004'),
  ('00000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005'),
  ('00000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006'),
  ('00000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007');
