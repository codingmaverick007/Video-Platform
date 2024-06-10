from django.test import TestCase
from django.contrib.auth import get_user_model

class CustomUserManagerTestCase(TestCase):
    def setUp(self):
        self.UserModel = get_user_model()

    def test_create_user(self):
        user = self.UserModel.objects.create_user(
            email='ben@gmail.com',
            password='benbenben',
            username='ben'
        )
        self.assertEqual(user.email, 'ben@gmail.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            self.UserModel.objects.create_user(
                email='',
                password='benbenben',
                username='ben'
            )

    def test_create_superuser(self):
        superuser = self.UserModel.objects.create_superuser(
            email='mike@gmail.com',
            password='mikemikemike',
            username='mike'
        )
        self.assertEqual(superuser.email, 'mike@gmail.com')
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_without_staff_status(self):
        with self.assertRaisesMessage(ValueError, 'Superuser must have is_staff=True.'):
            self.UserModel.objects.create_superuser(
                email='ben@gmail.com',
                password='benbenben',
                username='ben',
                is_staff=False
            )

    def test_create_superuser_without_superuser_status(self):
        with self.assertRaisesMessage(ValueError, 'Superuser must have is_superuser=True.'):
            self.UserModel.objects.create_superuser(
                email='ben@gmail.com',
                password='benbenben',
                username='ben',
                is_superuser=False
            )

class CustomUserTestCase(TestCase):
    def setUp(self):
        self.UserModel = get_user_model()

    def test_user_email(self):
        user = self.UserModel.objects.create_user(
            email='ben@gmail.com',
            password='benbenben',
            username='ben'
        )
        self.assertEqual(str(user), 'ben@gmail.com')