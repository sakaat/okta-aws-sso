Feature("OktaからSSOでAWSにログインする");

Scenario("ログイン成功", (I) => {
    I.amOnPage(process.env.OKTA_URL);
    I.fillField("username", process.env.OKTA_USERNAME);
    I.fillField("password", process.env.OKTA_PASSWORD);
    I.click("Sign In");
    const element = locate("a").withAttr({
        href: process.env.AWS_URL,
    });
    I.waitForElement(element, 10);
    I.click(element);
    // OPTIMIZE: 要素を待つ
    I.wait(20);
    I.see(process.env.AWS_USERNAME);
});

Scenario("ログイン失敗", (I) => {
    I.amOnPage(process.env.OKTA_URL);
    I.fillField("username", process.env.OKTA_USERNAME);
    I.fillField("password", "PASSWORD123456");
    I.click("Sign In");
    I.waitForElement(".okta-form-infobox-error", 5);
    I.see("Sign in failed!");
});
