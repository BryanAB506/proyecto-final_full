# from django import forms
# from .api.models import UploadedImage
# from .settings import 

# class ImageUploadForm(forms.ModelForm):
#     class Meta:
#         model = UploadedImage
#         fields = ('image',)

#     def save(self, commit=True):
#         instance = super().save(commit=False)
#         image = self.cleaned_data['image']

#         # Upload the image to Firebase Storage
#         blob = FIREBASE_BUCKET.blob(image.name)
#         blob.upload_from_file(image.file, content_type=image.content_type)

#         # Set the image URL in the model instance
#         instance.image = blob.public_url

#         if commit:
#             instance.save()
#         return instance