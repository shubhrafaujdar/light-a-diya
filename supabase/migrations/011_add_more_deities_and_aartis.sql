-- Add more popular Hindu deities and their aartis
-- This migration adds: Shiva, Krishna, Lakshmi, Durga, and Rama with their traditional aartis

-- Insert new deities
INSERT INTO public.deities (name_hindi, name_english, image_url, description_hindi, description_english, category) VALUES
(
    'श्री शिव जी',
    'Lord Shiva',
    '/images/deities/shiva.png',
    'श्री शिव जी त्रिदेवों में से एक हैं। वे संहार के देवता, योगी, और नटराज हैं। महाशिवरात्रि पर इनकी विशेष पूजा होती है।',
    'Lord Shiva is one of the trinity. He is the god of destruction, the supreme yogi, and Nataraja. Mahashivratri is especially dedicated to his worship.',
    'major'
),
(
    'श्री कृष्ण जी',
    'Lord Krishna',
    '/images/deities/krishna.png',
    'श्री कृष्ण जी भगवान विष्णु के अवतार हैं। वे प्रेम, आनंद और भक्ति के प्रतीक हैं। जन्माष्टमी पर इनका जन्मोत्सव मनाया जाता है।',
    'Lord Krishna is an avatar of Lord Vishnu. He is the symbol of love, joy, and devotion. Janmashtami celebrates his birth.',
    'major'
),
(
    'माँ लक्ष्मी',
    'Goddess Lakshmi',
    '/images/deities/lakshmi.png',
    'माँ लक्ष्मी धन, समृद्धि और सौभाग्य की देवी हैं। वे भगवान विष्णु की पत्नी हैं। दीपावली पर इनकी विशेष पूजा होती है।',
    'Goddess Lakshmi is the deity of wealth, prosperity, and fortune. She is the consort of Lord Vishnu. Diwali is especially dedicated to her worship.',
    'major'
),
(
    'माँ दुर्गा',
    'Goddess Durga',
    '/images/deities/durga.png',
    'माँ दुर्गा शक्ति की देवी हैं। वे बुराई का नाश करने वाली और भक्तों की रक्षा करने वाली हैं। नवरात्रि में इनकी नौ दिन पूजा होती है।',
    'Goddess Durga is the deity of power and strength. She destroys evil and protects devotees. Navratri celebrates her worship for nine days.',
    'major'
),
(
    'श्री राम जी',
    'Lord Rama',
    '/images/deities/rama.png',
    'श्री राम जी मर्यादा पुरुषोत्तम हैं। वे धर्म, सत्य और न्याय के प्रतीक हैं। रामनवमी पर इनका जन्मोत्सव मनाया जाता है।',
    'Lord Rama is the ideal man and upholder of dharma. He symbolizes righteousness, truth, and justice. Ram Navami celebrates his birth.',
    'major'
);

-- Shiva Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Shiva' LIMIT 1),
    'श्री शिव आरती',
    'Shri Shiva Aarti',
    'जय शिव ओंकारा हर शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव अर्धांगी धारा।।

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे।।

दो भुज चार चतुर्भुज दस भुज अति सोहे।
तीनों रूप निरखता त्रिभुवन जन मोहे।।

अक्षमाला वनमाला मुण्डमाला धारी।
चंदन मृगमद सोहे भाले शशिधारी।।

श्वेताम्बर पीताम्बर बाघम्बर अंगे।
सनकादिक गरुणादिक भूतादिक संगे।।

कर मध्य कमंडलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालन कारी।।

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर में शोभित ये तीनों एका।।

त्रिगुण स्वामी जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी मनवांछित फल पावे।।

जय शिव ओंकारा हर शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव अर्धांगी धारा।।',
    'जय शिव ओंकारा हर शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव अर्धांगी धारा।।

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे।।

दो भुज चार चतुर्भुज दस भुज अति सोहे।
तीनों रूप निरखता त्रिभुवन जन मोहे।।

अक्षमाला वनमाला मुण्डमाला धारी।
चंदन मृगमद सोहे भाले शशिधारी।।

श्वेताम्बर पीताम्बर बाघम्बर अंगे।
सनकादिक गरुणादिक भूतादिक संगे।।

कर मध्य कमंडलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालन कारी।।

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर में शोभित ये तीनों एका।।

त्रिगुण स्वामी जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी मनवांछित फल पावे।।

जय शिव ओंकारा हर शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव अर्धांगी धारा।।',
    'Victory to Shiva, the embodiment of Om, Hara Shiva, the embodiment of Om,
Brahma, Vishnu, and Sadashiva, with the goddess as half his body.

One-faced, four-faced, five-faced they reign,
Seated on swan, on Garuda, adorned with bull as vehicle.

Two arms, four arms, ten arms shine beautifully,
Seeing these three forms, people of all three worlds are enchanted.

Wearing rosary of beads, garland of forest flowers, garland of skulls,
Adorned with sandalwood and musk, bearing the moon on forehead.

Wearing white garments, yellow garments, tiger skin on body,
Accompanied by Sanaka and others, Garuda and others, ghosts and others.

In hand holding water pot, discus, and trident,
Giver of happiness, remover of sorrow, sustainer of the world.

Brahma, Vishnu, and Sadashiva, known without distinction,
In the sacred syllable Om, these three shine as one.

Whoever sings this aarti of the Lord of three qualities,
Says Shivananda Swami, obtains the desired fruit.

Victory to Shiva, the embodiment of Om, Hara Shiva, the embodiment of Om,
Brahma, Vishnu, and Sadashiva, with the goddess as half his body.',
    'Jai Shiva Omkara Hara Shiva Omkara,
Brahma Vishnu Sadashiva ardhangee dhara.

Ekaanan chaturaanan panchanan raaje,
Hansaasan garudaasan vrishabahan saaje.

Do bhuj chaar chaturbhuj das bhuj ati sohe,
Teenon roop nirakhata tribhuvan jan mohe.

Akshamala vanamala mundamala dhari,
Chandan mrigamad sohe bhale shashidhari.

Shvetambar peetambar baghambar ange,
Sanakadik garunadik bhootadik sange.

Kar madhya kamandalu chakra trishuldhari,
Sukhkari dukhari jagpalan kari.

Brahma Vishnu Sadashiva janat aviveka,
Pranavakshar mein shobhit ye teenon eka.

Trigun swami ji ki aarti jo koi nar gaave,
Kahat Shivananda Swami manvanchit phal paave.

Jai Shiva Omkara Hara Shiva Omkara,
Brahma Vishnu Sadashiva ardhangee dhara.'
);

-- Krishna Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Krishna' LIMIT 1),
    'श्री कृष्ण आरती',
    'Shri Krishna Aarti',
    'आरती कुंजबिहारी की श्री गिरिधर कृष्ण मुरारी की।।

गले में बैजंती माला बजावै मुरली मधुर बाला।
श्रवण में कुण्डल झलकाला नंद के आनंद नंदलाला।
गगन सम अंग कांति काली राधिका चमक रही आली।
लतन में ठाढ़े बनमाली भ्रमर सी अलक कस्तूरी तिलक।
चंद्र सी झलक ललाट पे प्यारी सूरत श्याम प्यारी की।।

कंठ में पड़े हार फूलन की अति सुंदर नाक मोतियन की।
यह छवि को रति रीझे आली दामिनी दमक रही आली।
अरुण अधर पर बंसी धरी अधरन की उपमा क्या करी।
भ्रकुटि विलास त्रिभुवन मोहन मोहनी मूरत मदन की।।

पीताम्बर तन पर सोहे अति सुंदर कटि किंकिणी जो झनके।
मेरे नंदलाल की आरती जो कोई नर गावे।
भक्त शिरोमणि मीरा लाल गिरिधर की पदरज पावे।।

आरती कुंजबिहारी की श्री गिरिधर कृष्ण मुरारी की।।',
    'आरती कुंजबिहारी की श्री गिरिधर कृष्ण मुरारी की।।

गले में बैजंती माला बजावै मुरली मधुर बाला।
श्रवण में कुण्डल झलकाला नंद के आनंद नंदलाला।
गगन सम अंग कांति काली राधिका चमक रही आली।
लतन में ठाढ़े बनमाली भ्रमर सी अलक कस्तूरी तिलक।
चंद्र सी झलक ललाट पे प्यारी सूरत श्याम प्यारी की।।

कंठ में पड़े हार फूलन की अति सुंदर नाक मोतियन की।
यह छवि को रति रीझे आली दामिनी दमक रही आली।
अरुण अधर पर बंसी धरी अधरन की उपमा क्या करी।
भ्रकुटि विलास त्रिभुवन मोहन मोहनी मूरत मदन की।।

पीताम्बर तन पर सोहे अति सुंदर कटि किंकिणी जो झनके।
मेरे नंदलाल की आरती जो कोई नर गावे।
भक्त शिरोमणि मीरा लाल गिरिधर की पदरज पावे।।

आरती कुंजबिहारी की श्री गिरिधर कृष्ण मुरारी की।।',
    'Aarti of the one who dwells in the groves, Shri Giridhara Krishna Murari.

Wearing a garland of basil around the neck, playing the sweet flute,
Earrings sparkling in the ears, Nandas joy, Nandlala.
Body dark as the sky, Radhika shines beside him,
Standing among the creepers, the forest dweller, with locks like bees and musk tilak.
Moon-like glow on the forehead, beloved face of the dark one.

Wearing a garland of flowers around the neck, beautiful nose adorned with pearls,
This beauty enchants even Rati, lightning flashes beside him.
Red lips holding the flute, what comparison can be made to those lips,
Playful eyebrows enchanting the three worlds, enchanting form of Cupid.

Yellow garments adorn the body, beautiful waist bells that jingle,
Whoever sings the aarti of my Nandlala,
Devotee jewel Meera obtains the dust of Giridharas feet.

Aarti of the one who dwells in the groves, Shri Giridhara Krishna Murari.',
    'Aarti kunjabihari ki Shri Giridhar Krishna Murari ki.

Gale mein baijanti mala bajaavai murali madhur bala,
Shravan mein kundal jhalkala Nand ke anand Nandlala.
Gagan sam ang kanti kali Radhika chamak rahi aali,
Latan mein thadhe banmali bhramar si alak kasturi tilak.
Chandra si jhalak lalat pe pyari surat Shyam pyari ki.

Kanth mein pade haar phulan ki ati sundar naak motiyan ki,
Yah chhavi ko Rati reejhe aali damini damak rahi aali.
Arun adhar par bansi dhari adharan ki upma kya kari,
Bhrakuti vilas tribhuvan mohan mohani murat Madan ki.

Peetambar tan par sohe ati sundar kati kinkini jo jhanke,
Mere Nandlal ki aarti jo koi nar gaave,
Bhakta shiromani Meera lal Giridhar ki padaraj paave.

Aarti kunjabihari ki Shri Giridhar Krishna Murari ki.'
);

-- Lakshmi Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Lakshmi' LIMIT 1),
    'श्री लक्ष्मी आरती',
    'Shri Lakshmi Aarti',
    'ॐ जय लक्ष्मी माता मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत हर विष्णु विधाता।।

उमा रमा ब्रह्माणी तुम ही जग माता।
सूर्य चंद्रमा ध्यावत नारद ऋषि गाता।।

दुर्गा रूप निरंजनी सुख संपत्ति दाता।
जो कोई तुमको ध्याता ऋद्धि सिद्धि धन पाता।।

तुम पाताल निवासिनी तुम ही शुभ दाता।
कर्म प्रभाव प्रकाशिनी भवनिधि की त्राता।।

जिस घर तुम रहती सब सद्गुण आता।
सब संभव हो जाता मन नहीं घबराता।।

तुम बिन यज्ञ न होते वस्त्र न कोई पाता।
खान पान का वैभव सब तुमसे आता।।

शुभ गुण मंदिर सुंदर क्षीरोदधि जाता।
रत्न चतुर्दश तुम बिन कोई नहीं पाता।।

महालक्ष्मी जी की आरती जो कोई नर गाता।
उर आनंद समाता पाप उतर जाता।।

ॐ जय लक्ष्मी माता मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत हर विष्णु विधाता।।',
    'ॐ जय लक्ष्मी माता मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत हर विष्णु विधाता।।

उमा रमा ब्रह्माणी तुम ही जग माता।
सूर्य चंद्रमा ध्यावत नारद ऋषि गाता।।

दुर्गा रूप निरंजनी सुख संपत्ति दाता।
जो कोई तुमको ध्याता ऋद्धि सिद्धि धन पाता।।

तुम पाताल निवासिनी तुम ही शुभ दाता।
कर्म प्रभाव प्रकाशिनी भवनिधि की त्राता।।

जिस घर तुम रहती सब सद्गुण आता।
सब संभव हो जाता मन नहीं घबराता।।

तुम बिन यज्ञ न होते वस्त्र न कोई पाता।
खान पान का वैभव सब तुमसे आता।।

शुभ गुण मंदिर सुंदर क्षीरोदधि जाता।
रत्न चतुर्दश तुम बिन कोई नहीं पाता।।

महालक्ष्मी जी की आरती जो कोई नर गाता।
उर आनंद समाता पाप उतर जाता।।

ॐ जय लक्ष्मी माता मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत हर विष्णु विधाता।।',
    'Om, victory to Mother Lakshmi, victory to Mother Lakshmi,
You are served day and night by Shiva, Vishnu, and Brahma.

Uma, Rama, Brahmani, you are the mother of the world,
The sun and moon meditate on you, sage Narada sings your praise.

In the form of Durga, pure one, giver of happiness and wealth,
Whoever meditates on you obtains prosperity, success, and wealth.

You dwell in the netherworld, you are the giver of auspiciousness,
Illuminator of the effects of karma, savior from the ocean of existence.

In whichever home you reside, all virtues come,
Everything becomes possible, the mind does not worry.

Without you, no sacrifice would occur, no one would get clothes,
The abundance of food and drink all comes from you.

Temple of auspicious qualities, beautiful one born from the ocean of milk,
The fourteen jewels, without you no one obtains.

Whoever sings the aarti of Mahalakshmi,
Joy fills the heart, sins are washed away.

Om, victory to Mother Lakshmi, victory to Mother Lakshmi,
You are served day and night by Shiva, Vishnu, and Brahma.',
    'Om jai Lakshmi mata maiya jai Lakshmi mata,
Tumko nisadin sevat Hara Vishnu Vidhata.

Uma Rama Brahmani tum hi jag mata,
Surya chandrama dhyavat Narad rishi gata.

Durga roop niranjani sukh sampatti data,
Jo koi tumko dhyata riddhi siddhi dhan pata.

Tum patal nivasini tum hi shubh data,
Karma prabhav prakashini bhavanidhi ki trata.

Jis ghar tum rahti sab sadgun ata,
Sab sambhav ho jata man nahin ghabrata.

Tum bin yagya na hote vastra na koi pata,
Khan pan ka vaibhav sab tumse ata.

Shubh gun mandir sundar kshirodadhi jata,
Ratna chaturdash tum bin koi nahin pata.

Mahalakshmi ji ki aarti jo koi nar gata,
Ur anand samata paap utar jata.

Om jai Lakshmi mata maiya jai Lakshmi mata,
Tumko nisadin sevat Hara Vishnu Vidhata.'
);

-- Durga Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Durga' LIMIT 1),
    'श्री दुर्गा आरती',
    'Shri Durga Aarti',
    'जय अम्बे गौरी मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी।।

मांग सिंदूर विराजत टीको मृगमद को।
उज्ज्वल से दोउ नैना चंद्रवदन नीको।।

कनक समान कलेवर रक्ताम्बर राजै।
रक्त पुष्प गल माला कंठन पर साजै।।

केहरि वाहन राजत खड्ग खप्परधारी।
सुर नर मुनि जन सेवत तिनके दुखहारी।।

कानन कुण्डल शोभित नासाग्रे मोती।
कोटिक चंद्र दिवाकर सम राजत ज्योती।।

शुंभ निशुंभ बिदारे हेमाक्ष संहारे।
धूम्र विलोचन नैना निशदिन मदमाते।।

चंड मुंड संहारे शोणित बीज हरे।
मधु कैटभ दोउ मारे सुर भयहीन करे।।

ब्रह्माणी रुद्राणी तुम कमला रानी।
आगम निगम बखानी तुम शिव पटरानी।।

चौंसठ योगिनी मंगल गावत नृत्य करत भैरों।
बाजत ताल मृदंगा अरु बाजत डमरू।।

तुम ही जग की माता तुम ही हो भर्ता।
भक्तन की दुख हर्ता सुख संपत्ति कर्ता।।

भुजा चार अति शोभित वर मुद्रा धारी।
मनवांछित फल पावत सेवत नर नारी।।

कंचन थाल विराजत अगर कपूर बाती।
श्री मालकेतु में राजत कोटि रतन ज्योती।।

श्री अम्बे जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी सुख संपत्ति पावे।।

जय अम्बे गौरी मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी।।',
    'जय अम्बे गौरी मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी।।

मांग सिंदूर विराजत टीको मृगमद को।
उज्ज्वल से दोउ नैना चंद्रवदन नीको।।

कनक समान कलेवर रक्ताम्बर राजै।
रक्त पुष्प गल माला कंठन पर साजै।।

केहरि वाहन राजत खड्ग खप्परधारी।
सुर नर मुनि जन सेवत तिनके दुखहारी।।

कानन कुण्डल शोभित नासाग्रे मोती।
कोटिक चंद्र दिवाकर सम राजत ज्योती।।

शुंभ निशुंभ बिदारे हेमाक्ष संहारे।
धूम्र विलोचन नैना निशदिन मदमाते।।

चंड मुंड संहारे शोणित बीज हरे।
मधु कैटभ दोउ मारे सुर भयहीन करे।।

ब्रह्माणी रुद्राणी तुम कमला रानी।
आगम निगम बखानी तुम शिव पटरानी।।

चौंसठ योगिनी मंगल गावत नृत्य करत भैरों।
बाजत ताल मृदंगा अरु बाजत डमरू।।

तुम ही जग की माता तुम ही हो भर्ता।
भक्तन की दुख हर्ता सुख संपत्ति कर्ता।।

भुजा चार अति शोभित वर मुद्रा धारी।
मनवांछित फल पावत सेवत नर नारी।।

कंचन थाल विराजत अगर कपूर बाती।
श्री मालकेतु में राजत कोटि रतन ज्योती।।

श्री अम्बे जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी सुख संपत्ति पावे।।

जय अम्बे गौरी मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी।।',
    'Victory to Mother Amba Gauri, victory to Shyama Gauri,
You are meditated upon day and night by Vishnu, Brahma, and Shiva.

Vermillion adorns the parting of hair, musk tilak on forehead,
Two bright eyes, beautiful moon-like face.

Body like gold, wearing red garments,
Garland of red flowers adorns the neck.

Riding on a lion, holding sword and skull,
Served by gods, humans, and sages, remover of their sorrows.

Earrings shine in ears, pearl on nose tip,
Light shines like millions of moons and suns.

Destroyed Shumbha and Nishumbha, killed Hemaksha,
Smoke-eyed, intoxicated day and night.

Destroyed Chanda and Munda, removed Raktabija,
Killed both Madhu and Kaitabha, made gods fearless.

Brahmani, Rudrani, you are Queen Kamala,
Described in Agamas and Vedas, you are Shivas queen.

Sixty-four Yoginis sing auspiciously, Bhairavas dance,
Cymbals and mridanga play, and the damaru sounds.

You are the mother of the world, you are the sustainer,
Remover of devotees sorrows, creator of happiness and wealth.

Four arms shine beautifully, holding blessing mudra,
Men and women serving obtain desired fruits.

Golden plate shines with incense and camphor lamp,
In the Malaketu shines the light of millions of gems.

Whoever sings the aarti of Shri Amba Ji,
Says Shivananda Swami, obtains happiness and wealth.

Victory to Mother Amba Gauri, victory to Shyama Gauri,
You are meditated upon day and night by Vishnu, Brahma, and Shiva.',
    'Jai Ambe Gauri maiya jai Shyama Gauri,
Tumko nishadin dhyavat Hari Brahma Shivari.

Mang sindoor virajat teeko mrigamad ko,
Ujjwal se dou naina chandravadan neeko.

Kanak saman kalevar raktambar rajai,
Rakta pushpa gal mala kanthan par sajai.

Kehari vahan rajat khadga khappardhari,
Sur nar muni jan sevat tinke dukhari.

Kanan kundal shobhit nasagre moti,
Kotik chandra divakar sam rajat jyoti.

Shumbha Nishumbha bidare Hemaksha sanhare,
Dhumra vilochan naina nishadin madmate.

Chanda Munda sanhare Shonit beej hare,
Madhu Kaitabha dou mare sur bhayaheen kare.

Brahmani Rudrani tum Kamala Rani,
Agam nigam bakhani tum Shiva Patrani.

Chaunsath yogini mangal gavat nritya karat Bhairon,
Bajat tal mridanga aru bajat damaru.

Tum hi jag ki mata tum hi ho bharta,
Bhaktan ki dukh harta sukh sampatti karta.

Bhuja char ati shobhit var mudra dhari,
Manvanchit phal pavat sevat nar nari.

Kanchan thal virajat agar kapur bati,
Shri Malketu mein rajat koti ratan jyoti.

Shri Ambe ji ki aarti jo koi nar gaave,
Kahat Shivananda Swami sukh sampatti paave.

Jai Ambe Gauri maiya jai Shyama Gauri,
Tumko nishadin dhyavat Hari Brahma Shivari.'
);

-- Rama Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Rama' LIMIT 1),
    'श्री राम आरती',
    'Shri Rama Aarti',
    'आरती कीजै रघुवीर की श्री रामचंद्र जी की।
जाके मुख की शोभा जगमग जोति अमंद है।।

सीता स्वामी नयन बिसाल भाल तिलक दिये।
दुंदुभि बाजत ढोल मृदंग मधुर मिठे बोल।।

जाके सिर पर मुकुट बड़ो है कुंडल लटकत कान।
हार हीरा मोतियन को सब हीं को ललचात।।

जाके हाथ कमान बान है कटि तरकस लटकत।
जाके नेत्र विशाल है भृकुटि कमान चढ़ी।।

श्री रामचंद्र जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी सुख संपत्ति पावे।।

आरती कीजै रघुवीर की श्री रामचंद्र जी की।
जाके मुख की शोभा जगमग जोति अमंद है।।',
    'आरती कीजै रघुवीर की श्री रामचंद्र जी की।
जाके मुख की शोभा जगमग जोति अमंद है।।

सीता स्वामी नयन बिसाल भाल तिलक दिये।
दुंदुभि बाजत ढोल मृदंग मधुर मिठे बोल।।

जाके सिर पर मुकुट बड़ो है कुंडल लटकत कान।
हार हीरा मोतियन को सब हीं को ललचात।।

जाके हाथ कमान बान है कटि तरकस लटकत।
जाके नेत्र विशाल है भृकुटि कमान चढ़ी।।

श्री रामचंद्र जी की आरती जो कोई नर गावे।
कहत शिवानंद स्वामी सुख संपत्ति पावे।।

आरती कीजै रघुवीर की श्री रामचंद्र जी की।
जाके मुख की शोभा जगमग जोति अमंद है।।',
    'We perform aarti of Raghuvir, of Shri Ramachandra Ji,
Whose face shines with brilliant, unending light.

Lord of Sita, with large eyes, tilak on forehead,
Drums beat, mridanga plays, sweet melodious words.

On whose head is a great crown, earrings hanging from ears,
Necklace of diamonds and pearls, tempting to all.

In whose hands are bow and arrow, quiver hanging at waist,
Whose eyes are large, eyebrows like a drawn bow.

Whoever sings the aarti of Shri Ramachandra Ji,
Says Shivananda Swami, obtains happiness and wealth.

We perform aarti of Raghuvir, of Shri Ramachandra Ji,
Whose face shines with brilliant, unending light.',
    'Aarti keejai Raghuveer ki Shri Ramachandra ji ki,
Jake mukh ki shobha jagmag joti amand hai.

Sita swami nayan bisaal bhal tilak diye,
Dundubhi bajat dhol mridang madhur mithe bol.

Jake sir par mukut bado hai kundal latkat kaan,
Haar heera motiyan ko sab hin ko lalchat.

Jake hath kaman ban hai kati tarkas latkat,
Jake netra vishal hai bhrakuti kaman chadhi.

Shri Ramachandra ji ki aarti jo koi nar gaave,
Kahat Shivananda Swami sukh sampatti paave.

Aarti keejai Raghuveer ki Shri Ramachandra ji ki,
Jake mukh ki shobha jagmag joti amand hai.'
);

-- Add shorter mantras for the new deities

-- Shiva Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Shiva' LIMIT 1),
    'शिव मंत्र',
    'Shiva Mantra',
    'ॐ नमः शिवाय।

त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्।।',
    'ॐ नमः शिवाय।

त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्।।',
    'Om, salutations to Shiva.

We worship the three-eyed one, who is fragrant and nourishes all beings,
May he liberate us from death for the sake of immortality, even as a cucumber is severed from its bondage to the creeper.',
    'Om Namah Shivaya.

Tryambakam yajamahe sugandhim pushtivardhanam,
Urvarukamiva bandhanat mrityormukshiya mamritat.'
);

-- Krishna Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Krishna' LIMIT 1),
    'कृष्ण मंत्र',
    'Krishna Mantra',
    'ॐ नमो भगवते वासुदेवाय।

कृष्णाय वासुदेवाय हरये परमात्मने।
प्रणत क्लेश नाशाय गोविन्दाय नमो नमः।।

हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम राम राम हरे हरे।।',
    'ॐ नमो भगवते वासुदेवाय।

कृष्णाय वासुदेवाय हरये परमात्मने।
प्रणत क्लेश नाशाय गोविन्दाय नमो नमः।।

हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।
हरे राम हरे राम राम राम हरे हरे।।',
    'Om, salutations to Lord Vasudeva.

To Krishna, son of Vasudeva, to Hari, the Supreme Soul,
Destroyer of the sufferings of those who surrender, to Govinda, salutations again and again.

Hare Krishna Hare Krishna Krishna Krishna Hare Hare,
Hare Rama Hare Rama Rama Rama Hare Hare.',
    'Om Namo Bhagavate Vasudevaya.

Krishnaya Vasudevaya Haraye Paramatmane,
Pranata klesha nashaya Govindaya namo namah.

Hare Krishna Hare Krishna Krishna Krishna Hare Hare,
Hare Rama Hare Rama Rama Rama Hare Hare.'
);

-- Lakshmi Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Lakshmi' LIMIT 1),
    'लक्ष्मी मंत्र',
    'Lakshmi Mantra',
    'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद।
श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः।।

सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते।।',
    'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद।
श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः।।

सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते।।',
    'Om Shreem Hreem Shreem, O lotus-dwelling one, be pleased, be pleased,
Shreem Hreem Shreem Om, salutations to Mahalakshmi.

O auspicious one among the auspicious, O Shiva, accomplisher of all purposes,
O refuge, three-eyed Gauri, Narayani, salutations to you.',
    'Om Shreem Hreem Shreem Kamale Kamalalaye Praseeda Praseeda,
Shreem Hreem Shreem Om Mahalakshmyai Namah.

Sarvamangala mangalye shive sarvartha sadhike,
Sharanye tryambake Gauri Narayani namostute.'
);

-- Durga Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Durga' LIMIT 1),
    'दुर्गा मंत्र',
    'Durga Mantra',
    'ॐ दुं दुर्गायै नमः।

सर्व स्वरूपे सर्वेशे सर्व शक्ति समन्विते।
भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते।।

या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः।।',
    'ॐ दुं दुर्गायै नमः।

सर्व स्वरूपे सर्वेशे सर्व शक्ति समन्विते।
भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते।।

या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः।।',
    'Om Dum, salutations to Durga.

O embodiment of all, ruler of all, endowed with all powers,
Protect us from all fears, O Goddess Durga, salutations to you.

To the Goddess who resides in all beings in the form of power,
Salutations to her, salutations to her, salutations to her, salutations again and again.',
    'Om Dum Durgayai Namah.

Sarva swarupe sarveshe sarva shakti samanvite,
Bhayebhyastrahi no devi Durge devi namostute.

Ya devi sarvabhuteshu shaktirupena sansthita,
Namastasyai namastasyai namastasyai namo namah.'
);

-- Rama Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Rama' LIMIT 1),
    'राम मंत्र',
    'Rama Mantra',
    'ॐ श्री रामाय नमः।

श्री राम राम रामेति रमे रामे मनोरमे।
सहस्रनाम तत्तुल्यं राम नाम वरानने।।

राम रामेति रामेति रमे रामे मनोरमे।
सहस्रनाम तत्तुल्यं राम नाम वरानने।।',
    'ॐ श्री रामाय नमः।

श्री राम राम रामेति रमे रामे मनोरमे।
सहस्रनाम तत्तुल्यं राम नाम वरानने।।

राम रामेति रामेति रमे रामे मनोरमे।
सहस्रनाम तत्तुल्यं राम नाम वरानने।।',
    'Om, salutations to Shri Rama.

Shri Rama, Rama, Rama, I delight in Rama, the enchanting one,
The name of Rama is equal to a thousand names, O beautiful-faced one.

Rama, Rama, Rama, I delight in Rama, the enchanting one,
The name of Rama is equal to a thousand names, O beautiful-faced one.',
    'Om Shri Ramaya Namah.

Shri Rama Rama Rameti rame Rame manorame,
Sahasranama tattulyam Rama nama varanane.

Rama Rameti Rameti rame Rame manorame,
Sahasranama tattulyam Rama nama varanane.'
);
