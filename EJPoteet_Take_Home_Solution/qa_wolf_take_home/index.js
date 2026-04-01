// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  //set variables
  let articleDate = '';
  let higherArticleDate = '';
  let lowerArticleDate = '';
  let currentArticleIndex = 0;
  let arrayLoopIndex = 0;

  //create an array to push the dates into
  let dates = [];
  
  //Takes the date pulled from the html element, and transforms it into a date value type
  function formatDate(date) {
    date = date.slice(0, 19);
    date = new Date(date);
    return date;
  }

  //Fetches the date from https://news.ycombinator.com/newest
  async function fetchDate() {
    articleDate = formatDate(await page.locator('.age').nth(currentArticleIndex).getAttribute('title'));
    dates.push(articleDate);
    currentArticleIndex++;
  }

  //function to compare and log dates for chronological order. Note that the older date (i.e. the one from the lower article) should be passed in first.
  function compareDates(firstDate, secondDate, articleNumber) {
    if (firstDate < secondDate || +firstDate === +secondDate) {
      console.log(`Success: article #${articleNumber + 1} is in descending chronological order. ${secondDate} > ${firstDate}`);
      return;
    } else if (firstDate > secondDate) {
      throw new Error (`Error: article #${articleNumber + 1} is not in the expected chronological order. ${secondDate} < ${firstDate}`);
    } else {
      throw new Error(`Unexpected result at article #${articleNumber + 1}. Test Failure.  Article #${articleNumber} date: ${secondDate}. Article #${articleNumber + 1} date: ${firstDate}.`);
    }
  }


  //loop through the first 100 articles, and push their posted dates into our array to keep them in order grabbed from the website
  for (i = 0; i < 100; i++) {
    //every 30 articles we need to click the More button to load the next 30 articles. There's a chance one of the article titles could contain the word "more", so we want to grab the last element with that text.
    if (i % 30 === 0) {
      await page.getByText('More').last().click();
      currentArticleIndex = 0;
      await fetchDate();
    //otherwise we can just proceed to the next article, and grab the date
    } else {
      await fetchDate();
    }
  }

  //finally we can loop through our array, and compare the dates
  for (date of dates) {
    //If this is the first loop, there is nothing to yet compare
    if (arrayLoopIndex === 0) {
    lowerArticleDate = date;
    arrayLoopIndex++;
    //and now we're pod racing. Sets the previous array index to a different variable, then compares it to the current array index date.
    } else {
    higherArticleDate = lowerArticleDate;
    lowerArticleDate = date;
    compareDates(lowerArticleDate, higherArticleDate, arrayLoopIndex);
    arrayLoopIndex++;
    }
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();