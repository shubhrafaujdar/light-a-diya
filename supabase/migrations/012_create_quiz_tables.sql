-- Migration: Create Quiz Tables and Seed Mahabharata Questions
-- Description: Creates quiz_categories and quiz_questions tables with multilingual support
-- Date: 2025-12-06

-- ============================================
-- Create quiz_categories table
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_hindi TEXT NOT NULL,
  name_english TEXT NOT NULL,
  description_hindi TEXT,
  description_english TEXT,
  icon TEXT,
  question_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Create quiz_questions table
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES quiz_categories(id) ON DELETE CASCADE,
  question_text_hindi TEXT NOT NULL,
  question_text_english TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL CHECK (correct_answer_index >= 0 AND correct_answer_index < 4),
  explanation_hindi TEXT,
  explanation_english TEXT,
  difficulty_level TEXT DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category_id ON quiz_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_display_order ON quiz_questions(display_order);
CREATE INDEX IF NOT EXISTS idx_quiz_categories_display_order ON quiz_categories(display_order);

-- ============================================
-- Seed Mahabharata Category
-- ============================================
INSERT INTO quiz_categories (name_hindi, name_english, description_hindi, description_english, icon, question_count, display_order)
VALUES (
  'महाभारत',
  'Mahabharata',
  'महाकाव्य महाभारत के बारे में अपने ज्ञान का परीक्षण करें',
  'Test your knowledge about the epic Mahabharata',
  '📖',
  50,
  1
);

-- ============================================
-- Seed 50 Mahabharata Questions
-- ============================================

-- Question 1
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'महाभारत के रचयिता कौन हैं?',
  'Who is the author of the Mahabharata?',
  '{"hindi": ["वाल्मीकि", "वेद व्यास", "तुलसीदास", "कालिदास"], "english": ["Valmiki", "Ved Vyasa", "Tulsidas", "Kalidasa"]}',
  1,
  1
);

-- Question 2
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'सबसे बड़े पांडव कौन थे?',
  'Who was the eldest Pandava?',
  '{"hindi": ["भीम", "युधिष्ठिर", "अर्जुन", "नकुल"], "english": ["Bhima", "Yudhishthira", "Arjuna", "Nakula"]}',
  1,
  2
);

-- Question 3
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौरवों की माता कौन थीं?',
  'Who was the mother of the Kauravas?',
  '{"hindi": ["कुंती", "गांधारी", "माद्री", "देवकी"], "english": ["Kunti", "Gandhari", "Madri", "Devaki"]}',
  1,
  3
);

-- Question 4
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अर्जुन के प्रसिद्ध धनुष का नाम क्या था?',
  'What was the name of Arjuna''s famous bow?',
  '{"hindi": ["गांडीव", "शारंग", "पिनाक", "कोदंड"], "english": ["Gandiva", "Sharanga", "Pinaka", "Kodanda"]}',
  0,
  4
);

-- Question 5
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'महाभारत का युद्ध किस युद्धक्षेत्र में लड़ा गया था?',
  'In which battlefield was the Mahabharata war fought?',
  '{"hindi": ["कुरुक्षेत्र", "हस्तिनापुर", "पांचाल", "मथुरा"], "english": ["Kurukshetra", "Hastinapura", "Panchala", "Mathura"]}',
  0,
  5
);

-- Question 6
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौरवों और पांडवों दोनों के गुरु कौन थे?',
  'Who was the teacher of both Kauravas and Pandavas?',
  '{"hindi": ["कृपाचार्य", "द्रोण", "परशुराम", "व्यास"], "english": ["Kripacharya", "Drona", "Parashurama", "Vyasa"]}',
  1,
  6
);

-- Question 7
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'किसने कभी सिंहासन पर न बैठने और ब्रह्मचारी रहने की प्रतिज्ञा ली थी?',
  'Who took a vow to never sit on a throne and remain celibate?',
  '{"hindi": ["कृष्ण", "विदुर", "भीष्म", "शांतनु"], "english": ["Krishna", "Vidura", "Bhishma", "Shantanu"]}',
  2,
  7
);

-- Question 8
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अर्जुन की माता कौन थीं?',
  'Who was the mother of Arjuna?',
  '{"hindi": ["कुंती", "गांधारी", "माद्री", "सत्यवती"], "english": ["Kunti", "Gandhari", "Madri", "Satyavati"]}',
  0,
  8
);

-- Question 9
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'भीम की घातक गदा का नाम क्या था?',
  'What was the name of Bhima''s deadly mace?',
  '{"hindi": ["कौमोदकी", "गदा", "वज्र", "शक्ति"], "english": ["Kaumodaki", "Gada", "Vajra", "Shakti"]}',
  1,
  9
);

-- Question 10
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'निम्नलिखित में से कौन अपने अद्वितीय धनुर्विद्या कौशल के लिए जाना जाता था?',
  'Who among the following was known for his unmatched archery skills?',
  '{"hindi": ["भीम", "दुर्योधन", "अर्जुन", "शकुनि"], "english": ["Bhima", "Duryodhana", "Arjuna", "Shakuni"]}',
  2,
  10
);

-- Question 11
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कर्ण के पिता कौन थे?',
  'Who was the father of Karna?',
  '{"hindi": ["पांडु", "सूर्य", "इंद्र", "कृष्ण"], "english": ["Pandu", "Surya", "Indra", "Krishna"]}',
  1,
  11
);

-- Question 12
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौन सा पांडव गदा युद्ध में विशेषज्ञता के लिए जाना जाता था?',
  'Which Pandava was known for his expertise in mace fighting?',
  '{"hindi": ["युधिष्ठिर", "भीम", "अर्जुन", "सहदेव"], "english": ["Yudhishthira", "Bhima", "Arjuna", "Sahadeva"]}',
  1,
  12
);

-- Question 13
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौरव सभा में द्रौपदी को निर्वस्त्र करने का प्रयास किसने किया?',
  'Who tried to disrobe Draupadi in the Kaurava court?',
  '{"hindi": ["कर्ण", "दुःशासन", "अश्वत्थामा", "शकुनि"], "english": ["Karna", "Dushasana", "Ashwatthama", "Shakuni"]}',
  1,
  13
);

-- Question 14
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'निर्वस्त्र करने की घटना के दौरान द्रौपदी को किसने बचाया?',
  'Who saved Draupadi during the disrobing incident?',
  '{"hindi": ["भीम", "युधिष्ठिर", "कृष्ण", "विदुर"], "english": ["Bhima", "Yudhishthira", "Krishna", "Vidura"]}',
  2,
  14
);

-- Question 15
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'द्रौपदी के कितने पुत्र थे?',
  'How many sons did Draupadi have?',
  '{"hindi": ["3", "5", "10", "1"], "english": ["3", "5", "10", "1"]}',
  1,
  15
);

-- Question 16
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'सबसे बड़ा कौरव कौन था?',
  'Who was the eldest Kaurava?',
  '{"hindi": ["दुःशासन", "कर्ण", "शकुनि", "दुर्योधन"], "english": ["Dushasana", "Karna", "Shakuni", "Duryodhana"]}',
  3,
  16
);

-- Question 17
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'भीष्म को किसने मारा?',
  'Who killed Bhishma?',
  '{"hindi": ["अर्जुन", "शिखंडी और अर्जुन", "भीम", "युधिष्ठिर"], "english": ["Arjuna", "Shikhandi with Arjuna", "Bhima", "Yudhishthira"]}',
  1,
  17
);

-- Question 18
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'दुर्योधन को किसने मारा?',
  'Who killed Duryodhana?',
  '{"hindi": ["अर्जुन", "भीम", "कर्ण", "धृतराष्ट्र"], "english": ["Arjuna", "Bhima", "Karna", "Dhritarashtra"]}',
  1,
  18
);

-- Question 19
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कृष्ण के सारथी के रूप में किसने सेवा की?',
  'Who served as Krishna''s charioteer?',
  '{"hindi": ["अर्जुन", "भीष्म", "युधिष्ठिर", "किसी ने उनकी सेवा नहीं की"], "english": ["Arjuna", "Bhishma", "Yudhishthira", "No one served him"]}',
  3,
  19
);

-- Question 20
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कृष्ण द्वारा अर्जुन को सुनाए गए पवित्र ग्रंथ का नाम क्या है?',
  'What is the name of the sacred text spoken by Krishna to Arjuna?',
  '{"hindi": ["रामायण", "वेद", "भगवद गीता", "उपनिषद"], "english": ["Ramayana", "Vedas", "Bhagavad Gita", "Upanishads"]}',
  2,
  20
);

-- Question 21
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'युद्ध से पहले हस्तिनापुर के राजा कौन थे?',
  'Who was the king of Hastinapura before the war?',
  '{"hindi": ["पांडु", "धृतराष्ट्र", "शांतनु", "युधिष्ठिर"], "english": ["Pandu", "Dhritarashtra", "Shantanu", "Yudhishthira"]}',
  1,
  21
);

-- Question 22
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'पासे के खेल के मास्टरमाइंड का नाम क्या था?',
  'What was the name of the dice game mastermind?',
  '{"hindi": ["कर्ण", "अश्वत्थामा", "शकुनि", "विदुर"], "english": ["Karna", "Ashwatthama", "Shakuni", "Vidura"]}',
  2,
  22
);

-- Question 23
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौन सा पांडव ज्ञान के लिए जाना जाता था?',
  'Which Pandava was known for wisdom?',
  '{"hindi": ["अर्जुन", "भीम", "युधिष्ठिर", "सहदेव"], "english": ["Arjuna", "Bhima", "Yudhishthira", "Sahadeva"]}',
  2,
  23
);

-- Question 24
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'महाभारत युद्ध की अवधि क्या थी?',
  'What was the duration of the Mahabharata war?',
  '{"hindi": ["7 दिन", "18 दिन", "30 दिन", "1 वर्ष"], "english": ["7 days", "18 days", "30 days", "1 year"]}',
  1,
  24
);

-- Question 25
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कर्ण को किसने मारा?',
  'Who killed Karna?',
  '{"hindi": ["भीम", "अर्जुन", "शिखंडी", "अभिमन्यु"], "english": ["Bhima", "Arjuna", "Shikhandi", "Abhimanyu"]}',
  1,
  25
);

-- Question 26
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'दुर्योधन की जांघ किसने तोड़ी?',
  'Who broke Duryodhana''s thigh?',
  '{"hindi": ["अर्जुन", "भीम", "कृष्ण", "कर्ण"], "english": ["Arjuna", "Bhima", "Krishna", "Karna"]}',
  1,
  26
);

-- Question 27
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अभिमन्यु किस पांडव का पुत्र था?',
  'Abhimanyu was the son of which Pandava?',
  '{"hindi": ["भीम", "युधिष्ठिर", "अर्जुन", "सहदेव"], "english": ["Bhima", "Yudhishthira", "Arjuna", "Sahadeva"]}',
  2,
  27
);

-- Question 28
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अभिमन्यु को किसने मारा?',
  'Who killed Abhimanyu?',
  '{"hindi": ["एक योद्धा", "द्रोणाचार्य", "कर्ण", "कई योद्धाओं का समूह"], "english": ["One warrior", "Dronacharya", "Karna", "A group of many warriors"]}',
  3,
  28
);

-- Question 29
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'धर्म के पुत्र के रूप में किसे जाना जाता था?',
  'Who was known as the son of Dharma?',
  '{"hindi": ["भीम", "अर्जुन", "युधिष्ठिर", "नकुल"], "english": ["Bhima", "Arjuna", "Yudhishthira", "Nakula"]}',
  2,
  29
);

-- Question 30
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'शिखंडी पूर्व जन्म में कौन थे?',
  'Who was Shikhandi in a previous birth?',
  '{"hindi": ["अंबा", "अंबिका", "अंबालिका", "सत्यवती"], "english": ["Amba", "Ambika", "Ambalika", "Satyavati"]}',
  0,
  30
);

-- Question 31
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'भीष्म की माता कौन थीं?',
  'Who was the mother of Bhishma?',
  '{"hindi": ["गंगा", "सत्यवती", "अंबिका", "अंबालिका"], "english": ["Ganga", "Satyavati", "Ambika", "Ambalika"]}',
  0,
  31
);

-- Question 32
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'धृतराष्ट्र के सलाहकार जो सत्य बोलने के लिए जाने जाते थे, कौन थे?',
  'Who was Dhritarashtra''s advisor known for speaking truth?',
  '{"hindi": ["कर्ण", "विदुर", "शकुनि", "कृपा"], "english": ["Karna", "Vidura", "Shakuni", "Kripa"]}',
  1,
  32
);

-- Question 33
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अर्जुन के सारथी कौन थे?',
  'Who was the charioteer of Arjuna?',
  '{"hindi": ["भीम", "कृष्ण", "युधिष्ठिर", "सहदेव"], "english": ["Bhima", "Krishna", "Yudhishthira", "Sahadeva"]}',
  1,
  33
);

-- Question 34
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'एकमात्र योद्धा जो अर्जुन को हरा सकता था लेकिन कभी नहीं हराया, कौन था?',
  'Who was the only warrior who could defeat Arjuna but never did?',
  '{"hindi": ["कर्ण", "भीम", "द्रोण", "द्रुपद"], "english": ["Karna", "Bhima", "Drona", "Drupada"]}',
  0,
  34
);

-- Question 35
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'पहले दिन कौरव सेना के सेनापति कौन थे?',
  'Who was the commander of the Kaurava army on day 1?',
  '{"hindi": ["भीष्म", "द्रोण", "कर्ण", "कृपा"], "english": ["Bhishma", "Drona", "Karna", "Kripa"]}',
  0,
  35
);

-- Question 36
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अर्जुन के पुत्र का नाम क्या था जिसने उत्तरा से विवाह किया?',
  'What was the name of Arjuna''s son who married Uttara?',
  '{"hindi": ["अभिमन्यु", "इरावान", "घटोत्कच", "शतानीक"], "english": ["Abhimanyu", "Iravan", "Ghatotkacha", "Satanika"]}',
  0,
  36
);

-- Question 37
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'घटोत्कच को किसने मारा?',
  'Who killed Ghatotkacha?',
  '{"hindi": ["कर्ण", "भीम", "अर्जुन", "दुःशासन"], "english": ["Karna", "Bhima", "Arjuna", "Dushasana"]}',
  0,
  37
);

-- Question 38
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कौरव सेना के अंतिम सेनापति कौन थे?',
  'Who was the last commander of the Kaurava army?',
  '{"hindi": ["दुर्योधन", "द्रोण", "अश्वत्थामा", "कर्ण"], "english": ["Duryodhana", "Drona", "Ashwatthama", "Karna"]}',
  2,
  38
);

-- Question 39
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'दुःशासन को किसने मारा?',
  'Who killed Dushasana?',
  '{"hindi": ["अर्जुन", "भीम", "कर्ण", "द्रुपद"], "english": ["Arjuna", "Bhima", "Karna", "Drupada"]}',
  1,
  39
);

-- Question 40
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'पांडु के पिता कौन थे?',
  'Who was the father of Pandu?',
  '{"hindi": ["शांतनु", "व्यास", "धृतराष्ट्र", "सत्यवती"], "english": ["Shantanu", "Vyasa", "Dhritarashtra", "Satyavati"]}',
  1,
  40
);

-- Question 41
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अभिमन्यु की मृत्यु में जयद्रथ की भूमिका के बाद अर्जुन ने क्या प्रतिज्ञा ली?',
  'What vow did Arjuna take after Jayadratha''s role in Abhimanyu''s death?',
  '{"hindi": ["एक सप्ताह उपवास", "सूर्यास्त से पहले जयद्रथ को मारना", "युद्धक्षेत्र छोड़ना", "कौरवों को नष्ट करना"], "english": ["Fast for a week", "Kill Jayadratha before sunset", "Leave the battlefield", "Destroy the Kauravas"]}',
  1,
  41
);

-- Question 42
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'जयद्रथ को किसने मारा?',
  'Who killed Jayadratha?',
  '{"hindi": ["भीम", "अर्जुन", "सहदेव", "नकुल"], "english": ["Bhima", "Arjuna", "Sahadeva", "Nakula"]}',
  1,
  42
);

-- Question 43
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'नकुल और सहदेव की माता कौन थीं?',
  'Who was the mother of Nakula and Sahadeva?',
  '{"hindi": ["कुंती", "माद्री", "गांधारी", "सत्यवती"], "english": ["Kunti", "Madri", "Gandhari", "Satyavati"]}',
  1,
  43
);

-- Question 44
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'द्वारका के शासक कौन थे?',
  'Who was the ruler of Dwarka?',
  '{"hindi": ["बलराम", "कृष्ण", "शिशुपाल", "कंस"], "english": ["Balarama", "Krishna", "Shishupala", "Kansa"]}',
  1,
  44
);

-- Question 45
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'द्रुपद को किसने मारा?',
  'Who killed Drupada?',
  '{"hindi": ["द्रोण", "अश्वत्थामा", "अर्जुन", "भीम"], "english": ["Drona", "Ashwatthama", "Arjuna", "Bhima"]}',
  1,
  45
);

-- Question 46
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'अश्वत्थामा को पृथ्वी पर हमेशा के लिए भटकने का श्राप किसने दिया?',
  'Who cursed Ashwatthama to roam the earth forever?',
  '{"hindi": ["कृष्ण", "द्रौपदी", "अर्जुन", "युधिष्ठिर"], "english": ["Krishna", "Draupadi", "Arjuna", "Yudhishthira"]}',
  0,
  46
);

-- Question 47
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'घटोत्कच के पिता कौन थे?',
  'Who was the father of Ghatotkacha?',
  '{"hindi": ["अर्जुन", "भीम", "युधिष्ठिर", "कृष्ण"], "english": ["Arjuna", "Bhima", "Yudhishthira", "Krishna"]}',
  1,
  47
);

-- Question 48
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'किस पांडव ने हिडिम्बा से विवाह किया?',
  'Which Pandava married Hidimba?',
  '{"hindi": ["अर्जुन", "भीम", "युधिष्ठिर", "नकुल"], "english": ["Arjuna", "Bhima", "Yudhishthira", "Nakula"]}',
  1,
  48
);

-- Question 49
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'किस पांडव ने हिडिम्बा से विवाह किया?',
  'Which Pandava married Hidimba?',
  '{"hindi": ["अर्जुन", "भीम", "युधिष्ठिर", "नकुल"], "english": ["Arjuna", "Bhima", "Yudhishthira", "Nakula"]}',
  1,
  49
);

-- Question 50
INSERT INTO quiz_questions (category_id, question_text_hindi, question_text_english, options, correct_answer_index, display_order)
VALUES (
  (SELECT id FROM quiz_categories WHERE name_english = 'Mahabharata'),
  'कितने कौरव थे?',
  'How many Kauravas were there?',
  '{"hindi": ["100", "99", "101", "50"], "english": ["100", "99", "101", "50"]}',
  0,
  50
);
