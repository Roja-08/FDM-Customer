from setuptools import setup, find_packages

setup(
    name="ecommerce-churn-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "Flask",
        "Flask-CORS", 
        "Flask-SQLAlchemy",
        "pandas",
        "numpy",
        "scikit-learn",
        "joblib",
        "python-dateutil",
        "gunicorn"
    ],
    python_requires=">=3.8",
)
