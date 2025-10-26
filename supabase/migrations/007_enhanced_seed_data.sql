-- Enhanced seed data with comprehensive deity and aarti information
-- This migration replaces and enhances the initial seed data

-- Clear existing data to avoid duplicates
DELETE FROM public.aartis;
DELETE FROM public.deities;

-- Insert comprehensive deity data with proper cultural representations
INSERT INTO public.deities (name_hindi, name_english, image_url, description_hindi, description_english, category) VALUES
(
    'श्री हनुमान जी',
    'Lord Hanuman',
    '/images/deities/hanuman.png',
    'श्री हनुमान जी राम भक्त, वीर, और शक्तिशाली देवता हैं। वे संकट मोचन, बल और साहस के प्रतीक हैं। मंगलवार और शनिवार को इनकी विशेष पूजा की जाती है।',
    'Lord Hanuman is a devoted follower of Lord Rama, known for his immense strength, courage, and unwavering devotion. He is the remover of obstacles and protector from evil. Tuesdays and Saturdays are considered especially auspicious for his worship.',
    'major'
),
(
    'श्री गणेश जी',
    'Lord Ganesha',
    '/images/deities/ganesha.png',
    'श्री गणेश जी विघ्न हर्ता और मंगलकारी देवता हैं। वे बुद्धि, विद्या और सिद्धि के दाता हैं। सभी शुभ कार्यों की शुरुआत इनकी पूजा से की जाती है।',
    'Lord Ganesha is the remover of obstacles and the lord of beginnings. He is the bestower of wisdom, knowledge, and success. All auspicious activities begin with his worship and blessings.',
    'major'
),
(
    'माँ सरस्वती',
    'Goddess Saraswati',
    '/images/deities/saraswati.png',
    'माँ सरस्वती विद्या, संगीत, कला और ज्ञान की देवी हैं। वे शुद्ध सफेद वस्त्र धारण करती हैं और वीणा बजाती हैं। बसंत पंचमी पर इनकी विशेष पूजा होती है।',
    'Goddess Saraswati is the deity of knowledge, music, arts, and wisdom. She is depicted wearing pure white garments and playing the veena. Basant Panchami is especially dedicated to her worship.',
    'major'
);

-- Insert comprehensive aarti data with complete verses

-- Hanuman Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Hanuman' LIMIT 1),
    'श्री हनुमान आरती',
    'Shri Hanuman Aarti',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।

अंजनि पुत्र महावीर कहलावे।
संकट हरन मंगल गुण गावे।।
यह लाल लंगूर कर दमके।
महावीर जब नाम सुनावे।।

भूत पिशाच निकट नहिं आवे।
महावीर जब नाम सुनावे।।
नासै रोग हरै सब पीरा।
जपत निरंतर हनुमत बीरा।।

संकट तै हनुमान छुड़ावे।
मन क्रम वचन ध्यान जो लावे।।
सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा।।

और मनोरथ जो कोई लावे।
सोई अमित जीवन फल पावे।।
चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा।।

साधु संत के तुम रखवारे।
असुर निकंदन राम दुलारे।।
अष्ट सिद्धि नौ निधि के दाता।
अस वर दीन जानकी माता।।

राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा।।
तुम्हरे भजन राम को पावे।
जनम जनम के दुख बिसरावे।।

अंत काल रघुबर पुर जाई।
जहां जन्म हरि भक्त कहाई।।
और देवता चित्त न धरई।
हनुमत सेई सर्व सुख करई।।

संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा।।
जै जै जै हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं।।',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।

अंजनि पुत्र महावीर कहलावे।
संकट हरन मंगल गुण गावे।।
यह लाल लंगूर कर दमके।
महावीर जब नाम सुनावे।।

भूत पिशाच निकट नहिं आवे।
महावीर जब नाम सुनावे।।
नासै रोग हरै सब पीरा।
जपत निरंतर हनुमत बीरा।।

संकट तै हनुमान छुड़ावे।
मन क्रम वचन ध्यान जो लावे।।
सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा।।

और मनोरथ जो कोई लावे।
सोई अमित जीवन फल पावे।।
चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा।।

साधु संत के तुम रखवारे।
असुर निकंदन राम दुलारे।।
अष्ट सिद्धि नौ निधि के दाता।
अस वर दीन जानकी माता।।

राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा।।
तुम्हरे भजन राम को पावे।
जनम जनम के दुख बिसरावे।।

अंत काल रघुबर पुर जाई।
जहां जन्म हरि भक्त कहाई।।
और देवता चित्त न धरई।
हनुमत सेई सर्व सुख करई।।

संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा।।
जै जै जै हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं।।',
    'We perform aarti of beloved Hanuman,
The destroyer of evil, the art of Raghunath.
By whose strength even mountains tremble,
Near whom diseases and faults dare not approach.

Son of Anjani, called the great hero,
Remover of troubles, singer of auspicious qualities.
This red monkey deity shines forth,
When the name Mahavir is proclaimed.

Ghosts and demons do not come near,
When the name Mahavir is proclaimed.
Diseases are destroyed, all pain is removed,
By constantly chanting the name of brave Hanuman.

Hanuman rescues from troubles,
Those who focus their mind, actions, and words on him.
Above all is Ram, the ascetic king,
All their tasks you accomplish completely.

Whatever other desires one may have,
They receive unlimited fruits of life.
Your glory spans all four ages,
Famous throughout the world as light.

You are the protector of saints and sages,
Destroyer of demons, beloved of Ram.
Giver of eight supernatural powers and nine treasures,
Such boons were given by Mother Janaki.

The essence of Ram is with you,
Always remain the servant of Raghupati.
Through devotion to you, one attains Ram,
Forgetting the sorrows of countless births.

At the time of death, going to Raghubars abode,
Where one is born and called a devotee of Hari.
Do not focus the mind on other deities,
Serving Hanuman brings all happiness.

Troubles are cut away, all pain is erased,
For those who remember brave Hanuman.
Victory, victory, victory to Lord Hanuman,
Show mercy like a divine teacher.',
    'Aarti keejai Hanuman lala ki,
Dusht dalan Raghunath kala ki.
Jake bal se girivar kaanpe,
Rog dosh jake nikat na jhaanke.

Anjani putra Mahavir kahlave,
Sankat haran mangal gun gaave.
Yah laal langoor kar damke,
Mahavir jab naam sunaave.

Bhoot pishaach nikat nahin aave,
Mahavir jab naam sunaave.
Naasai rog harai sab peera,
Japat nirantar Hanumat beera.

Sankat tai Hanuman chudaave,
Man kram vachan dhyaan jo laave.
Sab par Ram tapasvee raaja,
Tin ke kaaj sakal tum saaja.

Aur manorath jo koi laave,
Soi amit jeevan phal paave.
Chaaron jug partaap tumhaara,
Hai parasiddh jagat ujiyaara.

Saadhu sant ke tum rakhvaare,
Asur nikandan Ram dulaare.
Asht siddhi nau nidhi ke daata,
As var deen Janaki maata.

Ram rasayan tumhare paasa,
Sadaa raho Raghupati ke daasa.
Tumhare bhajan Ram ko paave,
Janam janam ke dukh bisaraave.

Ant kaal Raghubar pur jaai,
Jahaan janma Hari bhakt kahaai.
Aur devata chitt na dharai,
Hanumat sei sarva sukh karai.

Sankat katai mitai sab peera,
Jo sumirai Hanumat balbeera.
Jai jai jai Hanuman gosaain,
Kripa karahu gurudev ki naain.'
);

-- Ganesha Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Ganesha' LIMIT 1),
    'श्री गणेश आरती',
    'Shri Ganesha Aarti',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।

एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।

अंधन को आंख देत कोढ़िन को काया।
बांझन को पुत्र देत निर्धन को माया।।

सूर श्याम शरण आए सफल कीजे सेवा।
माता जाकी पार्वती पिता महादेवा।।

दीनन की लाज राखो शंभु सुतकारी।
कामना को पूर्ण करो जाऊं बलिहारी।।

जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।

एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।

अंधन को आंख देत कोढ़िन को काया।
बांझन को पुत्र देत निर्धन को माया।।

सूर श्याम शरण आए सफल कीजे सेवा।
माता जाकी पार्वती पिता महादेवा।।

दीनन की लाज राखो शंभु सुतकारी।
कामना को पूर्ण करो जाऊं बलिहारी।।

जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।',
    'Victory to Ganesha, victory to Ganesha, victory to Lord Ganesha,
Whose mother is Parvati and father is Mahadeva.

One-tusked, compassionate, bearer of four arms,
Tilak adorns his forehead, riding on a mouse.

You give sight to the blind, body to the lepers,
You give children to the childless, wealth to the poor.

Surdas has come to your refuge, make his service fruitful,
Whose mother is Parvati and father is Mahadeva.

Protect the honor of the humble, O son of Shambhu,
Fulfill all desires, I am devoted to you.

Victory to Ganesha, victory to Ganesha, victory to Lord Ganesha,
Whose mother is Parvati and father is Mahadeva.',
    'Jai Ganesha jai Ganesha jai Ganesha deva,
Mata jaki Parvati pita Mahadeva.

Ekdant dayavant char bhujadhari,
Mathe par tilak sohe muse ki savari.

Andhan ko aankh det kodhin ko kaya,
Baanjhan ko putra det nirdhan ko maya.

Soor Shyam sharan aaye saphal kije seva,
Mata jaki Parvati pita Mahadeva.

Deenan ki laaj rakho Shambhu sutkari,
Kaamna ko poorn karo jaaun balihari.

Jai Ganesha jai Ganesha jai Ganesha deva,
Mata jaki Parvati pita Mahadeva.'
);

-- Saraswati Aarti (Complete traditional version)
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Saraswati' LIMIT 1),
    'श्री सरस्वती आरती',
    'Shri Saraswati Aarti',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।

चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।

मधुर वीणा रव सुनकर मन प्रमुदित होता।
ज्ञान प्रकाश फैलाकर जग को सुख देता।।

वेद शास्त्र सिरजनहारी कला की रानी।
शारदा नाम से प्रसिद्ध सुख संपत्ति दानी।।

मन वाणी अर्पण करके शुद्ध भाव लाकर।
सरस्वती माँ की आरती उतारें मिलकर।।

जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।

चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।

मधुर वीणा रव सुनकर मन प्रमुदित होता।
ज्ञान प्रकाश फैलाकर जग को सुख देता।।

वेद शास्त्र सिरजनहारी कला की रानी।
शारदा नाम से प्रसिद्ध सुख संपत्ति दानी।।

मन वाणी अर्पण करके शुद्ध भाव लाकर।
सरस्वती माँ की आरती उतारें मिलकर।।

जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।',
    'Victory to Mother Saraswati, victory to Mother Saraswati,
Endowed with virtues and glory, famous in all three worlds.

Moon-faced, seated on lotus, radiant and auspicious,
Giver of happiness and prosperity, the authority of knowledge.

Hearing the sweet sound of the veena, the mind becomes joyful,
Spreading the light of knowledge, giving happiness to the world.

Creator of Vedas and scriptures, queen of arts,
Famous by the name Sharada, giver of happiness and wealth.

Offering mind and speech, bringing pure feelings,
Let us together perform the aarti of Mother Saraswati.

Victory to Mother Saraswati, victory to Mother Saraswati,
Endowed with virtues and glory, famous in all three worlds.',
    'Jai Saraswati mata maiya jai Saraswati mata,
Sadgun vaibhav shalini tribhuvan vikhyata.

Chandravadani padmasini dyuti mangalkari,
Sukh sampada dayini gyan ki adhikari.

Madhur veena rav sunkar man pramudit hota,
Gyan prakash phailakar jag ko sukh deta.

Ved shastra sirjanhari kala ki rani,
Sharada naam se prasiddh sukh sampatti dani.

Man vaani arpan karke shuddh bhaav lakar,
Saraswati maa ki aarti utaaren milkar.

Jai Saraswati mata maiya jai Saraswati mata,
Sadgun vaibhav shalini tribhuvan vikhyata.'
);

-- Add additional shorter aartis for variety

-- Short Hanuman Chalisa verse
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Hanuman' LIMIT 1),
    'हनुमान चालीसा (प्रारंभिक श्लोक)',
    'Hanuman Chalisa (Opening Verse)',
    'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।
बरनउं रघुबर बिमल जसु जो दायकु फल चारि।।

बुद्धिहीन तनु जानिके सुमिरौं पवन कुमार।
बल बुद्धि विद्या देहु मोहिं हरहु कलेस विकार।।',
    'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।
बरनउं रघुबर बिमल जसु जो दायकु फल चारि।।

बुद्धिहीन तनु जानिके सुमिरौं पवन कुमार।
बल बुद्धि विद्या देहु मोहिं हरहु कलेस विकार।।',
    'With the dust of my Gurus lotus feet, I cleanse the mirror of my mind,
I narrate the pure fame of Raghubir, which gives the four fruits of life.

Knowing my body to be devoid of intelligence, I remember the son of wind,
Grant me strength, wisdom, and knowledge, remove my afflictions and impurities.',
    'Shriguru charan saroj raj nij manu mukuru sudhari,
Baranaun Raghubar bimal jasu jo dayaku phal chari.

Buddhiheen tanu jaanike sumiraun pavan kumar,
Bal buddhi vidya dehu mohin harahu kalesa vikaar.'
);

-- Short Ganesha Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Ganesha' LIMIT 1),
    'गणेश मंत्र',
    'Ganesha Mantra',
    'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा।।

गणानां त्वा गणपतिं हवामहे कविं कवीनाम्।
उपमश्रवस्तमं ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत आ नः शृणोतुत्।।',
    'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा।।

गणानां त्वा गणपतिं हवामहे कविं कवीनाम्।
उपमश्रवस्तमं ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत आ नः शृणोतुत्।।',
    'O curved-trunked, large-bodied one, with the brilliance of a million suns,
Make all my endeavors free of obstacles, O Lord, always.

We invoke you, O Ganapati, lord of the ganas, poet among poets,
Most famous, eldest king, lord of prayers, listen to us.',
    'Vakratunda mahakaya suryakoti samaprabha,
Nirvighnam kuru me deva sarvakaryeshu sarvada.

Ganaanam tva ganapatim havaamahe kavim kavinaam,
Upamashravastamam jyeshtharajam brahmanaam brahmanaspata aa nah shrinotu.'
);

-- Short Saraswati Mantra
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Saraswati' LIMIT 1),
    'सरस्वती मंत्र',
    'Saraswati Mantra',
    'या कुन्देन्दु तुषारहार धवला या शुभ्र वस्त्रावृता।
या वीणावर दण्डमण्डित करा या श्वेत पद्मासना।।
या ब्रह्माच्युत शंकर प्रभृतिभिर्देवैः सदा वन्दिता।
सा मां पातु सरस्वती भगवती निःशेष जाड्यापहा।।

सरस्वति नमस्तुभ्यं वरदे कामरूपिणि।
विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा।।',
    'या कुन्देन्दु तुषारहार धवला या शुभ्र वस्त्रावृता।
या वीणावर दण्डमण्डित करा या श्वेत पद्मासना।।
या ब्रह्माच्युत शंकर प्रभृतिभिर्देवैः सदा वन्दिता।
सा मां पातु सरस्वती भगवती निःशेष जाड्यापहा।।

सरस्वति नमस्तुभ्यं वरदे कामरूपिणि।
विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा।।',
    'She who is white like jasmine, moon, and snow, clothed in pure white garments,
Whose hands are adorned with the excellent veena, who sits on a white lotus,
Who is always worshipped by Brahma, Vishnu, Shankara and other gods,
May that Goddess Saraswati protect me, who removes all ignorance completely.

Salutations to you, O Saraswati, giver of boons, who can take any form,
I am beginning my studies, may I always have success.',
    'Ya kundendu tusharahara dhavala ya shubhra vastraavrita,
Ya veenavaradanda mandita kara ya shveta padmasana.
Ya brahmachyuta shankara prabhritibhir devai sada vandita,
Sa maam paatu saraswati bhagavati nihshesha jadyapaha.

Saraswati namastubhyam varade kamarupini,
Vidyarambham karishyami siddhir bhavatu me sada.'
);