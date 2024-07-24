// utils/twilioClient.js
const sendSms = async (to, body) => {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, body }),
    });
  
    const data = await response.json();
  
    if (!data.success) {
      throw new Error(data.error);
    }
  
    return data.messageSid;
  };
  
  export default sendSms;
  