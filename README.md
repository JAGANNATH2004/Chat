# Simple Bidirectional Chat

A simple, lightweight real-time chat application with a clean white interface, instant bidirectional messaging across devices, and a **Clear** button that wipes message history.

---

## 🛠️ Deploying to Render (Free)

1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your Git repository.
3. Configure the following settings:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Deploy Web Service**.

Once deployed, open your Render URL (e.g. `https://your-chat-app.onrender.com`) on your phone and on your computer:
- Messages sync in real-time between both devices over the internet (Wi-Fi or Mobile Data).
- Clicking the **Clear** button will instantly erase all messages on all connected devices and wipe the server's history.

---

## 💻 Running Locally

```bash
pip install -r requirements.txt
python main.py
```
- Open [http://localhost:8000](http://localhost:8000) on your computer.
- Open `http://<your-ip>:8000` on your phone (on the same Wi-Fi).
