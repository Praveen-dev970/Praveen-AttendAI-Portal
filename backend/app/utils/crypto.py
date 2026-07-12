import base64

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad


KEY = b"8701661282118308"
IV = b"8701661282118308"


def encrypt_password(password: str) -> str:
    cipher = AES.new(
        KEY,
        AES.MODE_CBC,
        IV
    )

    encrypted = cipher.encrypt(
        pad(
            password.encode("utf-8"),
            AES.block_size
        )
    )

    return base64.b64encode(
        encrypted
    ).decode()