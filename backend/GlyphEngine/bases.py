import numpy as np
import math

def polygon(n,radius = 1,start_angle = None):
    if start_angle == None:
        start_angle = np.pi/n
    small_angle = [start_angle + i * 2*np.pi/n for i in np.arange(1,n+1)]
    x,y = (radius * np.sin(small_angle), radius * np.cos(small_angle))
    return(x,y)

def line(n):
    x = np.arange(0,n)
    y = np.zeros((1,n))
    return(x,y[0])

def quadratic(n,a = 1,b=0,c=0):
    x= [0]
    while len(x) < n:
        if -x[-1] in x:
            x.append(-x[-1] +1)
        else:
            x.append(-x[-1])
    x = np.array(x)
    y = a*x**2 +b*x+c
    return(x,y)

def circle(n,radius = 1,theta0 = 0,theta1 = -np.pi/2):
    theta = np.linspace(theta0,theta1,n)
    x = radius*np.cos(theta)
    y = radius*np.sin(theta)
    return(x,y)

def cubic(n,a = 0.1,b=0,c = -0.75,d=0):
    x = np.arange(-math.floor(n/2),math.ceil(n/2))
    y = a*x**3+b**2+c*x+d
    return(x,y)

def golden(n,lim = 3*np.pi):
    t = np.linspace(0,lim,n)
    g  = (1 + 5 ** 0.5) / 2
    f = g**(t*g/(2*np.pi))
    x = np.cos(t)*f
    y = np.sin(t)*f
    return(x,y)
