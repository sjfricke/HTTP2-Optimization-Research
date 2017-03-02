#! /bin/bash
### functions

print_help() {
	echo -e "
	#----------------------------------------------------------------------------
	### usage (all intputs are ints except for alternate options)
	\e[32m./website_gen.sh\e[0m \e[33mNumberofObjects/\e[93mAlternateOption\e[0m \e[36mObjectStructure\e[0m \e[35mObjectType\e[0m \e[94mMinSizeObject\e[0m \e[34mMaxSizeObject\e[0m \e[97mBS\e[0m

	\e[93m#Alternate Options\e[0m
	\e[92m##-help prints this page
	\e[91m##-purge deletes all websites from /var/www/html and sets web counter to 0

	\e[33m#NumberofObjects - how many objects in a webpage\e[0m

	\e[96m#ObjectStructure - How the objects are arranged in HTML top to bottom
	\e[36m## 0 All Max Size
	## 1 Ascending Size
	## 2 Descedning Size
	## 3 Random Placement

	\e[95m#ObjectType - What type of objects to use
	\e[35m## 0 All js
	## 1 All css
	## 2 All img
	## 3 All garbage ahref
	## 4 Random types (multiple of each)

	\e[94m#ObjectMinSize - how small in bytes

	\e[34m#ObjectMaxSize - how large in bytes

	\e[97m#BS - buffer strategy for dd\e[0m

	###Note 
	#For ObjectStructure 1,2,3 the size of the files will be assigned
	#a size from min size to max size with a diffrence of (max - min)/#ofObjects

	\e[8mChristian Rules\e[0m

	#----------------------------------------------------------------------------
	"
	return 0
}

purge() {
	rm -rf /var/www/html/*
	rm $COUNT_FP
	return 0
}

###Constants
MAIN_WEB_FP="/var/www/"
COUNT_FP=$MAIN_WEB_FP".web_count"
HTML_DOCTYPE="<!DOCTYPE thml>"

###Error Checking
if [[ $# -eq 0 ]] ; then
    print_help ""
    exit 0
fi

###Prelim options
OPTION=$1

case "$OPTION" in
-purge)#purge
	purge ""
	exit 0
;;
-help)#help
	print_help ""
	exit 0
;;
esac

###Input Paramaeters
OBJ_COUNT=$1
OBJ_STRUCT=$2
OBJ_TYPE=$3
OBJ_MIN_SIZE=$4
OBJ_MAX_SIZE=$5
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

WEB_FP=$MAIN_WEB_FP"html/"$WEB_NUM

mkdir $WEB_FP
INDEX_FP=$WEB_FP"/index.html" 
OBJECT_FP=$WEB_FP"/object" 

### html gen start
echo $HTML_DOCTYPE > $INDEX_FP
echo "<html>" >> $INDEX_FP
echo "<header></header>" >> $INDEX_FP
echo "<body><h1>Chuck Likes Vim</h1>" >> $INDEX_FP

### object gen
OBJ_DIF=$(( OBJ_MAX_SIZE - OBJ_MIN_SIZE ))

case "$OBJ_TYPE" in
0)#All js
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT" in
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i".js" bs=$BS count=$(( OBJ_MAX_SIZE/BS )) 				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i".js" bs=$BS count=$(( (OBJ_MIN_SIZE + i*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i".js" bs=$BS count=$(( (OBJ_MAX_SIZE - (i - 1)*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		3)#Random
			dd if=/dev/urandom of=$OBJECT_FP$i".js" bs=$BS count=$(( ( (RANDOM % (OBJ_MAX_SIZE - OBJ_MIN_SIZE)) + OBJ_MIN_SIZE) /BS ))				
		;;
		esac		
		echo "<script src='object$i".js"'></script>" >> $INDEX_FP
	done
;;
1)#All css
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT" in
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i".css" bs=$BS count=$(( OBJ_MAX_SIZE/BS )) 				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i".css" bs=$BS count=$(( (OBJ_MIN_SIZE + i*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i".css" bs=$BS count=$(( (OBJ_MAX_SIZE - (i - 1)*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		3)#Random
			dd if=/dev/urandom of=$OBJECT_FP$i".css" bs=$BS count=$(( ( (RANDOM % (OBJ_MAX_SIZE - OBJ_MIN_SIZE)) + OBJ_MIN_SIZE) /BS ))				
		;;
		esac		
		echo "<link rel='stylesheet' property='stylesheet' href='object$i".css"'>" >> $INDEX_FP
	done
;;
2)#All img 
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT" in
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i".png" bs=$BS count=$(( OBJ_MAX_SIZE/BS )) 				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i".png" bs=$BS count=$(( (OBJ_MIN_SIZE + i*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i".png" bs=$BS count=$(( (OBJ_MAX_SIZE - (i - 1)*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		3)#Random
			dd if=/dev/urandom of=$OBJECT_FP$i".png" bs=$BS count=$(( ( (RANDOM % (OBJ_MAX_SIZE - OBJ_MIN_SIZE)) + OBJ_MIN_SIZE) /BS ))				
		;;
		esac		
		echo "<img src='object$i".png"'>" >> $INDEX_FP
	done
;;
3)#All garbage
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT" in
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i".totallynotavirus" bs=$BS count=$(( OBJ_MAX_SIZE/BS )) 				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i".totallynotavirus" bs=$BS count=$(( (OBJ_MIN_SIZE + i*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i".totallynotavirus" bs=$BS count=$(( (OBJ_MAX_SIZE - (i - 1)*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		3)#Random
			dd if=/dev/urandom of=$OBJECT_FP$i".totallynotavirus" bs=$BS count=$(( ( (RANDOM % (OBJ_MAX_SIZE - OBJ_MIN_SIZE)) + OBJ_MIN_SIZE) /BS ))				
		;;
		esac		
		echo "<a href='object$i".totallynotavirus"' download>Click ME! Totally not a Virus #$i</a>" >> $INDEX_FP
	done
;;
4)#Random
	for i in `seq 1 $OBJ_COUNT`;
	do
		case "$OBJ_STRUCT" in
		0)#All Max size
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=$(( OBJ_MAX_SIZE/BS )) 				
		;;
		1)#Ascending order
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=$(( (OBJ_MIN_SIZE + i*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		2)#Descending order
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=$(( (OBJ_MAX_SIZE - (i - 1)*( OBJ_DIF )/OBJ_COUNT) /BS ))				
		;;
		3)#Random
			dd if=/dev/urandom of=$OBJECT_FP$i bs=$BS count=$(( ( (RANDOM % (OBJ_MAX_SIZE - OBJ_MIN_SIZE)) + OBJ_MIN_SIZE) /BS ))				
		;;
		esac	
		
		case "$(( RANDOM % 4 ))" in 
		0)
			echo "<script src='object$i'></script>" >> $INDEX_FP
		;;
		1)
			echo "<link rel='stylesheet' property='stylesheet' href='object$i'>" >> $INDEX_FP
		;;
		2)
			echo "<img src='object$i'>" >> $INDEX_FP
		;;
		3)
			echo "<a href='object$i' download>Click Me! ;)</a>" >> $INDEX_FP
		;;
		esac	
	done
;;
esac

### html gen end
echo "</body></html>" >> $INDEX_FP

### permissions
chmod 644 -R $WEB_FP
chmod 755 $WEB_FP


