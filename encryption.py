import rsa
import random

class Encryptor:

    def keygen(self, k=2048):
        (pub_key, priv_key) = rsa.newkeys(k)
        return (pub_key, priv_key)

    def encryptMessage(self, message, pub_key):
        try:
            #(pub_key, priv_key) = rsa.newkeys(k)
            crypto = rsa.encrypt(message, pub_key)
            return crypto
        except OverflowError:
            return ""

    def parseKey(self, key):
        # key (string) is in the form: PrivateKey(%d, %d, %d, %d, %d)
        key = (str(key)).replace("PrivateKey", "").strip("(").strip(")")

        A = key.split(", ")
        if(len(A) < 5): return None

        priv_key = ((int)(A[0]), (int)(A[1]), (int)(A[2]), (int)(A[3]), (int)(A[4]))
        return rsa.PrivateKey(*priv_key)

    def getMessage(self, crypto, priv_key):
        try:
            key = self.parseKey(priv_key)

            if(key == None): return self.yoOrYoYo()

            message = rsa.decrypt(crypto, key)
            return message

        except rsa.DecryptionError:
            return ""
