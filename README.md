# REST-Face
 Deep Learning face-recognition system with django, REST api. Client sends an image and gets a name of a person found on that
 image. The pros of this approach is that the client does not have access to database of all persons and the client's computer 
 does not have to have good hardware, main computations 
 are done on the server. The cons are that approach is rely on a stable internet connection.


## Used Technologies
- face_recognition library
- pure javascript + a little of JQuery
- django
- django-rest-framework


## 1. Installation
1.1 Install requirements
```
pip3 install -r requirements.txt
``` 
1.2 Code will work much faster if dlib will use CUDA (but CPU is working fine too). Guidelines on how to install CUDA, cuDNN, dlib can be founded in the web.
To check if dlib already use CUDA run:
```
python3
>> import dlib
>> print(dlib.DLIB_USE_CUDA)
```
If true then everything is fine and cuda is on, else install cuDNN.
If any troubles with installing face_recognition check the [github page](https://github.com/ageitgey/face_recognition)  of the library

1.3 After prerequisites installed go to the <i><b><download-path>/config/</i></b> and run this to create a database:
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py makemigrations main
python3 manage.py migrate main
```
1.4 Run the project:
```
python3 manage.py runserver
```
## 2. Usage
- To add new face into the database post username and image to <b>/api/face/</b>, if you doing it by hand, open /api/face/
and fill the given form. <b>THERE MUST BE ONLY ONE PERSON ON THE IMAGE</b>
- To recognize faces from image use <b>/api/getface/</b>
- There also an example of how this api can be used, check <b>/tester</b>
![alt text][gif]

## Contacts
Rysbek Tokoev \
[rysbek@tokoev.com](mailto:rysbek@tokoev.com) \
[Linkedin](https://www.linkedin.com/in/rysbek-tokoev-44197919a/) \
[Facebook](https://www.facebook.com/tokoevr/)

[gif]: https://github.com/RysbekTokoev/rest-face/blob/main/testing_example.gif "Logo Title Text 2"
