import time
from zapv2 import ZAPv2
import asyncio
from bs4 import BeautifulSoup
import sys,re,os

def parse_report_html(html_content):
    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the "High" row
    high_row = soup.find('td', class_='risk-3')

    if high_row:
        # Extract the value associated with "High" (assuming it's in the next <td>)
        high_value = high_row.find_next('td')

        # Check if the value is greater than 0
        if high_value and int(high_value.text.strip()) > 0:
           
            return f"The 'High' value is greater: {high_value.text.strip()}"
        
        else:
            return "The 'High' value is not greater than 0."
    else:
        return "No 'High' value found in the HTML."

# Your existing code
URLS = [os.environ.get("REACT_APP_BASE_URL_SITE", "http://ocalhost:3000")]

async def run_dast(url, index):
    zap = ZAPv2(apikey=None)

    print(f'Ajax Spider target {url}')
    scan_id = zap.ajaxSpider.scan(url)

    timeout = time.time() + 60*2   # 2 minutes from now
    # Loop until the Ajax Spider has finished or the timeout has exceeded
    while zap.ajaxSpider.status == 'running':
        if time.time() > timeout:
            break
        print(f'Ajax Spider status for {url}: {zap.ajaxSpider.status}')
        await asyncio.sleep(2)

    print(f'Ajax Spider completed for {url}')
    report_path = f"test_results/report{index}.html"
    report_contents = zap.core.htmlreport()

    # Write the report contents to a file
    with open(report_path, "w") as report_file:
        report_file.write(report_contents)

    # Print a message indicating where the report was saved
    print(f"Report saved at: {report_path}")

    # Process the results as needed
    result = parse_report_html(report_contents)

# Use a regular expression to extract the numeric value
    match = re.search(r'(\d+)', result)

    if match:
        numeric_value = match.group(1)  # Get the matched numeric value
        print(numeric_value,"value")
        if int(numeric_value) > 0:
            print(f"Failed because there are {numeric_value} high risks")
            sys.exit(1)
        sys.exit(0)
  
async def main():
    tasks = [run_dast(item, index) for index, item in enumerate(URLS)]
    results = await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
