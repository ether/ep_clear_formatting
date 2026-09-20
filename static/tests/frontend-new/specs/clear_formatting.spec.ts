import {expect, test} from '@playwright/test';
import {
  clearPadContent,
  getPadBody,
  goToNewPad,
  selectAllText,
  writeToPad,
} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

// The "Clear Formatting" entry lives in the Format menu contributed by
// ep_file_menu_toolbar, which is not installed alongside this plugin in CI.
// The click handler is delegated from the pad page's <body>, so adding the
// element to that document is enough to drive it.
const addClearFormattingEntry = async (page) => {
  await page.evaluate(() => {
    if (document.getElementById('clearFormatting')) return;
    const a = document.createElement('a');
    a.id = 'clearFormatting';
    a.textContent = 'Clear Formatting';
    document.body.appendChild(a);
  });
};

const clearFormatting = async (page) => {
  await selectAllText(page);
  await page.locator('#clearFormatting').click();
};

// ether/ether-plugins#42: clearing formatting on a line that carries a line
// attribute used to throw an uncaught RangeError out of
// AttributeManager.setAttributesOnRange. Fail the test on any page error.
let pageErrors: string[];

test.beforeEach(async ({page}) => {
  pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await goToNewPad(page);
  // A new pad starts with the multi-line `defaultPadText` from settings, and
  // these tests count formatting elements over the whole document.
  await clearPadContent(page);
});

test.describe('ep_clear_formatting', () => {
  test('clears character formatting without applying any', async ({page}) => {
    const padBody = await getPadBody(page);
    await writeToPad(page, 'formatted text');
    await selectAllText(page);
    await page.locator('.buttonicon-bold').first().click({force: true});
    await expect(padBody.locator('b')).toHaveCount(1);

    await addClearFormattingEntry(page);
    await clearFormatting(page);

    await expect(padBody.locator('b')).toHaveCount(0);
    // Passing `false` instead of '' used to *set* every attribute in the pad's
    // pool, so clearing formatting made the text italic/underlined/struck.
    await expect(padBody.locator('i')).toHaveCount(0);
    await expect(padBody.locator('u')).toHaveCount(0);
    await expect(padBody.locator('s')).toHaveCount(0);
    await expect(padBody).toContainText('formatted text');
    expect(pageErrors).toEqual([]);
  });

  test('clears line attributes too', async ({page}) => {
    // Regression test for ether/ether-plugins#40: ace_setAttributeOnSelection
    // only clears character attributes, so line attributes (ep_align's
    // `align`, headings, line spacing, lists, …) used to survive. A list is
    // the one line attribute core provides on its own, so it is what this
    // test can exercise without installing another plugin — it goes through
    // the identical removeAttributeOnLine path as `align`.
    const padBody = await getPadBody(page);
    await writeToPad(page, 'a list item');
    await selectAllText(page);
    await page.locator('.buttonicon-insertunorderedlist').first().click({force: true});
    await expect(padBody.locator('ul li')).toHaveCount(1);

    await addClearFormattingEntry(page);
    await clearFormatting(page);

    await expect(padBody.locator('ul')).toHaveCount(0);
    await expect(padBody).toContainText('a list item');
    expect(pageErrors).toEqual([]);
  });

  test('clears a bold list item without throwing (ether-plugins#42)', async ({page}) => {
    const padBody = await getPadBody(page);
    await writeToPad(page, 'bold list item');
    await selectAllText(page);
    await page.locator('.buttonicon-insertunorderedlist').first().click({force: true});
    await expect(padBody.locator('ul li')).toHaveCount(1);
    await selectAllText(page);
    await page.locator('.buttonicon-bold').first().click({force: true});
    await expect(padBody.locator('b')).toHaveCount(1);

    await addClearFormattingEntry(page);
    await clearFormatting(page);

    await expect(padBody.locator('ul')).toHaveCount(0);
    await expect(padBody.locator('b')).toHaveCount(0);
    await expect(padBody).toContainText('bold list item');
    expect(pageErrors).toEqual([]);
  });
});
