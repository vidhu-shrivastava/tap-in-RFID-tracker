FROM python:3.12-slim

WORKDIR /app

# The receiver uses only the Python standard library, so no dependency install
# step is required.
COPY receive_scan.py ./

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    TAP_IN_HOST=0.0.0.0 \
    TAP_IN_PORT=8787

EXPOSE 8787

CMD ["python", "receive_scan.py"]
