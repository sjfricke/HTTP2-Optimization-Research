#! /bin/bash

### Naming Convention
# (WXYZ)_(0-6)_(0-6)_(abcd)
#   |     ||    |||   |||| 
# OBJECT  ||    |||   ||||    
# TYPE    ||    |||   ||||
#        SIZE   |||   ||||
#              COUNT  ||||
#                   STRUCTURE  

### OBJECT TYPE
JS="W"
CSS="X"
IMG="Y"
RND="Z"

### SIZES
unset SIZES
SIZES=(100000 250000 500000 750000 1000000 1500000 2000000 2500000 4000000 6000000 8000000)

### OBJECT COUNTS
unset OBJECTS
OBJECTS=(1 2 3 4 5 6 7 8 9 10 15 20 25 30 35 50 70 90 100 125 150 175 200)

### OBJECT STRUCTURE
SS="a" #All same size
ASC="b"
DESC="c"
RNDS="d" #random structure

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
		WEBS1=$j
		SIZE=${SIZES[$j]}
		
		if [[ "$SIZE" -gt "999999" ]]
		then
			BS=100
		else
			BS=1
		fi

                for k in ${!OBJECTS[@]}; #OBJECT COUNT
                do
			WEBS2=$k
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
				./website_gen.sh $COUNT $OBJECT_STRUCTURE $OBJECT_TYPE 0 $SIZE $BS $WEBS0"_"$WEBS1"_"$WEBS2"_"$WEBS3
				#echo $WEBS0"_"$WEBS1"_"$WEBS2"_"$WEBS3"_"$COUNT"_"$SIZE
				
                        done
                done
        done
done
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
	
	#SPENCER REGEX HERE
	VALUE=$(python -c "print float($i) / float($BASE)")

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


