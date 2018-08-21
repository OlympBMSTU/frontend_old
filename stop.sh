#! /bin/sh

if [ -f /var/run/front.pid ]; then
    FRONT_PID=`cat /var/run/front.pid`
    echo "$FRONT_PID"
    kill $FRONT_PID
    rm /var/run/front.pid
else
    echo "Front Nothing"
fi
