-- Migration: Seed Ramayana Quiz Questions
-- Description: Adds 'Ramayana' category and 50 questions
-- Date: 2025-12-06

-- ============================================
-- Seed Ramayana Category
-- ============================================
INSERT INTO quiz_categories (name_hindi, name_english, description_hindi, description_english, icon, question_count, display_order)
VALUES (
  'रामायण',
  'Ramayana',
  'रामायण की कहानी, पात्रों और घटनाओं के बारे में अपने ज्ञान का परीक्षण करें',
  'Test your knowledge about the story, characters and events from the Ramayana',
  '🏹',
  50,
  2
);

-- ============================================
-- Seed Ramayana Questions
-- ============================================

-- Q1
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रामायण के रचयिता कौन हैं?',
  'Who is the author of the Ramayana?',
  '{"hindi": ["वाल्मीकि", "व्यास", "तुलसीदास", "कौटिल्य"], "english": ["Valmiki", "Vyasa", "Tulsidas", "Kautilya"]}',
  0,
  1
);

-- Q2
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रामायण के राजकुमार और नायक कौन हैं?',
  'Who is the prince and protagonist of Ramayana?',
  '{"hindi": ["राम", "लक्ष्मण", "भरत", "शत्रुघ्न"], "english": ["Rama", "Lakshmana", "Bharata", "Shatrughna"]}',
  0,
  2
);

-- Q3
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम की पत्नी कौन हैं?',
  'Who is Rama''s wife?',
  '{"hindi": ["सीता", "तारा", "मंदोदरी", "कैकेयी"], "english": ["Sita", "Tara", "Mandodari", "Kaikeyi"]}',
  0,
  3
);

-- Q4
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'सीता का अपहरण किसने किया?',
  'Who abducted Sita?',
  '{"hindi": ["रावण", "सूर्पणखा", "विभीषण", "मारीच"], "english": ["Ravana", "Surpanakha", "Vibhishana", "Maricha"]}',
  0,
  4
);

-- Q5
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लौटने के बाद राम ने किस राज्य पर शासन किया?',
  'Which kingdom did Rama rule after return?',
  '{"hindi": ["अयोध्या", "लंका", "किष्किंधा", "मिथिला"], "english": ["Ayodhya", "Lanka", "Kishkindha", "Mithila"]}',
  0,
  5
);

-- Q6
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम का वफादार भाई कौन है जो उनके साथ वन जाता है?',
  'Who is Rama''s loyal brother who accompanies him to the forest?',
  '{"hindi": ["लक्ष्मण", "भरत", "शत्रुघ्न", "हनुमान"], "english": ["Lakshmana", "Bharata", "Shatrughna", "Hanuman"]}',
  0,
  6
);

-- Q7
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम के वानर भक्त और दूत कौन हैं?',
  'Who is the monkey-devotee and messenger of Rama?',
  '{"hindi": ["सुग्रीव", "ऋष्यशृंग", "हनुमान", "अंगद"], "english": ["Sugriva", "Rishyasringa", "Hanuman", "Angada"]}',
  2,
  7
);

-- Q8
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लंका का राजा कौन बनता है और बाद में राम के साथ गठबंधन करता है?',
  'Who becomes king of Lanka and later allies with Rama?',
  '{"hindi": ["मारीच", "विभीषण", "कुंभकर्ण", "इंद्रजीत"], "english": ["Maricha", "Vibhishana", "Kumbhakarna", "Indrajit"]}',
  1,
  8
);

-- Q9
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम किस वंश के राजकुमार हैं?',
  'Rama is prince of which dynasty?',
  '{"hindi": ["कुरु", "इक्ष्वाकु (सूर्यवंश)", "पांडु", "चंद्र"], "english": ["Kuru", "Ikshvaku (Suryavansha)", "Pandu", "Chandra"]}',
  1,
  9
);

-- Q10
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किष्किंधा का राजा कौन है जो राम की मदद करता है?',
  'Who is the king of Kishkindha who helps Rama?',
  '{"hindi": ["सुग्रीव", "वाली", "अंगद", "जाम्बवन"], "english": ["Sugriva", "Vali", "Angada", "Jambavan"]}',
  0,
  10
);

-- Q11
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रावण का शक्तिशाली दानव भाई कौन था जो लंबी अवधि तक सोता था?',
  'Who was the powerful demon brother of Ravana who slept for long periods?',
  '{"hindi": ["कुंभकर्ण", "इंद्रजीत", "मारीच", "विभीषण"], "english": ["Kumbhakarna", "Indrajit", "Maricha", "Vibhishana"]}',
  0,
  11
);

-- Q12
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम की माता कौन हैं?',
  'Who is the mother of Rama?',
  '{"hindi": ["कौशल्या", "कैकेयी", "सुमित्रा", "सीता"], "english": ["Kaushalya", "Kaikeyi", "Sumitra", "Sita"]}',
  0,
  12
);

-- Q13
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम के पिता कौन थे?',
  'Who was the father of Rama?',
  '{"hindi": ["दशरथ", "दशरथ (वैकल्पिक वर्तनी)", "रघु", "जनक"], "english": ["Dasharatha", "Dasaratha (alt spelling)", "Raghu", "Janaka"]}',
  0,
  13
);

-- Q14
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रावण को हराने के लिए राम ने किस पवित्र शस्त्र का प्रयोग किया?',
  'Which sacred weapon did Rama use to defeat Ravana (traditional epic)?',
  '{"hindi": ["ब्रह्मास्त्र", "विष्णु का दिव्य बाण", "सुदर्शन", "कोई विशिष्ट शस्त्र नहीं"], "english": ["Brahmastra", "Divine arrow from Vishnu", "Sudarshana", "No specific weapon"]}',
  1,
  14
);

-- Q15
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किस ऋषि ने सीता को आश्रय दिया?',
  'Which sage found and raised Sita?',
  '{"hindi": ["वाल्मीकि", "वशिष्ठ", "भारद्वाज", "अगस्त्य"], "english": ["Valmiki", "Vashistha", "Bharadwaja", "Agastya"]}',
  0,
  15
);

-- Q16
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'वह रानी कौन है जिसने वरदान मांगकर राम के वनवास की मांग की?',
  'Who is the queen that asked for Rama''s exile by invoking a boon?',
  '{"hindi": ["कैकेयी", "कौशल्या", "सुमित्रा", "सीता"], "english": ["Kaikeyi", "Kaushalya", "Sumitra", "Sita"]}',
  0,
  16
);

-- Q17
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रावण का वह पुत्र कौन है जो युद्ध में वीरता से लड़ा?',
  'Who is the son of Ravana who fought valiantly in the war?',
  '{"hindi": ["इंद्रजीत (मेघनाद)", "अतिकाय", "अक्षयकुमार", "कुंभकर्ण"], "english": ["Indrajit (Meghnad)", "Atikaya", "Akshayakumara", "Kumbhakarna"]}',
  0,
  17
);

-- Q18
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किस पक्षी ने संदेश ले जाकर और टोह लेकर राम की सेना की मदद की?',
  'Which bird helped Rama''s army by carrying messages and scouting?',
  '{"hindi": ["जटायु", "गरुड़", "हनुमान", "संपाति"], "english": ["Jatayu", "Garuda", "Hanuman", "Sampati"]}',
  3,
  18
);

-- Q19
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'वह समर्पित भालू बुजुर्ग कौन है जिसने सुग्रीव और राम को सलाह दी?',
  'Who is the devoted bear elder who advised Sugriva and Rama?',
  '{"hindi": ["जाम्बवन", "सुग्रीव", "अंगद", "विभीषण"], "english": ["Jambavan", "Sugriva", "Angada", "Vibhishana"]}',
  0,
  19
);

-- Q20
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'कौन सा वीर वानर राजकुमार वाली का पुत्र है?',
  'Which heroic monkey prince is son of Vali?',
  '{"hindi": ["अंगद", "हनुमान", "सुग्रीव", "नल"], "english": ["Angada", "Hanuman", "Sugriva", "Nala"]}',
  0,
  20
);

-- Q21
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'मिथिला के राजा (सीता के पिता) कौन हैं?',
  'Who is the king of Mithila (Sita''s father)?',
  '{"hindi": ["जनक", "दशरथ", "रघु", "विश्वामित्र"], "english": ["Janaka", "Dasharatha", "Raghu", "Vishwamitra"]}',
  0,
  21
);

-- Q22
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'सीता और राम कहाँ मिले (सीता का स्वयंवर स्थान)?',
  'Where did Sita and Rama meet (Sita''s swayamvara location)?',
  '{"hindi": ["अयोध्या", "मिथिला", "किष्किंधा", "लंका"], "english": ["Ayodhya", "Mithila", "Kishkindha", "Lanka"]}',
  1,
  22
);

-- Q23
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'वे ऋषि कौन हैं जिन्होंने राम और लक्ष्मण का मार्गदर्शन किया?',
  'Who is the sage who guided Rama and Lakshmana and set events in motion (taught warfare)?',
  '{"hindi": ["विश्वामित्र", "वशिष्ठ", "भारद्वाज", "वाल्मीकि"], "english": ["Vishwamitra", "Vashistha", "Bharadwaja", "Valmiki"]}',
  0,
  23
);

-- Q24
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किस राक्षसी ने राम को लुभाने की कोशिश की और बाद में लक्ष्मण द्वारा विरूपित कर दी गई?',
  'Which demoness tried to seduce Rama and was later mutilated by Lakshmana?',
  '{"hindi": ["सूर्पणखा", "ताड़का", "शूर्पणखा (समान)", "त्रिजटा"], "english": ["Surpanakha", "Tataka", "Shurpanakha (same)", "Trijata"]}',
  0,
  24
);

-- Q25
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किस जानवर ने पुल बनाकर राम को सागर पार करने में मदद की?',
  'What animal helped Rama cross the ocean to Lanka by building a bridge?',
  '{"hindi": ["वानर और भालू (वानर सेना)", "हाथी", "मछली", "गरुड़"], "english": ["Monkeys & bears (Vanara army)", "Elephants", "Fish", "Garuda"]}',
  0,
  25
);

-- Q26
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लंका तक बनाए गए पुल का नाम क्या है?',
  'What is the name of the bridge built to Lanka?',
  '{"hindi": ["राम सेतु / एडम ब्रिज", "नल सेतु", "वानर सेतु", "विष्णु सेतु"], "english": ["Rama Setu / Adam''s Bridge", "Nala Setu", "Vanara Setu", "Vishnu Setu"]}',
  0,
  26
);

-- Q27
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम का वह पुत्र और महान धनुर्धर कौन था जो बाद की कहानियों में लड़ा?',
  'Who was the great archer and son of Rama who fought in some later versions (or Ramavatar stories)?',
  '{"hindi": ["लव", "कुश", "भरत", "शत्रुघ्न"], "english": ["Lava", "Kusha", "Bharata", "Shatrughna"]}',
  0,
  27
);

-- Q28
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लक्ष्मण और शत्रुघ्न की माता कौन थीं?',
  'Who was the mother of Lakshmana and Shatrughna (Dasharatha''s other wives)?',
  '{"hindi": ["सुमित्रा", "कौशल्या", "कैकेयी", "सीता"], "english": ["Sumitra", "Kaushalya", "Kaikeyi", "Sita"]}',
  0,
  28
);

-- Q29
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लंका में सीता को ढूंढकर राम की मदद किसने की?',
  'Who aided Rama by finding Sita in Lanka and bringing her message to Rama (search party leader)?',
  '{"hindi": ["हनुमान", "सुग्रीव", "जाम्बवन", "अंगद"], "english": ["Hanuman", "Sugriva", "Jambavan", "Angada"]}',
  0,
  29
);

-- Q30
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किसे ''वानर'' सेनापति कहा जाता है जो वफादारी के लिए जाना जाता था?',
  'Who is called the ''vanara'' commander who led troops and was known for loyalty?',
  '{"hindi": ["अंगद", "विभीषण", "जटायु", "मारीच"], "english": ["Angada", "Vibhishana", "Jatayu", "Maricha"]}',
  0,
  30
);

-- Q31
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लंका में सीता की राक्षसी संरक्षक कौन थी, जिसे अक्सर सीता के प्रति दयालु दिखाया जाता है?',
  'Who was the demoness guardian of Sita in Lanka (consoled her), often shown compassionate to Sita?',
  '{"hindi": ["त्रिजटा", "सूर्पणखा", "मंदोदरी", "तारा"], "english": ["Trijata", "Surpanakha", "Mandodari", "Tara"]}',
  0,
  31
);

-- Q32
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम के वनवास के दौरान अयोध्या पर किस भाई ने शासन किया?',
  'Which brother of Rama ruled Ayodhya while Rama was in exile (ruler at home)?',
  '{"hindi": ["भरत (परीजक के रूप में)", "लक्ष्मण", "शत्रुघ्न", "कोई नहीं"], "english": ["Bharata (as regent)", "Lakshmana", "Shatrughna", "None"]}',
  0,
  32
);

-- Q33
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किसने सिंहासन पर बैठने से इनकार कर दिया और राम की खड़ाऊँ रखीं?',
  'Who refused to sit on the throne and instead placed Rama''s sandals on it until Rama returned?',
  '{"hindi": ["भरत", "लक्ष्मण", "शत्रुघ्न", "विभीषण"], "english": ["Bharata", "Lakshmana", "Shatrughna", "Vibhishana"]}',
  0,
  33
);

-- Q34
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रावण की पत्नी और लंका की रानी कौन है?',
  'Who is Ravana''s wife and queen of Lanka?',
  '{"hindi": ["मंदोदरी", "तारा", "त्रिजटा", "शूर्पणखा"], "english": ["Mandodari", "Tara", "Trijata", "Shurpanakha"]}',
  0,
  34
);

-- Q35
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'बचाव के बाद सीता ने अपनी पवित्रता साबित करने के लिए कौन सी परीक्षा दी?',
  'What test did Sita undergo to prove her purity after rescue?',
  '{"hindi": ["अग्नि परीक्षा", "जल परीक्षा", "मौन व्रत", "पौधे की परीक्षा"], "english": ["Agni Pariksha (trial by fire)", "Ordeal by water", "Silence vow", "Plant test"]}',
  0,
  35
);

-- Q36
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम और सीता का छोटा पुत्र कौन है?',
  'Who is the younger son of Rama and Sita who later appears in many tellings along with his twin?',
  '{"hindi": ["कुश", "लव", "अंगद", "नल"], "english": ["Kusha", "Lava", "Angada", "Nala"]}',
  0,
  36
);

-- Q37
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'दूसरा जुड़वां (कुश का भाई) कौन है?',
  'Who is the other twin (brother of Kusha)?',
  '{"hindi": ["लव", "कुश (वैकल्पिक)", "सुषेण", "सुमित्रा"], "english": ["Lava", "Kusa (alt)", "Sushena", "Sumitra"]}',
  0,
  37
);

-- Q38
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'शूर्पणखा की नाक किसने काटी जिससे संघर्ष बढ़ गया?',
  'Who cut off the nose of Shurpanakha leading to escalation of conflict?',
  '{"hindi": ["लक्ष्मण", "राम", "हनुमान", "सुग्रीव"], "english": ["Lakshmana", "Rama", "Hanuman", "Sugriva"]}',
  0,
  38
);

-- Q39
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'वह महान भक्त और पर्वत पर रहने वाला वानर कौन था जिसने शुरू में राम की मदद की?',
  'Who was the great devotee and mountain-dwelling vanara who initially helped Rama (elder)?',
  '{"hindi": ["जाम्बवन", "नल", "नील", "वाली"], "english": ["Jambavan", "Nala", "Nila", "Vali"]}',
  0,
  39
);

-- Q40
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम की सेना का सेनापति कौन था?',
  'Who was the commander of Rama''s forces that later fought on battlefield alongside monkeys and bears?',
  '{"hindi": ["सुग्रीव", "अंगद", "हनुमान", "जाम्बवन"], "english": ["Sugriva", "Angada", "Hanuman", "Jambavan"]}',
  1,
  40
);

-- Q41
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लंका के लिए पत्थरों के पुल को जोड़ने के लिए कौन सा पात्र प्रसिद्ध है?',
  'Which character is famous for forging the link-bridge stones to Lanka (in mythic tale)?',
  '{"hindi": ["नल (वानर इंजीनियर)", "नील", "अंगद", "जाम्बवन"], "english": ["Nala (Vanara engineer)", "Nila", "Angada", "Jambavan"]}',
  0,
  41
);

-- Q42
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'मायावी युद्ध के लिए प्रसिद्ध रावण का पुत्र कौन था?',
  'Who was the son of Ravana famed for magical warfare and named Indrajit?',
  '{"hindi": ["मेघनाद (इंद्रजीत)", "अतिकाय", "अक्षयकुमार", "कुंभकर्ण"], "english": ["Meghnad (Indrajit)", "Atikaya", "Akshayakumara", "Kumbhakarna"]}',
  0,
  42
);

-- Q43
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'किसने रावण को सलाह दी लेकिन बाद में राम के पक्ष में चला गया?',
  'Who advised Ravana but later deserted him for Rama''s side?',
  '{"hindi": ["विभीषण", "कुंभकर्ण", "मारीच", "सूर्पणखा"], "english": ["Vibhishana", "Kumbhakarna", "Maricha", "Surpanakha"]}',
  0,
  43
);

-- Q44
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम वन में सबसे पहले किससे मिले जो वनवास के दौरान उनके शिक्षक और मार्गदर्शक बने?',
  'Who did Rama first meet in the forest who became his teacher and guide during exile?',
  '{"hindi": ["विश्वामित्र", "वाली", "सुग्रीव", "भारद्वाज"], "english": ["Vishwamitra", "Vali", "Sugriva", "Bharadwaja"]}',
  0,
  44
);

-- Q45
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'लौटने के बाद राम और सीता के कौन से दो पुत्र थे?',
  'Which two sons did Rama and Sita have after they returned? (choose the pair)',
  '{"hindi": ["लव और कुश", "राम जूनियर और कुश", "लव और अंगद", "कुश और अंगद"], "english": ["Lava & Kusha", "Rama Jr & Kusha", "Lava & Angada", "Kusha & Angada"]}',
  0,
  45
);

-- Q46
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'राम के वंश से जुड़े कई बाद के वृत्तांतों में अश्वमेध यज्ञ किसने किया?',
  'Who performed the horse sacrifice (Ashwamedha) in many later retellings involving Rama’s lineage?',
  '{"hindi": ["राम या उनके उत्तराधिकारी (अश्वमेध)", "भरत", "शत्रुघ्न", "कोई नहीं"], "english": ["Rama or his successors (Ashwamedha)", "Bharata", "Shatrughna", "No one"]}',
  0,
  46
);

-- Q47
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'मुख्य महाकाव्य परंपरा के अनुसार राम ने कितने दिन वनवास में बिताए?',
  'How many days did Rama spend in exile according to the main epic tradition (varies by telling)?',
  '{"hindi": ["14 वर्ष", "7 वर्ष", "12 वर्ष", "10 वर्ष"], "english": ["14 years", "7 years", "12 years", "10 years"]}',
  0,
  47
);

-- Q48
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'मारीच को किसने मारा?',
  'Who killed Maricha (who disguised as a golden deer)?',
  '{"hindi": ["लक्ष्मण", "राम", "भागते समय मारीच की मृत्यु राम के बाण से हुई", "हनुमान"], "english": ["Lakshmana", "Rama", "Maricha died by Rama''s arrow while escaping; Rama", "Hanuman"]}',
  2,
  48
);

-- Q49
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'सुग्रीव का बड़ा भाई कौन था जिसे राम ने हराने में मदद की?',
  'Who was the elder brother of Sugriva whom Rama helped defeat (and later died)?',
  '{"hindi": ["वाली", "अंगद", "नल", "नील"], "english": ["Vali", "Angada", "Nala", "Nila"]}',
  0,
  49
);

-- Q50
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Ramayana'),
  'रावण किस राज्य का राजा था?',
  'Ravana was king of which kingdom?',
  '{"hindi": ["लंका", "अयोध्या", "किष्किंधा", "मिथिला"], "english": ["Lanka", "Ayodhya", "Kishkindha", "Mithila"]}',
  0,
  50
);
