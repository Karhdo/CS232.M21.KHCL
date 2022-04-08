from selenium import webdriver
from selenium.webdriver.common.keys  import Keys
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import csv
import argparse

# Config parse
parser = argparse.ArgumentParser()
parser.add_argument('--num_article', type=int, help='number article to get crawling', default=2)
parser.add_argument('--num_commnet', type=int, help='number comment ber post', default=2)
parser.add_argument('--save_file', type=str, default='data/comments.csv')
args = vars(parser.parse_args())

# Open Chrome and access to url
driver = webdriver.Chrome(executable_path="./chromedriver.exe")
url = 'https://vnexpress.net/'
driver.get(url)

# Get element article
page_source = BeautifulSoup(driver.page_source)
element_title_articles = page_source.find_all('h3', class_ = "title-news")

# Get title name and link every article article
all_title_link = []
all_title_name = []
all_comments = []

for element in element_title_articles:
    all_title_name.append(element.find('a').get('title'))
    all_title_link.append(element.find('a').get('href'))

# Get all element comments
for link in all_title_link[:min(len(all_title_link),  args['num_article'])]:
    driver.get(link)
    page_source = BeautifulSoup(driver.page_source)
    time.sleep(2)

    element_comments = set()
    num_of_comment = len(element_comments)

    while num_of_comment < args['num_commnet']:
        try:
            comments = page_source.find_all('div', class_='content-comment')
            element_comments.update(comments)
        except:
            break

        try:
            btn = driver.find_element(By.ID, 'show_more_coment')
        except:
            break
        driver.execute_script ("arguments[0].click();",btn)

    # Get comment text every element comments
    for cmt in list(element_comments):
        try:
            cmt_text = cmt.find('p', 'full_content')
            all_comments.append([cmt_text.text])
        except:
            cmt_text = cmt.find('p', 'content_more')
            all_comments.append([cmt_text.text])

driver.close()

# Write data to file .csv
header = ['Comment']
with open(args['save_file'], 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)

    # write the header
    writer.writerow(header)

    # write multiple rows
    writer.writerows(all_comments)