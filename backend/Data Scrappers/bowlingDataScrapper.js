const puppeteer = require("puppeteer");
const fs = require("fs");

const baseURL =
  "https://stats.espncricinfo.com/ci/engine/stats/index.html?class=6;filter=advanced;orderby={orderby};season={season};size=10;template=results;trophy=117;type=bowling;view=season";

const statsConfig = {
  purpleCap: { orderby: "wickets", statKey: "wickets", colIndex: 6 },
  economy: { orderby: "economy_rate", statKey: "economy_rate", colIndex: 9 },
  bestBowling: { orderby: "bbi", statKey: "bbi", colIndex: 7 },
  maidens: { orderby: "maidens", statKey: "maidens", colIndex: 4 }
};

const seasons = [2025, 2024, 2023, 2022, 2021];

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const finalData = {};

  for (const [key, config] of Object.entries(statsConfig)) {
    finalData[key] = {};

    for (const season of seasons) {
      const url = baseURL
        .replace("{orderby}", config.orderby)
        .replace("{season}", season);

      console.log(`Scraping ${key} - ${season}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("table.engineTable");

      const seasonData = await page.evaluate((colIndex, statKey) => {
        const rows = Array.from(
          document.querySelectorAll("table.engineTable tr")
        );
        const data = [];

        for (let i = 0; i < rows.length; i++) {
          const cols = rows[i].querySelectorAll("td");
          if (cols.length < 15) continue;

          data.push({
            player: cols[0].innerText.trim(),
            matches: cols[1].innerText.trim(),
            innings: cols[2].innerText.trim(),
            [statKey]: cols[colIndex].innerText.trim(),
          });
        }

        return data;
      }, config.colIndex, config.statKey);

      finalData[key][season] = seasonData;
    }
  }

  await browser.close();

  fs.writeFileSync("./data/bowlingStats.json", JSON.stringify(finalData, null, 2));
  console.log("✅ All stats scraped and saved to bowlingStats.json");
})();
