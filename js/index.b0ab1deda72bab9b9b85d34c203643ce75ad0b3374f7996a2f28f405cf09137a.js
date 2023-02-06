const toast = new Axentix.Toast('Votre message a été envoyé avec succès.', {
  classes: 'primary rounded-2 shadow-2',
  direction: 'bottom',
});

const Forms = (() => {
  const apiURL = 'https://5a3t1kw5t5.execute-api.eu-west-2.amazonaws.com/prod/email';
  let societyForm, contactForm, candidateForm, spinner;

  const submitSocietyForm = (e) => {
    e.preventDefault();
    const formData = new FormData(societyForm);
    formData.append('type', 'society');

    const button = societyForm.querySelector('button');
    button.setAttribute('disabled', true);
    spinner.classList.remove('hide');
    button.querySelector('span').classList.add('hide');

    const captcha = grecaptcha.getResponse();

    axios
      .post(apiURL, { data: Object.fromEntries(formData), captcha })
      .then(() => {
        toast.change('Votre message a été envoyé avec succès.', {
          classes: 'success rounded-2 shadow-2',
        });
        toast.show();
      })
      .catch((error) => {
        console.error(error);
        toast.change("Une erreur s'est produite lors de l'envoi de votre message.", {
          classes: 'error rounded-2 shadow-2',
        });
        toast.show();
      })
      .finally(() => {
        societyForm.reset();
        button.removeAttribute('disabled');
        spinner.classList.add('hide');
        button.querySelector('span').classList.remove('hide');
        grecaptcha.reset();
      });
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    formData.append('type', 'contact');

    const button = contactForm.querySelector('button');
    button.setAttribute('disabled', true);
    spinner.classList.remove('hide');
    button.querySelector('span').classList.add('hide');

    const captcha = grecaptcha.getResponse();

    axios
      .post(apiURL, { data: Object.fromEntries(formData), captcha })
      .then(() => {
        toast.change('Votre message a été envoyé avec succès.', {
          classes: 'success rounded-2 shadow-2',
        });
        toast.show();
      })
      .catch((error) => {
        console.error(error);
        toast.change("Une erreur s'est produite lors de l'envoi de votre message.", {
          classes: 'error rounded-2 shadow-2',
        });
        toast.show();
      })
      .finally(() => {
        contactForm.reset();
        button.removeAttribute('disabled');
        spinner.classList.add('hide');
        button.querySelector('span').classList.remove('hide');
        grecaptcha.reset();
      });
  };

  const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if (encoded.length % 4 > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const submitCandidateForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(candidateForm);
    formData.append('type', 'candidate');

    const button = candidateForm.querySelector('button');
    button.setAttribute('disabled', true);
    spinner.classList.remove('hide');
    button.querySelector('span').classList.add('hide');

    const captcha = grecaptcha.getResponse();

    const output = await fileToBase64(formData.get('file'));
    formData.set('file', output);

    axios
      .post(apiURL, { data: Object.fromEntries(formData), captcha })
      .then(() => {
        toast.change('Votre candidature a été envoyé avec succès.', {
          classes: 'success rounded-2 shadow-2',
        });
        toast.show();
      })
      .catch((error) => {
        console.error(error);
        toast.change("Une erreur s'est produite lors de l'envoi de votre candidature.", {
          classes: 'error rounded-2 shadow-2',
        });
        toast.show();
      })
      .finally(() => {
        candidateForm.reset();
        button.removeAttribute('disabled');
        spinner.classList.add('hide');
        button.querySelector('span').classList.remove('hide');
        grecaptcha.reset();
      });
  };

  const setup = () => {
    spinner = document.querySelector('.spinner');

    societyForm = document.querySelector('#contact form');
    if (societyForm) societyForm.addEventListener('submit', submitSocietyForm);

    contactForm = document.querySelector('#contact-page-form form');
    if (contactForm) contactForm.addEventListener('submit', submitContactForm);

    candidateForm = document.querySelector('#candidate form');
    if (candidateForm) candidateForm.addEventListener('submit', submitCandidateForm);
  };

  return {
    setup,
  };
})();

document.addEventListener('DOMContentLoaded', Forms.setup);

// cookie
const Cookie = (() => {
  let cc;

  const setup = () => {
    cc = initCookieConsent();

    cc.run({
      current_lang: 'fr',
      languages: {
        fr: {
          consent_modal: {
            title: 'Miam des cookies !',
            description: 'Ce site utilise des cookies et vous donne le contrôle sur ce que vous souhaitez activer.',
            primary_btn: {
              text: 'Ok, tout accepter',
              role: 'accept_all', // 'accept_selected' or 'accept_all'
            },
            secondary_btn: {
              text: 'Personnaliser',
              role: 'settings', // 'settings' or 'accept_necessary'
            },
          },
          settings_modal: {
            title: 'Gestion des cookies',
            save_settings_btn: 'Sauvegarder',
            accept_all_btn: 'Autoriser tous les cookies',
            reject_all_btn: 'Interdire tous les cookies',
            close_btn_label: 'Fermer',
            cookie_table_headers: [{ col1: 'Nom' }, { col2: 'Domaine' }, { col3: 'Expiration' }],
            blocks: [
              {
                title: 'Utilisation des cookies 📢',
                description:
                  'En autorisant ces services tiers, vous acceptez le dépôt et la lecture de cookies et l\'utilisation de technologies de suivi nécessaires à leur bon fonctionnement. <a href="/politique-confidentialite" class="cc-link">Politique de confidentialité</a>.',
              },
              {
                title: "Mesure d'audience",
                description: 'Analyse du trafic du site internet pour Google.',
                toggle: {
                  value: 'analytics', // your cookie category
                  enabled: true,
                  readonly: false,
                },
                cookie_table: [
                  // list of all expected cookies
                  {
                    col1: '^_ga', // match all cookies starting with "_ga"
                    col2: 'google.com',
                    col3: '13 mois',
                    is_regex: true,
                  },
                  {
                    col1: '_gid',
                    col2: 'google.com',
                    col3: '13 mois',
                  },
                  {
                    col1: '_gat',
                    col2: 'google.com',
                    col3: '13 mois',
                  },
                ],
              },
              {
                title: "Plus d'informations",
                description:
                  'Pour toutes demandes concernant notre politique de confidentialité ou la gestion des cookies, n\'hésitez pas à <a class="cc-link" href="/contact">nous contacter</a>.',
              },
            ],
          },
        },
      },
    });
  };

  return {
    setup,
  };
})();

document.addEventListener('DOMContentLoaded', Cookie.setup);
