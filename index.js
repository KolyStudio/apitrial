const express = require('express');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const dayjs = require('dayjs');

const app = express();
const port = 8080;

let authCookies = '';
let authCookies2 = '';

var cors = require('cors');

app.use(cors())


// Cette fonction effectue le processus de connexion
async function performLogin() {
  try {
    const browser = await puppeteer.launch(
      
    );
    const page = await browser.newPage();

    await page.goto('https://www.prelinker.com');
    await page.click('button:text("connexion")');
    await page.type('#email-address', 'PierreTorres');
    await page.type('#password', 'agdHn8DMnc#J!zjm');

    await Promise.all([
      page.waitForNavigation(),
      await page.click('button:text("Connexion")'),
    ]);

    const cookies = await page.cookies();
    authCookies = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    await browser.close();
    console.log('Successfully logged in.');
  } catch (error) {
    console.error('Error during login:', error);
  }
}

async function performLoginMel() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto('https://www.prelinker.com');
      await page.click('button:text("connexion")');
      await page.type('#email-address', 'Meldje');
      await page.type('#password', 'PANLDhGAd5Ho#gBp');
  
      await Promise.all([
        page.waitForNavigation(),
        await page.click('button:text("Connexion")'),
      ]);
  
    
      const cookies = await page.cookies();
      authCookies2 = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  
      await browser.close();
      console.log('Successfully logged in.');
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

// Appel initial de la fonction de connexion
performLogin();
performLoginMel()

// Configuration de l'intervalle pour appeler la fonction de connexion toutes les heures
const loginInterval = setInterval(performLogin, 60 * 60 * 1000); // Toutes les heures
const loginIntervalMel = setInterval(performLoginMel, 60 * 60 * 1000); // Toutes les heures


// Gestionnaire de route pour la fonction /login
app.get('/login', (req, res) => {
  res.sendStatus(200);
});

app.get('/loginmel', (req, res) => {
    res.sendStatus(200);
  });

// Gestionnaire de route pour la fonction /today
app.get('/today', async (req, res) => {
  try {
    if (!authCookies) {
      // Redirige vers /login pour déclencher le processus de connexion
      return res.redirect('/login');
    }

    const today = dayjs().format('YYYY-MM-DD');
    const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${today}%20-%20${today}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
    const myHeaders = {
      'cookie': authCookies,
    };

    const response = await fetch(targetURL, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
  }
});

app.get('/todaymel', async (req, res) => {
    try {
      if (!authCookies2) {
        // Redirige vers /login pour déclencher le processus de connexion
        return res.redirect('/loginmel');
      }
  
      const today = dayjs().format('YYYY-MM-DD');
      const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${today}%20-%20${today}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
      const myHeaders = {
        'cookie': authCookies2,
      };
  
      const response = await fetch(targetURL, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      });
  
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
    }
  });

// Gestionnaire de route pour la fonction /yesterday
app.get('/yesterday', async (req, res) => {
  try {
    if (!authCookies) {
      // Redirige vers /login pour déclencher le processus de connexion
      return res.redirect('/login');
    }

    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${yesterday}%20-%20${yesterday}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
    const myHeaders = {
      'cookie': authCookies,
    };

    const response = await fetch(targetURL, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
  }
});

app.get('/yesterdaymel', async (req, res) => {
    try {
      if (!authCookies2) {
        // Redirige vers /login pour déclencher le processus de connexion
        return res.redirect('/login');
      }
  
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${yesterday}%20-%20${yesterday}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
      const myHeaders = {
        'cookie': authCookies2,
      };
  
      const response = await fetch(targetURL, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      });
  
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
    }
  });

// Gestionnaire de route pour la fonction /month
app.get('/month', async (req, res) => {
  try {
    if (!authCookies) {
      // Redirige vers /login pour déclencher le processus de connexion
      return res.redirect('/login');
    }

    const firstMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${firstMonth}%20-%20${today}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
    const myHeaders = {
      'cookie': authCookies,
    };

    const response = await fetch(targetURL, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
  }
});

app.get('/monthmel', async (req, res) => {
    try {
      if (!authCookies2) {
        // Redirige vers /login pour déclencher le processus de connexion
        return res.redirect('/login');
      }
  
      const firstMonth = dayjs().startOf('month').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${firstMonth}%20-%20${today}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
      const myHeaders = {
        'cookie': authCookies2,
      };
  
      const response = await fetch(targetURL, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      });
  
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
    }
  });
  

// Gestionnaire de route pour la fonction /detailed
app.get('/detailed', async (req, res) => {
  try {
    if (!authCookies) {
      // Redirige vers /login pour déclencher le processus de connexion
      return res.redirect('/login');
    }

    const datee1 = dayjs(req.query.date1).format('YYYY-DD-MM');
    const datee2 = dayjs(req.query.date2).format('YYYY-DD-MM');

    const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${datee1}%20-%20${datee2}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
    const myHeaders = {
      'cookie': authCookies,
    };

    const response = await fetch(targetURL, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
  }
});

app.get('/detailedmel', async (req, res) => {
    try {
      if (!authCookies2) {
        // Redirige vers /login pour déclencher le processus de connexion
        return res.redirect('/login');
      }
  
      const datee1 = dayjs(req.query.date1).format('YYYY-DD-MM');
      const datee2 = dayjs(req.query.date2).format('YYYY-DD-MM');
  
      const targetURL = `https://www.prelinker.com/stats/analytics/data?daterange=${datee1}%20-%20${datee2}&select%5B%5D=token_2&select%5B%5D=token_3&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=volume_trial&select%5B%5D=volume_upsell&select%5B%5D=volume_bill&select%5B%5D=volume_rebill&select%5B%5D=volume_chargeback&select%5B%5D=payout_trial&select%5B%5D=payout_upsell&select%5B%5D=payout_lead&select%5B%5D=payout_pending&select%5B%5D=payout_bill&select%5B%5D=payout_rebill&select%5B%5D=payout_chargeback&select%5B%5D=payout&filter%5Bdevice%5D=&filter%5Bsite_group%5D=&filter%5Bchannel%5D=&filter%5Btype_payout%5D=&filter%5Btoken_3%5D=&filter%5Btoken_5%5D=&order=14%2Cdesc&compact=1&1691403777542`;
      const myHeaders = {
        'cookie': authCookies2,
      };
  
      const response = await fetch(targetURL, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      });
  
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
    }
  });

// Gestionnaire de route pour la fonction /graph
app.get('/graph', async (req, res) => {
  try {
    if (!authCookies) {
      // Redirige vers /login pour déclencher le processus de connexion
      return res.redirect('/login');
    }

    const lastday = dayjs().subtract(31, 'day').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    const targetURL = `https://www.prelinker.com/stats/analytics/data?select%5B%5D=date&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=payout&compact=1&acme=wid.90642&daterange=${lastday}%20-%20${today}`;
    const myHeaders = {
      'cookie': authCookies,
    };

    const response = await fetch(targetURL, {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
  }
});

app.get('/graphmel', async (req, res) => {
    try {
      if (!authCookies2) {
        // Redirige vers /login pour déclencher le processus de connexion
        return res.redirect('/login');
      }
  
      const lastday = dayjs().subtract(31, 'day').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      const targetURL = `https://www.prelinker.com/stats/analytics/data?select%5B%5D=date&select%5B%5D=volume_click&select%5B%5D=volume_registration&select%5B%5D=payout&compact=1&acme=wid.90642&daterange=${lastday}%20-%20${today}`;
      const myHeaders = {
        'cookie': authCookies2,
      };
  
      const response = await fetch(targetURL, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      });
  
      const data = await response.text();
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Erreur lors de la récupération des données depuis l\'URL cible.' });
    }
  });

// Arrêter l'intervalle lorsque le serveur est arrêté
process.on('SIGINT', () => {
  clearInterval(loginInterval);
  process.exit();
});

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});