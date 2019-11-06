import { Selector } from "testcafe";

fixture("OktaからSSOでAWSにログインする").page(process.env.OKTA_URL);

test("ログイン成功", async (t) => {
    const element = await Selector("a[class=app-button]")
        .child("img")
        .withAttribute("alt", "Graphic Link Amazon Web Services");
    await t
        .typeText(Selector("input[name=username]"), process.env.OKTA_USERNAME)
        .typeText(Selector("input[name=password]"), process.env.OKTA_PASSWORD)
        .click("input[type=submit]")
        .click(element);
    const result = (await Selector("a[id=nav-usernameMenu]").innerText).trim();
    await t.expect(result).eql(process.env.AWS_USERNAME);
});

test("ログイン失敗", async (t) => {
    await t
        .typeText(Selector("input[name=username]"), process.env.OKTA_USERNAME)
        .typeText(Selector("input[name=password]"), "PASSWORD123456")
        .click("input[type=submit]");
    const message = (await Selector(".okta-form-infobox-error")
        .innerText).trim();
    await t.expect(message).eql("Sign in failed!");
});
