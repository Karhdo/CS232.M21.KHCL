from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import pandas as pd
import os
from time import sleep

def readData(fileName):
    f = open(fileName, 'r', encoding='utf-8')
    data = []
    for i, line in enumerate(f):
        try:
            line = repr(line)
            line = line[1:len(line) - 3]
            data.append(line)
        except:
            print("error write line")
    return data

def writeFile(fileName, content):
    with open(fileName, 'a', encoding='utf-8') as f1:
        f1.write(content + os.linesep)

# Khởi tạo một webdriver (cụ thể là chrome) trên máy
def initDriver():
    options = Options()

    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    browser = webdriver.Chrome(executable_path="./chromedriver.exe", chrome_options=options) 
    return browser

# ----------------------------------------------------------------
# Thiết lập cho máy tự động thực hiện login vào facebook
def loginFacebook(browser, username, password):
    browser.get("https://mbasic.facebook.com/") 

    textUserName = browser.find_element(By.ID, "m_login_email")
    textUserName.send_keys(username)

    textPassword = browser.find_element(By.NAME, "pass")
    textPassword.send_keys(password)

    # textPassword.send_keys(Keys.ENTER) 

def getContentComment(driver):
    try:
        list_comments_of_a_post = []
        links = driver.find_elements_by_xpath('//a[contains(@href, "comment/replies")]')
        ids = []
        if (len(links)):
            for link in links:
                takeLink = link.get_attribute('href').split('ctoken=')[1].split('&')[0]
                textCommentElement = driver.find_element_by_xpath(('//*[@id="' + takeLink.split('_')[1] + '"]/div/div[1]'))
                if (takeLink not in ids):
                    # writeFile('comments.csv', textCommentElement.text)
                    list_comments_of_a_post.append(textCommentElement.text)
                    ids.append(takeLink)
        return ids, list_comments_of_a_post
    except:
        print("error get link")

# Thực hiện crawl comments từ mỗi bài post
def getAmountOfComments(driver, postId, numberCommentTake, list_comments):
    try:
        driver.get("https://mbasic.facebook.com/" + str(postId))
        sumLinks, list_comments_of_a_post = getContentComment(driver)
        list_comments.append(list_comments_of_a_post)
        while(len(sumLinks) < numberCommentTake):
            try:
                nextBtn = driver.find_elements_by_xpath('//*[contains(@id,"see_next")]/a')
                if (len(nextBtn)):
                    nextBtn[0].click()
                    sumLinks_more, list_comments_of_a_post_more = getContentComment(driver)
                    list_comments.append(list_comments_of_a_post_more)
                    sumLinks.extend(sumLinks_more)
                else:
                    break
            except:
                print('Error when cralw content comment')
        return list_comments
    except:
        print("Error get cmt")

def getPostIds(driver, filePath = 'posts.csv'):
    allPosts = readData(filePath)
    sleep(2)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    shareBtn = driver.find_elements_by_xpath('//a[contains(@href, "/sharer.php")]')
    if (len(shareBtn)):
        for link in shareBtn:
            postId = link.get_attribute('href').split('sid=')[1].split('&')[0]
            if postId not in allPosts:
                writeFile(filePath, postId)

# Thực hiện việc lấy id từng bài viết của trang và lưu vào file post.csv
def getnumOfPostFanpage(driver, pageId, amount, filePath = 'posts.csv'):
    driver.get("https://touch.facebook.com/" + pageId)
    while len(readData(filePath)) < amount * 2:
        getPostIds(driver, filePath)


list_comments = []
browser = initDriver()

loginFacebook(browser, "ducducqn123.dev@gmail.com", "duyduyduc18102001")
getnumOfPostFanpage(browser, 'ConfessionUIT', 10, './comments_crawl/posts.csv')

# Duyệt qua từng id của bài post
for postId in readData('./comments_crawl/posts.csv'):
    list_comments.append(getAmountOfComments(browser, postId, 10, list_comments))

print(len(list_comments))

data = { 'List Comments': list_comments }
pd.DataFrame(data).to_csv('./comments_crawl/comments.csv')
