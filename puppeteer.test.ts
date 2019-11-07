import puppeteer = require("puppeteer");

describe("OktaからSSOでAWSにログインする", () => {
    let browser;
    let page;
    beforeEach(async () => {
        browser = await puppeteer.launch({
            args: [
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-setuid-sandbox",
                "--no-sandbox",
            ],
            headless: true,
        });
        page = await browser.newPage();
        await page.goto(process.env.OKTA_URL);
    });

    it("ログイン成功", async () => {
        await page.waitFor("input[name=username]");
        await page.type("input[name=username]", process.env.OKTA_USERNAME);
        await page.waitFor("input[name=password]");
        await page.type("input[name=password]", process.env.OKTA_PASSWORD);
        await page.waitFor("input[type=submit]");
        await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            page.click("input[type=submit]"),
        ]);
        await page.waitFor("a[" + process.env.AWS_LINK + "]");
        const [newPage] = await Promise.all([
            browser
                .waitForTarget((t) => t.opener() === page.target())
                .then((t) => t.page()),
            page.click("a[" + process.env.AWS_LINK + "]"),
        ]);
        await newPage.waitFor("a[id=nav-usernameMenu]");
        const result = await newPage.$eval("a[id=nav-usernameMenu]", (item) => {
            return item.textContent.trim();
        });
        await expect(result).toBe(process.env.AWS_USERNAME);
    });

    it("ログイン失敗", async () => {
        await page.waitFor("input[name=username]");
        await page.type("input[name=username]", process.env.OKTA_USERNAME);
        await page.waitFor("input[name=password]");
        await page.type("input[name=password]", "PASSWORD123456");
        await page.waitFor("input[type=submit]");
        await Promise.all([
            page.waitFor(".okta-form-infobox-error"),
            page.click("input[type=submit]"),
        ]);
        const message = await page.$eval(".okta-form-infobox-error", (item) => {
            return item.textContent.trim();
        });
        await expect(message).toBe("Sign in failed!");
    });

    afterEach(async () => {
        await page.close();
        await browser.close();
    });
});
