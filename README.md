System Specifications
===
Linux 64-Bit running Ubuntu 16.04, Gnome Desktop. Eight threads across four Intel i7-6700HQ cores and 24GB of random access memory. Graphic processor is NVIDIA Quadro M1000M installed with driver version 375.39.

A virtual environment has been set up running NodeJS 7.8.0 and Python 3.5.2 backends. The frontend run HMTL5, CSS and Javascript. Concurrent asynchronous tasks are executed in Node, whereas parallel sequential tasks in Python.


Setting up Virtual Environment
=
Install the python virtual enviroment package for your user, then create an environment named `env` running Python 3. Activate the environment. Any python packages are now installed using `pip install`. 
```bash
pip install --user virtualenv
virtualenv -p /usr/bin/python3 env
source env/bin/activate
```
With the enviroment activated, install NodeJS and append its virtual enviroment wrapper to the currently activated enviroment. Make sure to deactivate/activate the enviroment for changes to take effect.
```bash
pip install nodeenv
nodeenv -p
deactivate; source env/bin/activate
```
All required node modules are then installed using `npm install -g`.
```bash
npm install -g events
npm install -g d3
```

