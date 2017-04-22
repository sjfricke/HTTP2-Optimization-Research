#! /bin/bash

### Naming Convention
# (WXYZ)_(  )_(  )_(ABCD)
#   |     ||   ||   ||||
# OBJECT  ||   ||   ||||
# TYPE    ||   ||   ||||
#        SIZE  ||   ||||
#             COUNT ||||
#                 STRUCTURE

### READ FROM CONFIG FILE
DOMAIN=$(grep DOMAIN web_config | awk '{print $2}')
WEB_DIR=$(grep HOST_DIR web_config | awk '{print $2}')
COUNT_FP=$(grep COUNT_FP web_config | awk '{print $2}')

### PARSE CONFIG VARIBLE
# OBJECT TYPE
HOLD=$(grep OBJECT_TYPE web_config | awk '{print $2}')
if [[ $HOLD == *"W"* ]]; then
        JS_BOOL=1
else
        JS_BOOL=0
fi
if [[ $HOLD == *"X"* ]]; then
        CSS_BOOL=1
else
        CSS_BOOL=0
fi
if [[ $HOLD == *"Y"* ]]; then
        IMG_BOOL=1
else
        IMG_BOOL=0
fi
if [[ $HOLD == *"Z"* ]]; then
        RND_BOOL=1
else
        RND_BOOL=0
fi

# SIZE ARRAY
HOLD=$(grep OBJECT_SIZES web_config | sed 's/.*SIZES //')
unset SIZES
unset IFS
IFS=' ' read -r -a SIZES <<< "$HOLD"

# COUNT/OBJECTS ARRAY
HOLD=$(grep OBJECT_COUNTS web_config | sed 's/.*COUNTS //')
unset OBJECTS
unset IFS
IFS=' ' read -r -a OBJECTS <<< "$HOLD"

# STRUCTURE TYPE
HOLD=$(grep OBJECT_STRUCTURE web_config | awk '{print $2}')
if [[ $HOLD == *"A"* ]]; then
        SS_BOOL=1
else
        SS_BOOL=0
fi
if [[ $HOLD == *"B"* ]]; then
        ASC_BOOL=1
else
        ASC_BOOL=0
fi
if [[ $HOLD == *"C"* ]]; then
        DESC_BOOL=1
else
        DESC_BOOL=0
fi
if [[ $HOLD == *"D"* ]]; then
        RNDS_BOOL=1
else
        RNDS_BOOL=0
fi

### OBJECT TYPE
JS="W"
CSS="X"
IMG="Y"
RND="Z"

### SIZES (in bytes)
#unset SIZES
#SIZES=(100000 250000 500000 750000 1000000 1500000 2000000 2500000 4000000 6000000 8000000)

### OBJECT COUNTS
#unset OBJECTS
#OBJECTS=(1 2 3 4 5 6 7 8 9 10 15 20 25 30 35 50 70 90 100 125 150 175 200)

### OBJECT STRUCTURE
SS="A" #All same size
ASC="B" #Ascending
DESC="C" #Descending
RNDS="D" #Random structure

### LOOP VARIBLES
OBJECT_STRUCTURE=0
SIZE=0
COUNT=0
OBJECT_TYPE=0
BS=1
WEBS0=""
WEBS1=""
WEBS2=""
WEBS3=""

### GENERATION
for i in `seq 0 3`; #OBJECT TYPE
do
        case "$i" in
        0)
                OBJECT_TYPE=0
                WEBS0=$JS
        ;;
        1)
                OBJECT_TYPE=1
                WEBS0=$CSS
        ;;
        2)
                OBJECT_TYPE=2
                WEBS0=$IMG
        ;;
        3)
                OBJECT_TYPE=4
                WEBS0=$RND
        ;;
        esac
        for j in ${!SIZES[@]}; #SIZE
        do
                WEBS1=${SIZES[$j]}
                SIZE=${SIZES[$j]}

                if [[ "$SIZE" -gt "999999" ]]
                then
                        BS=100
                else
                        BS=1
                fi

                for k in ${!OBJECTS[@]}; #OBJECT COUNT
                do
                        WEBS2=${OBJECTS[$k]}
                        COUNT=${OBJECTS[$k]}
                        for l in `seq 0 3`; #OBJECT STRUCTURE
                        do
                                case "$l" in
                                0)
                                        OBJECT_STRUCTURE=0
                                        WEBS3=$SS
                                ;;
                                1)
                                        OBJECT_STRUCTURE=1
                                        WEBS3=$ASC
                                ;;
                                2)
                                        OBJECT_STRUCTURE=2
                                        WEBS3=$DESC
                                ;;
                                3)
                                        OBJECT_STRUCTURE=3
                                        WEBS3=$RNDS
                                ;;
                                esac

                                ### ACTUAL GENERATION
                                if ([ "$OBJECT_TYPE" == "0" ] && [ "$JS_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_TYPE" == "1" ] && [ "$CSS_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_TYPE" == "2" ] && [ "$IMG_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_TYPE" == "3" ] && [ "$RND_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_STRUCTURE" == "0" ] && [ "$SS_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_STRUCTURE" == "1" ] && [ "$ASC_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_STRUCTURE" == "2" ] && [ "$DESC_BOOL" == "0" ]) ||\
                                        ([ "$OBJECT_STRUCTURE" == "3" ] && [ "$RNDS_BOOL" == "0" ]); then
                                        echo "hello darkness my old friend" > /dev/null
                                else
                                        ./website_gen.sh $COUNT $OBJECT_STRUCTURE $OBJECT_TYPE 0 $SIZE $BS $WEBS0"_"$WEBS1"_"$WEBS2"_"$WEBS3 $WEB_DIR $COUNT_FP
                                        #echo $WEBS0"_"$WEBS1"_"$WEBS2"_"$WEBS3"|||"$WEB_DIR"|||"$COUNT_FP
                                fi

                        done # /OBJECT STRUCTURE
                done # /COUNT
        done # /SIZE
done # /TYPE

#
# Used print out size of result constants
#
echo -n "const SIZE = ["
for i in ${SIZES[@]};
do

        if [[ "$i" -lt "999999" ]]
        then
                BASE=1000
                UNITS="KB"
        else
                BASE=1000000
                UNITS="MB"
        fi

        VALUE=$(python -c "print float($i) / float($BASE)" | sed -e 's/\.0//g')

        if [ "$i" != "${SIZES[-1]}" ]
        then
                echo -n '"'$VALUE $UNITS'"'," "
        else
                echo '"'$VALUE $UNITS'"'"];"
        fi
done

echo -n "const COUNT = ["
for i in ${OBJECTS[@]};
do
        if [ "$i" != "${OBJECTS[-1]}" ]
        then
                echo -n '"'$i'"'," "
        else
                echo '"'$i'"'"];"
        fi
done


