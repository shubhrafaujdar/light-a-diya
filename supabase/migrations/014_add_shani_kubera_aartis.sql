-- Add Shani and Kubera Deities and Aartis

-- Insert new deities
INSERT INTO public.deities (name_hindi, name_english, image_url, description_hindi, description_english, category) VALUES
(
    'श्री शनिदेव',
    'Lord Shani',
    '/images/deities/shani.png',
    'श्री शनिदेव न्याय और कर्मफल के देवता हैं। वे सूर्य देव और छाया के पुत्र हैं।',
    'Lord Shani is the dispenser of justice and karma. He is the son of Surya (Sun God) and Chhaya.',
    'major'
),
(
    'श्री कुबेर जी',
    'Lord Kubera',
    '/images/deities/kuber.png',
    'श्री कुबेर धन, समृद्धि और वैभव के देवता हैं। वे यक्षों के राजा हैं।',
    'Lord Kubera is the lord of wealth, prosperity, and glory. He is the king of Yakshas.',
    'major'
);

-- Shani Aarti
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Shani' LIMIT 1),
    'श्री शनिदेव आरती',
    'Shri Shanideva Aarti',
    'जय जय श्री शनिदेव भक्तन हितकारी।
सूरज के पुत्र प्रभु छाया महतारी॥

श्याम अंग वक्र-दृष्टि चतुर्भुजा धारी।
निलाम्बर धार नाथ गज की असवारी॥

क्रीट मुकुट शीश सहज दिपत है लिलारी।
मुक्तन की माल गले शोभित बलिहारी॥

मोदक और मिष्ठान चढ़े, चढ़ती पान सुपारी।
लोहा, तिल, तेल, उड़द महिषी है अति प्यारी॥

देव दनुज ऋषि मुनि सुमिरत नर नारी।
विश्वनाथ धरत ध्यान हम हैं शरण तुम्हारी॥

जय जय श्री शनिदेव भक्तन हितकारी।
सूरज के पुत्र प्रभु छाया महतारी॥',
    'जय जय श्री शनिदेव भक्तन हितकारी।
सूरज के पुत्र प्रभु छाया महतारी॥

श्याम अंग वक्र-दृष्टि चतुर्भुजा धारी।
निलाम्बर धार नाथ गज की असवारी॥

क्रीट मुकुट शीश सहज दिपत है लिलारी।
मुक्तन की माल गले शोभित बलिहारी॥

मोदक और मिष्ठान चढ़े, चढ़ती पान सुपारी।
लोहा, तिल, तेल, उड़द महिषी है अति प्यारी॥

देव दनुज ऋषि मुनि सुमिरत नर नारी।
विश्वनाथ धरत ध्यान हम हैं शरण तुम्हारी॥

जय जय श्री शनिदेव भक्तन हितकारी।
सूरज के पुत्र प्रभु छाया महतारी॥',
    'Victory to Shri Shanideva, the benefactor of devotees.
Son of the Sun God and Mother Chhaya.

Dark-bodied, with crooked gaze, four-armed one.
Wearing blue garments, riding on an elephant (or crow/vulture in some traditions, implies majesty).

Crown on head, forehead shining naturally.
Garland of pearls adorns the neck beautifully.

Sweets and betel nut are offered.
Iron, sesame, oil, urad dal, and buffalo are very dear.

Gods, demons, sages, and humans all remember you.
Lord of the Universe, we meditate on you and seek your refuge.',
    'Jaya Jaya Shri Shanideva Bhaktana Hitakari.
Suraja Ke Putra Prabhu Chhaya Mahatari.

Shyama Anga Vakra-Drishti Chaturbhuja Dhari.
Nilambara Dhara Natha Gaja Ki Asavari.

Krita Mukuta Shisha Sahaja Dipata Hai Lilari.
Muktana Ki Mala Gale Shobhita Balihari.

Modaka Aura Mishthana Chadhe, Chadhati Pana Supari.
Loha, Tila, Tela, Urada Mahishi Hai Ati Pyari.

Deva Danuja Rishi Muni Sumirata Nara Nari.
Vishvanatha Dharata Dhyana Hum Hain Sharana Tumhari.

Jaya Jaya Shri Shanideva Bhaktana Hitakari.
Suraja Ke Putra Prabhu Chhaya Mahatari.'
);

-- Kubera Aarti
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Kubera' LIMIT 1),
    'श्री कुबेर जी की आरती',
    'Shri Kubera Aarti',
    'ॐ जै यक्ष कुबेर हरे, स्वामी जै यक्ष जै यक्ष कुबेर हरे।
शरण पड़े भगतों के, भण्डार कुबेर भरे॥

शिव भक्तों में भक्त कुबेर बड़े, स्वामी भक्त कुबेर बड़े।
दैत्य दानव मानव से, कई-कई युद्ध लड़े॥

स्वर्ण सिंहासन बैठे, सिर पर छत्र फिरे, स्वामी सिर पर छत्र फिरे।
योगिनी मंगल गावैं, सब जय जय कार करैं॥

गदा त्रिशूल हाथ में, शस्त्र बहुत धरे, स्वामी शस्त्र बहुत धरे।
दुख भय संकट मोचन, धनुष टंकार करें॥

भाँति भाँति के व्यंजन बहुत बने, स्वामी व्यंजन बहुत बने।
मोहन भोग लगावैं, साथ में उड़द चने॥

बल बुद्धि विद्या दाता, हम तेरी शरण पड़े, स्वामी हम तेरी शरण पड़े।
अपने भक्त जनों के, सारे काम संवारे॥

मुकुट मणी की शोभा, मोतियन हार गले, स्वामी मोतियन हार गले।
अगर कपूर की बाती, घी की जोत जले॥

यक्ष कुबेर जी की आरती, जो कोई नर गावे, स्वामी जो कोई नर गावे।
कहत प्रेमपाल स्वामी, मनवांछित फल पावे॥

ॐ जै यक्ष कुबेर हरे, स्वामी जै यक्ष जै यक्ष कुबेर हरे।',
    'ॐ जै यक्ष कुबेर हरे, स्वामी जै यक्ष जै यक्ष कुबेर हरे।
शरण पड़े भगतों के, भण्डार कुबेर भरे॥

शिव भक्तों में भक्त कुबेर बड़े, स्वामी भक्त कुबेर बड़े।
दैत्य दानव मानव से, कई-कई युद्ध लड़े॥

स्वर्ण सिंहासन बैठे, सिर पर छत्र फिरे, स्वामी सिर पर छत्र फिरे।
योगिनी मंगल गावैं, सब जय जय कार करैं॥

गदा त्रिशूल हाथ में, शस्त्र बहुत धरे, स्वामी शस्त्र बहुत धरे।
दुख भय संकट मोचन, धनुष टंकार करें॥

भाँति भाँति के व्यंजन बहुत बने, स्वामी व्यंजन बहुत बने।
मोहन भोग लगावैं, साथ में उड़द चने॥

बल बुद्धि विद्या दाता, हम तेरी शरण पड़े, स्वामी हम तेरी शरण पड़े।
अपने भक्त जनों के, सारे काम संवारे॥

मुकुट मणी की शोभा, मोतियन हार गले, स्वामी मोतियन हार गले।
अगर कपूर की बाती, घी की जोत जले॥

यक्ष कुबेर जी की आरती, जो कोई नर गावे, स्वामी जो कोई नर गावे।
कहत प्रेमपाल स्वामी, मनवांछित फल पावे॥

ॐ जै यक्ष कुबेर हरे, स्वामी जै यक्ष जै यक्ष कुबेर हरे।',
    'Om, Victory to Yaksha Kubera, O Lord, Victory to Yaksha Kubera.
He fills the stores of the devotees who seek his refuge.

Among Shiva devotees, Kubera is great, Swami Kubera is a great devotee.
He fought many battles with demons, giants, and humans.

Seated on a golden throne, with a canopy over his head.
Yoginis sing auspicious songs, everyone chants victory.

Holding mace and trident in hand, carrying many weapons.
Liberator from sorrow, fear, and crisis, twanging the bow.

Varieties of dishes are prepared, many dishes are made.
Mohan Bhog is offered, along with urad and gram.

Giver of strength, intelligence, and knowledge, we seek your refuge.
You accomplish all the tasks of your devotees.

The beauty of the crown and gems, pearl garland on the neck.
Incense and camphor wick, ghee lamp burns.

Whoever sings the Aarti of Yaksha Kubera,
Says Prempal Swami, obtains the desired fruit.

Om, Victory to Yaksha Kubera, O Lord, Victory to Yaksha Kubera.',
    'Om Jai Yaksha Kubera Hare, Swami Jai Yaksha Jai Yaksha Kubera Hare.
Sharana Pade Bhagaton Ke, Bhandara Kubera Bhare.

Shiva Bhakton Mein Bhakta Kubera Bade, Swami Bhakta Kubera Bade.
Daitya Danava Manava Se, Kai-Kai Yuddha Lade.

Svarna Sinhasana Baithe, Sira Para Chhatra Phire, Swami Sira Para Chhatra Phire.
Yogini Mangala Gavain, Saba Jaya Jaya Kara Karain.

Gada Trishula Hatha Mein, Shastra Bahuta Dhare, Swami Shastra Bahuta Dhare.
Dukha Bhaya Sankata Mochana, Dhanusha Tankara Karen.

Bhanti Bhanti Ke Vyanjana Bahuta Bane, Swami Vyanjana Bahuta Bane.
Mohana Bhoga Lagavain, Satha Mein Urada Chane.

Bala Buddhi Vidya Data, Hama Teri Sharana Pade, Swami Hama Teri Sharana Pade.
Apane Bhakta Janon Ke, Sare Kama Sanvare.

Mukuta Mani Ki Shobha, Motiyana Hara Gale, Swami Motiyana Hara Gale.
Agara Kapura Ki Bati, Ghi Ki Jota Jale.

Yaksha Kubera Ji Ki Aarti, Jo Koi Nara Gave, Swami Jo Koi Nara Gave.
Kahata Premapala Swami, Manvanchhita Phala Pave.

Om Jai Yaksha Kubera Hare, Swami Jai Yaksha Jai Yaksha Kubera Hare.'
);
