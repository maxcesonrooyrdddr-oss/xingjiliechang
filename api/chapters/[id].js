const { connectToDatabase } = require('../lib/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Chapter ID is required' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chapters');

    switch (req.method) {
      case 'GET':
        // 获取单个章节详细内容
        const chapter = await collection.findOne({
          $or: [
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : id },
            { chapterNum: id }
          ]
        });
        
        if (!chapter) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        
        return res.status(200).json({
          id: chapter._id,
          volumeId: chapter.volumeId,
          chapterNum: chapter.chapterNum,
          title: chapter.title,
          content: chapter.content,
          wordCount: chapter.wordCount,
          updatedAt: chapter.updatedAt
        });

      case 'PUT':
        // 更新章节
        const { title, content } = req.body;
        
        const updateData = {
          updatedAt: new Date()
        };
        
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) {
          updateData.content = content;
          updateData.wordCount = content.length;
        }

        const updateResult = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        
        return res.status(200).json({ message: 'Chapter updated successfully' });

      case 'DELETE':
        // 删除章节
        const deleteResult = await collection.deleteOne({
          _id: new ObjectId(id)
        });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        
        return res.status(200).json({ message: 'Chapter deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};