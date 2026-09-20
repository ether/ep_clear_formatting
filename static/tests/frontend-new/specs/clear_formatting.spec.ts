import {expect, test} from '@playwright/test';
import {
  getPadBody,
  getPadOuter,
  goToNewPad,
  selectAllText,
  writeToPad,
} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// The "Clear Formatting" entry lives in the Format menu contributed by
// ep_file_menu_toolbar, which is not installed alongside this plugin in CI.
// The click handler is delegated from <body>, so adding the element is enough
// to drive it.
const addClearFormattingEntry = async (page) => {
  const outer = await getPadOuter(page);
  await outer.evaluate(() => {
    if (document.getElementById('clearFormatting')) return;
    const a = document.createElement('a');
    a.id = 'clearFormatting';
    a.textContent = 'Clear Formatting';
    document.body.appendChild(a);
  });
};

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_clear_formatting', () => {
  test('pad loads with plugin installed', async ({page}) => {
    const padBody = await getPadBody(page);
    await expect(padBody).toBeVisible();
  });

  test('clears character formatting', async ({page}) => {
    const padBody = await getPadBody(page);
    await writeToPad(page, 'formatted text');
    await selectAllText(page);
    await page.keyboard.press('Control+b');
    await expect(padBody.locator('b')).toHaveCount(1);

    await addClearFormattingEntry(page);
    await selectAllText(page);
    await (await getPadOuter(page)).locator('#clearFormatting').click();

    await expect(padBody.locator('b')).toHaveCount(0);
  });

  test('clears line attributes too', async ({page}) => {
    // Regression test for ether/ether-plugins#40: ace_setAttributeOnSelection
    // only clears character attributes, so line attributes (ep_align's
    // `align`, headings, line spacing, lists, …) used to survive. A list is
    // the one line attribute core provides on its own, so it is what this
    // test can exercise without installing another plugin.
    const padBody = await getPadBody(page);
    await writeToPad(page, 'a list item');
    await selectAllText(page);
    await (await getPadOuter(page)).locator('.buttonicon-insertunorderedlist').click();
    await expect(padBody.locator('ul li')).toHaveCount(1);

    await addClearFormattingEntry(page);
    await selectAllText(page);
    await (await getPadOuter(page)).locator('#clearFormatting').click();

    await expect(padBody.locator('ul')).toHaveCount(0);
    await expect(padBody).toContainText('a list item');
  });
});
