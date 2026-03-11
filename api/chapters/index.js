const { connectToDatabase } = require('../lib/db');

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chapters');

    switch (req.method) {
      case 'GET':
        // 获取所有章节列表（不含内容，减少传输）
        const chapters = await collection
          .find({}, { projection: { content: 0 } })
          .sort({ volumeId: 1, chapterNum: 1 })
          .toArray();
        
        // 按卷分组
        const volumes = {};
        chapters.forEach(ch => {
          if (!volumes[ch.volumeId]) {
            volumes[ch.volumeId] = {
              id: ch.volumeId,
              title: getVolumeTitle(ch.volumeId),
              chapters: []
            };
          }
          volumes[ch.volumeId].chapters.push({
            id: ch._id,
            num: ch.chapterNum,
            title: ch.title,
            wordCount: ch.wordCount || 0
          });
        });
        
        return res.status(200).json({ volumes: Object.values(volumes) });

      case 'POST':
        // 创建新章节
        const { volumeId, chapterNum, title, content } = req.body;
        
        if (!volumeId || !chapterNum || !title) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newChapter = {
          volumeId: parseInt(volumeId),
          chapterNum,
          title,
          content: content || '',
          wordCount: content ? content.length : 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await collection.insertOne(newChapter);
        return res.status(201).json({ 
          id: result.insertedId,
          message: 'Chapter created successfully' 
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

function getVolumeTitle(id) {
  const titles = {
    1: '第一卷：灾变废土',
    2: '第二卷：引擎觉醒',
    3: '第三卷：废土猎人',
    4: '第四卷：降临派战争',
    5: '第五卷：废土神战'
  };
  return titles[id] || `第${id}卷`;
}