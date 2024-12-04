import os
from google.cloud import firestore
import base64

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Directorio actual del archivo
CRED_PATH = os.path.join(BASE_DIR, '../../config/creaciones-fayfa-firebase-adminsdk-tjgry-6a2bfd6385.json')

firestore_client = firestore.Client.from_service_account_json(CRED_PATH)

