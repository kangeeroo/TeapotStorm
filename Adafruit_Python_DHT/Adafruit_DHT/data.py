#!/usr/bin/python
import sys
import Adafruit_DHT
import time

while True:
    humidity, temperature = Adafruit_DHT.read_retry(11, 4)
    print '"Temp": {0:0.1f}, "Humidity": {1:0.1f}'.format(temperature, humidity)
    #You need to flush sys.stdout as the output is buffered because it is piped:
    sys.stdout.flush()
    time.sleep(2)
#time.sleep(10)
