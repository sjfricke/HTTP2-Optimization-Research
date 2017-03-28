# TODO: Add to readme

# Headless browser notes
* After deep searching it seems that the only way to get the data will be from grabbing the HAR files from the browser
* To do this via script we will need to run Chrome/Firefox headless
  * This is where the issues come in
  * The Pi will not run chromium without a display buffer
  
# Solutions
  * use Xvfb to simulate the framebuffer
  * figure out how to get the --headless features in chromium to work
