while read a b ; do 
    [ "$a" = '"version":' ] && { b="${b%\"*}" ; echo "${b#\"}" ; break ; }
done < package.json
