from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import urllib.request 
from time import sleep

def initDriver():
    options = Options()

    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    browser = webdriver.Chrome(executable_path="./chromedriver.exe", chrome_options=options)
    # browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()))    
    return browser

browser = initDriver()

# Access to google image in the browser
browser.get('https://images.google.com/')

# Find search input 
search_input = browser.find_element(by=By.XPATH, value='//*[@id="sbtc"]/div/div[2]/input')

# Type information which we want to search
info = 'cat'
search_input.send_keys(info)

# Then press key enter to search
search_input.send_keys(Keys.ENTER) 

src_images = []
path = 'D:\\Hoc_ky_6\\Tinh_Toan_Da_Phuong_Tien\\image\\'

for i in range(1, 10):
    try:
        img = browser.find_element(by=By.XPATH, value = '//*[@id="islrg"]/div[1]/div[' + str(i) + ']/a[1]/div[1]/img')
        src_images.append(img.get_attribute("src"))
        sleep(0.5)
    except:
        continue

# number = 0
# for src in src_images:
#     urllib.request.urlretrieve(src, path + str(number) + ".jpg")
#     number += 1
sleep(120)

browser.close()