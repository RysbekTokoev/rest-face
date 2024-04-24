import cv2
import urllib
import numpy as np
import face_recognition
from main.models import Face


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


TOLERANCE = 0.6
def recognize_face(stream=None, url=None, encoding=None):
    faces = Face.objects.all()

    if encoding:
        encoding = list(encoding.values())

    elif stream is not None or url is not None:
        image = grab_image(stream=stream, url=url)
        locations = face_recognition.face_locations(image)
        encoding = face_recognition.face_encodings(image, locations)

    for face in faces:
        result = np.linalg.norm(np.frombuffer(face.encoding) - encoding) <= TOLERANCE
        if result:
            return face
    return None


def get_encoding(fullpath):
    image = face_recognition.load_image_file(fullpath)
    encoding = face_recognition.face_encodings(image)[0]
    return encoding.tobytes()
