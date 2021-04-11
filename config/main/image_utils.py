import cv2
import urllib
import numpy as np
import face_recognition
from .models import Face


def grab_image(path=None, stream=None, url=None):
    if path is not None:
        image = cv2.imread(path)
    else:
        if url is not None:
            resp = urllib.request.urlopen(url)
            data = resp.read()
        elif stream is not None:
            data = stream.read()
        image = np.asarray(bytearray(data), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    return image


TOLERANCE = 0.7
def compare_faces(stream=None, url=None):
    image = grab_image(stream=stream, url=url)
    locations = face_recognition.face_locations(image)
    encoding = face_recognition.face_encodings(image, locations)[0]
    for face in Face.objects.all():
        results = face_recognition.compare_faces([encoding], np.frombuffer(face.encoding), TOLERANCE)
        if True in results:
            return face.username
    return "unknown face"


def get_encoding(fullpath):
    image = face_recognition.load_image_file(fullpath)
    encoding = face_recognition.face_encodings(image)[0]
    return encoding.tobytes()
