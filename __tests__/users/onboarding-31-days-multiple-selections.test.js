const puppeteer = require('puppeteer');

describe('Tests the "Onboarding > 31 Days" Filter', () => {
  let browser;
  let page;

  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new', //change headless to 'new' to check the tests in browser
      ignoreHTTPSErrors: true,
      args: ['--incognito', '--disable-web-security'],
      devtools: false,
    });
    page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (interceptedRequest) => {
      const url = interceptedRequest.url();
      if (url === 'https://api.realdevsquad.com/tasks/sunny-s') {
        // When we encounter the respective api call we respond with the below response
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
          body: JSON.stringify(userDetailsApi),
        });
      } else if (url === 'https://api.realdevsquad.com/users/self') {
        // When we encounter the respective api call we respond with the below response
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
          body: JSON.stringify(superUserDetails), // Y contains the json of a superuser in the server which will grant us the access to view the page without locks
        });
      } else {
        interceptedRequest.continue();
      }
    });
    await page.goto('http://localhost:8000/users/?dev=true');

    await page.waitForNetworkIdle();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should gives results for Onboarding > 31 SELECTED', async () => {
    const taskDiv = await page.$('.filter-button');
    expect(taskDiv).toBeTruthy();

    await taskDiv.click();

    await page.waitForTimeout(2000);
    const elements = await page.$$('.checkbox-label');

    // Checking if elements are found
    expect(elements).toBeTruthy();

    const checkbox = await page.$('#ONBOARDING31DAYS');
    await checkbox.click();

    const applyfilterbutton = await page.$('.apply-filter-button');
    expect(applyfilterbutton).toBeTruthy();
    await applyfilterbutton.click();

    await page.waitForTimeout(500);
  });
  it('should gives results for ACTIVE SELECTED', async () => {
    const taskDiv = await page.$('.filter-button');
    expect(taskDiv).toBeTruthy();

    await taskDiv.click();

    // await page.waitForTimeout(2000);  enable to see the tests in actions
    const elements = await page.$$('.checkbox-label');

    const clear = await page.$('#clear-button');
    await clear.click();

    // await page.waitForTimeout(2000);     enable to see the tests in actions

    const taskDiv2 = await page.$('.filter-button');
    await taskDiv2.click();
    expect(taskDiv2).toBeTruthy();
    // await page.waitForTimeout(2000); enable to see the tests in actions
    expect(elements).toBeTruthy();

    const checkbox = await page.$('#ACTIVE');
    await checkbox.click();

    const applyfilterbutton = await page.$('.apply-filter-button');
    expect(applyfilterbutton).toBeTruthy();
    await applyfilterbutton.click();

    await page.waitForTimeout(500);
  });

  it('should gives results for both ACTIVE & Onboarding > 31 SELECTED', async () => {
    const taskDiv = await page.$('.filter-button');
    expect(taskDiv).toBeTruthy();

    await taskDiv.click();

    // await page.waitForTimeout(2000);  enable to see the tests in actions
    const elements = await page.$$('.checkbox-label');

    // Checking if elements are found
    expect(elements).toBeTruthy();

    const clear = await page.$('#clear-button');
    await clear.click();

    // await page.waitForTimeout(2000);   enable to see the tests in actions

    const taskDiv2 = await page.$('.filter-button');
    await taskDiv2.click();
    expect(taskDiv2).toBeTruthy();
    // await page.waitForTimeout(2000);  enable to see the tests in actions
    const checkbox = await page.$('#ONBOARDING31DAYS');
    await checkbox.click();
    // await page.waitForTimeout(2000);  enable to see the tests in actions
    const checkbox2 = await page.$('#ACTIVE');
    await checkbox2.click();
    // await page.waitForTimeout(2000);   enable to see the tests in actions
    const applyfilterbutton = await page.$('.apply-filter-button');
    expect(applyfilterbutton).toBeTruthy();
    await applyfilterbutton.click();

    await page.waitForTimeout(500);
  });
});
