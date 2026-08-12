// Centralized API Backend Endpoints Configuration for BERT Sentiment Lab
// Primary: Google Colab Tesla T4 GPU Server (via Ngrok Static Permanent Tunnel)
export const GPU_BACKEND_URL = 'https://irritably-tipper-january.ngrok-free.dev'

// Secondary: Railway Production CPU Server (Automatic Failover Backup)
export const CPU_BACKEND_URL = 'https://bertsentimentlab.up.railway.app'
