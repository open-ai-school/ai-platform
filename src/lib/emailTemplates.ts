const emailStrings: Record<string, Record<string, string>> = {
  en: {
    title: "Welcome to AI Educademy",
    subtitle: "Welcome to our community!",
    greeting: "Welcome",
    body: "Thank you for joining the AI Educademy community! We're excited to have you on board. Whether you're looking to learn, experiment, or collaborate, you're in the right place.",
    explore: "Here's what you can explore:",
    browsePrograms: "Browse Programs",
    tryLab: "Try AI Lab",
    joinGithub: "Join GitHub",
    closing: "Happy learning! If you have any questions, feel free to reach out to us anytime.",
    regards: "Best regards,",
    team: "The AI Educademy Team",
    footer: "You received this email because you subscribed to AI Educademy.",
    unsubscribe: "Unsubscribe",
  },
  fr: {
    title: "Bienvenue sur AI Educademy",
    subtitle: "Bienvenue dans notre communaute !",
    greeting: "Bienvenue",
    body: "Merci d'avoir rejoint la communaute AI Educademy ! Nous sommes ravis de vous accueillir. Que vous souhaitiez apprendre, experimenter ou collaborer, vous etes au bon endroit.",
    explore: "Voici ce que vous pouvez explorer :",
    browsePrograms: "Parcourir les programmes",
    tryLab: "Essayer le labo IA",
    joinGithub: "Rejoindre GitHub",
    closing: "Bon apprentissage ! Si vous avez des questions, n'hesitez pas a nous contacter.",
    regards: "Cordialement,",
    team: "L'equipe AI Educademy",
    footer: "Vous avez recu cet email car vous etes abonne a AI Educademy.",
    unsubscribe: "Se desabonner",
  },
  nl: {
    title: "Welkom bij AI Educademy",
    subtitle: "Welkom in onze community!",
    greeting: "Welkom",
    body: "Bedankt dat je lid bent geworden van de AI Educademy community! We zijn blij dat je erbij bent. Of je nu wilt leren, experimenteren of samenwerken, je bent op de juiste plek.",
    explore: "Dit kun je verkennen:",
    browsePrograms: "Programma's bekijken",
    tryLab: "AI Lab proberen",
    joinGithub: "GitHub bijtreden",
    closing: "Veel leerplezier! Als je vragen hebt, neem gerust contact met ons op.",
    regards: "Met vriendelijke groet,",
    team: "Het AI Educademy Team",
    footer: "Je ontvangt deze email omdat je je hebt ingeschreven bij AI Educademy.",
    unsubscribe: "Uitschrijven",
  },
  hi: {
    title: "AI Educademy में आपका स्वागत है",
    subtitle: "हमारे समुदाय में आपका स्वागत है!",
    greeting: "स्वागत है",
    body: "AI Educademy समुदाय में शामिल होने के लिए धन्यवाद! हमें खुशी है कि आप यहां हैं। चाहे आप सीखना चाहें, प्रयोग करना चाहें या सहयोग करना चाहें, आप सही जगह पर हैं।",
    explore: "यहां वह है जो आप एक्सप्लोर कर सकते हैं:",
    browsePrograms: "प्रोग्राम देखें",
    tryLab: "AI लैब आज़माएं",
    joinGithub: "GitHub जॉइन करें",
    closing: "शुभ शिक्षा! यदि आपके कोई प्रश्न हैं, तो बेझिझक हमसे संपर्क करें।",
    regards: "सादर,",
    team: "AI Educademy टीम",
    footer: "आपको यह ईमेल इसलिए मिला क्योंकि आपने AI Educademy की सदस्यता ली है।",
    unsubscribe: "सदस्यता रद्द करें",
  },
  te: {
    title: "AI Educademy కి స్వాగతం",
    subtitle: "మా కమ్యూనిటీకి స్వాగతం!",
    greeting: "స్వాగతం",
    body: "AI Educademy కమ్యూనిటీలో చేరినందుకు ధన్యవాదాలు! మీరు ఇక్కడ ఉన్నందుకు మేము సంతోషిస్తున్నాము. మీరు నేర్చుకోవాలనుకున్నా, ప్రయోగాలు చేయాలనుకున్నా లేదా సహకరించాలనుకున్నా, మీరు సరైన చోటికి వచ్చారు.",
    explore: "మీరు ఏమి అన్వేషించవచ్చో ఇక్కడ ఉంది:",
    browsePrograms: "ప్రోగ్రామ్‌లు చూడండి",
    tryLab: "AI ల్యాబ్ ప్రయత్నించండి",
    joinGithub: "GitHub చేరండి",
    closing: "శుభ విద్యాభ్యాసం! మీకు ఏవైనా ప్రశ్నలు ఉంటే, దయచేసి ఎప్పుడైనా మమ్మల్ని సంప్రదించండి.",
    regards: "శుభాకాంక్షలతో,",
    team: "AI Educademy టీమ్",
    footer: "మీరు AI Educademy కి సబ్‌స్క్రైబ్ చేసినందున ఈ ఇమెయిల్ అందింది.",
    unsubscribe: "అన్‌సబ్‌స్క్రైబ్",
  },
};

export function welcomeEmailHtml(email: string, locale: string = "en"): string {
  const s = emailStrings[locale] || emailStrings.en;
  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333;">
  <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f9fafb;">
    <tr>
      <td style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎓 AI Educademy</h1>
              <p style="margin: 8px 0 0 0; color: #e9d8ff; font-size: 14px;">${s.subtitle}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">${s.greeting}, ${email}! 👋</h2>
              
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${s.body}
              </p>

              <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${s.explore}
              </p>

              <!-- CTA Buttons -->
              <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 0 8px 16px 0; width: 33.33%;">
                    <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #667eea; border-radius: 6px;">
                      <tr>
                        <td style="padding: 12px; text-align: center;">
                          <a href="https://aieducademy.org/programs" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${s.browsePrograms}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0 8px 16px 0; width: 33.33%;">
                    <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #764ba2; border-radius: 6px;">
                      <tr>
                        <td style="padding: 12px; text-align: center;">
                          <a href="https://aieducademy.org/lab" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${s.tryLab}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding: 0; width: 33.34%;">
                    <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #5a67d8; border-radius: 6px;">
                      <tr>
                        <td style="padding: 12px; text-align: center;">
                          <a href="https://github.com/ai-educademy" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${s.joinGithub}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${s.closing}
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${s.regards}<br>
                <strong>${s.team}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5; text-align: center;">
                ${s.footer}<br>
                <a href="https://aieducademy.org" style="color: #667eea; text-decoration: none;">${s.unsubscribe}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
