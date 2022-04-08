
from selenium import webdriver
from time  import sleep
import pandas as pd

import os

#1 Khai bao bien browser
browser=webdriver.Chrome(executable_path="./chromedriver.exe")

# #2. Mo thu 1 trang web
browser.get("https://scholar.google.com/citations?hl=vi&user=p3vHDZYAAAAJ")
sleep(5)

showmore_paper = browser.find_element_by_id('gsc_bpf_more')
showmore_paper.click()
sleep(5)

title_paper=[]
author_paper=[]
year_paper=[]

paper_list = browser.find_elements_by_class_name('gsc_a_tr')

for paper in paper_list:
    title = paper.find_element_by_class_name('gsc_a_at')
    authors = paper.find_element_by_class_name('gs_gray')
    year=paper.find_element_by_class_name('gsc_a_h')

    title_paper.append(title.text)
    author_paper.append(authors.text)
    year_paper.append(year.text)

data={'Title': title_paper,'Authors':author_paper,'Year':year_paper}

pd.DataFrame(data).to_csv('./csv/paper.csv')

browser.close()
