#! /bin/bash
### functions

print_help() {
        echo -e "
        ----------------------------------------------------------------------------
        ### Usage (all intputs are ints except for alternate options)
        \e[32m./website_gen.sh\e[0m \e[93mAlternateOption/\e[0m\e[33mNumberofObjects \e[36mObjectStructure\e[0m \e[35mObjectType\e[0m \e[94mMinSizeObject\e[0m \e[34mTotalWebsiteSize\e[0m \e[97mBS\e[0m \e[31mWebsiteName\e[0m

        \e[93m# Alternate Options\e[0m
        \e[92m## -help prints this page
        \e[91m## -purge deletes all websites from /var/www/html and sets web counter to 0

        \e[33m# NumberofObjects - how many objects in a webpage\e[0m

        \e[96m# ObjectStructure - How the objects are arranged in HTML top to bottom
        \e[36m## 0 All Max Size
        ## 1 Ascending Size
        ## 2 Descedning Size
        ## 3 Random Placement

        \e[95m# ObjectType - What type of objects to use
        \e[35m## 0 All js
        ## 1 All css
        ## 2 All img
        ## 3 All garbage ahref
        ## 4 Random types (multiple of each)

        \e[94m# ObjectMinSize - how small in bytes - Only used for random number generator

        \e[34m# TotalWebsiteSize - how large in bytes (TotalWebsiteSize = Sum(objectsizes))

        \e[97m# BS - buffer strategy for dd - BE CAREFUL WITH THIS\e[0m

        \e[31m# WebsiteName - Custom name of website used by script script \e[0m

        ### Note
        # Sizes of the objects will be as following:
          - All Max size = (TotalWebsiteSize / NumberOfObjects)
          - Asc/Desc = (TotalWebsiteSize/(NumberofObjects^2 + NumberofObjects)) * n where n = 1 to = NumberofObjects
          - Dont ask why, its because MATH
          - Random = Same generation as Asc but placed in a random order

        \e[8mChristian Rules\e[0m
        ----------------------------------------------------------------------------
        "
        return 0
}

purge() {
        read -r -p "Are you sure you want to delete all sites in: $MAIN_WEB_FP? [YES/N] " response
        if [[ "$response" =~ ^([Y][E][S]+$ ]]
        then
                ls -1 -d $MAIN_WEB_FP*/  | grep "$MAIN_WEB_FP[^(css)|(js)|(images)]" | sudo xargs rm -R #deletes all directories not for report
                rm $COUNT_FP
                rm $WEB_LIST_FP
        else
                echo "If you wanted to purge $MAIN_WEB_FP you have to type YES"
                echo "If you want to purge a diffrent directory run ./website_gen -purge 0 0 0 0 0 0 /dir/you/want/to/purge/"
                echo "If thats a pain, just do it yourself"
        fi
        return 0
}

###Constants
if [ -z "$8" ] ; then
        MAIN_WEB_FP="/var/www/html/"
else
        MAIN_WEB_FP=$8
fi

if [ -z "$9" ] ; then
        COUNT_FP=$MAIN_WEB_FP".web_count"
else
        COUNT_FP=$9
fi
WEB_LIST_FP=$MAIN_WEB_FP"web_list"
HTML_DOCTYPE="<!DOCTYPE html>"

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

### Input Paramaeters
OBJ_COUNT=$1
OBJ_STRUCT=$2
OBJ_TYPE=$3
OBJ_MIN_SIZE=$4
WEB_MAX_SIZE=$5
BS=$6
WEB_NAME=$7

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

WEB_FP=$MAIN_WEB_FP"html/"$WEB_NAME

mkdir $WEB_FP
INDEX_FP=$WEB_FP"/index.html"
OBJECT_FP=$WEB_FP"/object"

### web list addition
echo "https://http2optimization.com/"$WEB_NAME"/" >> $WEB_LIST_FP

### html gen start
echo $HTML_DOCTYPE > $INDEX_FP
echo "<html>" >> $INDEX_FP
echo "<header>$WEB_NAME</header>" >> $INDEX_FP
echo "<body><h1>CHUCK RULES</h1>" >> $INDEX_FP

#clears list for random tracking
unset LIST

### object gen
for i in `seq 1 $OBJ_COUNT`;
do
        case "$OBJ_TYPE" in
        0)#ALL js
                echo "<script src='object$i.js'></script>" >> $INDEX_FP
                FT=".js"
        ;;
        1)#ALL css
                echo "<link rel='stylesheet' property='stylesheet' href='object$i.css'>" >> $INDEX_FP
                FT=".css"
        ;;
        2)#ALL img
                echo "<img src='object$i.png'>" >> $INDEX_FP
                FT=".png"
        ;;
        3)#ALL garbage links
                echo "<a href='object$i.totallynotavirus' download>Click ME! Totally not a Virus #$i</a>" >> $INDEX_FP
                FT=".totallynotavirus"
        ;;
        4)#ALL Random
                case "$(( RANDOM % 3 ))" in
                0)
                        echo "<script src='object$i.js'></script>" >> $INDEX_FP
                        FT=".js"
                ;;
                1)
                        echo "<link rel='stylesheet' property='stylesheet' href='object$i.css'>" >> $INDEX_FP
                        FT=".css"
                ;;
                2)
                        echo "<img src='object$i.png'>" >> $INDEX_FP
                        FT=".png"
                ;;
                esac
        ;;
        esac
        case "$OBJ_STRUCT" in
        0)#All Max size
                dd if=/dev/urandom of=$OBJECT_FP$i$FT bs=$BS count=$(( (WEB_MAX_SIZE/OBJ_COUNT)/BS )) >& /dev/null
        ;;
        1)#Ascending order
                dd if=/dev/urandom of=$OBJECT_FP$i$FT bs=$BS count=$(( ( (WEB_MAX_SIZE*2/(OBJ_COUNT*(OBJ_COUNT + 1)) )*i) /BS )) >& /dev/null
        ;;
        2)#Descending order
                dd if=/dev/urandom of=$OBJECT_FP$i$FT bs=$BS count=$(( ( (WEB_MAX_SIZE*2/(OBJ_COUNT*(OBJ_COUNT + 1)) )*(OBJ_COUNT - (i - 1) ))  /BS )) >& /dev/null
        ;;
        3)#Random
                RAND=$( python -c "import random; print random.randrange(1, $(( OBJ_COUNT + 1 )) );" )
                while [ $(( LIST[RAND] )) == 1 ]; do
                        if (( RAND >= OBJ_COUNT ));
                        then
                                RAND=1
                        else
                                RAND=$(( RAND + 1 ))
                        fi
                done
                LIST[$RAND]=1
                dd if=/dev/urandom of=$OBJECT_FP$i$FT bs=$BS count=$(( ( (WEB_MAX_SIZE*2/(OBJ_COUNT*(OBJ_COUNT + 1)) )*RAND) /BS )) >& /dev/null
        ;;
        esac
done

### html gen end
echo "</body></html>" >> $INDEX_FP

### permissions
chmod 644 -R $WEB_FP
chmod 755 $WEB_FP

echo $WEB_NAME" DONE"


