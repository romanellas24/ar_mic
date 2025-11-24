# Esperienza AR per MIC

## Far partire la demo in un server node 
- Requisiti: node, ngrok
- installare le dipendenze con npm install
- Per accendere il server locale
    ```bash
    node index.js
    ```
- Per inoltrare il traffico in un dominio certificato con una connessione https: 
    ```bash
    ngrok http  https://localhost:3000  
    ```


## Utilizzo
- Accedere al sito dal telefono (es. tramite il link fornito da ngrok). 
- Acconsentire all'utilizzo della fotocamera
- Inquadrare l'immagine presente in /patterns
- Dovrebbe apparire il video sul marker inquadrato