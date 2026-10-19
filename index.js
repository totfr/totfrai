const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// DeepSeek 代理接口，兼容OpenAI格式
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const apiKey = req.headers.authorization?.replace('Bearer ','');
    if(!apiKey){
      return res.status(401).json({error:"缺少API Key"});
    }
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      req.body,
      {
        headers:{
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type":"application/json"
        }
      }
    );
    res.json(response.data);
  }catch(err){
    res.status(err.response?.status || 500).json(err.response?.data || {error:err.message});
  }
});

app.listen(port, ()=>{
  console.log(`Proxy server running on port ${port}`);
})
