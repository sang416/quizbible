FROM python:3-slim
WORKDIR /quizbible
COPY . .
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "app.py"]
