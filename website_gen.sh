#! /bin/bash

### usage
#./website_gen.sh #ofObjects #ObjectStructure #ObjectType #MinSizeObject #MaxSizeObject

#ofObjects - how many objects in a webpage

#ObjectStructure - How the objects are arranged in HTML top to bottom
## 0 All Max Size
## 1 Ascending Size
## 2 Descedning Size
## 3 Random Placement

#ObjectType - What type of objects to use
## 0 All js
## 1 All css
## 2 All img
## 3 All garbage ahref
## 4 Random types (multiple of each)

#ObjectMinSize - how small in bytes

#ObjectMaxSize - how large in bytes

#BS - buffer strategy for dd

###Note 
#For ObjectStructure 1,2,3 the size of the files will be assigned
#a size from min size to max size with a diffrence of (max - min)/#ofObjects

#----------------------------------------------------------------------------
###Constants
MAIN_WEB_FP="/var/www/"
COUNT_FP=$MAIN_WEB_FP".web_count"
HTML_DOCTYPE="<!DOCTYPE thml>"

###Input Paramaeters
OBJ_COUNT=$1
OBJ_STRUCT=$2
OBJ_TYPE=$3
OBJ_MIN_SIZE=$4
OBJ_MAN_SIZE=$5
BS=$6

### directory gen

if [ -a $COUNT_FP ]
	then 
		WEB_NUM="$(cat $COUNT_FP)"
		let "WEB_NUM++"
		echo $WEB_NUM > $COUNT_FP
	else
		WEB_NUM=0
		echo 0 > $COUNT_FP
fi

WEB_FP=$MAIN_WEB_FP"/http/"$WEB_NUM

mkdir $WEB_FP
INDEX_FP=$WEB_FP"/index.html" 
OBJECT_FP=$WEB_FP"/object" 

### html gen start
echo $HTML_DOCTYPE > $INDEX_FP
echo "<html>" >> $INDEX_FP
echo "<header></header>" >> $INDEX_FP
echo "<body><h1>Chuck Likes Vim</h1>" >> $INDEX_FP

### object gen
OBJ_DIF=$(OBJ_MAX_SIZE - OBJ_MIN_SIZE)

case "$OBJ_TYPE" in
0)# All js
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT"
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=(OBJ_MAX_SIZE/BS)				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=((OBJ_MIN_SIZE + i*(OBJ_DIF))/BS)				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=((OBJ_MAX_SIZE - i*(OBJ_DIF))/BS)				
		;;
		3)#Random
			#some RANDOM FUNCTION
			#RAND=RAND(OBJ_MIN_SIZE, OBJ_MAX_SIZE)
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=(RAND/BS)				
		;;
		esac		
		echo "<script src='$OBJECT_FP$i'></script>" >> $INDEX_FP
	done

esac
## js gen

## css gen

## img gen

## garbage gen

### html gen end
echo "</body></html>" >> $INDEX_FP

### permissions/cleanup

# sub folders in /var/www/http
# varible number of websites
# vairble number of objects
# varible size of objects
# varible file type just to make sure
# diffrent sizes in diffrent order
# reorder files

### Choices

