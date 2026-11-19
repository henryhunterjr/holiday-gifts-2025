"""Run with Henry and ordinary-account session JSON paths, never credentials.

python3 scripts/test-admin-permissions.py /secure/henry.json /secure/ordinary.json
Uses the local preview and makes read-only authenticated requests.
"""
import asyncio
import json
import sys
from playwright.async_api import async_playwright


async def check(browser, session_file, admin):
    with open(session_file) as source:
        minted = json.load(source)
    context = await browser.new_context(viewport={"width": 1280, "height": 1800})
    page = await context.new_page()
    await page.goto("http://localhost:8080")
    await page.evaluate("([k,v])=>localStorage.setItem(k,v)", [minted["storage_key"], json.dumps(minted["session"])])
    await page.goto("http://localhost:8080/admin/analytics/")
    if admin:
        await page.get_by_role("heading", name="Traffic sources & campaigns").wait_for()
    else:
        await page.get_by_role("status").filter(has_text="Your account does not have admin access.").wait_for()
    result = await page.evaluate("""async () => {
        const {supabase} = await import('/src/integrations/supabase/client.ts');
        const report = await supabase.rpc('get_guide_report', {days:30,env:'production'});
        const entries = await supabase.from('giveaway_entries').select('id');
        return {reportAllowed: !report.error, reportCode: report.error?.code,
                giveawayAllowed: !entries.error, giveawayRows: entries.data?.length};
    }""")
    assert result["reportAllowed"] == admin, "Reports must require an admin role"
    if admin:
        assert result["giveawayAllowed"], "Henry must be able to read giveaway entries"
    else:
        assert result["reportCode"] == "42501", "Server must deny ordinary-account report access"
        assert result["giveawayRows"] == 0, "Ordinary accounts must not read giveaway entries"
    await context.close()


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        await check(browser, sys.argv[1], True)
        await check(browser, sys.argv[2], False)
        await browser.close()
    print("Admin permissions passed: Henry can read reports; ordinary accounts cannot read reports or giveaway entries.")


if __name__ == "__main__":
    asyncio.run(main())