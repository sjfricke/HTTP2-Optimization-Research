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
S0=100000
S1=500000
S2=1000000
S3=2000000
S4=4000000
S5=8000000
S6=1000000000

### OBJECT COUNTS
C0=3
C1=10
C2=50
C3=100
C4=200
C5=500
C6=1000

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
        for j in `seq 0 6`; #SIZE
        do
		WEBS1=$j
                case "$j" in
                0)
			SIZE=$S0
			BS=10
                ;;
		1)
			SIZE=$S1
			BS=10
                ;;
                2)
			SIZE=$S2
			BS=100
                ;;
		3)
			SIZE=$S3
			BS=1000
                ;;
                4)
			SIZE=$S4
			BS=1000
                ;;
		5)
			SIZE=$S5
			BS=1000
                ;;
		6)
			SIZE=$S6
			BS=10000
                ;;
                esac
                for k in `seq 0 6`; #COUNT
                do
			WEBS2=$k
                        case "$k" in
			0)
				COUNT=$C0
			;;
			1)
				COUNT=$C1
			;;
			2)
				COUNT=$C2
			;;
			3)
				COUNT=$C3
			;;
			4)
				COUNT=$C4
			;;
			5)
				COUNT=$C5
			;;
			6)
				COUNT=$C6
			;;
                        esac
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
				echo ./website_gen.sh $COUNT $OBJECT_STRUCTURE $OBJECT_TYPE 0 $SIZE $BS $WEBS0"_"$WEBS1"_"$WEBS2"_"$WEBS3
                        done
                done
        done
done

