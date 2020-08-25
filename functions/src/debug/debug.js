const { similarity } = require('../api/text');

const news = [
  'Share this post with ',
  ' Email ',
  ' Facebook ',
  ' Messenger ',
  ' Messenger ',
  ' Twitter ',
  ' WhatsApp ',
  ' LinkedIn ',
  ' Copy this link ',
  ' These are external links and will open in a new window ',
  ' Since the first reported case in the current pandemic coronavirus in December, China the main symptoms attributed to disease covid-19 are dry persistent cough, fever and fatigue. ',
  ' However, over the months and the rapid spread of the virus, which has reached more than 3 million people, there were many other signs associated with the disease. ', ' In view of the observations made by doctors from different countries and a large number of recent international studies (most still without critical review of academic peers), the Control Center and Prevention (CDC) of the United States decided to include five new symptoms in the list that is assigned to covid-19. ',
  ' In addition to the known cough, fever and fatigue, the CDC noted: ',
  ' These symptoms, not necessarily all, but a combination of them, may manifest between 2 and 14 days after the person contracting the virus, the CDC said. ',
  ' Increasing this signal list, experts say, will serve to determine which people need to be tested to identify whether they have the virus, and also to better understand when someone should be isolated for suspected infection covid-19. ',
  ' WHO maintains Email list ',
  ' To date, the World Health Organization (WHO) has not made changes in their list of symptoms. ',
  ' The organization points out that fever, dry cough and fatigue are the main ways in which the disease manifests itself, and some patients may also develop body aches, nasal congestion, sore throat or diarrhea. ',
  ' The site of the WHO adds that these symptoms are usually mild and develop gradually. ',
  ' Although the description of symptoms is different between the WHO and the US CDC, both agree on when to seek emergency medical help. ',
  ' They say it should be done when the patient has difficulty breathing or feel pressure or chest pain. ',
  ' What to do if you are having symptoms? ',
  ' The recommendation of the Ministry of Health is that anyone presenting flu symptoms stay home in isolation for 14 days and only look for the hospital if the worsening picture, if there is difficulty breathing. ',
  ' There, doctors will auscultation it, check your blood oxygenation, to assess whether it is within normal parameters, and possibly do a CT scan of the lungs, to assess whether there is some kind of commitment. ',
  ' Depending on the result, if confirmed of pneumonia, for example, doctors may opt for hospitalization. ',
  ' The pulmonologist Fernando Didier, HCor, makes a recommendation: the ideal for those who have mild symptoms, it is to try to manage them at home, resting, drinking plenty of fluids. ',
  ' Look for the basic units if no relief of symptoms. ',
  ' If the diagnosis of covid-19 is confirmed, the Ministry of Health advises that the patient should be isolated from other residents of the house. ',
  ' This also applies to suspected cases, as in Brazil there is a shortage of tests, and many mild cases are not diagnosed. ',
  ' The ideal is that the family take every precaution to prevent others who share the same space sick. Thus, the person with symptoms should pass through the shared spaces of shade and avoid sharing household items - cutlery, glasses, towels, chairs. ',
  ' She should still sleep in a separate room with good ventilation, to stay with the door closed. ',
  ' For millions of Brazilians, however, is not something simple to follow these recommendations, either because they share the property with many relatives or because they live in a one-room house alone. ',
  " And that's where the preventive measures become even more important: wash your hands often, avoid taking them in the eyes, nose and mouth, use alcohol gel for hand hygiene when you can not wash them and keep the house clean surfaces. ",
  ' In most cases, the body can fight the new coronavirus, and recovery takes place without the need for specific treatment. ',
  "'ve watched our new videos on YouTube? Sign up for our channel! ",
  ' Final YouTube post of BBC News Brazil ',
  ' YouTube Final post 2 BBC News Brazil ',
  ' YouTube Final post 3 BBC News Brazil',
];

const sanitizedByHuman = [
  ' Since the first reported case in the current pandemic coronavirus in December, China the main symptoms attributed to disease covid-19 are dry persistent cough, fever and fatigue. ',
  ' However, over the months and the rapid spread of the virus, which has reached more than 3 million people, there were many other signs associated with the disease. ', ' In view of the observations made by doctors from different countries and a large number of recent international studies (most still without critical review of academic peers), the Control Center and Prevention (CDC) of the United States decided to include five new symptoms in the list that is assigned to covid-19. ',
  ' In addition to the known cough, fever and fatigue, the CDC noted: ',
  ' These symptoms, not necessarily all, but a combination of them, may manifest between 2 and 14 days after the person contracting the virus, the CDC said. ',
  ' Increasing this signal list, experts say, will serve to determine which people need to be tested to identify whether they have the virus, and also to better understand when someone should be isolated for suspected infection covid-19. ',
  ' WHO maintains Email list ',
  ' To date, the World Health Organization (WHO) has not made changes in their list of symptoms. ',
  ' The organization points out that fever, dry cough and fatigue are the main ways in which the disease manifests itself, and some patients may also develop body aches, nasal congestion, sore throat or diarrhea. ',
  ' The site of the WHO adds that these symptoms are usually mild and develop gradually. ',
  ' Although the description of symptoms is different between the WHO and the US CDC, both agree on when to seek emergency medical help. ',
  ' They say it should be done when the patient has difficulty breathing or feel pressure or chest pain. ',
  ' What to do if you are having symptoms? ',
  ' The recommendation of the Ministry of Health is that anyone presenting flu symptoms stay home in isolation for 14 days and only look for the hospital if the worsening picture, if there is difficulty breathing. ',
  ' There, doctors will auscultation it, check your blood oxygenation, to assess whether it is within normal parameters, and possibly do a CT scan of the lungs, to assess whether there is some kind of commitment. ',
  ' Depending on the result, if confirmed of pneumonia, for example, doctors may opt for hospitalization. ',
  ' The pulmonologist Fernando Didier, HCor, makes a recommendation: the ideal for those who have mild symptoms, it is to try to manage them at home, resting, drinking plenty of fluids. ',
  ' Look for the basic units if no relief of symptoms. ',
  ' If the diagnosis of covid-19 is confirmed, the Ministry of Health advises that the patient should be isolated from other residents of the house. ',
  ' This also applies to suspected cases, as in Brazil there is a shortage of tests, and many mild cases are not diagnosed. ',
  ' The ideal is that the family take every precaution to prevent others who share the same space sick. Thus, the person with symptoms should pass through the shared spaces of shade and avoid sharing household items - cutlery, glasses, towels, chairs. ',
  ' She should still sleep in a separate room with good ventilation, to stay with the door closed. ',
  ' For millions of Brazilians, however, is not something simple to follow these recommendations, either because they share the property with many relatives or because they live in a one-room house alone. ',
  " And that's where the preventive measures become even more important: wash your hands often, avoid taking them in the eyes, nose and mouth, use alcohol gel for hand hygiene when you can not wash them and keep the house clean surfaces. ",
  ' In most cases, the body can fight the new coronavirus, and recovery takes place without the need for specific treatment. ',
];

const words = [
  'Share this with',
  'Share this post with',
  'Email',
  'Facebook',
  'Messenger',
  'Twitter',
  'WhatsApp',
  'LinkedIn',
  'Pinterest',
  'Copy this link',
  'These are external links and will open in a new window',
  'Have you watched our new videos on YouTube? Subscribe to our channel!',
  'End of YouTube post from BBC News Brasil',
  'End of YouTube post 2 of BBC News Brasil',
  'End of YouTube post 3 from BBC News Brasil',
  'Share this post with Email',
  'Facebook Messenger Messenger',
  'Twitter WhatsApp',
  'LinkedIn Copy this link',
  'These are external links and will open in a new window',
  'Final YouTube post of BBC News Brazil',
  'YouTube Final post 2 BBC News Brazil',
  'YouTube Final post 3 BBC News Brazil',
];

const line = [' WHO maintains Email list '];

// [' WHO maintains Email list '].filter((item) => arr.every(each => !item.includes(each))
// [' WHO maintains Email list '].filter((item) => arr.every(each => !item.includes(each))

// const sanitized = news.filter((item) => words.every((each) => !(similarity(item, each) > 0.4)));

// const sanitized = news.filter((item) => {
//   let max = 0;
//   words.some((each) => {
//     const value = similarity(item, each);
//     if (value > max) max = value;
//     if (value > 0.4) return true;
//   });
//   console.log((`${item}                           `).slice(0, 30), max);
// });

console.log(sanitizedByHuman.length)
