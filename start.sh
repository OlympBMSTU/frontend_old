#! /bin/sh


if [ ! -f /var/run/front.pid ]; then
    npm start & echo $! >>/var/run/front.pid
else
    echo "FRONT PID EXISTS"
fi
