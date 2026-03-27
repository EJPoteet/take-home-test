// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  //set variables to be compared for chronological order
  let higherArticleDate = '';
  let lowerArticleDate = '';
  let currentArticleIndex = 0;
  
  //Takes the date pulled from the html element, and transforms it into a date value type
  function formatDate(date) {
    date = date.slice(0, 19);
    date = new Date(date);
    return date
  }

  //function to compare and log dates for chronological order. Note that the older date (i.e. the one from the lower article) should be passed in first.
  function compareDates(firstDate, secondDate, articleNumber) {
    if (firstDate < secondDate) {
      console.log(`Success: article #${articleNumber + 1} is in descending chronological order. ${secondDate} > ${firstDate}`)
      return
    } else if (firstDate > secondDate) {
      throw new Error (`Error: article #${articleNumber + 1} is not in the expected chronological order. ${secondDate} < ${firstDate}`)
    } else {
      throw new Error(`Unexpected result at article #${articleNumber + 1}. Test Failure.  Article #${articleNumber} date: ${secondDate}. Article #${articleNumber + 1} date: ${firstDate}.`)
    }
  }
 
  //loop through the first 100 articles, and call the functions that we set up earlier to fromat and compare dates.
  for (i = 0; i < 100; i++) {
    //if it's the very first article, we don't need to compare to anything yet.
    if (i == 0) {
      lowerArticleDate = formatDate(await page.locator('.age').nth(currentArticleIndex).getAttribute('title'));
      currentArticleIndex++
    }
    //every 30 articles, we need to click the More button to load the next 30 articles.
    else if (i % 30 === 0) {
      await page.getByText('More').last().click();
      currentArticleIndex = 0
      higherArticleDate = lowerArticleDate;
      lowerArticleDate = formatDate(await page.locator('.age').nth(currentArticleIndex).getAttribute('title'));
      compareDates(lowerArticleDate, higherArticleDate, i);
      currentArticleIndex++
    //otherwise we get the happy path
    } else {
      higherArticleDate = lowerArticleDate;
      lowerArticleDate = formatDate(await page.locator('.age').nth(currentArticleIndex).getAttribute('title'));
      compareDates(lowerArticleDate, higherArticleDate, i);
      currentArticleIndex++
    }
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();