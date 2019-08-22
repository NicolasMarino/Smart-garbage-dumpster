import serial
import time

serial_p = serial.Serial("COM6", 9600)

data = open("basura.txt","r").read()

infinite_loop = True
while(infinite_loop):
    time.sleep(1)
    serial_p.write(data.encode())
    print("data {}".format(data))
    data = open("basura.txt","r").read()