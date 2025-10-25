-- Seed initial deity data
INSERT INTO public.deities (name_hindi, name_english, image_url, description_hindi, description_english, category) VALUES
(
    'श्री हनुमान जी',
    'Lord Hanuman',
    '/images/deities/hanuman.jpg',
    'श्री हनुमान जी राम भक्त, वीर, और शक्तिशाली देवता हैं।',
    'Lord Hanuman is a devoted follower of Lord Rama, known for his strength, courage, and devotion.',
    'major'
),
(
    'श्री गणेश जी',
    'Lord Ganesha',
    '/images/deities/ganesha.jpg',
    'श्री गणेश जी विघ्न हर्ता और मंगलकारी देवता हैं।',
    'Lord Ganesha is the remover of obstacles and the lord of beginnings.',
    'major'
),
(
    'माँ सरस्वती',
    'Goddess Saraswati',
    '/images/deities/saraswati.jpg',
    'माँ सरस्वती विद्या, संगीत और कला की देवी हैं।',
    'Goddess Saraswati is the deity of knowledge, music, and arts.',
    'major'
);

-- Seed initial aarti data for Hanuman
INSERT INTO public.aartis (deity_id, title_hindi, title_english, content_sanskrit, content_hindi, content_english, transliteration) VALUES
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Hanuman' LIMIT 1),
    'हनुमान आरती',
    'Hanuman Aarti',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।',
    'आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की।।
जाके बल से गिरिवर कांपे।
रोग दोष जाके निकट न झांके।।',
    'We perform aarti of beloved Hanuman,
The destroyer of evil, the art of Raghunath.
By whose strength even mountains tremble,
Near whom diseases and faults dare not approach.',
    'Aarti keejai Hanuman lala ki,
Dusht dalan Raghunath kala ki.
Jake bal se girivar kaanpe,
Rog dosh jake nikat na jhaanke.'
),
(
    (SELECT id FROM public.deities WHERE name_english = 'Lord Ganesha' LIMIT 1),
    'गणेश आरती',
    'Ganesha Aarti',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।
एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।',
    'जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा।।
एकदंत दयावंत चार भुजाधारी।
माथे पर तिलक सोहे मूसे की सवारी।।',
    'Victory to Ganesha, victory to Ganesha, victory to Lord Ganesha,
Whose mother is Parvati and father is Mahadeva.
One-tusked, compassionate, bearer of four arms,
Tilak adorns his forehead, riding on a mouse.',
    'Jai Ganesha jai Ganesha jai Ganesha deva,
Mata jaki Parvati pita Mahadeva.
Ekdant dayavant char bhujadhari,
Mathe par tilak sohe muse ki savari.'
),
(
    (SELECT id FROM public.deities WHERE name_english = 'Goddess Saraswati' LIMIT 1),
    'सरस्वती आरती',
    'Saraswati Aarti',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।
चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।',
    'जय सरस्वती माता मैया जय सरस्वती माता।
सद्गुण वैभव शालिनी त्रिभुवन विख्याता।।
चंद्रवदनी पद्मासिनी द्युति मंगलकारी।
सुख संपदा दायिनी ज्ञान की अधिकारी।।',
    'Victory to Mother Saraswati, victory to Mother Saraswati,
Endowed with virtues and glory, famous in all three worlds.
Moon-faced, seated on lotus, radiant and auspicious,
Giver of happiness and prosperity, the authority of knowledge.',
    'Jai Saraswati mata maiya jai Saraswati mata,
Sadgun vaibhav shalini tribhuvan vikhyata.
Chandravadani padmasini dyuti mangalkari,
Sukh sampada dayini gyan ki adhikari.'
);

-- Create function to generate unique share links for celebrations
CREATE OR REPLACE FUNCTION generate_share_link()
RETURNS TEXT AS $$
BEGIN
    RETURN 'celebration-' || encode(gen_random_bytes(8), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically set share_link if not provided
CREATE OR REPLACE FUNCTION set_celebration_share_link()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.share_link IS NULL OR NEW.share_link = '' THEN
        NEW.share_link := generate_share_link();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set share_link
CREATE TRIGGER set_celebration_share_link_trigger
    BEFORE INSERT ON public.celebrations
    FOR EACH ROW
    EXECUTE FUNCTION set_celebration_share_link();