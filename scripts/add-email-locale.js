const fs = require('fs');
const path = require('path');

const msgs = {
  en: {
    emailSentTitle: 'We received your inquiry.',
    emailWarningText: 'Your message was saved, but we had a technical issue sending the email notification. Please also reach us at \u202a+20 120 014 2107\u202c or info@thecitadels.com.'
  },
  ar: {
    emailSentTitle: '\u0644\u0642\u062f \u062a\u0644\u0642\u064a\u0646\u0627 \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u0643\u0645.',
    emailWarningText: '\u062a\u0645 \u062d\u0641\u0638 \u0631\u0633\u0627\u0644\u062a\u0643\u060c \u0644\u0643\u0646 \u0648\u0627\u062c\u0647\u0646\u0627 \u0645\u0634\u0643\u0644\u0629 \u062a\u0642\u0646\u064a\u0629 \u0641\u064a \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0639\u0627\u0631. \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0645\u0628\u0627\u0634\u0631\u0629\u064b \u0639\u0644\u0649 \u202a+20 120 014 2107\u202c \u0623\u0648 info@thecitadels.com.'
  },
  fr: {
    emailSentTitle: 'Nous avons bien recu votre demande.',
    emailWarningText: 'Votre message a ete sauvegarde, mais un probleme technique nous a empeche d\'envoyer la notification. Contactez-nous au +20 120 014 2107 ou info@thecitadels.com.'
  },
  it: {
    emailSentTitle: 'Abbiamo ricevuto la tua richiesta.',
    emailWarningText: 'Il tuo messaggio e stato salvato, ma si e verificato un problema tecnico nell\'invio della notifica. Contattaci al +20 120 014 2107 o info@thecitadels.com.'
  }
};

for (const lang of ['en', 'ar', 'fr', 'it']) {
  const p = path.join(__dirname, '..', 'locales', lang + '.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  data.contact.emailSentTitle = msgs[lang].emailSentTitle;
  data.contact.emailWarningText = msgs[lang].emailWarningText;
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated ' + lang);
}
