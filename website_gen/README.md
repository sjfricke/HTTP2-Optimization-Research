# Website Generator
This is a simple bash script to generate a fake website

## script_script.sh
* This calls `website_gen.sh` multiple time with a set of parameters
* `website_gen.sh` does all the generating while this just lets you easily create your permutations of sites
* When it is done running it creates a list (in javascript format) of all the files generated

## website_gen.sh
This creates a website by the parameters you pass it
* Usage (all intputs are ints except for alternate options)
  * `./website_gen.sh <AlternateOption/NumberofObjects> <ObjectStructure> <ObjectType> <MinSizeObject> <TotalWebsiteSize> <BS> <WebsiteName>`
* **Alternate Options**
 * -help prints this page
 * -purge deletes all websites from /var/www/html and sets web counter to 0
   * Example: `./website_gen.sh -purge`
* **NumberofObjects**
  * how many objects in a webpage
* **ObjectStructure** 
  * How the objects are arranged in HTML top to bottom
	* `0` All Max Size
	* `1` Ascending Size
	* `2` Descedning Size
	* `3` Random Placement
* **ObjectType** 
  *What type of objects to use
	* `0` All js
	* `1` All css
	* `2` All img
	* `3` All garbage ahref
	* `4` Random types (multiple of each)
* **ObjectMinSize**
  * How small in bytes - Only used for random number generator
* **TotalWebsiteSize**
  * How large in bytes (TotalWebsiteSize = Sum(objectsizes))
* **BS**
  * Buffer strategy for dd (how fast it will generate) - BE CAREFUL WITH THIS
  * If your `TotalWebsiteSize` is greater then 1000000 (1MB) then set to 100
  * Otherwise leave as 1 to be safe
* **WebsiteName**
  * Custom name of website used by script script 

### Example
* `./website_gen.sh 5 0 1 0 2000000 100 myNewSite`
  * This will create a website with 5 CSS files of all the same size and the site will be a total of 2MB large
* `./website_gen.sh 3 2 3 0 10000 1 smallImage`
  * This will create a website with 3 image files of 10KB total and the will be listed in descending size order on the webpage 

### Note
* Sizes of the objects will be as following:
  * All Max size = (TotalWebsiteSize / NumberOfObjects)
  *  Asc/Desc = (TotalWebsiteSize/(NumberofObjects^2 + NumberofObjects)) * n where n = 1 to = NumberofObjects
	 * Dont ask why, its because MATH
	 * Random = Same generation as Asc but placed in a random order